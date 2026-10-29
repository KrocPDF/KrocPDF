#!/bin/sh
set -e

echo "=================================================="
echo "🚀 Starting KrocPDF Production Monolith Container"
echo "=================================================="

# Ensure worker doesn't attempt to bind to public PORT
export ENABLE_WORKER_HTTP=false

# Verify Prisma client exists or regenerate
if [ ! -d "node_modules/@prisma/client" ] || [ ! -d "node_modules/.prisma/client" ]; then
  echo "==> Prisma client not found in node_modules, generating..."
  npx prisma generate
fi

# Start the Go conversion worker in the background
echo "==> Starting Go worker daemon in background..."
/usr/local/bin/kroc-worker &
WORKER_PID=$!
echo "==> Go worker started with PID: $WORKER_PID"

# Start the NestJS API server in the foreground
echo "==> Starting NestJS API Gateway on port ${PORT:-3000}..."
exec node dist/main.js
