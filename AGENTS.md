# KrocPDF Monorepo — Master Autonomous Multi-Agent Swarm Guide

> **Directive File**: `AGENTS.md` (Root Level)  
> **Audience**: Autonomous AI Agents (Antigravity, Cursor, Copilot, Gemini CLI, Claude Code, Roo/Cline)  
> **Repository**: `Bus-Driver` (Product Name: **KrocPDF**)  
> **Companion Directives**: [`/CLAUDE.md`](./CLAUDE.md) \| [`frontend/AGENTS.md`](./frontend/AGENTS.md) \| [`frontend/CLAUDE.md`](./frontend/CLAUDE.md)  
> **Scope**: Monorepo swarm coordination, cross-service execution waves, multi-agent roles, and universal guardrails  

---

## 1. 🤖 System Overview & Swarm Mission

**KrocPDF** is an enterprise-ready, dual-engine document conversion platform uniting:
- A modern, privacy-first **Next.js 16 + React 19 Client with WASM** (`frontend/`)
- A robust, scalable **NestJS 12 API Gateway** (`backend-api/`)
- A high-throughput **Go 1.25 Worker Service** (`worker-service/`)
- A localized, ephemeral **Docker Infrastructure** (PostgreSQL 16, Redis 7 Streams, MinIO S3)

When autonomous AI agents operate in this repository, they must act as a coordinated swarm. Monorepo tasks frequently span database schemas, queue protocols, backend handlers, and frontend clients. Subagents must never perform unstructured, concurrent edits across disparate services without explicit wave ordering and interface agreements.

---

## 2. 👥 Cross-Service Multi-Agent Taxonomy

Tasks should be delegated across specialized agent roles to prevent architectural fragmentation:

```mermaid
graph TD
    Root[Lead Monorepo Orchestrator] --> Infra[DevOps & Infra Agent]
    Root --> Backend[Backend API Agent]
    Root --> Worker[Go Worker Agent]
    Root --> Frontend[Frontend UI & WASM Agent]
    Root --> QA[Monorepo QA & Integrity Agent]

    Infra --> DB[(Postgres, Redis, MinIO)]
    Backend --> Nest[NestJS 12 & Prisma]
    Worker --> Go[Go 1.25 & pdfcpu]
    Frontend --> Next[Next.js 16 & React 19]
    QA --> Tests[tsc, lint, vitest, go vet]
```

### 1. Lead Monorepo Orchestrator
- **Scope**: Cross-service planning, task decomposition, dependency sequencing, and conflict arbitration.
- **Responsibilities**:
  - Enforces the 5-Wave Execution Protocol across services.
  - Ensures changes to API DTOs or Redis schemas are reflected across all dependent codebases.
  - Conducts cross-service verification before approving completion.

### 2. Frontend UI & WASM Agent
- **Scope**: `frontend/` directory (Next.js 16, React 19, Tailwind v4, `@hello-pangea/dnd`, `pdf-lib`).
- **Responsibilities**:
  - Governs client-side conversion engine (`localConverter.ts`) and object URL lifecycle.
  - Maintains responsive, accessible UI components (`ConverterWidget.tsx`).
  - Follows strict guidelines in [`frontend/AGENTS.md`](./frontend/AGENTS.md).

### 3. Backend API Agent
- **Scope**: `backend-api/` directory (NestJS 12, Express, Prisma 5, IORedis, S3 SDK).
- **Responsibilities**:
  - Implements presigned S3 URL endpoints, session management, and SSE progress broadcasting.
  - Manages Prisma database schema migrations and query optimizations.
  - Publishes conversion jobs cleanly into Redis Streams.

### 4. Worker Systems Agent
- **Scope**: `worker-service/` directory (Go 1.25, `pdfcpu`, `aws-sdk-go-v2`, `go-redis/v9`).
- **Responsibilities**:
  - Implements high-throughput consumer groups reading from Redis Streams.
  - Downloads raw image buffers from MinIO/S3 and streams compiled PDFs back.
  - Manages goroutine lifecycles and memory limits during massive batch conversions.

### 5. DevOps & Infrastructure Agent
- **Scope**: `docker-compose.yml`, Dockerfiles, MinIO bucket policies, and CI/CD workflows.
- **Responsibilities**:
  - Maintains deterministic container configurations and automated healthchecks.
  - Configures 1-day retention lifecycles on MinIO conversion buckets for data privacy.
  - Ensures local development mirrors production environment variables.

### 6. Monorepo QA & Integrity Agent
- **Scope**: Full-stack verification, linting, type checks, and regression audits.
- **Responsibilities**:
  - Executes test suites across all 3 services (`npm run lint`, `npx tsc`, `vitest`, `go vet`).
  - Validates zero leakage of credentials, `any` types, or orphaned goroutines.

