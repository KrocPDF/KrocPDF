# 🏛️ 01. Dual-Engine Architecture & Decision Engine

The core competitive advantage of KrocPDF is its **Dual-Engine Document Architecture**. On the web, we balance browser WebAssembly (WASM) with Go cloud workers. On mobile, we adapt this into an ultra-fast **On-Device Native Engine** paired with our scalable **Cloud Worker Cluster**.

---

## ⚖️ Web vs. Mobile Dual-Engine Mapping

| Engine Layer | Web Platform (`frontend/`) | Mobile App (`krocpdf-mobile`) |
| :--- | :--- | :--- |
| **Local Client Engine** | Browser WASM (`pdf-lib`, Canvas 2D) | **Native On-Device Dart/Skia** (`pdf` package, native image decoders) |
| **Input Capture** | HTML5 drag-and-drop file picker | **Physical Camera Scanner** (ML Kit) + Photo Gallery + File Picker |
| **Offline Capability** | Limited to loaded service workers | **100% Full Offline Execution** (Zero internet required) |
| **Cloud Engine** | NestJS Gateway + Go 1.25 Worker Cluster | **Identical NestJS Gateway + Go 1.25 Worker Cluster** |
| **Progress Tracking** | Web EventSource (SSE) | **HTTP/2 Streaming SSE Client** (`dio` streaming transformer) |
| **Storage & Output** | Browser Blob URL (`URL.createObjectURL`) | **Native Filesystem Cache + System Share Sheet** |

---

## 🔄 Dual-Engine Architecture Diagram

```mermaid
graph TD
    User([User: Mobile Camera / Photos / Files]) --> Ingest[Capture & Reorder Workspace]
    Ingest --> Decision{Dual-Engine Decision Heuristics}

    %% Local Path
    Decision -->|Low/Medium Batch & Offline Preferred| LocalEngine[Native On-Device Engine]
    subgraph On-Device Execution
        LocalEngine --> DartImage[Image Downsample & Crop (Skia/Image)]
        DartImage --> PDFBuilder[Dart PDF Document Builder]
        PDFBuilder --> LocalCache[(App Cache Directory)]
    end

    %% Cloud Path
    Decision -->|Large Batch >30 imgs OR High-Res Cloud Toggle| CloudEngine[Cloud Accelerated Engine]
    subgraph Cloud Infrastructure
        CloudEngine --> Presign[POST /api/v1/conversions/presigned-url]
        Presign --> S3Direct[Direct Multipart S3/MinIO Upload]
        S3Direct --> JobDispatch[POST /api/v1/conversions]
        JobDispatch --> Redis[(Redis 7 Streams)]
        Redis --> Worker[Go 1.25 Conversion Worker]
        Worker --> S3Output[(Compiled PDF in MinIO)]
        JobDispatch --> SSE[SSE Progress Stream: /progress]
    end

    SSE -.->|Live % Updates| ProgressUI[Real-time Progress Modal]
    S3Output --> Download[GET /api/v1/conversions/:id/download]
    Download --> LocalCache

    LocalCache --> Viewer[In-App PDF Viewer & Share Sheet]
    Viewer --> Share([Share to WhatsApp, Mail, AirDrop, Save to Files])
```

---

## 🧠 The Adaptive Decision Engine (Heuristics)

The mobile application dynamically evaluates the following parameters before executing a conversion:

```dart
enum ConversionEnginePreference {
  automatic, // Recommended default
  alwaysLocal, // Maximum privacy / strict offline
  alwaysCloud, // Highest compression / server power
}

class EngineDecisionHeuristic {
  static bool shouldOffloadToCloud({
    required int imageCount,
    required int totalSizeBytes,
    required bool isOnline,
    required bool isMeteredConnection,
    required ConversionEnginePreference preference,
  }) {
    // 1. If offline, local conversion is mandatory
    if (!isOnline) return false;

    // 2. Honor explicit user settings
    if (preference == ConversionEnginePreference.alwaysLocal) return false;
    if (preference == ConversionEnginePreference.alwaysCloud) return true;

    // 3. Prevent data-heavy uploads on metered mobile cellular connections
    if (isMeteredConnection && totalSizeBytes > 25 * 1024 * 1024) {
      return false; // Fall back to device processing to save user data
    }

    // 4. Batch threshold: Cloud is recommended for massive batches
    // Devices with >30 high-DPI images might experience memory spikes or throttling
    if (imageCount >= 30 || totalSizeBytes > 60 * 1024 * 1024) {
      return true;
    }

    // Default to ultra-fast local processing
    return false;
  }
}
```

---

## ⚡ The On-Device Engine (Privacy-First)

### How Local Conversion Works:
1. **Memory Discipline**: Images are processed sequentially or in small worker isolates (using Flutter `compute()`) to avoid allocating all decoded bitmaps simultaneously.
2. **Page Geometry**: Supports standard presets matching the web app:
   - **Page Sizes**: A4, Letter, Legal, or Fit to Image.
   - **Orientations**: Portrait, Landscape, or Auto (matches image aspect ratio).
   - **Margins**: None (0pt), Small (18pt), Medium (36pt), Large (72pt).
3. **Compression & Downscaling**:
   - Compresses raw camera captures (often 12–48MP) to 150–200 DPI JPEG buffers inside the PDF container. This keeps the resulting PDF small (<3MB for 10 pages) without noticeable quality loss.

---

## ☁️ The Cloud Supercharger Engine

### When Cloud Processing Wins:
1. **Batch Sizes 50–500 Images**: Converting hundreds of scanned pages on a mobile phone can drain battery and risk OS background process termination.
2. **Ultra-PDF Compression**: The cloud's Go worker runs `pdfcpu`, which performs multi-pass stream optimization, font compacting, and resource dictionary compaction far beyond what lightweight mobile libraries can do.
3. **Background Persistence**: If the user leaves the app, the cloud worker completes the compilation asynchronously, notifying the user when their document is ready.
