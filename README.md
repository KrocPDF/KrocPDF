<div align="center">

<img src="docs/assets/KrocPDF_Logo_Without_Bg.png" alt="KrocPDF Logo" width="120" />

# KrocPDF — Privacy-First Document Platform

<p align="center">
  <a href="https://github.com/KrocPDF/KrocPDF/actions/workflows/ci-gatekeeper.yml"><img src="https://github.com/KrocPDF/KrocPDF/actions/workflows/ci-gatekeeper.yml/badge.svg" alt="CI Gatekeeper" /></a>
  <a href="https://github.com/KrocPDF/KrocPDF/actions/workflows/daily-audit.yml"><img src="https://github.com/KrocPDF/KrocPDF/actions/workflows/daily-audit.yml/badge.svg" alt="Daily Health Audit" /></a>
  <a href="./e2e"><img src="https://img.shields.io/badge/E2E-Playwright-2EAD33?logo=playwright" alt="Playwright E2E" /></a>
  <a href="./PRIVACY.md"><img src="https://img.shields.io/badge/Privacy-0--Byte%20WASM-brightgreen.svg" alt="0-Byte WASM" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" /></a>
  <a href="https://nestjs.com/"><img src="https://img.shields.io/badge/NestJS-12-E0234E?logo=nestjs" alt="NestJS" /></a>
  <a href="https://go.dev/"><img src="https://img.shields.io/badge/Go-1.25-00ADD8?logo=go" alt="Go" /></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql" alt="PostgreSQL" /></a>
  <a href="https://redis.io/"><img src="https://img.shields.io/badge/Redis-Streams-DC382D?logo=redis" alt="Redis Streams" /></a>
  <a href="https://www.cloudflare.com/products/r2/"><img src="https://img.shields.io/badge/Cloudflare-R2_%240_Egress-F38020?logo=cloudflare" alt="Cloudflare R2" /></a>
</p>

</div>

---

## Visual Showcase

<div align="center">

<p align="center">
  <video src="docs/assets/kroc-crunch-animation.mp4" poster="docs/assets/kroc-crunch-poster.jpg" controls muted loop playsinline style="max-width: 100%; height: auto; border-radius: 12px;"></video>
</p>

<br/>

<img src="docs/assets/krocpdf_homepage.png" alt="KrocPDF Landing Page" width="95%" />

<br/><br/>

<p align="center">
  <img src="docs/assets/krocpdf_png_to_pdf.png" alt="PNG to PDF Conversion Page" width="48%" />
  &nbsp;
  <img src="docs/assets/krocpdf_jpg_to_pdf.png" alt="JPG to PDF Conversion Page" width="48%" />
</p>

</div>

---

<p align="center">
  <b>Jump Directly:</b>
  <a href="#why-this-exists"><code>Why Us</code></a> •
  <a href="#key-features"><code>Features</code></a> •
  <a href="#us-vs-them"><code>Comparison</code></a> •
  <a href="#architecture-overview"><code>Architecture</code></a> •
  <a href="#prerequisites"><code>Prerequisites</code></a> •
  <a href="#quick-start-local-development"><code>Quick Start</code></a> •
  <a href="#usage-guide"><code>API Guide</code></a> •
  <a href="#production-deployment-cloudflare-r2"><code>Cloudflare R2</code></a> •
  <a href="#testing--quality-assurance"><code>Testing</code></a> •
  <a href="#governance-legal--privacy"><code>Governance & Legal</code></a> •
  <a href="#contributing--community"><code>Contributing</code></a>
</p>

---

## Why This Exists

> [!CAUTION]
> ### The Problem: The Predatory "Free" Converter Trap
> Most commercial online converters (iLovePDF, Smallpdf, PDF Candy) lure users with a "free" claim, then aggressively monetize document urgency through user-hostile mechanics:
> - **Arbitrary Paywalls:** 15–25 MB caps strategically engineered to fail on high-res camera scans or multi-page documents.
> - **Permanent Data Harvesting:** Invoices, tax returns, and ID scans are uploaded to opaque third-party cloud disks with no proof of deletion.
> - **Degraded Quality & Watermarks:** Files are re-compressed down to 72 DPI, ruining small print unless you purchase a monthly subscription.
> - **Deceptive Dark Patterns:** Full-screen popups, countdown blockers, and fake download buttons running tracking scripts.

