package validator

import (
	"encoding/base64"
	"testing"
)

var (
	// Valid 1x1 JPEG
	validJPEG = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="
	// Valid 1x1 PNG
	validPNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
	// Decompression Bomb PNG (10000x10000, 100 MP > 50 MP limit)
	bombPNG = "iVBORw0KGgoAAAANSUhEUgAAJxAAACcQCAIAAAA1LPVw"
)

func decodeBase64(s string) []byte {
	data, _ := base64.StdEncoding.DecodeString(s)
	return data
}

func TestSniffValidJPEG(t *testing.T) {
	_, err := Sniff(decodeBase64(validJPEG))
	if err != nil {
		t.Errorf("Expected nil error for valid JPEG, got %v", err)
	}
}

func TestSniffValidPNG(t *testing.T) {
	_, err := Sniff(decodeBase64(validPNG))
	if err != nil {
		t.Errorf("Expected nil error for valid PNG, got %v", err)
	}
}

func TestSniffInvalidHeaderLength(t *testing.T) {
	header := []byte{0x89, 0x50, 0x4E}
	_, err := Sniff(header)
	if err != ErrInvalidImageHeader {
		t.Errorf("Expected ErrInvalidImageHeader for short header, got %v", err)
	}
}

func TestSniffInvalidMagicBytes(t *testing.T) {
	header := []byte{0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F}
	_, err := Sniff(header)
	if err != ErrInvalidImageHeader {
		t.Errorf("Expected ErrInvalidImageHeader for invalid magic bytes, got %v", err)
	}
}

func TestSniffDecompressionBomb(t *testing.T) {
	_, err := Sniff(decodeBase64(bombPNG))
	if err != ErrDecompressionBomb {
		t.Errorf("Expected ErrDecompressionBomb, got %v", err)
	}
}
