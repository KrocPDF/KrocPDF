# 🎨 04. UI/UX & Design System Blueprint

This document translates KrocPDF's web platform visual identity—dark mode glassmorphism, glowing emerald accents, clean typography, and zero-clutter layouts—into native Flutter mobile design specifications.

---

## 🎨 Color Palette & Design Tokens

Define these tokens in `lib/app/theme/app_colors.dart`:

```dart
import 'package:flutter/material.dart';

class AppColors {
  // Primary Backgrounds
  static const Color background = Color(0xFF0F172A); // Slate 900
  static const Color surface = Color(0xFF1E293B);    // Slate 800
  static const Color surfaceElevated = Color(0xFF334155); // Slate 700

  // Brand Accents
  static const Color primary = Color(0xFF10B981);    // Emerald 500
  static const Color primaryLight = Color(0xFF34D399); // Emerald 400
  static const Color primaryDark = Color(0xFF059669);  // Emerald 600

  // Secondary & Accents
  static const Color cyan = Color(0xFF06B6D4);       // Cyan 500 (Cloud engine badge)
  static const Color purple = Color(0xFF8B5CF6);     // Purple 500 (Merge tool)
  static const Color amber = Color(0xFFF59E0B);      // Amber 500 (Compression tool)
  static const Color red = Color(0xFFEF4444);        // Red 500 (Destructive / Delete)

  // Typography & Neutrals
  static const Color textPrimary = Color(0xFFF8FAFC);   // Slate 50
  static const Color textSecondary = Color(0xFF94A3B8); // Slate 400
  static const Color textMuted = Color(0xFF64748B);     // Slate 500
  static const Color border = Color(0xFF334155);        // Slate 700 (15% opacity)
  static const Color glassBorder = Color(0x33FFFFFF);   // 20% White for glassmorphism
}
```

---

## 💎 Glassmorphic Card Container

Use Flutter's `BackdropFilter` and semi-transparent gradients to recreate the web platform's glassmorphism:

```dart
import 'dart:ui';
import 'package:flutter/material.dart';
import 'app_colors.dart';

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;

  const GlassCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(20),
          child: Container(
            padding: padding,
            decoration: BoxDecoration(
              color: AppColors.surface.withOpacity(0.65),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.glassBorder, width: 1.2),
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}
```

---

## 📱 Core Screen Blueprints

### 1. Home Dashboard (`/home`)
- **Header**: KrocPDF logo icon, brand title with gradient text, and Quick Settings gear button.
- **Hero Conversion Cards**:
  1. 📷 **Scan Document**: Opens native camera with automatic edge detection.
  2. 🖼️ **Images to PDF**: Opens photo gallery / file picker for multi-selection.
  3. 📑 **Merge PDFs**: Select and merge multiple existing PDF files.
  4. 🗜️ **Compress PDF**: Select a heavy PDF and pick compression levels (Low to Extreme).
- **Recent Files Section**: Shows locally converted PDFs with one-tap system share or view.

---

### 2. Document Scanner Viewfinder (`/scanner`)
- **Full-Screen Camera Preview**: Utilizing `google_mlkit_document_scanner` for native hardware acceleration.
- **Controls**:
  - **Top Bar**: Flash toggle (Auto/On/Off), Batch Counter badge (`"Page 3"`), Close button.
  - **Bottom Bar**: Large haptic Shutter Button (Emerald glowing circle), Photo Library shortcut, and Done button with preview badge.
- **Automatic Crop**: Automatically identifies document boundaries and rectifies distortion.

---

### 3. Reorder & Arrangement Canvas (`/reorder`)
- **Thumbnail Grid**: 3-column `ReorderableGridView` displaying scanned pages.
- **Thumbnail Card Actions**:
  - Drag handle for smooth reordering.
  - Page number badge (`"1"`, `"2"`, `"3"`).
  - Quick action pills: Rotate 90°, Retake, Delete.
- **Bottom Configuration Drawer**:
  - Page Size (A4, Letter, Fit).
  - Orientation (Portrait, Landscape).
  - Margins (None, Small, Medium).
  - Dual-Engine Switch: `"Convert On-Device (Private)"` vs `"Cloud Supercharger"`.
- **Primary CTA**: Glowing Emerald Button: `"Compile PDF (X Pages)"`.

---

### 4. Conversion Progress Sheet (`/progress`)
- **Modal Barrier**: Non-dismissible bottom sheet during compilation.
- **Visuals**:
  - Smooth Circular Progress Indicator with glowing gradient.
  - Step Status: `"Normalizing color profiles..."` $\rightarrow$ `"Compiling pages..."` $\rightarrow$ `"Linearizing output..."`.
  - Engine Tag: Shows `"Running Locally on Device (100% Offline)"` or `"Cloud Worker Cluster"`.
  - Cancel Button: Immediately cancels isolate worker or triggers `DELETE /api/v1/conversions/:id`.

---

### 5. PDF Previewer & Export Screen (`/preview`)
- **Full Viewport PDF Viewer**: Powered by `pdfx` with pinch-to-zoom and page swipe.
- **Sticky Bottom Action Bar**:
  - **Share**: Launches native iOS AirDrop / Android Share Sheet (`share_plus`).
  - **Save to Files / Downloads**: Writes document directly to user's device.
  - **Compress Further**: Quick handoff to compression workflow.
  - **Done**: Clears temporary image cache and returns to Home.

---

## 📳 Haptic Feedback & Touch Targets
- **Haptics**: Fire light haptic pulses (`HapticFeedback.lightImpact()`) on page reorder snaps and shutter capture.
- **Touch Targets**: All interactive buttons, chips, and icons must meet Apple/Google minimum accessibility sizes ($\ge 48 \times 48\text{dp}$).
