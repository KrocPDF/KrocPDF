# Getting Support for KrocPDF

Thank you for using KrocPDF! We are committed to providing a reliable, privacy-first document platform. Whether you need help using the web application, running the services locally with Docker, or contributing to the codebase, here is how to get support.

---

## 1. Where to Ask for Help

| Need | Recommended Channel | Details |
|:---|:---|:---|
| **General Questions & Q&A** | [GitHub Discussions](https://github.com/KrocPDF/KrocPDF/discussions) | Best for "How do I...?", deployment advice, or architecture discussions. |
| **Bug Reports & In-App Issues** | [Report an Issue Page](https://jpg-to-pdf-zeta.vercel.app/report-issue) | Direct web form that notifies the maintainer team without requiring a GitHub account. |
| **Feature Requests & Ideas** | [GitHub Discussions — Ideas](https://github.com/KrocPDF/KrocPDF/discussions/categories/ideas) | Share and discuss proposals for new tools, format conversions, or UX enhancements. |
| **Security Disclosures** | [SECURITY.md](./SECURITY.md) | For confidential reporting of potential vulnerabilities. Please do not report security flaws on public boards. |
| **Contribution & Development** | [CONTRIBUTING.md](./CONTRIBUTING.md) | Guide to setting up the local multi-service development environment (Docker, Next.js, Go, NestJS). |

---

## 2. Reporting an Issue

If you encounter an unexpected error, a conversion failure, or a layout glitch:

### Option A: Using the In-App Issue Reporter (Fastest)
1. Navigate to **[krocpdf.app/report-issue](https://jpg-to-pdf-zeta.vercel.app/report-issue)** (or click **Report an Issue** in the website footer).
2. Choose your category: **Bug Report**, **Conversion Issue**, or **Feature Request**.
3. Fill out the details using the quick starter template.
4. Click **Send Issue Report**. This routes your message directly to the maintainer team.

### Option B: Using GitHub Discussions or Issues
If you have a GitHub account and would like community tracking:
1. Search existing [Discussions](https://github.com/KrocPDF/KrocPDF/discussions) to see if the issue has already been reported.
2. If not, open a new thread with:
   - Operating System and Browser version (e.g. Chrome 122 on Windows 11).
   - Mode used (In-Browser WASM or Cloud Batch).
   - Approximate file dimensions and format (e.g. 5 × 3000x4000 JPGs).
   - Error messages from the browser console, if any.

---

## 3. Common Troubleshooting Tips

### Client-Side WASM Memory Limits
- **Symptom**: Browser tab reloads or crashes during huge batches (50+ high-resolution scans).
- **Explanation**: Client-side conversion processes uncompressed bitmap buffers in browser WebAssembly memory.
- **Solution**: Convert in smaller batches (15–20 images at a time) or switch to Cloud Batch mode for massive multi-gigabyte queues.

### Inverted or Rotated Photos
- **Symptom**: Uploaded smartphone camera photos appear sideways.
- **Explanation**: Some devices store rotation angle in EXIF metadata rather than raw pixel orientation.
- **Solution**: KrocPDF automatically parses EXIF orientation headers. If a specific device orientation fails, report the device make and model via `/report-issue`.

### Unsupported Formats
- KrocPDF natively supports **JPG, JPEG, PNG, and WebP**.
- Support for HEIC/HEIF and client-side OCR is planned on our [Roadmap](./MILESTONE.md).

---

## 4. Governance & Project Policies

For additional information on how KrocPDF is governed, your rights, and data protection:
- **[GOVERNANCE.md](./GOVERNANCE.md)**: Community stewardship and decision-making model.
- **[PRIVACY.md](./PRIVACY.md)**: Technical privacy charter (0-byte WASM local execution guarantee).
- **[TERMS.md](./TERMS.md)**: Terms of service and acceptable use guidelines.
- **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)**: Standards for a welcoming, inclusive community.