---

## 3. 🌊 Cross-Service 5-Wave Execution Protocol

When executing features or refactors that span multiple layers, agents must execute sequentially across five distinct waves:

```
Wave 1: Infra & DB  ──►  Wave 2: Worker Engine  ──►  Wave 3: API Gateway  ──►  Wave 4: Frontend Client  ──►  Wave 5: QA Gate
(docker, prisma)         (worker-service/go)          (backend-api/nest)        (frontend/next)              (monorepo test)
```

### Wave 1: Infrastructure & Data Contracts
1. Update `docker-compose.yml`, `.env.example`, or MinIO initialization scripts if storage/service configuration changes.
2. Update `backend-api/prisma/schema.prisma` and run `npx prisma db push` or create migrations.
3. Lock down shared DTOs and data schemas.

### Wave 2: Worker Engine (Processing Core)
1. Update Go structs in `worker-service/internal/` to reflect new job options or metadata.
2. Implement image decoding, page orientation, or `pdfcpu` assembly optimizations.
3. Validate Go packages with `go vet ./...` and `go test ./...`.

### Wave 3: API Gateway (Control & Streaming Plane)
1. Implement or update NestJS endpoints in `backend-api/src/`.
2. Validate incoming requests with `class-validator` DTOs.
3. Enqueue verified jobs into Redis and wire SSE controllers to stream worker progress.
4. Run `npm run lint` (Oxlint) and `npm run test` in `backend-api/`.

### Wave 4: Frontend Client (User Experience & WASM)
1. Update client-side types and API client utilities (`src/lib/uploader.ts`, `src/hooks/useConversion.ts`).
2. Update UI components in `src/components/ConverterWidget.tsx`.
3. Verify local WASM conversion remains untouched and operational.
4. Run `npx tsc --noEmit` and `npm run lint` in `frontend/`.

### Wave 5: Monorepo Verification & Audit Gate
1. Perform an end-to-end trace from client request $\rightarrow$ S3 upload $\rightarrow$ Redis stream $\rightarrow$ Go assembly $\rightarrow$ SSE completion.
2. Confirm zero regressions across all services.

---

## 4. 🧠 Swarm Communication & Workspace Rules

1. **Subdirectory Directive Invariance**:
   - Subdirectory directive files ([`frontend/AGENTS.md`](./frontend/AGENTS.md) and [`frontend/CLAUDE.md`](./frontend/CLAUDE.md)) hold specialized domain rules. Never overwrite them with generic content.
   - When modifying `frontend/AGENTS.md`, lines 1–9 (`<!-- BEGIN:nextjs-agent-rules --> ... <!-- END:nextjs-agent-rules -->`) MUST remain intact.
2. **Contract-First Synchronization**:
   - Agents must never write implementation code in `frontend/` assuming an API shape that has not yet been defined in `backend-api/`.
   - Redis Stream schemas must be agreed upon before editing either `backend-api` or `worker-service`.
3. **Memory & Lifecycle Discipline**:
   - **Frontend**: Revoke all Blob URLs (`URL.revokeObjectURL`) upon component unmount or conversion completion.
   - **Backend**: Close Redis pub/sub listeners and SSE connections when clients disconnect.
   - **Worker**: Release image buffers promptly to prevent garbage collection spikes during high-DPI PDF assembly.
4. **Git Discipline**:
   - Work on descriptive topic branches (e.g., `feat/worker-pdfcpu-tuning`, `fix/frontend-dnd-order`).
   - Follow Conventional Commits: `feat(api):`, `fix(worker):`, `perf(wasm):`, `docs(root):`.
   - Never push directly to `main`.

---

## 5. 🛡️ Universal Guardrails (The Golden Rules)

Every agent operating anywhere in this monorepo must uphold these rules:

1. **Never Compromise Client WASM Privacy**:
   - Client-side conversion is KrocPDF's hallmark feature. Never redirect images to the cloud when local conversion is viable and requested.
2. **Strict Type Safety**:
   - TypeScript: Zero `any`. Errors typed as `unknown` with instance checking.
   - Go: Strict error returns. No ignored errors (`_ = func()`).
3. **No Secrets in Source Control**:
   - Never commit `.env` files with production secrets. Use `.env.example` templates.
4. **Zero-Regression Verification**:
   - Before completing any task, run verification commands for all modified workspaces.

---

## 6. 🗺️ Master Documentation Sequential Roadmap & Mandatory Reading Order

> [!IMPORTANT]
> **Mandatory Autonomous Agent Directive**:
> Any autonomous AI agent (Antigravity, Cursor, Claude Code, Copilot, Roo/Cline, Gemini CLI) or engineer cloning/importing this repository **MUST** consult and follow the documentation files listed below before and during execution. Modifying code across services without reading the corresponding architecture, interface contracts, and workspace rules violates KrocPDF monorepo protocol.

