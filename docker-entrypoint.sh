#!/bin/sh
set -e

echo "=================================================="
echo "🚀 Starting KrocPDF Production Monolith Container"
echo "=================================================="

# Export worker environment
export ENABLE_WORKER_HTTP=false

# Push / Synchronize Prisma Schema with database if DATABASE_URL is present
if [ -n "$DATABASE_URL" ]; then
  echo "==> Synchronizing database schema with Prisma..."
  npx prisma db push --skip-generate || echo "⚠️ Warning: Prisma db push failed or skipped. Continuing startup."
else
  echo "⚠️ Warning: DATABASE_URL not set; skipping database synchronization."
fi

# Start the Go conversion worker in the background
echo "==> Starting Go worker daemon in background..."
/usr/local/bin/kroc-worker &
WORKER_PID=$!
echo "==> Go worker started with PID: $WORKER_PID"

# Start the NestJS API server in the foreground/subshell
echo "==> Starting NestJS API Gateway on port ${PORT:-3000}..."
node dist/main.js &
NEST_PID=$!
echo "==> NestJS API started with PID: $NEST_PID"

# Signal handler for graceful shutdown
term_handler() {
  echo "==> Received shutdown signal. Terminating processes gracefully..."
  kill -TERM "$WORKER_PID" 2>/dev/null || true
  kill -TERM "$NEST_PID" 2>/dev/null || true
  wait "$WORKER_PID" 2>/dev/null || true
  wait "$NEST_PID" 2>/dev/null || true
  echo "==> All processes shut down cleanly."
  exit 0
}

trap 'term_handler' SIGTERM SIGINT

# Wait for any process to exit
wait -n "$WORKER_PID" "$NEST_PID"
EXIT_STATUS=$?
echo "==> A core process exited with status $EXIT_STATUS. Stopping container."
term_handler
