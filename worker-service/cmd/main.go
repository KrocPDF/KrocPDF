package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sort"

	"github.com/redis/go-redis/v9"
	"worker-service/internal/consumer"
	"worker-service/internal/converter"
	"worker-service/internal/processor"
	"worker-service/internal/storage"
	"worker-service/internal/validator"
)

func main() {
	// Start lightweight HTTP health server (only when enabled or standalone)
	if os.Getenv("ENABLE_WORKER_HTTP") != "false" {
		go func() {
			port := os.Getenv("WORKER_PORT")
			if port == "" {
				port = os.Getenv("PORT")
			}
			if port == "" {
				port = "8080"
			}
			http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusOK)
				w.Write([]byte("worker live"))
			})
			http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusOK)
				w.Write([]byte("worker ok"))
			})
			log.Printf("Health server listening on 0.0.0.0:%s", port)
			if err := http.ListenAndServe("0.0.0.0:"+port, nil); err != nil {
				log.Printf("Health server failed: %v", err)
			}
		}()
	}

	redisUrl := os.Getenv("REDIS_URL")
	if redisUrl == "" {
		redisUrl = "redis://localhost:6379"
	}

	opt, err := redis.ParseURL(redisUrl)
	if err != nil {
		log.Fatalf("Invalid Redis URL: %v", err)
	}

	rdb := redis.NewClient(opt)
	defer rdb.Close()

	// Setup S3 Client
	accessKey := os.Getenv("AWS_ACCESS_KEY_ID")
	secretKey := os.Getenv("AWS_SECRET_ACCESS_KEY")
	s3Endpoint := os.Getenv("S3_ENDPOINT")
	if s3Endpoint == "" {
		s3Endpoint = "http://localhost:9000"
	}
	if accessKey == "" {
		accessKey = "minioadmin"
		secretKey = "minioadmin"
	}

	region := os.Getenv("AWS_REGION")
	if region == "" {
		region = "auto"
	}
	bucketName := os.Getenv("S3_BUCKET_NAME")
	if bucketName == "" {
		bucketName = "conversions"
	}

	s3Client, err := storage.NewS3Client(context.Background(), s3Endpoint, region, accessKey, secretKey, bucketName)
	if err != nil {
		log.Fatalf("Failed to initialize S3 client: %v", err)
	}

	worker := consumer.NewWorker(rdb, "conversions:jobs", "pdf_workers", "worker-1")
	worker.InitGroup(context.Background())

	log.Println("Starting Go Worker Daemon with Real PDF Pipeline...")
	
	worker.Start(context.Background(), func(ctx context.Context, payload map[string]interface{}) error {
		jobId, ok := payload["job_id"].(string)
		if !ok {
			log.Println("Invalid job_id in payload")
			return nil
		}
		targetS3Key, ok := payload["target_s3_key"].(string)
		if !ok {
			log.Printf("Invalid target_s3_key for job %s", jobId)
			return nil
		}
		filesRaw, ok := payload["files"].([]interface{})
		if !ok {
			log.Printf("Invalid files payload for job %s", jobId)
			return nil
		}
		
		jobType, _ := payload["job_type"].(string)
		if jobType == "" {
			jobType = "IMAGE_TO_PDF"
		}

		worker.PublishEvent(ctx, jobId, "PROCESSING", 10, "Downloading files...")
		
		tempDir := filepath.Join(os.TempDir(), jobId)
		if err := os.MkdirAll(tempDir, 0755); err != nil {
			worker.PublishEvent(ctx, jobId, "FAILED", 0, "Failed to create temp directory")
			return err
		}
		defer os.RemoveAll(tempDir) // cleanup after

		var imagePaths []string

		type FileItem struct {
			Order int
			Key   string
		}
		var fileItems []FileItem
		for _, f := range filesRaw {
			fMap, ok := f.(map[string]interface{})
			if !ok {
				continue
			}
			orderFloat, _ := fMap["order"].(float64)
			key, _ := fMap["s3_key"].(string)
			fileItems = append(fileItems, FileItem{Order: int(orderFloat), Key: key})
		}
		
		sort.Slice(fileItems, func(i, j int) bool {
			return fileItems[i].Order < fileItems[j].Order
		})

		outPath := filepath.Join(tempDir, "output.pdf")

		if jobType == "MERGE_PDF" {
			var downloadedPaths []string
			for i, item := range fileItems {
				stream, err := s3Client.DownloadStream(ctx, item.Key)
				if err != nil {
					worker.PublishEvent(ctx, jobId, "FAILED", 0, fmt.Sprintf("Failed to download PDF %d", i+1))
					return err
				}
				
				localPath := filepath.Join(tempDir, fmt.Sprintf("doc_%d.pdf", i))
				outFile, err := os.Create(localPath)
				if err != nil {
					stream.Close()
					return err
				}
				io.Copy(outFile, stream)
				outFile.Close()
				stream.Close()

				downloadedPaths = append(downloadedPaths, localPath)
			}

			worker.PublishEvent(ctx, jobId, "PROCESSING", 60, "Merging PDFs...")
			if err := converter.MergePDFs(ctx, downloadedPaths, outPath); err != nil {
				worker.PublishEvent(ctx, jobId, "FAILED", 0, fmt.Sprintf("PDF Merge failed: %v", err))
				return err
			}
		} else if jobType == "COMPRESS_PDF" {
			worker.PublishEvent(ctx, jobId, "PROCESSING", 30, "Downloading PDF for compression...")
			if len(fileItems) == 0 {
				worker.PublishEvent(ctx, jobId, "FAILED", 0, "No files provided for compression")
				return fmt.Errorf("no files provided")
			}
			
			stream, err := s3Client.DownloadStream(ctx, fileItems[0].Key)
			if err != nil {
				worker.PublishEvent(ctx, jobId, "FAILED", 0, "Failed to download PDF")
				return err
			}
			localPath := filepath.Join(tempDir, "input.pdf")
			inFile, err := os.Create(localPath)
			if err != nil {
				stream.Close()
				return err
			}
			io.Copy(inFile, stream)
			inFile.Close()
			stream.Close()

			compressionLevel, ok := payload["compression_level"].(string)
			if !ok {
				compressionLevel = "MEDIUM"
			}

			worker.PublishEvent(ctx, jobId, "PROCESSING", 50, "Compressing PDF...")
			if err := converter.CompressPDF(ctx, localPath, outPath, compressionLevel); err != nil {
				worker.PublishEvent(ctx, jobId, "FAILED", 0, fmt.Sprintf("PDF Compression failed: %v", err))
				return err
			}
		} else if jobType == "PDF_TO_JPG" {
			worker.PublishEvent(ctx, jobId, "PROCESSING", 10, "Downloading PDF...")
			if len(fileItems) == 0 {
				worker.PublishEvent(ctx, jobId, "FAILED", 0, "No files provided for extraction")
				return fmt.Errorf("no files provided")
			}
			
			stream, err := s3Client.DownloadStream(ctx, fileItems[0].Key)
			if err != nil {
				worker.PublishEvent(ctx, jobId, "FAILED", 0, "Failed to download PDF")
				return err
			}
			localPath := filepath.Join(tempDir, "input.pdf")
			inFile, err := os.Create(localPath)
			if err != nil {
				stream.Close()
				return err
			}
			io.Copy(inFile, stream)
			inFile.Close()
			stream.Close()

			qualityStr, ok := payload["image_quality"].(string)
			quality := 80
			if ok {
				switch qualityStr {
				case "LOW": quality = 40
				case "MEDIUM": quality = 60
				case "HIGH": quality = 80
				case "MAXIMUM": quality = 100
				}
			}

			outZipPath := filepath.Join(tempDir, "output.zip")
			
			err = converter.PdfToJpg(ctx, localPath, outZipPath, quality, func(pct int, msg string) {
				worker.PublishEvent(ctx, jobId, "PROCESSING", pct, msg)
			})
			if err != nil {
				worker.PublishEvent(ctx, jobId, "FAILED", 0, fmt.Sprintf("PDF to JPG conversion failed: %v", err))
				return err
			}
			
			// Change outPath to zip so the uploader picks it up
			outPath = outZipPath
		} else {
			for i, item := range fileItems {
				headerBytes, err := s3Client.GetHeaderBytes(ctx, item.Key, 65535)
				if err != nil {
					worker.PublishEvent(ctx, jobId, "FAILED", 0, fmt.Sprintf("Failed to read image %d", i+1))
					return err
				}
				format, err := validator.Sniff(headerBytes)
				if err != nil {
					worker.PublishEvent(ctx, jobId, "FAILED", 0, fmt.Sprintf("Image %d validation failed: %v", i+1, err))
					return err
				}

				stream, err := s3Client.DownloadStream(ctx, item.Key)
				if err != nil {
					worker.PublishEvent(ctx, jobId, "FAILED", 0, fmt.Sprintf("Failed to download image %d", i+1))
					return err
				}
				
				localPath := filepath.Join(tempDir, fmt.Sprintf("img_%d.%s", i, format))
				outFile, err := os.Create(localPath)
				if err != nil {
					stream.Close()
					return err
				}
				io.Copy(outFile, stream)
				outFile.Close()
				stream.Close()

				imagePaths = append(imagePaths, localPath)
			}

			pageSize, ok := payload["page_size"].(string)
			if !ok { pageSize = "A4" }
			
			orientation, ok := payload["orientation"].(string)
			if !ok { orientation = "PORTRAIT" }
			
			margins, ok := payload["margins"].(string)
			if !ok { margins = "NONE" }

			transparencyMode, ok := payload["transparency_mode"].(string)
			if !ok { transparencyMode = "FLATTEN_WHITE" }

			var finalImagePaths []string
			for i, localPath := range imagePaths {
				// Extract format from the localPath extension
				ext := filepath.Ext(localPath)
				format := "jpg"
				if len(ext) > 1 {
					format = ext[1:]
				}
				processedPath, err := processor.ProcessImage(localPath, format, transparencyMode)
				if err != nil {
					worker.PublishEvent(ctx, jobId, "FAILED", 0, fmt.Sprintf("Image processing failed for %d: %v", i+1, err))
					return err
				}
				finalImagePaths = append(finalImagePaths, processedPath)
			}

			worker.PublishEvent(ctx, jobId, "PROCESSING", 60, "Generating PDF...")
			
			if err := converter.GeneratePDF(ctx, finalImagePaths, outPath, pageSize, orientation, margins); err != nil {
				worker.PublishEvent(ctx, jobId, "FAILED", 0, fmt.Sprintf("PDF Generation failed: %v", err))
				return err
			}
		}

		worker.PublishEvent(ctx, jobId, "PROCESSING", 85, "Uploading result...")
		
		finalFile, err := os.Open(outPath)
		if err != nil {
			worker.PublishEvent(ctx, jobId, "FAILED", 0, "Failed to read generated output file")
			return err
		}
		defer finalFile.Close()

		fileInfo, _ := finalFile.Stat()
		
		contentType := "application/pdf"
		if filepath.Ext(outPath) == ".zip" {
			contentType = "application/zip"
		}
		
		if err := s3Client.UploadStream(ctx, targetS3Key, finalFile, fileInfo.Size(), contentType); err != nil {
			worker.PublishEvent(ctx, jobId, "FAILED", 0, "Failed to upload final result")
			return err
		}

		worker.PublishEvent(ctx, jobId, "COMPLETED", 100, "PDF successfully generated and uploaded")
		return nil
	})
}
