# 🔒 05. Platform Permissions, Security & Store Compliance

This document outlines the mandatory iOS and Android native configurations, operating system permissions, scoped storage compliance, and zero-trust privacy rules required for approval on the **Apple App Store** and **Google Play Store**.

---

## 🍏 iOS Native Configuration (`ios/Runner/Info.plist`)

Apple enforces strict App Store review guidelines (5.1.1 Data Privacy) regarding camera and photo access. All permission keys must include clear, customer-friendly rationale strings:

```xml
<key>NSCameraUsageDescription</key>
<string>KrocPDF requires camera access to scan physical documents, receipts, and notes directly into high-quality PDFs.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>KrocPDF requires photo library access to import images for PDF conversion.</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>KrocPDF requires permission to save converted PDFs or extracted images to your library.</string>

<!-- Enable File Sharing so users can find PDFs in the iOS Files app -->
<key>UIFileSharingEnabled</key>
<true/>
<key>LSSupportsOpeningDocumentsInPlace</key>
<true/>
```

---

## 🤖 Android Native Configuration (`android/app/src/main/AndroidManifest.xml`)

### Scoped Storage Compliance (Android 13+ / API 33+)
Google Play rejects apps using legacy broad storage permissions. Use fine-grained media permissions:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Camera Access -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />

    <!-- Internet & Network State for Cloud Dual-Engine -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- Modern Android 13+ Fine-Grained Media Permission -->
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <!-- Legacy Fallback for Android 12 and below (API <= 32) -->
    <uses-permission
        android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />
    <uses-permission
        android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="29" />

    <application
        android:label="KrocPDF"
        android:name="${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <!-- Application configuration -->
    </application>
</manifest>
```

---

## 🛡️ Zero-Trust Privacy & Cache Discipline

### 1. Ephemeral Temporary File Eviction
To prevent sensitive user documents (passports, tax forms, financial statements) from lingering in application cache, execute aggressive cache cleanup:

```dart
import 'dart:io';
import 'package:path_provider/path_provider.dart';

class SecureDocumentCleaner {
  /// Evicts all temporary scanned images and uncompressed buffers
  static Future<void> purgeTemporaryFiles() async {
    try {
      final tempDir = await getTemporaryDirectory();
      if (tempDir.existsSync()) {
        final files = tempDir.listSync(recursive: true);
        for (final file in files) {
          if (file is File) {
            // Delete raw camera captures & temporary jpeg buffers
            if (file.path.endsWith('.jpg') || file.path.endsWith('.png') || file.path.contains('raw_scan')) {
              await file.delete();
            }
          }
        }
      }
    } catch (e) {
      // Log failure silently without throwing
    }
  }
}
```

### 2. Zero-Telemetry Policy on Document Payloads
- **Never Log Filenames or Paths**: Crash reporting libraries (Sentry, Firebase Crashlytics) must strip document titles, paths, and metadata.
- **No Document Analytics**: Events like `"conversion_completed"` may only record anonymous counts (`page_count: 5, duration_ms: 1200, engine: "local"`), never document contents.
- **Cloud Bucket Auto-Destruction**: The cloud MinIO/S3 bucket is configured with a 24-hour lifecycle expiration rule. No user document persists past 1 day.

---

## 📋 App Store & Google Play Review Guidelines

### Apple App Store Checkpoints
- **Data Safety (Nutrition Label)**: Mark "Data Not Collected" for on-device conversions. For optional cloud conversion, declare "Files/Docs: Used only for app functionality, not linked to identity".
- **Functional Incomplete Policy**: Ensure the camera scanner handles camera permission denial gracefully with a user prompt to open iOS Settings.

### Google Play Store Checkpoints
- **Data Safety Form**: Declare that ephemeral document uploads are transmitted over encrypted TLS (`HTTPS`) and deleted automatically.
- **Target API Level**: Target Android 14 (API level 34) or higher as mandated by Google Play developer policies.