> [!TIP]
> ### The Mission: Enterprise Quality with Zero-Compromise Privacy
> We engineered this platform to be the definitive **open-source, privacy-first alternative**:
> - **Client-First Inversion (WASM):** Small-to-medium files compile right inside your browser's WebAssembly sandbox. **0 bytes leave your machine.**
> - **High-Throughput Distributed Cloud Worker:** Massive multi-gigabyte queues scale seamlessly through Go goroutines (`pdfcpu` + `govips`).
> - **Zero Bandwidth Penalties:** Integrated with Cloudflare R2's zero-egress S3 API, allowing unlimited 100 MB free conversions without cost traps.

### The Architecture Shift at a Glance

| Optional **The Predatory Incumbents** |  **Our Open-Source Architecture** |
| :--- | :--- |
|  **Capped at 15–25 MB**<br>Forces paid subscription traps when submitting documents. |  **100 MB Free File Limits**<br>4x higher than standard industry ceilings. |
|  **Forced Recompression & Branding**<br>Downsamples to 72 DPI and adds unwanted watermarks. |  **Lossless 150/300 DPI Fidelity**<br>Pixel-perfect clarity, zero watermarks, legal-ready output. |
|  **Opaque Server Logging**<br>Sensitive personal files uploaded and retained indefinitely. |  **Dual-Engine Privacy (WASM First)**<br>Local mode runs 100% in-browser; files never touch a wire. |
|  **Indefinite Retention**<br>No visibility into when or if files are permanently deleted. |  **Strict 24h Purge + Instant Delete**<br>Enforced automated lifecycle deletion rules on Cloudflare R2. |
|  **Aggressive Ad Banners & Trackers**<br>Cluttered, deceptive UI designed to harvest ad impressions. |  **Zero Ads & Pure Glassmorphism**<br>Minimalist, focused, distraction-free open-source workspace. |

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

## Key Features

| Feature | Details | Benefit |
|:---|:---|:---|
| **Dual Engine** | Client-side WASM + Go daemon backend | Full privacy for confidential files; high throughput for heavy jobs |
| **100 MB Limit** | 4x larger than standard competitors | Convert high-res scans and multi-page books without splitting |
| **Zero Watermarks** | No branding added to documents | Fully professional PDFs ready for legal, corporate, or academic use |
| **Lossless DPI** | Preserves 150 & 300 DPI resolutions | Crisp text and sharp photography; no forced artifacting |
| **Layout Controls** | Margins (None, Small, Large), Orientation (Portrait, Landscape), Page Size (A4, Letter, Legal) | Complete styling flexibility before generating documents |
| **Visual Reordering** | Drag-and-drop preview grid | Intuitively sort pages before stitching into a single PDF |
| **Real-Time Progress**| Server-Sent Events (SSE) streaming | Accurate live feedback during heavy multi-image compilations |
| **Zero-Egress Cost** | Cloudflare R2 S3-compatible storage | Sustainable open-source deployment with zero bandwidth penalty |

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

## Us vs. Them

| Metric / Capability | Conventional Tools (iLovePDF, Smallpdf) | Our Platform |
|:---|:---|:---|
| **Max File Upload** | 15 MB – 25 MB | **100 MB (Free)** |
| **Watermarks** | Forced on free tier | **Zero (Always Clean)** |
| **Privacy Guarantee** | Server-side upload required | **Client-side WASM Engine Option** |
| **Data Retention** | Indefinite / Opaque retention | **Strict 24h Purge + Instant Purge Action** |
| **Interface** | Ad-heavy & deceptive redirect traps | **Clean Glassmorphic UI, Zero Ads** |
| **Worker Architecture** | Slow single-threaded Node scripts | **Parallel Go Routines (`pdfcpu` + `govips`)** |

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

## Architecture Overview

Our platform decouples stateful API orchestration from CPU-bound image processing through an asynchronous, event-driven queue:

