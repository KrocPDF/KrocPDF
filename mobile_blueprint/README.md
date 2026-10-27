# 📱 KrocPDF Mobile — Flutter Engineering Blueprint & Architecture Guide

Welcome to the **KrocPDF Mobile Initiative** (`krocpdf-mobile`). This blueprint serves as the central engineering repository, architectural specification, and onboarding guide for developing the official cross-platform mobile application for KrocPDF on **iOS (Apple App Store)** and **Android (Google Play Store)** using **Flutter**.

---

## 🌟 Executive Summary & Vision

**KrocPDF** is a privacy-first, enterprise-grade dual-engine document conversion platform. While our web platform (`Bus-Driver`) leverages Next.js 16, client-side WebAssembly (WASM), and Go backend workers, the mobile application expands our reach directly into users' pockets.

The mobile app delivers:
1. **Pocket Document Scanner**: High-speed camera capture with real-time automatic document edge detection and perspective rectification.
2. **True Offline Dual-Engine**: 100% offline document compilation directly on the smartphone (using native Dart/Skia image-to-PDF generation) with zero data leaving the phone.
3. **Cloud Supercharger**: Optional cloud offload to KrocPDF's NestJS API Gateway and Go conversion cluster for massive batches (>30 high-DPI photos or multi-hundred page documents).
4. **Clean, Premium Aesthetics**: Signature dark-mode glassmorphism interface, intuitive drag-and-drop page reordering, and direct system share sheet integration.

---

## 🗺️ Documentation Sitemap & Reading Order

To get up to speed quickly, explore these blueprint modules in sequence:

| Guide | Description | Key Topics |
| :--- | :--- | :--- |
| [**01. Dual-Engine Architecture**](./01_ARCHITECTURE_AND_DUAL_ENGINE.md) | How the dual-engine works on mobile devices | On-device native compiler vs. cloud offload, decision heuristics, system architecture diagram |
| [**02. Backend API Specification**](./02_BACKEND_API_SPECIFICATION.md) | Complete wire protocol for communicating with KrocPDF backend | Presigned S3 uploads, SSE real-time progress streams, conversion endpoints, error handling |
| [**03. Flutter Tech Stack & Pubspec**](./03_FLUTTER_TECH_STACK_AND_PUBSPEC.md) | Project scaffold, dependency catalog, and state management | Flutter 3.29+, Riverpod 2.x, feature-first Clean Architecture, full `pubspec.yaml` reference |
| [**04. UI/UX & Design System**](./04_UI_UX_AND_DESIGN_SYSTEM.md) | Mobile visual identity and screen design contracts | Color tokens, typography, scanner viewfinder, reorderable thumbnail canvas, preview modal |
| [**05. Platform Permissions & Security**](./05_PLATFORM_PERMISSIONS_AND_SECURITY.md) | iOS and Android native configurations and privacy guardrails | `Info.plist`, `AndroidManifest.xml`, scoped storage, zero-telemetry policy, cache eviction |
| [**06. CI/CD & Store Deployment**](./06_CI_CD_APP_STORE_DEPLOYMENT.md) | Automated build and release engineering | Fastlane configuration, GitHub Actions workflows, App Store Connect & Google Play Console setup |
| [**07. Intern 4-Week Sprint Roadmap**](./07_INTERN_ROADMAP_AND_SPRINT_GUIDE.md) | Structured onboarding milestones and task roadmap | Week 1–4 milestones, acceptance criteria, definition of done (DoD), and mentorship FAQ |

---

## ⚡ Quickstart for Mobile Developers

### 1. Prerequisites
- **Flutter SDK**: `>= 3.29.0` (Dart `>= 3.7.0`)
- **Android Studio / Xcode**: Android SDK Platform 34+, Xcode 16+
- **Physical Device or Emulator**:
  - Android Device (API 26+) or iOS Device (iOS 15+)
  - *Note: Camera document scanning requires a physical device with a camera.*

### 2. Recommended Repository Setup
The mobile app will live in a dedicated repository under the KrocPDF organization:
```
Organization: https://github.com/KrocPDF
Repository:   krocpdf-mobile (or KrocPDF-Mobile)
```

### 3. Local Development Environment
When testing cloud offload features locally:
```bash
# Clone the monorepo backend (this repo)
git clone https://github.com/KrocPDF/KrocPDF.git
cd KrocPDF

# Start backend infrastructure (Postgres, Redis, MinIO)
docker compose up -d postgres redis minio minio-create-bucket

# Start NestJS API Gateway (port 3001)
cd backend-api
npm install
npm run start:dev
```
On Android emulator, point API requests to `http://10.0.2.2:3001`.  
On iOS Simulator, point API requests to `http://localhost:3001`.  
On physical test devices, point to your local LAN IP (e.g. `http://192.168.1.50:3001`).

---

## 🤝 Core Engineering Principles

1. **Privacy-First (No Compromises)**: If an operation can be performed on the phone (e.g. 5 camera snaps converted to PDF), it **must** run locally on the phone without touching any cloud server.
2. **Zero Watermarks, Zero Ads**: The mobile app preserves KrocPDF's reputation as a clean, enterprise-grade utility.
3. **Graceful Degradation**: The app must function fully without an internet connection. Network failures during cloud offloads must automatically offer on-device local fallback.
4. **Predictable Memory Footprint**: Large images must be downscaled/compressed sequentially to prevent mobile Out-Of-Memory (OOM) crashes.
