# Project Governance & Stewardship

## 1. Overview & Principles

KrocPDF is an open-source, privacy-first document platform built to provide universal, free document manipulation without predatory paywalls, tracking scripts, or data retention.

This governance charter outlines the organizational structure, decision-making framework, contribution guidelines, and stewardship responsibilities of the KrocPDF project.

### Core Guarantees:
- **Zero-Compromise Privacy**: Core document conversion must always prioritize client-side execution (WASM). Files must never be sent to external servers when client-side execution is viable.
- **Architectural Integrity**: Maintain the 5-Wave Execution Protocol across microservices (Infra/DB -> Worker -> API Gateway -> Frontend -> QA Gate).
- **Open Standards**: Transparent schemas, permissively licensed under the MIT License.

---

## 2. Roles & Responsibilities

The project community is organized into four tiers of participation:

### 2.1 Project Leads & Maintainers
- **Responsibilities**:
  - Sets the strategic technical roadmap and architecture direction.
  - Reviews and approves architectural RFCs (Request for Comments).
  - Maintains repository integrity, GitHub branch protection rules, and release tagging.
  - Final arbiters in technical debates or community escalations.
- **Current Lead**: Alok Prashar ([@alokprashar864](https://github.com/alokprashar864))

### 2.2 Core Contributors & Reviewers
- **Responsibilities**:
  - Reviews Pull Requests across frontend, backend-api, or worker-service.
  - Verifies zero regressions, type safety (`zero any`), and test coverage.
  - Mentors new contributors and reviews backlog items.

### 2.3 Triagers & Issue Stewards
- **Responsibilities**:
  - Labels and categorizes incoming GitHub issues and bug reports.
  - Reproduces reported bugs and verifies environment prerequisites.
  - Flags security vulnerabilities directly to the security team under private disclosure channels.

### 2.4 Community Contributors
- Anyone who submits a pull request, opens an issue, improves documentation, or participates in architecture discussions.

---

## 3. Decision-Making & RFC Process

For minor bug fixes, performance improvements, and documentation, contributors can open a PR directly.

For significant architectural changes, an RFC is required:

### When an RFC is Required:
- Modifications to the Redis Stream queue schema or job metadata protocols.
- Database migrations affecting Prisma schemas in `backend-api/prisma/schema.prisma`.
- New document format pipelines (e.g., OCR via Tesseract WASM, PDF splitting/encryption).
- External infrastructure integrations (storage providers, caching tiers).

### RFC Lifecycle:
1. **Proposal**: Open an issue titled `[RFC] <Proposal Name>` utilizing the RFC template.
2. **Review Period**: A minimum 7-day public discussion period for community feedback.
3. **Consensus**: Project maintainers reach consensus. A proposal is approved with majority maintainer sign-off.
4. **Implementation**: Feature branches follow the 5-Wave Execution Protocol.

---

## 4. Release Management & Versioning

KrocPDF strictly adheres to [Semantic Versioning 2.0.0](https://semver.org/):
- **MAJOR (`x.0.0`)**: Breaking API changes, queue schema rewrites, or architectural inversions.
- **MINOR (`0.x.0`)**: New conversion tools, client optimizations, or backward-compatible feature additions.
- **PATCH (`0.0.x`)**: Bug fixes, security patches, dependency updates, and documentation fixes.

All official releases are published via GitHub Releases with signed git tags and automated changelog summaries.

---

## 5. Conflict Resolution & Code of Conduct

All members of the KrocPDF project must adhere to the [Code of Conduct](./CODE_OF_CONDUCT.md).

If technical conflicts arise that cannot be resolved through consensus in PR reviews or RFC threads:
1. The assigned PR reviewers will hold a focused discussion outlining trade-offs.
2. If consensus cannot be reached, the Lead Maintainer will make the final determination based on project principles: **Privacy First > Performance > Ergonomics**.

---

## 6. Amendments to this Charter

Changes to `GOVERNANCE.md` require a pull request approved by the Project Lead and at least two active core contributors.