```
[ User Browser ]
       │
       ├─── (Privacy Mode) ──> [ Client-Side WASM Engine ] ──> [ Instant PDF Download ]
       │
       └─── (Batch Mode) ───> [ Next.js Frontend ]
                                     │
                                     ├── (Presigned PUT) ──> [ Cloudflare R2 Bucket ]
                                     │
                                     └── (Job Metadata) ───> [ NestJS API Gateway ]
                                                                   │
                                                                   ├── (Save Record) ──> [ Neon PostgreSQL ]
                                                                   │
                                                                   └── (Enqueue Job) ──> [ Redis Streams ]
                                                                                               │
                                                                                               ▼
                                                                                   [ Go Worker Daemon ]
                                                                                   (govips + pdfcpu)
                                                                                               │
                                                                                               ├── (Stream Output) ──> Cloudflare R2
                                                                                               └── (SSE Progress)  ──> Next.js UI
```

### Feature Specifications & Deep Dives

For detailed breakdowns of how our dual-engine architecture processes specific formats, view our specialized feature specifications:

- [**Merge PDF Engine (v2.1)**](./docs/features/merge-pdf.md): Explores the Smart Auto-Fallback routing between in-browser `pdf-lib` and cloud `pdfcpu` workers, complete with DTO schemas and binary `%PDF-` validation gates.
- [** Mobile App Engineering Blueprint (Flutter)**](./mobile_blueprint/README.md): Comprehensive architectural specifications, wire protocols, Flutter tech stack, UI/UX design tokens, and App Store / Google Play deployment pipelines for the official KrocPDF mobile client.

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

## Prerequisites

Before running the project locally, ensure you have the following installed:

- **Node.js:** `v20.x` or later
- **Go:** `v1.21` or later
- **Docker & Docker Compose:** `v24.x` or later (for local DB, Redis, MinIO)
- **Package Manager:** `npm` or `pnpm`

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

## Quick Start (Local Development)

<div align="center">
<table>
<tr>
<td style="background-color: #0d1117; border-radius: 8px;">
<p><b>terminal — 80x24</b></p>

```bash
# 1-Command Production-Parity Local Bootstrap
git clone https://github.com/KrocPDF/KrocPDF.git
cd KrocPDF && docker compose up -d

[OK] Container jpg2pdf-postgres   Running (Port 5432)
[OK] Container jpg2pdf-redis      Running (Port 6379)
[OK] Container jpg2pdf-minio      Running (S3 API :9000 | Web Console :9001)
[OK] Active Engine Routing        Client WASM: Online | Cloud Worker: Listening
```

</td>
</tr>
</table>
</div>

### ⚡ 5-Minute Developer Quick Start

> 🚀 **Working on Frontend or WASM Only?**  
> You don't need Docker, PostgreSQL, or Go! Jump straight to **[`docs/getting-started.md`](./docs/getting-started.md)** for our zero-friction 5-minute setup track (`cd frontend && npm install && npm run dev`).

For developers working on the full monorepo stack:

### 1. Clone & Setup Environment
```bash
git clone https://github.com/KrocPDF/KrocPDF.git
cd KrocPDF
cp .env.example .env
```

### 2. Start Local Infrastructure
Spin up local PostgreSQL, Redis, and MinIO storage (pre-configured with CORS and automatic bucket provisioning):
```bash
docker compose up -d
```

### 3. Initialize & Run Backend API
```bash
cd backend-api
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```
*API will run on: `http://localhost:3000`*

### 4. Start the Go Conversion Worker
```bash
cd ../worker-service
go run cmd/worker/main.go
```
*Worker connects to Redis Streams and listens for conversion tasks.*

### 5. Launch the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*Web client will be available at: `http://localhost:3000`.*

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

## Usage Guide

