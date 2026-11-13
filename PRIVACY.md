# Privacy Policy & Data Protection Charter

**Effective Date**: November 2026  
**Product**: KrocPDF ([krocpdf.app](https://krocpdf.app) / [jpg-to-pdf-zeta.vercel.app](https://jpg-to-pdf-zeta.vercel.app))  
**License**: MIT Open Source

---

## 1. Executive Summary: The Privacy-First Guarantee

Unlike traditional online PDF converters that require users to upload sensitive files to opaque servers, **KrocPDF is engineered with an in-browser client-first architecture**:

- **0 Bytes Uploaded in Local Mode**: When you convert JPG, PNG, or JPEG files in your browser, the conversion engine runs entirely inside client-side WebAssembly (WASM). Your documents never leave your machine or touch a server.
- **Strict Ephemeral Cloud Processing**: When Cloud Batch Mode is explicitly chosen for massive multi-gigabyte queues, files are transferred directly via short-lived presigned URLs and permanently deleted after processing.
- **Zero Document Retention**: We never store, inspect, monetize, or train machine learning models on your documents.

---

## 2. Technical Data Flow & Architecture

### 2.1 In-Browser Mode (WASM & Canvas)
1. **Local Processing**: Images dropped into the conversion widget are loaded into your browser's private memory sandbox via standard HTML5 `FileReader` and WebAssembly (`pdf-lib`, `fflate`).
2. **Immediate Memory Revocation**: Blob URLs generated for PDF previews and downloads are explicitly revoked (`URL.revokeObjectURL`) upon component unmount or task completion.
3. **Network Telemetry**: Exactly **0 bytes** of image or PDF payloads are transmitted over HTTP/HTTPS or WebSockets.

### 2.2 Cloud Worker Mode (High-Throughput Batch Processing)
When handling large-scale multi-file operations that exceed local device resources:
1. **Presigned Direct Upload**: Client uploads binary buffers directly to encrypted S3-compatible object storage (Cloudflare R2) via time-limited presigned PUT URLs (valid for 15 minutes).
2. **Worker Assembly**: High-throughput Go worker services (`pdfcpu`, `govips`) stream data from object storage, compile the PDF, and upload the final compiled document.
3. **Automated 24-Hour Expiration**: All temporary upload buffers and generated PDFs are automatically and permanently purged via bucket lifecycle policies within 24 hours. Users can also trigger immediate deletion via the UI.

---

## 3. Telemetry & Analytics

To ensure high availability and monitor performance regressions:

- **Vercel Web Analytics**:
  - We use `@vercel/analytics` to measure aggregate traffic (page views, country of origin, browser family).
  - **No Personal Identifiable Information (PII)** is collected.
  - **No cookies** are placed on your machine.
  - No file names, file contents, or document metadata are ever accessible or logged by analytics.

- **Server Logs**:
  - API Gateway logs contain only standard HTTP request paths (`POST /api/convert`), HTTP status codes, and anonymized response durations.
  - No document contents or image thumbnails are ever written to server disk or persistent logging tables.

---

## 4. Third-Party Subprocessors

KrocPDF utilizes modern cloud infrastructure providers strictly for hosting and temporary storage:

| Subprocessor | Purpose | Data Transferred | Retention Period |
| :--- | :--- | :--- | :--- |
| **Vercel Inc.** | Static Frontend Hosting & Edge CDN | Anonymized HTTP requests | Ephemeral request lifecycle |
| **Cloudflare Inc.** (R2) | Temporary S3 Object Storage (Cloud Mode only) | Encrypted user document buffers | Hard purge after 24 hours |
| **Neon / Supabase** | PostgreSQL Job State Indexing | Job status IDs and timestamps | Deleted with job expiration |

---

## 5. Regulatory Compliance

### 5.1 GDPR & UK GDPR (European Economic Area)
- Under GDPR Article 6, local processing requires zero legal basis because data never transfers from the data subject's device.
- For Cloud Worker processing, data is processed solely under the performance of contract (fulfilling document conversion) and immediately deleted.

### 5.2 CCPA / CPRA (California Residents)
- We do not sell or share personal information.
- We do not retain consumer personal information across sessions.

### 5.3 HIPAA Readiness
- Because In-Browser WASM Mode operates completely within the client's local memory, medical scans, patient intake forms, and confidential records can be converted without triggering third-party Business Associate Agreements (BAAs).

---

## 6. Open-Source Verification

Privacy claims can be independently audited. KrocPDF's source code is publicly accessible on GitHub:
- [Frontend WASM Implementation (`localConverter.ts`)](https://github.com/KrocPDF/KrocPDF/blob/main/frontend/src/lib/localConverter.ts)
- [Zero-Telemetry Verification Test Suite](https://github.com/KrocPDF/KrocPDF/tree/main/frontend/src/lib)

---

## 7. Contact & Privacy Inquiries

For inquiries, vulnerability disclosures, or privacy audits, contact the project maintainers via [GitHub Discussions](https://github.com/KrocPDF/KrocPDF/discussions) or security email `security@krocpdf.app`.
