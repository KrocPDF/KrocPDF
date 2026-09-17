package converter

import (
	"archive/zip"
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strconv"

	"github.com/h2non/bimg"
	"github.com/pdfcpu/pdfcpu/pkg/api"
	"github.com/pdfcpu/pdfcpu/pkg/pdfcpu/model"
)

// PdfToJpg extracts each page of a PDF as a JPG and streams it into a local ZIP file.
// Emits progress updates via a callback to ensure the frontend can show real-time progress.
func PdfToJpg(ctx context.Context, inPath string, outZipPath string, quality int, progressCb func(int, string)) error {
	// First, determine page count using pdfcpu (lightweight)
	pageCount, err := api.PageCountFile(inPath)
	if err != nil {
		return fmt.Errorf("failed to get page count: %w", err)
	}

	if pageCount == 0 {
		return fmt.Errorf("PDF has no pages")
	}

	// Create the temporary zip file
	zipFile, err := os.Create(outZipPath)
	if err != nil {
		return fmt.Errorf("failed to create zip file: %w", err)
	}
	
	zipWriter := zip.NewWriter(zipFile)

	for i := 1; i <= pageCount; i++ {
		// Check context cancellation
		select {
		case <-ctx.Done():
			zipWriter.Close()
			zipFile.Close()
			return ctx.Err()
		default:
		}

		// Report progress
		if progressCb != nil {
			pct := 10 + int((float64(i-1)/float64(pageCount))*70) // 10% to 80%
			progressCb(pct, fmt.Sprintf("Extracting page %d of %d", i, pageCount))
		}

		pageDir, err := os.MkdirTemp("", "pdf-page-*")
		if err != nil {
			return fmt.Errorf("failed to create page directory: %w", err)
		}

		defer os.RemoveAll(pageDir)

		conf := model.NewDefaultConfiguration()
		if err := api.ExtractPagesFile(
			inPath,
			pageDir,
			[]string{strconv.Itoa(i)},
			conf,
		); err != nil {
			return fmt.Errorf("failed to extract page %d: %w", i, err)
		}

		// pdfcpu ExtractPagesFile outputs files as <inPathBase>_<pageNum>.pdf
		// We need to figure out the exact generated name.
		// Since we output to an empty temp dir, we can just grab the first .pdf file
		entries, err := os.ReadDir(pageDir)
		if err != nil {
			return fmt.Errorf("failed to read page directory: %w", err)
		}
		var extractedPdf string
		for _, entry := range entries {
			if !entry.IsDir() && filepath.Ext(entry.Name()) == ".pdf" {
				extractedPdf = filepath.Join(pageDir, entry.Name())
				break
			}
		}
		
		if extractedPdf == "" {
			return fmt.Errorf("pdfcpu did not generate a pdf file in %s", pageDir)
		}
		
		// Wait! Actually, let's use the explicit Rename or just read extractedPdf
		pageBytes, err := os.ReadFile(extractedPdf)
		if err != nil {
			return fmt.Errorf("failed to read extracted page %d: %w", i, err)
		}

		imgBuffer, err := bimg.NewImage(pageBytes).Process(bimg.Options{
			Type:    bimg.JPEG,
			Quality: quality,
		})
		if err != nil {
			zipWriter.Close()
			zipFile.Close()
			return fmt.Errorf("failed to extract page %d: %w", i, err)
		}

		// Create a new file within the zip
		f, err := zipWriter.Create(fmt.Sprintf("page_%d.jpg", i))
		if err != nil {
			zipWriter.Close()
			zipFile.Close()
			return fmt.Errorf("failed to add page %d to zip: %w", i, err)
		}

		// Stream the JPEG buffer directly into the zip.Writer
		_, err = f.Write(imgBuffer)
		if err != nil {
			zipWriter.Close()
			zipFile.Close()
			return fmt.Errorf("failed to write page %d to zip: %w", i, err)
		}
		
		// Let GC quickly reclaim the image buffer
		imgBuffer = nil
	}

	// Finalize zip
	if err := zipWriter.Close(); err != nil {
		zipFile.Close()
		return fmt.Errorf("failed to close zip writer: %w", err)
	}

	if err := zipFile.Close(); err != nil {
		return fmt.Errorf("failed to close zip file: %w", err)
	}

	return nil
}
