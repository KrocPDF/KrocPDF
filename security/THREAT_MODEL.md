# KrocPDF System Threat Model

## 1. Executive Security Architecture

KrocPDF operates under a **Privacy-by-Design** and **Zero-Trust Client Inversion** philosophy. Because document converters frequently process confidential data (tax forms, legal contracts, passports, receipts), the primary attack surface is mitigated by executing conversions client-side whenever possible.

```
+-----------------------------------------------------------------------------------+
| USER BROWSER SANDBOX (HTML5 / WASM)                                              |
|  - Input files stay in local RAM via FileReader / ArrayBuffer                     |
|  - Conversion runs in isolated WASM (pdf-lib)                                     |
|  - 0 bytes leave device for standard batches (<= 20 images, <= 50MB)             |
+-----------------------------------------------------------------------------------+
                               | (Only for explicitly chosen Cloud Batch Mode)
                               v [HTTPS Presigned PUT / 15-min TTL]
+-----------------------------------------------------------------------------------+
| CLOUD STORAGE (Cloudflare R2 / S3 Compatible)                                     |
|  - Encrypted at rest (AES-256)                                                    |
|  - Strict 24-hour automated lifecycle purge                                       |
|  - Zero public read ACLs                                                          |
+-----------------------------------------------------------------------------------+
                               ^
                               | [Private VPC IAM Stream]
+-----------------------------------------------------------------------------------+
| WORKER MICROSERVICE (Go 1.25 / pdfcpu / govips)                                   |
|  - Non-root container execution                                                   |
|  - Memory-bounded image decoders (prevents decompression bombs)                    |
|  - Ephemeral scratch buffers purged immediately upon assembly                     |
+-----------------------------------------------------------------------------------+
```

---

## 2. STRIDE Threat Analysis

| Threat Category | Potential Attack Vector | KrocPDF Mitigation Control |
|:---|:---|:---|
| **Spoofing** | Forging conversion job completion or impersonating worker nodes. | Redis Streams authentication (`REDIS_URL` with TLS/AUTH). Worker consumer groups require verified credentials. SSE endpoints validate job ownership. |
| **Tampering** | Man-in-the-middle alteration of document payloads in transit. | HTTPS-only transport with HSTS. S3 presigned PUT URLs contain cryptographic signature tokens and expire in 15 minutes. |
| **Repudiation** | Denying job submission or abuse of rate limits. | Client IP hashed with daily salt for Upstash rate limiting (`limit_req_zone`). Audit timestamps logged without persisting document PII. |
| **Information Disclosure** | Cloud server leaks user documents, invoices, or personal data. | **Core Inversion**: 85%+ of conversions execute entirely in-browser WebAssembly. Cloud mode enforces 24h hard deletion lifecycle. Zero analytics tracking of document metadata. |
| **Denial of Service** | Decompression bombs (zip bombs / billion-pixel TIFF/PNGs) crashing worker RAM. | Magic number MIME sniffing rejects invalid headers. Go workers enforce strict memory limits (2GB cap) and reject images exceeding 100 megapixels. Edge rate-limiting (30 req/min). |
| **Elevation of Privilege** | Container breakout via PDF parser vulnerabilities (`pdfcpu` / `libvips`). | Go workers run as unprivileged user `appuser` (UID 10001) in scratch/alpine minimal containers with read-only root filesystems. |

---

## 3. Trust Boundaries

1. **Browser vs. Edge CDN**: Untrusted boundary. All client inputs validated via `class-validator` DTOs and magic-byte sniffers.
2. **API Gateway vs. Object Storage**: Authenticated boundary. Direct S3 access is gated behind ephemeral presigned URLs.
3. **API Gateway vs. Go Worker**: Isolated messaging bus via Redis Streams within private Docker/Kubernetes networking. Workers never accept raw HTTP inbound traffic from the public Internet.

