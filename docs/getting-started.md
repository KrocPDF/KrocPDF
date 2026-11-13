# 🚀 Getting Started with KrocPDF

Welcome to the **KrocPDF** developer guide! This document provides the fastest path to cloning, building, running, and verifying the platform locally.

KrocPDF features a **dual-engine architecture**:
- **Local In-Browser Engine (Client-Side WASM)**: Runs completely within browser memory using WebAssembly (`pdf-lib`, HTML Canvas). **Zero bytes** uploaded to any server.
- **Cloud Worker Engine (High-Throughput Daemon)**: Scalable backend using Go 1.25, NestJS 12, Redis Streams, PostgreSQL, and Cloudflare R2 / MinIO for massive multi-hundred document queues.

Choose the track that fits what you want to work on:

---

## ⚡ Quick Navigation
- [Track A: Instant 5-Minute Setup (Frontend & WASM Only)](#track-a-instant-5-minute-setup-frontend--wasm-only) — *No Docker required!*
- [Track B: Full Monorepo Setup (Cloud Worker Stack)](#track-b-full-monorepo-setup-cloud-worker-stack) — *Full infrastructure*
- [🧪 Running the Verification Test Suite](#-running-the-verification-test-suite)
- [🧩 Architecture & Service Matrix](#-architecture--service-matrix)
- [♿ Accessibility & Localization Statement](#-accessibility--localization-statement)

---

## Track A: Instant 5-Minute Setup (Frontend & WASM Only)

If you are working on the UI, animations, conversion settings, or client-side WebAssembly compilation, **you do not need Docker, Go, Redis, or PostgreSQL!**

### 1. Prerequisites
- **Node.js**: `>= 20.x` (LTS recommended)
- **npm**: `>= 10.x`
- **Git**

### 2. Clone & Run
```bash
# 1. Clone the repository
git clone https://github.com/KrocPDF/KrocPDF.git
cd KrocPDF

# 2. Navigate to the frontend workspace and install dependencies
cd frontend
npm install

# 3. Start the Next.js development server
npm run dev
```

### 3. Verify Local Conversion
1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. Drag and drop sample images from [`examples/images/`](../examples/images/) into the conversion widget.
3. Click **"Convert to PDF"**.
4. Your PDF compiles locally in memory in **under 800ms**. Check your browser DevTools Network tab: **0 bytes are uploaded**.

*You are ready to contribute to the frontend!*

---

## Track B: Full Monorepo Setup (Cloud Worker Stack)

Use this track if you are developing API endpoints, Redis queue pipelines, Go worker compilation, or infrastructure manifests.

### 1. Prerequisites
- **Docker & Docker Compose**: v24.x or later
- **Node.js**: `>= 20.x` and `npm`
- **Go**: `>= 1.24` (Go 1.25 recommended)
- **Git**

### 2. Boot Local Infrastructure
```bash
# From the repository root:
cp .env.example .env

# Spin up PostgreSQL 16, Redis 7 Streams, and MinIO S3
docker compose up -d
```

Verify healthy status with `docker compose ps`:
- **PostgreSQL**: `localhost:5432`
- **Redis Streams**: `localhost:6379`
- **MinIO S3 API**: `http://localhost:9000`
- **MinIO Web Console**: `http://localhost:9001` (User: `admin`, Password: `admin123`)

### 3. Initialize & Start Backend API Gateway
```bash
cd backend-api
npm install

# Push database schema to local Postgres
npx prisma db push

# Start the NestJS API in development mode
npm run start:dev
```
API Gateway will be accessible at [http://localhost:3000/api](http://localhost:3000/api) (or port defined in `.env`).

### 4. Start Conversion Worker Daemon
Open a new terminal:
```bash
cd worker-service

# Run Go worker daemon
go run cmd/worker/main.go
```
The Go daemon immediately joins the Redis consumer group and polls for pending document conversion tasks.

### 5. Start Frontend Client
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000). You can now switch between **Local WASM** and **Cloud Mode** in the UI.

---

## 🧪 Running the Verification Test Suite

Before opening a pull request, verify your changes across all workspaces:

```bash
# From the repository root:

# 1. TypeScript compilation check across workspaces
npm run typecheck

# 2. Oxlint / ESLint linter across workspaces
npm run lint

# 3. Unit test suites (Vitest & Jest)
npm run test:unit

# 4. Playwright End-to-End integration tests
npm run test:e2e

# 5. Worker service sanity (Go)
cd worker-service && go vet ./... && go test ./...
```

---

## 🧩 Architecture & Service Matrix

| Service | Directory | Tech Stack | Local Port |
| :--- | :--- | :--- | :--- |
| **Frontend Web** | `frontend/` | Next.js 16, React 19, Tailwind CSS v4, WASM | `:3000` |
| **API Gateway** | `backend-api/` | NestJS 12, Prisma 5, Express, IORedis | `:3001` (or API route) |
| **Worker Daemon** | `worker-service/` | Go 1.25, `pdfcpu`, `govips`, Redis Streams | Background Worker |
| **PostgreSQL** | Docker | Postgres 16 Alpine | `:5432` |
| **Redis** | Docker | Redis 7 Alpine (Streams) | `:6379` |
| **MinIO S3** | Docker | S3-Compatible Ephemeral Storage | `:9000` / `:9001` |
| **E2E Suite** | `e2e/` | Playwright (Chromium, Firefox, WebKit) | Headless |

---

## ♿ Accessibility & Localization Statement

KrocPDF is committed to building an inclusive tool for everyone:
- **WCAG 2.1 AA Compliance**: All interactive controls feature visible focus rings, high contrast ratios (`>= 4.5:1`), and accessible names.
- **Keyboard Navigation**: Full tab index traversal across file cards, delete actions, drag reordering handles, and conversion triggers.
- **Screen Reader Support**: Conversion progress is announced dynamically via `aria-live="polite"` regions.
- **Localization & RTL**: Internationalization (i18n) and Right-to-Left (RTL) language support are tracked in our active roadmap for version 1.2.

---

## 📚 Related Documentation
- [Contributing Guide](../CONTRIBUTING.md) — Issue triage, branch naming, and pull request rules
- [Architecture Blueprint](../ARCHITECTURE.md) — Dual-engine deep dive and event lifecycles
- [Performance Benchmarks](./benchmarks.md) — Real-world compilation times and hardware metrics
- [Privacy Policy](../PRIVACY.md) — 0-byte WASM guarantee and 24h cloud auto-purge
- [Security Policy](../SECURITY.md) — STRIDE threat model and responsible disclosure

