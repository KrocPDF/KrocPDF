#!/usr/bin/env bash
# ==============================================================================
# KrocPDF REST API & Server-Sent Events (SSE) Progress Demo Script
# Demonstrates 3-step distributed cloud conversion:
# 1. POST /api/convert (Obtain Job ID & Presigned S3 PUT URLs)
# 2. PUT to S3 directly (0 server compute during file upload)
# 3. Follow SSE stream /api/jobs/:id/progress until Go worker compiles PDF
# ==============================================================================

set -euo pipefail

API_HOST="${API_HOST:-http://localhost:3000}"
IMAGE_1="${1:-examples/images/sample-receipt.jpg}"
IMAGE_2="${2:-examples/images/sample-document.png}"

echo "=== 1. Creating Conversion Job on $API_HOST ==="
CREATE_RESPONSE=$(curl -s -X POST "$API_HOST/api/convert" \
  -H "Content-Type: application/json" \
  -d '{
    "pageSize": "A4",
    "orientation": "portrait",
    "margins": "small",
    "imageCount": 2
  }')

echo "Response: $CREATE_RESPONSE"
JOB_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4 || echo "$CREATE_RESPONSE" | grep -o '"jobId":"[^"]*' | cut -d'"' -f4)

if [ -z "$JOB_ID" ]; then
  echo "Error: Failed to extract Job ID from response."
  exit 1
fi

echo "Created Job ID: $JOB_ID"

echo ""
echo "=== 2. Following Real-Time Progress (SSE) ==="
echo "Listening to $API_HOST/api/jobs/$JOB_ID/progress..."
curl -N -s "$API_HOST/api/jobs/$JOB_ID/progress" | while read -r line; do
  echo "$line"
  if echo "$line" | grep -q '"status":"COMPLETED"'; then
    echo "Conversion completed successfully!"
    break
  fi
done

echo ""
echo "=== 3. Done! Download your PDF ==="
echo "Download Endpoint: $API_HOST/api/jobs/$JOB_ID/download"
