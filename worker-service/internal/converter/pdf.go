package converter

import (
	"context"
	"fmt"

	"github.com/pdfcpu/pdfcpu/pkg/api"
	"github.com/pdfcpu/pdfcpu/pkg/pdfcpu/model"
	"github.com/pdfcpu/pdfcpu/pkg/pdfcpu/types"
)

// GetImportConfig translates layout settings into a pdfcpu configuration string
func GetImportConfig(pageSize, orientation, margins string) string {
	formSize := pageSize
	if formSize == "FIT_TO_IMAGE" || formSize == "CUSTOM" {
		formSize = "A4" // Fallback for unsupported sizes in this MVP
	}

	if orientation == "LANDSCAPE" {
		formSize += "L"
	}

	scale := "1.0"
	switch margins {
	case "SMALL":
		scale = "0.95"
	case "MEDIUM":
		scale = "0.9"
	case "LARGE":
		scale = "0.8"
	}

	return fmt.Sprintf("f:%s, pos:c, sc:%s", formSize, scale)
}

// GeneratePDF takes a list of downloaded image file paths and merges them into a PDF.
// Using physical files is preferred for memory constraints.
func GeneratePDF(ctx context.Context, imagePaths []string, outPath string, pageSize, orientation, margins string) error {
	importConfig := GetImportConfig(pageSize, orientation, margins)

	imp, _ := api.Import(importConfig, types.POINTS)

	err := api.ImportImagesFile(imagePaths, outPath, imp, nil)
	return err
}

// MergePDFs takes a list of downloaded PDF file paths and merges them into a single PDF.
func MergePDFs(ctx context.Context, pdfPaths []string, outPath string) error {
	return api.MergeCreateFile(pdfPaths, outPath, false, nil)
}

// CompressPDF optimizes a PDF file based on the requested level
func CompressPDF(ctx context.Context, inPath string, outPath string, level string) error {
	conf := model.NewDefaultConfiguration()
	
	// Map UI levels to pdfcpu configuration heuristics
	// LOW / MEDIUM: standard
	// HIGH / MAXIMUM: aggressive stream optimization
	switch level {
	case "LOW", "MEDIUM":
		conf.OptimizeResourceDicts = true
	case "HIGH", "MAXIMUM":
		conf.OptimizeResourceDicts = true
		conf.OptimizeDuplicateContentStreams = true
	default:
		conf.OptimizeResourceDicts = true
	}

	return api.OptimizeFile(inPath, outPath, conf)
}
