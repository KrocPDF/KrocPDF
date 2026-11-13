# 🤝 Contributing to KrocPDF

Thank you for your interest in contributing to **KrocPDF**! We are building an enterprise-grade, privacy-first, and high-throughput document platform designed as an open-source alternative to predatory, ad-cluttered PDF converters.

Whether you are fixing a typo in documentation, polishing a glassmorphic UI component, tuning the client-side WebAssembly engine, optimizing Go worker throughput, or writing automated tests, your contributions are welcome and deeply valued.

---

## 📑 Table of Contents
- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
  - [Finding an Issue](#finding-an-issue)
  - [Suggesting Features](#suggesting-features)
  - [Reporting Bugs](#reporting-bugs)
  - [Issue Triage & Label Taxonomy](#issue-triage--label-taxonomy)
- [⚡ Quick Start & Development Setup](#-quick-start--development-setup)
- [🧪 Mandatory Pre-PR Quality Checks](#-mandatory-pre-pr-quality-checks)
- [📜 Git & Contribution Workflow](#-git--contribution-workflow)
  - [Branch Naming Convention](#branch-naming-convention)
  - [Conventional Commit Standards](#conventional-commit-standards)
  - [Pull Request Lifecycle](#pull-request-lifecycle)
- [⚖️ Licensing, CLA & Trademark Policy](#-licensing-cla--trademark-policy)
- [📐 Code Architecture & Style Guides](#-code-architecture--style-guides)
  - [Frontend Client (Next.js 16 + React 19)](#frontend-client-nextjs-16--react-19)
  - [Go Worker Service (Go 1.25)](#go-worker-service-go-125)
  - [Backend API & Database (NestJS 12 + Prisma)](#backend-api--database-nestjs-12--prisma)
- [❓ Getting Help & Community](#-getting-help--community)

---

## 🤍 Code of Conduct

All contributors, maintainers, and community members are expected to adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md) (adapted from Contributor Covenant v2.1). Please treat everyone with empathy, respect, and constructive professionalism.

---

## 🧭 How Can I Contribute?

### Finding an Issue
If you are new to the codebase, start with our curated beginner filters:
- **[`good first issue`](https://github.com/KrocPDF/KrocPDF/labels/good%20first%20issue)**: Genuinely small, beginner-friendly tasks (UI copy polish, updating tool metadata cards, adding conversion presets, documentation fixes).
- **[`help wanted`](https://github.com/KrocPDF/KrocPDF/labels/help%20wanted)**: High-impact features, mobile engineering tasks, or performance challenges open for community collaboration.

> 💡 **Tip:** Before writing code, please comment on an open issue to express your interest so other contributors don't duplicate your work. If an issue doesn't exist for what you want to build, open an issue first!

### Suggesting Features
Have an idea for a compression preset, UI improvement, or new conversion engine? Please open a **Feature Request** on our [Issues page](https://github.com/KrocPDF/KrocPDF/issues/new) to discuss technical viability with maintainers.

### Reporting Bugs
If you encounter unexpected errors or conversion failures:
1. Search [existing issues](https://github.com/KrocPDF/KrocPDF/issues) to avoid duplicates.
2. Open a **Bug Report** with browser/OS details, reproduction steps, sample file sizes, and browser console / worker log outputs.

### Issue Triage & Label Taxonomy
Issues are reviewed and triaged regularly by maintainers. We use a standardized label matrix:

| Label Category | Labels | Description |
| :--- | :--- | :--- |
| **Newcomer** | `good first issue`, `help wanted` | Welcoming issues suitable for external contributors. |
| **Type** | `type: bug`, `type: feature`, `type: enhancement`, `type: documentation`, `type: security` | Categorizes the nature of the change. |
| **Area** | `area: frontend`, `area: backend-api`, `area: worker`, `area: wasm`, `area: infra-storage` | Pinpoints the service or subsystem in the monorepo. |
| **Priority** | `priority-critical` (P0), `priority: high` (P1), `priority: medium` (P2), `priority: low` (P3) | Indicates release urgency and impact. |

*Untriaged issues without labels are reviewed weekly and categorized.*

---

## ⚡ Quick Start & Development Setup

KrocPDF offers two development pathways:

1. **Track A (5-Minute Fast Path — Frontend & WASM Only)**:  
   *No Docker, Go, or database required!* If you are working on the UI, components, or client-side WASM engine:
   ```bash
   git clone https://github.com/KrocPDF/KrocPDF.git
   cd KrocPDF/frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:3000` to convert files locally with 0 bytes uploaded.

2. **Track B (Full Cloud Monorepo Stack)**:  
   For API endpoints, Redis Streams, Go worker daemons, and S3 storage, see the complete guide:  
   👉 **[docs/getting-started.md](./docs/getting-started.md)**

---

## 🧪 Mandatory Pre-PR Quality Checks

Before submitting a Pull Request, all contributors must ensure their changes pass the local verification suite. Our CI pipeline enforces these gates automatically:

| Verification Stage | Command (from root or workspace) | What It Validates |
| :--- | :--- | :--- |
| **Type Safety** | `npm run typecheck` | Validates TypeScript compiler (`tsc --noEmit`) across `frontend/` and `backend-api/`. Zero `any` allowed. |
| **Linting** | `npm run lint` | Runs Oxlint and ESLint across frontend and backend codebases. |
| **Unit Tests** | `npm run test:unit` | Executes frontend component tests (Vitest) and backend API tests (Jest). |
| **E2E Integration** | `npm run test:e2e` | Runs Playwright tests (`e2e/`) verifying WASM 0-byte privacy and SSE progress streaming. |
| **Go Daemon Check** | `cd worker-service && go vet ./... && go test ./...` | Verifies static analysis and unit tests for the Go conversion service. |

> [!TIP]
> **Automated Git Hooks**: We provide Husky hooks in `.husky/` that automatically run `typecheck` and `lint` prior to committing, and unit tests prior to pushing!

---

## 📜 Git & Contribution Workflow

```
[ Fork / Branch ] ──► [ Write Code & Verify ] ──► [ Conventional Commit ] ──► [ Open PR on main ]
```

### Branch Naming Convention
Keep branch names short, descriptive, and prefixed with the category:
- `feat/target-file-size-compression`
- `fix/safari-canvas-memory-leak`
- `docs/benchmarks-update`
- `refactor/worker-buffer-pool`

### Conventional Commit Standards
We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This drives automated release notes and changelog generation:

```
<type>(<scope>): <short description>
```

| Type | Purpose | Example |
| :--- | :--- | :--- |
| `feat` | Adding a new capability or user-facing feature | `feat(frontend): add visual drag handle for image reordering` |
| `fix` | Resolving a bug or error | `fix(worker): handle corrupt JPEG EXIF orientation metadata` |
| `perf` | Performance improvement or memory optimization | `perf(wasm): reuse canvas context to prevent GC pauses` |
| `docs` | Documentation updates or tutorials | `docs(root): add 5-minute quick start guide` |
| `refactor` | Code restructuring without feature or bug changes | `refactor(api): decouple presigned URL generator into service` |
| `test` | Adding or updating unit, integration, or e2e tests | `test(e2e): add Playwright check for 0-byte WASM upload` |
| `ci` / `infra` | CI/CD pipelines, workflows, or infrastructure | `infra(k8s): add horizontal pod autoscaler manifests` |

---

### Pull Request Lifecycle

1. **Rebase on `main`:** Before opening your PR, ensure your branch is up-to-date with upstream:
   ```bash
   git fetch origin
   git rebase origin/main
   ```
2. **Open PR:** Submit your PR against the `main` branch.
3. **Fill Out the Checklist:** The [Pull Request Template](./.github/PULL_REQUEST_TEMPLATE.md) will auto-populate. Complete the checklist.
4. **Attach Visuals:** For UI/frontend changes, attach a screenshot or screen recording.
5. **CI Automation:** Automated GitHub Actions workflows will run linting, schema validation, and unit/e2e tests.
6. **Code Review:** Maintainers will review your PR. Address feedback promptly. Once approved, your PR will be squash-merged into `main`!

---

## ⚖️ Licensing, CLA & Trademark Policy

### No Contributor License Agreement (CLA) Required
KrocPDF is open-source software released under the **[MIT License](./LICENSE)**. 

To keep the contribution process transparent, friendly, and low-friction, **we do NOT require a Contributor License Agreement (CLA)**. By submitting a Pull Request, you certify that:
1. You wrote or have the explicit right to submit the code under the MIT License.
2. Your contribution complies with the **Developer Certificate of Origin (DCO)**.

### Trademark Notice
"KrocPDF", the Kroc crocodile mascot illustrations, and brand graphics are protected assets under our **[Terms of Service](./TERMS.md)**. You are free to fork, build, and redistribute the software under the MIT License, but commercial misuse or confusingly similar branding using the "KrocPDF" trademark requires prior written approval.

---

## 📐 Code Architecture & Style Guides

### Frontend Client (Next.js 16 + React 19)
- Use standard functional React components with strict TypeScript types.
- Zero `any` types; handle errors as `unknown` with instance checks.
- Clean memory management: always revoke generated Blob URLs (`URL.revokeObjectURL`) on unmount.
- Follow Tailwind CSS v4 design tokens and responsive utility patterns.

### Go Worker Service (Go 1.25)
- Standard Go formatting (`gofmt`) and `go vet` are strictly enforced in CI.
- Handle all errors explicitly. Never swallow errors or use ignored blank assignments (`_ = func()`).
- Bounded goroutine pools and memory limits to prevent OOM panics during high-volume batch runs.

### Backend API & Database (NestJS 12 + Prisma)
- Follow NestJS modular architecture and dependency injection.
- Validate request bodies with `class-validator` DTOs.
- Never write raw unescaped SQL; leverage Prisma Client queries.

---

## ❓ Getting Help & Community

Stuck or have questions about architectural decisions?
- **[GitHub Discussions](https://github.com/KrocPDF/KrocPDF/discussions):** Ask questions, discuss ideas, and share feedback.
- **[Report an Issue](https://github.com/KrocPDF/KrocPDF/issues):** File bug reports or request new features.
- **Issue Comments:** Ask questions directly on the issue you are working on.

Thank you for helping make the web cleaner, faster, and privacy-respecting! 🐊🚀