### 1. Web Interface
1. Open your browser to `http://localhost:3001` or [Live Demo](https://jpg-to-pdf-zeta.vercel.app).
2. Choose your mode:
   - **Privacy Mode (WASM):** Best for sensitive IDs, confidential documents, under 50MB. Files never leave your browser.
   - **Cloud Batch Mode:** Best for large collections, batch operations up to 100MB.
3. Drag and drop your JPG/PNG files into the upload zone.
4. Reorder images dynamically by dragging cards.
5. Customize page size (**A4, US Letter, Legal**), orientation (**Portrait, Landscape**), and margins (**None, Small, Large**).
6. Click **"Convert to PDF"** and download your clean, unwatermarked document!

### 2. REST API (For Developers)

Create an automated conversion job via our HTTP endpoints:

#### Create Job & Obtain Presigned URLs
```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "pageSize": "A4",
    "orientation": "portrait",
    "margins": "small",
    "imageCount": 2
  }'
```

#### Upload Files Directly to Storage
```bash
curl -X PUT --upload-file page1.jpg "<PRESIGNED_UPLOAD_URL_1>"
curl -X PUT --upload-file page2.jpg "<PRESIGNED_UPLOAD_URL_2>"
```

#### Listen for Progress (SSE)
```bash
curl -N http://localhost:3000/api/jobs/<JOB_ID>/progress
```

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

## Configuration Reference

<details open>
<summary><b> Click to Collapse / Expand Environment Variable Matrix (<code>.env</code>)</b></summary>
<br/>

All application secrets and endpoints can be customized in `.env`:

| Variable | Required | Default / Example | Purpose |
|:---|:---:|:---|:---|
| `DATABASE_URL` | Yes | `postgresql://postgres:password@localhost:5432/jpg2pdf` | PostgreSQL database connection string |
| `REDIS_URL` | Yes | `redis://localhost:6379` | Redis broker connection for streaming queues |
| `S3_ENDPOINT` | Yes | `http://localhost:9000` *(Local)* / `https://<ID>.r2.cloudflarestorage.com` | S3-compatible endpoint (MinIO / Cloudflare R2) |
| `AWS_ACCESS_KEY_ID` | Yes | `admin` *(Local)* / Cloudflare Token ID | S3 API client access identifier |
| `AWS_SECRET_ACCESS_KEY` | Yes | `admin123` *(Local)* / Cloudflare Secret | S3 API authentication secret |
| `AWS_REGION` | Optional | `us-east-1` *(Local)* / `auto` *(R2)* | Storage bucket geographic region |
| `S3_BUCKET_NAME` | Optional | `conversions` | Storage bucket name for temporary artifacts |
| `API_PORT` | Optional | `3000` | Port for the NestJS API gateway |

</details>

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

## Production Deployment (Cloudflare R2)

To deploy at scale with zero bandwidth egress costs:

1. **Create an R2 Bucket:** In the Cloudflare Dashboard, create a bucket named `conversions`.
2. **CORS Policy:** Add the following CORS rule to allow uploads directly from your frontend domain:
   ```json
   [
     {
       "AllowedOrigins": ["https://jpg-to-pdf-zeta.vercel.app", "http://localhost:3000"],
       "AllowedMethods": ["GET", "PUT"],
       "AllowedHeaders": ["*"]
     }
   ]
   ```
3. **Lifecycle Rule:** Enable an Object Lifecycle Rule set to expire and purge objects after 24 hours (1 day).
4. **Deploy Backend & Worker:** Set `S3_ENDPOINT`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` on Render or Railway.

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

## Testing & Quality Assurance

We maintain comprehensive automated testing across all workspaces, including unit, static analysis, and full end-to-end user journeys:

```bash
# 1. Typecheck all workspaces (zero 'any' tolerance)
npm run typecheck

# 2. Linting across frontend and backend (Oxlint / ESLint)
npm run lint

# 3. Unit test suites (Vitest in frontend, Jest in backend-api)
npm run test:unit

# 4. Playwright End-to-End integration tests (WASM 0-byte privacy & SSE streaming)
npm run test:e2e

# 5. Go Worker Daemon tests
cd worker-service && go vet ./... && go test -v ./...
```

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

## ⚡ Performance Benchmarks

KrocPDF delivers on its **sub-800ms compilation** guarantee through client-side WebAssembly and parallel Go worker pipelines:

| Engine | Input Size / Batch | Compilation Duration | Memory Footprint | Network Payload |
| :--- | :--- | :---: | :---: | :---: |
| **Client WASM (`localConverter`)** | 10 pages (1080p JPEG) | **~480 ms** | ~62 MB RAM | **0 bytes** (100% private) |
| **Client WASM (`localConverter`)** | 20 pages (1080p JPEG) | **~780 ms** | ~84 MB RAM | **0 bytes** (100% private) |
| **Distributed Go Worker** | 50 high-DPI photos | **~2.10 s** | Managed Goroutines | Streaming I/O |
| **Distributed Go Worker** | 100 high-DPI photos | **~4.31 s** | Managed Goroutines | Streaming I/O |

*Read the full hardware specifications, memory profiler traces, and reproduction methodology in [**docs/benchmarks.md**](./docs/benchmarks.md).*

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

## 📱 Mobile Client Initiative (Flutter)

Looking to use or build the mobile version of KrocPDF?  
We have established a complete 7-part engineering blueprint and technical specification for cross-platform **iOS** and **Android** development using **Flutter & Dart**:

👉 **[mobile_blueprint/ — Mobile Architecture & Implementation Guide](./mobile_blueprint/README.md)**

- **Architecture**: Dual-engine parity (on-device offline native Dart compiler vs. cloud Go worker offload).
- **Features**: Camera document scanning with auto-edge detection, perspective rectification, and glassmorphic UI.
- **Community Collaboration**: Open for Flutter contributors and mobile engineers!

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

## ♿ Accessibility & Inclusion

KrocPDF is built to be accessible to all users, regardless of device or ability:
- **WCAG 2.1 AA Compliant**: High contrast typography (`>= 4.5:1`), prominent keyboard focus outlines, and accessible touch targets (`>= 44x44px`).
- **Full Keyboard Navigation**: Every action (upload, drag-and-drop reordering, settings adjustment, conversion, download) can be driven entirely via keyboard (`Tab`, `Space`, `Enter`, Arrow keys).
- **Screen Reader Friendly**: Dynamic conversion states and upload alerts are voiced in real-time through `aria-live="polite"` regions.
- **Localization Roadmap**: Full i18n support and RTL (Right-to-Left) layouts are actively planned for v1.2.

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

## 🗺️ Roadmap & Milestones

For a detailed view of our release schedule and planning artifacts, see **[MILESTONE.md](./MILESTONE.md)** and **[RELEASE_v1.0.md](./RELEASE_v1.0.md)**.

- [x] **v1.0 — Production Core (Current):**
  - [x] Dual-engine architecture (Local WASM + Cloud Go Worker)
  - [x] 100 MB file upload support with zero watermarks
  - [x] Real-time SSE conversion progress streaming
  - [x] Cloudflare R2 zero-egress integration
- [ ] **v1.1 — Interactive Canvas & Output Presets (Community Open 🟢):**
  - [ ] Interactive PDF multi-page canvas preview prior to download
  - [ ] Output compression profiles (*Print Ready 300 DPI*, *Email Friendly*, *Archival*)
  - [ ] Additional input formats (HEIC, TIFF, BMP)
- [ ] **v1.2 — Intelligence & Mobile Ecosystem (Core & Community):**
  - [ ] Client-side OCR text extraction for searchable PDFs (Tesseract WASM)
  - [ ] Companion Flutter mobile client launch ([mobile_blueprint/](./mobile_blueprint/README.md))
  - [ ] Cloud storage import connectors (Google Drive, Dropbox, OneDrive)

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

## Contributing & Community

> **We believe in open engineering and community-first innovation.** Whether you're fixing a typo, optimizing Go memory buffers, refining Next.js canvas rendering, or proposing a new compression profile, your contributions help keep the web free from predatory paywalls.

<div align="center">
  <a href="https://github.com/KrocPDF/KrocPDF/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">
    <img src="https://img.shields.io/badge/Good_First_Issues-Start_Here-7057FF?style=for-the-badge&logo=github" alt="Good First Issue" />
  </a>
  <a href="https://github.com/KrocPDF/KrocPDF/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22">
    <img src="https://img.shields.io/badge/Help_Wanted-High_Impact-008672?style=for-the-badge&logo=gitbook" alt="Help Wanted" />
  </a>
  <a href="https://github.com/KrocPDF/KrocPDF/discussions">
    <img src="https://img.shields.io/badge/Community-Discussions-EA4AAA?style=for-the-badge&logo=githubsponsors" alt="Discussions" />
  </a>
</div>

<br/>

### Contribution Lifecycle

```
[ 1. Fork & Branch ] ──► [ 2. Local Fast Dev / Docker ] ──► [ 3. Conventional Commit ] ──► [ 4. CI Validation ] ──► [ 5. Merge & Recognition ]
```

1. **Find an Issue:** Explore open tickets tagged with [`good first issue`](https://github.com/KrocPDF/KrocPDF/labels/good%20first%20issue) or [`help wanted`](https://github.com/KrocPDF/KrocPDF/labels/help%20wanted).
2. **Setup Local Dev in 5 Minutes:** Follow our **[docs/getting-started.md](./docs/getting-started.md)** for instant frontend/WASM setup, or **[CONTRIBUTING.md](./CONTRIBUTING.md)** for full monorepo guidelines.
3. **No CLA Required:** Contributions are under standard MIT License and Developer Certificate of Origin (DCO).
4. **Commit with Discipline:** We follow the **[Conventional Commits](https://www.conventionalcommits.org/)** standard (`feat:`, `fix:`, `perf:`, `docs:`):
   ```bash
   git commit -m "feat(worker): add binary search file size target compression"
   ```
5. **Submit a Pull Request:** Open a PR against `main`. Automated GitHub Actions will validate type safety, linting, and unit/e2e tests.
6. **Code of Conduct:** We are committed to a welcoming environment for all. Read our **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** before participating.

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

### Contributor Recognition

Every contributor who gets a PR merged is permanently immortalized in our project release notes and contributor graph. Thank you to everyone helping democratize document processing!

<p align="center">
  <a href="https://github.com/KrocPDF/KrocPDF/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=KrocPDF/KrocPDF" alt="Contributors" />
  </a>
</p>

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

## Governance, Legal & Privacy

KrocPDF operates under transparent, community-first open-source governance and strict privacy-by-design standards:

- **[GOVERNANCE.md](./GOVERNANCE.md)**: Community stewardship model, 4-tier participation taxonomy (Project Lead, Core Contributors, Triagers, Community), RFC decision-making framework, and 5-wave release protocol.
- **[PRIVACY.md](./PRIVACY.md)**: Formal privacy charter documenting 0-byte WASM local execution, ephemeral Cloud Worker S3 upload with 24-hour auto-purge lifecycle, and cookie-free `@vercel/analytics` telemetry disclosure.
- **[TERMS.md](./TERMS.md)**: Terms of Service, Acceptable Use Policy (malware and DDoS abuse prohibitions), warranty disclaimers, and KrocPDF trademark protection.
- **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)**: Contributor Covenant standards for a welcoming, inclusive community.
- **[SECURITY.md](./SECURITY.md)**: Vulnerability disclosure channels, private reporting instructions, and responsible remediation policies.
- **[SUPPORT.md](./SUPPORT.md)**: Support channels, in-app issue reporting, FAQ, and troubleshooting guide.

<br/>
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=1,2,3,4&height=3&section=header" width="100%" alt="divider" />
</p>
<br/>

## License

This project is open-source software licensed under the **[MIT License](./LICENSE)**.

```
Copyright (c) 2026 Alok Prashar & Open-Source Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions...
```

<div align="center">

<p align="center">
  <a href="https://github.com/KrocPDF/KrocPDF/stargazers">
    <img src="https://img.shields.io/github/stars/KrocPDF/KrocPDF?style=social" alt="Star on GitHub" />
  </a>
  &nbsp;
  <a href="https://github.com/KrocPDF/KrocPDF/network/members">
    <img src="https://img.shields.io/github/forks/KrocPDF/KrocPDF?style=social" alt="Fork on GitHub" />
  </a>
</p>

<p>
  Built with care by <b>Alok Prashar</b> and the <b>KrocPDF</b> open-source community.
</p>

</div>
