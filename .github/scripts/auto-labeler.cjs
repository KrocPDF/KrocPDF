/**
 * KrocPDF Unified Advanced Monorepo Labeler
 *
 * Automatically triages and classifies both Pull Requests and Issues across
 * a comprehensive taxonomy of Area, Type, Component, PR Size, and Status labels.
 *
 * Designed to fire once on creation, and for PRs only re-evaluate on substantial
 * commit milestones (>= 3 commits, every 3 commits) or significant line changes.
 */

const LABEL_DEFINITIONS = {
  // Area Labels
  'area:frontend': {
    color: '0052CC',
    description: 'Client UI, React 19, Next.js 16, Canvas, Tailwind CSS',
  },
  'area:backend': {
    color: '00875A',
    description: 'NestJS API Gateway, Prisma, Redis Streams, SSE controllers',
  },
  'area:worker': {
    color: 'FF8B00',
    description: 'Go 1.25 conversion worker, pdfcpu, govips image processing',
  },
  'area:wasm': {
    color: '6554C0',
    description: 'Client-side WebAssembly conversion engine & pdf-lib',
  },
  'area:infra': {
    color: '4C9AFF',
    description: 'Docker Compose, MinIO S3, Redis, PostgreSQL infrastructure',
  },
  'area:ci': {
    color: 'E34935',
    description: 'GitHub Actions workflows, CodeQL, security gates, Dependabot',
  },
  'area:docs': {
    color: '36B37E',
    description: 'Documentation, guides, specifications, README updates',
  },
  'area:security': {
    color: 'BF2600',
    description: 'Security vulnerabilities, secret detection, authentication',
  },

  // Type Labels
  'type:bug': {
    color: 'D73A4A',
    description: "Something isn't working as expected or regression",
  },
  'type:feature': {
    color: '1D76DB',
    description: 'New user-facing functionality or core platform capability',
  },
  'type:enhancement': {
    color: 'A2EEEF',
    description: 'Refinement, UX polish, or incremental improvement',
  },
  'type:refactor': {
    color: '5319E7',
    description: 'Code restructuring without behavioral changes',
  },
  'type:performance': {
    color: 'FBCA04',
    description: 'Performance optimization, memory tuning, or throughput',
  },
  'type:documentation': {
    color: '0075CA',
    description: 'Documentation, diagrams, inline comments, or guides',
  },
  'type:test': {
    color: 'C2E0C6',
    description: 'Unit, integration, e2e tests, or testing framework',
  },
  'type:chore': {
    color: 'CCCCCC',
    description: 'Build tooling, dependencies, configs, or maintenance',
  },

  // Size Labels (PR only)
  'size/XS': {
    color: '3CB371',
    description: 'Extra small diff: < 10 lines changed',
  },
  'size/S': {
    color: '2E8B57',
    description: 'Small diff: 10 - 49 lines changed',
  },
  'size/M': {
    color: 'FFA500',
    description: 'Medium diff: 50 - 249 lines changed',
  },
  'size/L': {
    color: 'FF6347',
    description: 'Large diff: 250 - 999 lines changed',
  },
  'size/XL': {
    color: '8B0000',
    description: 'Huge diff: 1000+ lines changed (consider splitting into smaller PRs)',
  },

  // Component Labels
  'component:pdfcpu': {
    color: '79E2F2',
    description: 'pdfcpu Go engine, page orientation, or PDF compilation',
  },
  'component:prisma': {
    color: '5A32A3',
    description: 'Prisma schema, migrations, or database queries',
  },
  'component:redis': {
    color: 'DC3545',
    description: 'Redis Streams, consumer groups, or worker coordination',
  },
  'component:minio': {
    color: 'C7254E',
    description: 'MinIO S3 storage, presigned URLs, or bucket lifecycles',
  },
  'component:dnd': {
    color: '8F43EE',
    description: 'Drag-and-drop reordering or canvas arrangement',
  },

  // Status Labels
  'status:triage-needed': {
    color: 'ED8936',
    description: 'New issue awaiting maintainer triage and classification',
  },
  'status:needs-review': {
    color: '4299E1',
    description: 'Pull request ready for peer review',
  },
};

