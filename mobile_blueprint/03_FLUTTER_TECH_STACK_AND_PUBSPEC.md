# 🛠️ 03. Flutter Tech Stack & Pubspec Blueprint

This document specifies the recommended software development kit (SDK) versions, state management architecture, project directory layout, and complete `pubspec.yaml` dependency catalog for the `krocpdf-mobile` repository.

---

## 🎯 SDK Baseline
- **Flutter SDK**: `>= 3.29.0`
- **Dart SDK**: `>= 3.7.0`
- **Android Target**: Android 14 (API level 34), Min SDK 26 (Android 8.0 Oreo)
- **iOS Target**: iOS 15.0+

---

## 🏗️ Feature-First Clean Architecture

The mobile app follows a modular **Feature-First Architecture** with **Riverpod 2.x** for state management:

```
lib/
├── app/
│   ├── app.dart                   # MaterialApp.router configuration
│   ├── router.dart                # GoRouter route declarations
│   └── theme/                     # Glassmorphic dark theme tokens & styles
├── core/
│   ├── constants/                 # API endpoints, asset paths, layout dimensions
│   ├── errors/                    # Failure classes & exception mappers
│   ├── network/                   # Dio client, interceptors, SSE transformer
│   └── utils/                     # Memory optimizer, file formatters, mime sniffer
└── features/
    ├── home/                      # Dashboard cards & conversion mode picker
    │   ├── presentation/
    │   └── domain/
    ├── scanner/                   # Camera viewfinder & ML Kit document capture
    │   ├── data/
    │   ├── domain/
    │   └── presentation/
    ├── reorder/                   # Draggable grid canvas, crop, rotation & settings
    │   └── presentation/
    ├── conversion/                # Dual-engine coordinator (Local Dart vs Cloud API)
    │   ├── data/                  # Remote datasource (Dio) + Local datasource (PDF)
    │   ├── domain/                # ConversionJob, PageGeometry, CompressionOptions
    │   └── presentation/          # Progress modal & SSE controller
    ├── preview/                   # Native PDF renderer, pinch-to-zoom, page counter
    │   └── presentation/
    └── settings/                  # Offline engine toggle, default page size, clear cache
        └── presentation/
```

---

## 📦 Complete `pubspec.yaml` Blueprint

Copy this directly into the new `krocpdf-mobile` repository:

```yaml
name: krocpdf
description: "KrocPDF - Dual-Engine Privacy-First Mobile Document Converter"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.7.0 <4.0.0'
  flutter: '>=3.29.0'

dependencies:
  flutter:
    sdk: flutter

  # State Management & Routing
  flutter_riverpod: ^2.6.1
  riverpod_annotation: ^2.6.1
  go_router: ^14.8.1

  # Document Scanning & Camera
  camera: ^0.11.1
  google_mlkit_document_scanner: ^0.4.0

  # PDF Generation, Manipulation & Viewing
  pdf: ^3.11.1
  printing: ^5.13.4
  pdfx: ^2.6.0
  image: ^4.5.3

  # Networking & Real-Time SSE Streaming
  dio: ^5.8.0+1
  connectivity_plus: ^6.1.3

  # UI Components, Animations & Glassmorphism
  google_fonts: ^6.2.1
  flutter_svg: ^2.0.17
  reorderable_grid_view: ^2.2.8
  gap: ^3.0.1
  shimmer: ^3.0.0
  flutter_animate: ^4.5.2

  # Device Hardware & System Integration
  file_picker: ^8.1.7
  share_plus: ^10.1.4
  path_provider: ^2.1.5
  permission_handler: ^11.4.0
  flutter_secure_storage: ^9.2.4
  shared_preferences: ^2.5.2
  vibration: ^2.0.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^5.0.0
  build_runner: ^2.4.15
  riverpod_generator: ^2.6.3
  custom_lint: ^0.7.0
  riverpod_lint: ^2.6.4

flutter:
  uses-material-design: true
  assets:
    - assets/icons/
    - assets/images/
    - assets/branding/
```

---

## ⚡ Core Package Justifications

| Package | Purpose in KrocPDF Mobile | Why This Choice? |
| :--- | :--- | :--- |
| **`google_mlkit_document_scanner`** | Automatic paper edge detection, perspective transformation, shadow removal | Native Google ML Kit engine runs on-device with zero cloud latency and produces clean rectangular scans. |
| **`pdf` + `printing`** | On-device native PDF document assembly | 100% offline, zero server dependency. Renders images directly into PDF canvas with precise page geometry. |
| **`pdfx`** | High-performance PDF viewing | Native Skia/Android PdfRenderer and iOS PDFKit bindings; prevents memory blowups when scrolling multi-page PDFs. |
| **`dio`** | Multipart upload & SSE stream decoding | Supports HTTP/2, streaming byte transformers, cancel tokens, and custom S3 upload interceptors. |
| **`reorderable_grid_view`** | Drag-and-drop page sequencing | Smooth interactive reordering of scanned pages matching the web app's drag-and-drop canvas. |
| **`flutter_riverpod`** | Reactive state management | Compile-time safe, testable, handles asynchronous states (`AsyncValue`) cleanly for conversions. |

---

## 🧵 Thread Isolation: Offloading Heavy Image Work

To keep the Flutter UI at a constant 60/120 FPS, never decode or compress large image bitmaps on the main UI isolate. Always utilize Flutter's `compute()` or `Isolate.run()`:

```dart
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:image/image.dart' as img;

Future<File> downsampleImageInIsolate({
  required File inputFile,
  required int maxDimension,
  required int jpegQuality,
}) async {
  return compute(_isolateWorker, {
    'path': inputFile.path,
    'maxDim': maxDimension,
    'quality': jpegQuality,
  });
}

File _isolateWorker(Map<String, dynamic> params) {
  final path = params['path'] as String;
  final maxDim = params['maxDim'] as int;
  final quality = params['quality'] as int;

  final bytes = File(path).readAsBytesSync();
  final decoded = img.decodeImage(bytes);
  if (decoded == null) throw Exception('Corrupt image');

  final resized = img.copyResize(
    decoded,
    width: decoded.width > decoded.height ? maxDim : null,
    height: decoded.height >= decoded.width ? maxDim : null,
    interpolation: img.Interpolation.linear,
  );

  final optimizedBytes = img.encodeJpg(resized, quality: quality);
  final outPath = '${path}_optimized.jpg';
  final outFile = File(outPath)..writeAsBytesSync(optimizedBytes);
  return outFile;
}
```
