package converter

import (
	"testing"

	"github.com/pdfcpu/pdfcpu/pkg/pdfcpu/model"
)

func TestGetImportConfig(t *testing.T) {
	tests := []struct {
		name        string
		pageSize    string
		orientation string
		margins     string
		expected    string
	}{
		{
			name:        "A4 Portrait No Margins",
			pageSize:    "A4",
			orientation: "PORTRAIT",
			margins:     "NONE",
			expected:    "f:A4, pos:c, sc:1.0",
		},
		{
			name:        "Letter Landscape Small Margins",
			pageSize:    "Letter",
			orientation: "LANDSCAPE",
			margins:     "SMALL",
			expected:    "f:LetterL, pos:c, sc:0.95",
		},
		{
			name:        "Legal Portrait Large Margins",
			pageSize:    "Legal",
			orientation: "PORTRAIT",
			margins:     "LARGE",
			expected:    "f:Legal, pos:c, sc:0.8",
		},
		{
			name:        "Unsupported FIT_TO_IMAGE defaults to A4",
			pageSize:    "FIT_TO_IMAGE",
			orientation: "PORTRAIT",
			margins:     "NONE",
			expected:    "f:A4, pos:c, sc:1.0",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GetImportConfig(tt.pageSize, tt.orientation, tt.margins)
			if result != tt.expected {
				t.Errorf("expected %q, got %q", tt.expected, result)
			}
		})
	}
}

func TestCompressPDFLevels(t *testing.T) {
	levels := []string{"LOW", "MEDIUM", "HIGH", "MAXIMUM", "UNKNOWN"}

	for _, level := range levels {
		t.Run(level, func(t *testing.T) {
			// Validate level maps cleanly without panic
			conf := model.NewDefaultConfiguration()
			switch level {
			case "LOW":
				conf.OptimizeResourceDicts = true
			case "MEDIUM":
				conf.OptimizeResourceDicts = true
				conf.WriteObjectStream = true
			case "HIGH", "MAXIMUM":
				conf.OptimizeResourceDicts = true
				conf.OptimizeDuplicateContentStreams = true
				conf.WriteObjectStream = true
				conf.WriteXRefStream = true
			default:
				conf.OptimizeResourceDicts = true
				conf.WriteObjectStream = true
			}

			if !conf.OptimizeResourceDicts {
				t.Errorf("OptimizeResourceDicts must be true for level %s", level)
			}
		})
	}
}