const ALL_SIZE_LABELS = ['size/XS', 'size/S', 'size/M', 'size/L', 'size/XL'];

module.exports = async function runAutoLabeler({ github, context, core }) {
  const { owner, repo } = context.repo;
  const eventName = context.eventName;
  const payload = context.payload;

  core.info(`[Auto-Labeler] Invoked on event: ${eventName}, action: ${payload.action}`);

  // Helper: ensure a label exists in the repository
  async function ensureLabelExists(name) {
    const meta = LABEL_DEFINITIONS[name];
    if (!meta) return;
    try {
      await github.rest.issues.getLabel({ owner, repo, name });
    } catch (err) {
      if (err.status === 404) {
        core.info(`[Auto-Labeler] Creating missing label: ${name}`);
        try {
          await github.rest.issues.createLabel({
            owner,
            repo,
            name,
            color: meta.color,
            description: meta.description,
          });
        } catch (createErr) {
          core.warning(`Failed to create label ${name}: ${createErr.message}`);
        }
      }
    }
  }

  // Helper: apply labels to an issue or pull request
  async function applyLabels(issueNumber, labelsToAdd, labelsToRemove = []) {
    // Ensure all labels to add exist
    for (const label of labelsToAdd) {
      await ensureLabelExists(label);
    }

    // Fetch existing labels on the issue/PR
    const currentLabelsResponse = await github.rest.issues.listLabelsOnIssue({
      owner,
      repo,
      issue_number: issueNumber,
    });
    const currentLabelNames = new Set(currentLabelsResponse.data.map((l) => l.name));

    // Remove obsolete labels if requested (e.g. previous size label)
    for (const label of labelsToRemove) {
      if (currentLabelNames.has(label) && !labelsToAdd.includes(label)) {
        try {
          await github.rest.issues.removeLabel({
            owner,
            repo,
            issue_number: issueNumber,
            name: label,
          });
          core.info(`[Auto-Labeler] Removed obsolete label: ${label}`);
        } catch (e) {
          core.warning(`Could not remove label ${label}: ${e.message}`);
        }
      }
    }

    // Filter to only new labels
    const newLabels = labelsToAdd.filter((l) => !currentLabelNames.has(l));
    if (newLabels.length > 0) {
      await github.rest.issues.addLabels({
        owner,
        repo,
        issue_number: issueNumber,
        labels: newLabels,
      });
      core.info(`[Auto-Labeler] Successfully added labels: ${newLabels.join(', ')}`);
    } else {
      core.info('[Auto-Labeler] No new labels to add.');
    }
  }

  // ==========================================
  // 1. ISSUE HANDLING (Fires only once on opened)
  // ==========================================
  if (eventName === 'issues') {
    const issue = payload.issue;
    const issueNumber = issue.number;
    core.info(`[Auto-Labeler] Processing Issue #${issueNumber}: "${issue.title}"`);

    const titleLower = (issue.title || '').toLowerCase();
    const bodyLower = (issue.body || '').toLowerCase();
    const combinedText = `${titleLower}\n${bodyLower}`;

    const labelsToAdd = ['status:triage-needed'];

    // Determine Types
    if (/\b(bug|error|fail|crash|broken|exception|fix|regression)\b/.test(combinedText)) {
      labelsToAdd.push('type:bug');
    } else if (/\b(feat|feature|add|new|implement|proposal|rfc)\b/.test(combinedText)) {
      labelsToAdd.push('type:feature');
    } else if (/\b(improve|enhancement|better|polish|clean)\b/.test(combinedText)) {
      labelsToAdd.push('type:enhancement');
    } else if (/\b(docs?|documentation|readme|guide|wiki)\b/.test(combinedText)) {
      labelsToAdd.push('type:documentation');
    } else if (/\b(perf|performance|speed|slow|latency|throughput)\b/.test(combinedText)) {
      labelsToAdd.push('type:performance');
    } else if (/\b(refactor|restructure|clean ?up)\b/.test(combinedText)) {
      labelsToAdd.push('type:refactor');
    } else if (/\b(sec|security|vuln|cve|leak|credential)\b/.test(combinedText)) {
      labelsToAdd.push('type:security');
    }

    // Determine Areas
    if (/\b(frontend|ui|react|next|canvas|tailwind|css|browser)\b/.test(combinedText)) {
      labelsToAdd.push('area:frontend');
    }
    if (/\b(backend|nest|nestjs|api|prisma|postgres|controller|sse)\b/.test(combinedText)) {
      labelsToAdd.push('area:backend');
    }
    if (/\b(worker|go|golang|pdfcpu|vips|queue)\b/.test(combinedText)) {
      labelsToAdd.push('area:worker');
    }
    if (/\b(wasm|pdf-lib|client-side conversion)\b/.test(combinedText)) {
      labelsToAdd.push('area:wasm');
    }
    if (/\b(docker|compose|minio|redis|infra|storage|s3)\b/.test(combinedText)) {
      labelsToAdd.push('area:infra');
    }
    if (/\b(ci|cd|github actions|workflow|pipeline|dependabot|gatekeeper)\b/.test(combinedText)) {
      labelsToAdd.push('area:ci');
    }

    // Determine Components
    if (combinedText.includes('pdfcpu')) labelsToAdd.push('component:pdfcpu');
    if (combinedText.includes('prisma')) labelsToAdd.push('component:prisma');
    if (combinedText.includes('redis')) labelsToAdd.push('component:redis');
    if (combinedText.includes('minio')) labelsToAdd.push('component:minio');
    if (/\b(dnd|drag|drop|reorder)\b/.test(combinedText)) labelsToAdd.push('component:dnd');

    await applyLabels(issueNumber, labelsToAdd);
    return;
  }

  // ==========================================
  // 2. PULL REQUEST HANDLING
  // ==========================================
  if (eventName === 'pull_request_target' || eventName === 'pull_request') {
    const pr = payload.pull_request;
    const prNumber = pr.number;
    const action = payload.action;

    core.info(`[Auto-Labeler] Processing Pull Request #${prNumber}: "${pr.title}" (action: ${action})`);

    // Substantive commit gate for synchronize events:
    // Only re-run if it's opened OR if it has reached a substantive commit milestone (>=3 commits, every 3 commits)
    const commitCount = pr.commits || 1;
    const additions = pr.additions || 0;
    const deletions = pr.deletions || 0;
    const totalLines = additions + deletions;

    if (action === 'synchronize') {
      const isSubstantive = commitCount >= 3 && (commitCount % 3 === 0 || totalLines >= 250);
      if (!isSubstantive) {
        core.info(
          `[Auto-Labeler] Skipping synchronize run: PR #${prNumber} currently has ${commitCount} commit(s) and ${totalLines} changed lines. Next automated run fires at commit milestone (every 3 commits).`
        );
        return;
      }
      core.info(`[Auto-Labeler] Substantive commit milestone met (${commitCount} commits, ${totalLines} lines). Re-evaluating labels.`);
    }

    const labelsToAdd = ['status:needs-review'];
    const labelsToRemove = [];

    // Calculate Size Label
    let currentSizeLabel;
    if (totalLines < 10) {
      currentSizeLabel = 'size/XS';
    } else if (totalLines < 50) {
      currentSizeLabel = 'size/S';
    } else if (totalLines < 250) {
      currentSizeLabel = 'size/M';
    } else if (totalLines < 1000) {
      currentSizeLabel = 'size/L';
    } else {
      currentSizeLabel = 'size/XL';
    }

    labelsToAdd.push(currentSizeLabel);
    for (const size of ALL_SIZE_LABELS) {
      if (size !== currentSizeLabel) {
        labelsToRemove.push(size);
      }
    }

    // Determine Type from Conventional Commit Title
    const title = pr.title || '';
    const conventionalMatch = title.match(/^([a-z]+)(\([a-z0-9_-]+\))?!?:\s+/i);
    if (conventionalMatch) {
      const typePrefix = conventionalMatch[1].toLowerCase();
      switch (typePrefix) {
        case 'feat':
          labelsToAdd.push('type:feature');
          break;
        case 'fix':
          labelsToAdd.push('type:bug');
          break;
        case 'docs':
          labelsToAdd.push('type:documentation');
          break;
        case 'refactor':
          labelsToAdd.push('type:refactor');
          break;
        case 'perf':
          labelsToAdd.push('type:performance');
          break;
        case 'test':
          labelsToAdd.push('type:test');
          break;
        case 'ci':
        case 'chore':
        case 'build':
          labelsToAdd.push('type:chore');
          break;
      }
    }

    // Inspect Changed Files for Area & Component Labels
    const changedFiles = [];
    try {
      const filesPaginator = github.paginate.iterator(github.rest.pulls.listFiles, {
        owner,
        repo,
        pull_number: prNumber,
        per_page: 100,
      });

      for await (const response of filesPaginator) {
        for (const file of response.data) {
          changedFiles.push(file.filename);
        }
      }
    } catch (e) {
      core.warning(`Could not fetch PR files: ${e.message}`);
    }

    let hasFrontend = false;
    let hasBackend = false;
    let hasWorker = false;
    let hasInfra = false;
    let hasCi = false;
    let hasDocs = false;
    let hasWasm = false;
    let hasPrisma = false;
    let hasPdfcpu = false;
    let hasRedis = false;
    let hasMinio = false;

    for (const file of changedFiles) {
      if (file.startsWith('frontend/')) {
        hasFrontend = true;
        if (file.includes('localConverter') || file.includes('pdf-lib') || file.includes('wasm')) {
          hasWasm = true;
        }
      }
      if (file.startsWith('backend-api/')) {
        hasBackend = true;
        if (file.includes('prisma/')) hasPrisma = true;
        if (file.includes('redis/')) hasRedis = true;
        if (file.includes('storage/')) hasMinio = true;
      }
      if (file.startsWith('worker-service/')) {
        hasWorker = true;
        if (file.includes('pdfcpu') || file.includes('pdf.go')) hasPdfcpu = true;
        if (file.includes('redis')) hasRedis = true;
        if (file.includes('storage') || file.includes('s3')) hasMinio = true;
      }
      if (file.startsWith('.github/')) {
        hasCi = true;
      }
      if (
        file.includes('docker') ||
        file.includes('compose') ||
        file.startsWith('infra/') ||
        file === '.dockerignore'
      ) {
        hasInfra = true;
      }
      if (
        file.endsWith('.md') ||
        file.startsWith('docs/') ||
        file.includes('LICENSE') ||
        file.startsWith('.planning/')
      ) {
        hasDocs = true;
      }
    }

    if (hasFrontend) labelsToAdd.push('area:frontend');
    if (hasBackend) labelsToAdd.push('area:backend');
    if (hasWorker) labelsToAdd.push('area:worker');
    if (hasInfra) labelsToAdd.push('area:infra');
    if (hasCi) labelsToAdd.push('area:ci');
    if (hasDocs && !hasFrontend && !hasBackend && !hasWorker) labelsToAdd.push('area:docs');
    if (hasWasm) labelsToAdd.push('area:wasm');
    if (hasPrisma) labelsToAdd.push('component:prisma');
    if (hasPdfcpu) labelsToAdd.push('component:pdfcpu');
    if (hasRedis) labelsToAdd.push('component:redis');
    if (hasMinio) labelsToAdd.push('component:minio');

    await applyLabels(prNumber, labelsToAdd, labelsToRemove);
  }
};
