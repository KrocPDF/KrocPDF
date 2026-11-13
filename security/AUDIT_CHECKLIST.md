# KrocPDF Pre-Release Security Audit Checklist

Every major or minor release (`x.y.0`) must pass all gates in this checklist before promotion to production.

---

## 1. Static Analysis & Dependency Vulnerabilities

- [ ] **Dependency Audit (Frontend)**:
  ```bash
  cd frontend && npm audit --audit-level=critical
  ```
- [ ] **Dependency Audit (Backend API)**:
  ```bash
  cd backend-api && npm audit --audit-level=critical
  ```
- [ ] **CodeQL Semantic Code Analysis**: Confirm zero high/critical alerts in GitHub Security tab.
- [ ] **Secret Leakage Scan**:
  ```bash
  git log -p -n 50 | grep -iE 'AWS_SECRET|MINIO_ROOT_PASSWORD|REDIS_PASSWORD|POSTGRES_PASSWORD'
  ```

---

## 2. Privacy & Data Retention Verification

- [ ] **Client WASM Zero-Network Isolation**:
  - Run Playwright network interceptor test:
    ```bash
    npx playwright test e2e/specs/wasm-conversion.spec.ts
    ```
  - Confirm **0 bytes** uploaded to any external origin during local conversion mode.
- [ ] **Cloud Storage 24-Hour Purge Lifecycle**:
  - Verify Cloudflare R2 or MinIO bucket lifecycle configuration:
    ```bash
    # MinIO verification
    docker exec jpg2pdf-minio-init mc ilm rule list local/conversions
    ```
  - Confirm expiration policy is set to $\le 1\text{ day}$.

---

## 3. Denial of Service & Abuse Defense

- [ ] **File Size Boundary Enforcement**:
  - Attempt upload exceeding 120MB; confirm Nginx returns `413 Request Entity Too Large`.
- [ ] **Burst Rate Limiting**:
  - Run benchmark sending $>30$ requests within 1 minute; confirm gateway returns `429 Too Many Requests`.
- [ ] **Magic-Byte Header Validation**:
  - Attempt upload of disguised executable (`.exe` renamed to `.jpg`); confirm rejection before worker processing.

---

## 4. Container & Infrastructure Hardening

- [ ] Non-root execution verified (`USER appuser` in worker Dockerfile).
- [ ] Read-only root filesystem enabled on production worker Kubernetes deployments.
- [ ] No exposed database or Redis ports to the public Internet (restricted to internal Kubernetes ClusterIP).