```mermaid
flowchart TD
    classDef l1 fill:#0F172A,stroke:#38BDF8,stroke-width:2px,color:#E0F2FE,font-weight:600;
    classDef l2 fill:#0F172A,stroke:#34D399,stroke-width:2px,color:#ECFDF5,font-weight:600;
    classDef l3 fill:#0F172A,stroke:#F59E0B,stroke-width:2px,color:#FEF3C7,font-weight:600;
    classDef l4 fill:#0F172A,stroke:#C084FC,stroke-width:2px,color:#FAF5FF,font-weight:600;

    L1["Level 1: System Architecture & Protocols<br/>AGENTS.md • CLAUDE.md • ARCHITECTURE.md • README.md"]:::l1
    L2["Level 2: Service-Specific Directives<br/>frontend/AGENTS.md • backend-api/README.md • mobile_blueprint"]:::l2
    L3["Level 3: Governance, Privacy & Security<br/>GOVERNANCE.md • PRIVACY.md • TERMS.md • SECURITY.md"]:::l3
    L4["Level 4: Execution Waves, Roadmap & Planning<br/>CONTRIBUTING.md • .planning/ • CHANGELOG.md"]:::l4

    L1 -->|Foundational Rules| L2
    L2 -->|Compliance & Policy| L3
    L3 -->|Execution Protocol| L4
```

### Complete Monorepo Markdown Index & Sequential Reading Order

#### Level 1: Core System Architecture & Operating Directives (Mandatory First Read)
| Document | Scope & Purpose | When to Read |
|:---|:---|:---|
| **[`AGENTS.md`](./AGENTS.md)** | Root multi-agent swarm taxonomy, 5-Wave Execution Protocol, and universal guardrails. | **First entry point** for any AI agent or contributor. |
| **[`CLAUDE.md`](./CLAUDE.md)** | Universal CLI command reference, local Docker boot commands, lint/test suites, and syntax standards. | Before running build, test, or migration commands. |
| **[`ARCHITECTURE.md`](./ARCHITECTURE.md)** | Comprehensive dual-engine architecture: client-side WASM vs. Go worker, Redis Streams event bus, and MinIO/S3 lifecycle. | Before proposing or implementing cross-service changes. |
| **[`README.md`](./README.md)** | High-level product overview, visual interface showcase, performance metrics, and interactive system radar. | For platform overview, public features, and quick start. |

#### Level 2: Subsystem & Domain Directives (Read Before Modifying Target Directory)
| Document | Scope & Purpose | When to Read |
|:---|:---|:---|
| **[`frontend/AGENTS.md`](./frontend/AGENTS.md)** | Next.js 16 + React 19 rules, client-side WASM engine (`localConverter.ts`), memory lifecycle (`URL.revokeObjectURL`), and drag-and-drop invariants. | **Mandatory** before editing any file in `frontend/`. |
| **[`frontend/CLAUDE.md`](./frontend/CLAUDE.md)** | Frontend development cheatsheet, dev port conventions, Oxlint rules, and Vitest suite instructions. | Before running frontend unit tests or builds. |
| **[`frontend/README.md`](./frontend/README.md)** | Frontend component architecture, Tailwind v4 tokens, and interactive canvas components. | When working on UI components or pages. |
| **[`backend-api/README.md`](./backend-api/README.md)** | NestJS 12 architecture, Prisma 5 database schema, S3 presigned URL generation, and Redis queue producer. | Before editing `backend-api/` controllers or services. |
| **[`docs/features/merge-pdf.md`](./docs/features/merge-pdf.md)** | Specification for PDF merging, page orientation, memory limits, and Go `pdfcpu` pipelines. | When working on PDF assembly or worker features. |
| **[`mobile_blueprint/`](./mobile_blueprint/README.md)** | Complete 7-part architecture & technical specification for the Flutter/Dart mobile application. | Before implementing or reviewing mobile features. |
| &nbsp;&nbsp;↳ [`01_ARCHITECTURE_AND_DUAL_ENGINE.md`](./mobile_blueprint/01_ARCHITECTURE_AND_DUAL_ENGINE.md) | Mobile dual-engine model (on-device WASM/native vs. Go cloud worker parity). | Mobile architecture design. |
| &nbsp;&nbsp;↳ [`02_BACKEND_API_SPECIFICATION.md`](./mobile_blueprint/02_BACKEND_API_SPECIFICATION.md) | Mobile REST endpoints, presigned S3 upload, and SSE streaming contracts. | Mobile networking implementation. |
| &nbsp;&nbsp;↳ [`03_FLUTTER_TECH_STACK_AND_PUBSPEC.md`](./mobile_blueprint/03_FLUTTER_TECH_STACK_AND_PUBSPEC.md) | Mobile dependencies, packages, and platform requirements. | Mobile setup and dependencies. |
| &nbsp;&nbsp;↳ [`04_UI_UX_AND_DESIGN_SYSTEM.md`](./mobile_blueprint/04_UI_UX_AND_DESIGN_SYSTEM.md) | Mobile design system, touch gestures, and file upload interactions. | Mobile UI engineering. |
| &nbsp;&nbsp;↳ [`05_PLATFORM_PERMISSIONS_AND_SECURITY.md`](./mobile_blueprint/05_PLATFORM_PERMISSIONS_AND_SECURITY.md) | iOS/Android sandboxing, file permissions, and data protection. | Mobile security audit. |
| &nbsp;&nbsp;↳ [`06_CI_CD_APP_STORE_DEPLOYMENT.md`](./mobile_blueprint/06_CI_CD_APP_STORE_DEPLOYMENT.md) | Automated Fastlane pipelines, TestFlight, and Google Play tracks. | Mobile release automation. |
| &nbsp;&nbsp;↳ [`07_INTERN_ROADMAP_AND_SPRINT_GUIDE.md`](./mobile_blueprint/07_INTERN_ROADMAP_AND_SPRINT_GUIDE.md) | Step-by-step developer implementation sprints and milestones. | Onboarding mobile engineers. |

#### Level 3: Governance, Privacy, Security & Legal Compliance
| Document | Scope & Purpose | When to Read |
|:---|:---|:---|
| **[`GOVERNANCE.md`](./GOVERNANCE.md)** | Project charter, 4-tier participation taxonomy (Project Lead, Core Contributors, Triagers, Community), RFC protocol, and 5-wave release standards. | Before proposing breaking changes, schema changes, or PRs. |
| **[`PRIVACY.md`](./PRIVACY.md)** | Formal privacy charter: 0-byte WASM local execution guarantee, 24h cloud auto-purge lifecycle, and cookie-free telemetry. | When handling telemetry, data flows, or storage logic. |
| **[`TERMS.md`](./TERMS.md)** | Terms of Service, Acceptable Use Policy (malware and DDoS abuse prohibitions), warranty disclaimers, and trademark protection. | For legal compliance, licensing, and usage guidelines. |
| **[`SECURITY.md`](./SECURITY.md)** | Vulnerability disclosure channels, private reporting instructions, and responsible remediation policies. | When reporting or fixing security vulnerabilities. |
| &nbsp;&nbsp;↳ [`THREAT_MODEL.md`](./security/THREAT_MODEL.md) | STRIDE threat model, sandboxing boundaries, and abuse vectors. | When modifying authentication, queue, or storage logic. |
| &nbsp;&nbsp;↳ [`AUDIT_CHECKLIST.md`](./security/AUDIT_CHECKLIST.md) | Pre-release security verification checklist. | Before major releases or infrastructure updates. |
| **[`CONTRIBUTING.md`](./CONTRIBUTING.md)** | Contribution lifecycle, Conventional Commits formatting, local Docker boot guide, and PR requirements. | Before opening a Pull Request or creating a branch. |
| **[`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)** | Contributor Covenant standards for an inclusive and harassment-free community. | When interacting in issues, discussions, or PR reviews. |
| **[`SUPPORT.md`](./SUPPORT.md)** | Support channels, in-app issue reporting, FAQ, and troubleshooting guide. | When seeking assistance, reporting bugs, or helping users. |
| **[`OPEN_SOURCE.md`](./OPEN_SOURCE.md)** | Open-source philosophy, mission differentiation against predatory converters, and community vision. | For project context and open-source alignment. |

#### Level 4: Project Tracking, Releases & Planning Memory
| Document | Scope & Purpose | When to Read |
|:---|:---|:---|
| **[`CHANGELOG.md`](./CHANGELOG.md)** | Chronological history of releases, feature additions, fixes, and performance tuning. | Before tagging releases or tracking past changes. |
| **[`RELEASE_v1.0.md`](./RELEASE_v1.0.md)** | Production v1.0 release notes, verified performance benchmarks, and feature manifest. | For v1.0 baseline reference. |
| **[`MILESTONE.md`](./MILESTONE.md)** | High-level milestone roadmap and strategic deliverable tracker. | When planning new versions or features. |
| **[`Deployment_Plan_Agy.md`](./Deployment_Plan_Agy.md)** | Infrastructure deployment plan, DNS routing, and hosting topology (Vercel, Cloudflare R2, Container registry). | Before configuring CI/CD or production infrastructure. |
| **[`.planning/`](./.planning/)** | Autonomous planning directory containing GSD requirements, phase plans, and Nyquist audit files (`PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `phases/`). | When running autonomous planning or milestone audits. |

