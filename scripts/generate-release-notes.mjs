#!/usr/bin/env node

/**
 * Enterprise Release Notes Generator
 *
 * Automatically aggregates commits, categorizes changes by Conventional Commits,
 * detects first-time and founding contributors, stacks changes per developer,
 * and formats GitHub Releases & CHANGELOG.md entries.
 *
 * Zero external runtime dependencies - uses Node.js standard library.
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');

// CLI Arguments
const args = process.argv.slice(2);
function getArg(flag, defaultValue = null) {
  const index = args.indexOf(flag);
  if (index !== -1 && index + 1 < args.length) {
    return args[index + 1];
  }
  const prefix = `${flag}=`;
  const match = args.find((a) => a.startsWith(prefix));
  if (match) return match.slice(prefix.length);
  return defaultValue;
}
const hasFlag = (flag) => args.includes(flag);

const isPreview = hasFlag('--preview') || hasFlag('--dry-run');
const isFirstRelease = hasFlag('--first');
const writeChangelog = hasFlag('--write-changelog');
const outputFile = getArg('--output');
const customTag = getArg('--tag');
const fromArg = getArg('--from');
const toArg = getArg('--to', 'HEAD');

/**
 * Execute Git command safely
 */
function git(cmd, options = {}) {
  try {
    return execSync(`git ${cmd}`, {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, GIT_CONFIG_GLOBAL: process.env.GIT_CONFIG_GLOBAL || 'NUL' },
      ...options,
    }).trim();
  } catch (error) {
    if (options.ignoreError) return '';
    throw error;
  }
}

/**
 * Get repository remote origin URL to build GitHub links
 */
function getRepoInfo() {
  const remoteUrl = git('config --get remote.origin.url', { ignoreError: true });
  if (!remoteUrl) {
    return { owner: 'alokprashar864', repo: 'jpg_to_pdf', url: 'https://github.com/alokprashar864/jpg_to_pdf' };
  }
  const match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/i);
  if (match) {
    return {
      owner: match[1],
      repo: match[2],
      url: `https://github.com/${match[1]}/${match[2]}`,
    };
  }
  return { owner: 'alokprashar864', repo: 'jpg_to_pdf', url: 'https://github.com/alokprashar864/jpg_to_pdf' };
}

/**
 * Determine range of commits: fromRef ... toRef
 */
function resolveRefs() {
  let toRef = toArg;
  let fromRef = fromArg;

  if (fromRef) {
    return { fromRef, toRef, isInitial: isFirstRelease };
  }

  if (isFirstRelease) {
    const rootCommit = git('rev-list --max-parents=0 HEAD');
    return { fromRef: rootCommit, toRef, isInitial: true };
  }

  try {
    const allTags = git('tag --sort=-creatordate')
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    if (allTags.length === 0) {
      const rootCommit = git('rev-list --max-parents=0 HEAD');
      return { fromRef: rootCommit, toRef, isInitial: true };
    }

    if (customTag && allTags.includes(customTag)) {
      const idx = allTags.indexOf(customTag);
      if (idx + 1 < allTags.length) {
        fromRef = allTags[idx + 1];
      } else {
        fromRef = git('rev-list --max-parents=0 HEAD');
        return { fromRef, toRef, isInitial: true };
      }
    } else {
      fromRef = allTags[0];
    }

    return { fromRef, toRef, isInitial: false };
  } catch {
    const rootCommit = git('rev-list --max-parents=0 HEAD');
    return { fromRef: rootCommit, toRef, isInitial: true };
  }
}

/**
 * Known contributor GitHub handles and mappings
 */
const KNOWN_HANDLES = {
  'aayushaggarwal348@gmail.com': 'Ayushaggarwal05',
  'jhaabhijeet864@gmail.com': 'jhaabhijeet864',
  'alokprashar864@gmail.com': 'alokprashar864',
};

function inferGithubHandle(name, email) {
  const normalizedEmail = (email || '').toLowerCase().trim();
  if (KNOWN_HANDLES[normalizedEmail]) {
    return KNOWN_HANDLES[normalizedEmail];
  }

  if (normalizedEmail.includes('@users.noreply.github.com')) {
    const parts = normalizedEmail.split('@')[0].split('+');
    return parts[parts.length - 1];
  }

  // Check normalized name
  const normalizedName = (name || '').toLowerCase().replace(/\s+/g, '');
  for (const [knownEmail, handle] of Object.entries(KNOWN_HANDLES)) {
    if (handle.toLowerCase() === normalizedName) return handle;
  }

  return name;
}

/**
 * Parse commits between fromRef and toRef
 */
function parseCommits(fromRef, toRef, isInitial) {
  const range = isInitial ? toRef : `${fromRef}..${toRef}`;
  const rawLog = git(`log ${range} --format="%H%x1f%h%x1f%an%x1f%ae%x1f%ad%x1f%s%x1f%b%x1e" --date=short`);

  if (!rawLog.trim()) {
    return [];
  }

  const rawEntries = rawLog.split('\x1e').map((e) => e.trim()).filter(Boolean);

  // Map PR numbers from merge commits
  const prMap = new Map(); // prNumber -> { authorHandle, branch }
  for (const entry of rawEntries) {
    const parts = entry.split('\x1f');
    const subject = parts[5] || '';
    const prMergeMatch = subject.match(/Merge pull request #(\d+)\s+from\s+([^\s]+)/i);
    if (prMergeMatch) {
      const prNum = prMergeMatch[1];
      const source = prMergeMatch[2];
      const candidate = source.split('/')[0].trim();
      prMap.set(prNum, candidate !== 'KrocPDF' ? candidate : null);
    }
  }

  const commits = [];

  for (const entry of rawEntries) {
    const [hash, shortHash, authorName, authorEmail, date, subject, body = ''] = entry.split('\x1f');

    const isMergeCommit = subject.startsWith('Merge pull request #') || subject.startsWith('Merge branch ');
    let prNumber = null;

    const prMergeMatch = subject.match(/Merge pull request #(\d+)/i);
    if (prMergeMatch) {
      prNumber = prMergeMatch[1];
    } else {
      const squashPrMatch = subject.match(/\(#(\d+)\)$/);
      if (squashPrMatch) {
        prNumber = squashPrMatch[1];
      }
    }

    let githubHandle = inferGithubHandle(authorName, authorEmail);

    // Extract Co-authors
    const coAuthors = [];
    const coAuthorMatches = body.matchAll(/Co-authored-by:\s*([^<]+)<([^>]+)>/gi);
    for (const match of coAuthorMatches) {
      const coName = match[1].trim();
      const coEmail = match[2].trim();
      coAuthors.push({
        name: coName,
        email: coEmail,
        handle: inferGithubHandle(coName, coEmail),
      });
    }

    // Conventional commit parsing
    const ccMatch = subject.match(/^([a-zA-Z]+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/);

    let type = 'other';
    let scope = null;
    let isBreaking = Boolean(body.includes('BREAKING CHANGE:') || body.includes('BREAKING-CHANGE:'));
    let cleanSubject = subject;

    if (ccMatch) {
      type = ccMatch[1].toLowerCase();
      scope = ccMatch[2] ? ccMatch[2].toLowerCase() : null;
      if (ccMatch[3] === '!') isBreaking = true;
      cleanSubject = ccMatch[4].trim();
    } else if (isMergeCommit) {
      type = 'merge';
    }

    commits.push({
      hash,
      shortHash,
      authorName,
      authorEmail,
      date,
      originalSubject: subject,
      subject: cleanSubject,
      body,
      isMergeCommit,
      prNumber,
      githubHandle,
      coAuthors,
      type,
      scope,
      isBreaking,
    });
  }

  return commits;
}

/**
 * Detect historical authors prior to fromRef
 */
function getHistoricalAuthors(fromRef, isInitial) {
  if (isInitial) {
    return new Set();
  }
  try {
    const raw = git(`log ${fromRef} --format="%ae%x1f%an"`);
    const history = new Set();
    raw.split('\n').forEach((line) => {
      const [email, name] = line.split('\x1f');
      if (email) history.add(email.trim().toLowerCase());
      if (name) history.add(name.trim().toLowerCase());
    });
    return history;
  } catch {
    return new Set();
  }
}

/**
 * Group commits into semantic categories
 */
function categorizeCommits(commits) {
  const categories = {
    breaking: { title: '💥 Breaking Changes', items: [] },
    feat: { title: '🚀 Features & Enhancements', items: [] },
    fix: { title: '🐛 Bug Fixes', items: [] },
    perf: { title: '⚡ Performance Improvements', items: [] },
    security: { title: '🛡️ Security & Privacy', items: [] },
    infra: { title: '🏗️ Infrastructure & CI/CD', items: [] },
    refactor: { title: '🧹 Maintenance & Refactoring', items: [] },
    docs: { title: '📖 Documentation', items: [] },
    test: { title: '🧪 Testing & Verification', items: [] },
    other: { title: 'Other Changes', items: [] },
  };

  const infraTypes = new Set(['ci', 'build', 'infra', 'docker']);
  const maintenanceTypes = new Set(['refactor', 'chore', 'style', 'deps', 'revert']);

  for (const commit of commits) {
    // Skip merge commits from what's changed lists unless they represent squashed PRs
    if (commit.isMergeCommit) continue;

    if (commit.isBreaking) {
      categories.breaking.items.push(commit);
    }

    if (commit.type === 'feat') {
      categories.feat.items.push(commit);
    } else if (commit.type === 'fix') {
      categories.fix.items.push(commit);
    } else if (commit.type === 'perf') {
      categories.perf.items.push(commit);
    } else if (commit.type === 'security' || commit.scope === 'security' || commit.scope === 'sec') {
      categories.security.items.push(commit);
    } else if (infraTypes.has(commit.type) || commit.scope === 'infra' || commit.scope === 'docker' || commit.scope === 'ci') {
      categories.infra.items.push(commit);
    } else if (commit.type === 'docs') {
      categories.docs.items.push(commit);
    } else if (commit.type === 'test') {
      categories.test.items.push(commit);
    } else if (maintenanceTypes.has(commit.type)) {
      categories.refactor.items.push(commit);
    } else {
      categories.other.items.push(commit);
    }
  }

  return categories;
}

/**
 * Group contributions by author
 */
function groupContributionsByAuthor(commits) {
  const authorMap = new Map();

  for (const commit of commits) {
    const key = (commit.authorEmail || commit.authorName).toLowerCase().trim();

    if (!authorMap.has(key)) {
      authorMap.set(key, {
        handle: commit.githubHandle,
        name: commit.authorName,
        email: commit.authorEmail,
        commits: [],
        prs: new Set(),
      });
    }

    const record = authorMap.get(key);
    record.commits.push(commit);
    if (commit.prNumber) record.prs.add(commit.prNumber);

    // Track co-authors
    for (const co of commit.coAuthors) {
      const coKey = (co.email || co.name).toLowerCase().trim();
      if (!authorMap.has(coKey)) {
        authorMap.set(coKey, {
          handle: co.handle,
          name: co.name,
          email: co.email,
          commits: [],
          prs: new Set(),
        });
      }
      const coRecord = authorMap.get(coKey);
      coRecord.commits.push(commit);
      if (commit.prNumber) coRecord.prs.add(commit.prNumber);
    }
  }

  return Array.from(authorMap.values()).sort((a, b) => b.commits.length - a.commits.length);
}

/**
 * Render Markdown release notes
 */
function renderReleaseNotes({
  tag,
  fromRef,
  toRef,
  isInitial,
  repoInfo,
  commits,
  categories,
  contributors,
  firstTimeContributors,
}) {
  const today = new Date().toISOString().split('T')[0];
  const uniquePRs = new Set(commits.map((c) => c.prNumber).filter(Boolean));
  const nonMergeCommits = commits.filter((c) => !c.isMergeCommit);

  const lines = [];

  // Title
  lines.push(`# 🚀 KrocPDF ${tag}`);
  lines.push('');
  lines.push(`> Released on **${today}** | Target: \`${toRef}\` | Base: \`${fromRef}\``);
  lines.push('');

  // Metrics Dashboard
  lines.push('### 📊 Release Metrics');
  lines.push(`- **Total Commits**: ${nonMergeCommits.length}`);
  lines.push(`- **Pull Requests Merged**: ${uniquePRs.size}`);
  lines.push(`- **Active Contributors**: ${contributors.length}`);
  if (firstTimeContributors.length > 0) {
    lines.push(`- **${isInitial ? 'Founding' : 'New'} Contributors**: ${firstTimeContributors.length}`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // 1. Breaking Changes
  if (categories.breaking.items.length > 0) {
    lines.push(`## ${categories.breaking.title}`);
    lines.push('> [!WARNING]');
    lines.push('> This release introduces breaking changes. Please review the items below carefully.');
    lines.push('');
    for (const item of categories.breaking.items) {
      const scopeBadge = item.scope ? `**${item.scope}**: ` : '';
      const prLink = item.prNumber ? ` in [#${item.prNumber}](${repoInfo.url}/pull/${item.prNumber})` : '';
      const authorMention = `@${item.githubHandle}`;
      lines.push(`- ${scopeBadge}${item.subject}${prLink} by ${authorMention}`);
    }
    lines.push('');
  }

  // 2. What's Changed
  lines.push("## 🚀 What's Changed");
  lines.push('');

  const displayOrder = ['feat', 'fix', 'perf', 'security', 'infra', 'refactor', 'docs', 'test', 'other'];

  for (const catKey of displayOrder) {
    const category = categories[catKey];
    if (!category || category.items.length === 0) continue;

    lines.push(`### ${category.title}`);
    lines.push('');

    for (const item of category.items) {
      const scopeBadge = item.scope ? `**${item.scope}**: ` : '';
      const prLink = item.prNumber
        ? ` in [#${item.prNumber}](${repoInfo.url}/pull/${item.prNumber})`
        : ` ([${item.shortHash}](${repoInfo.url}/commit/${item.hash}))`;
      const authorMention = item.githubHandle ? `@${item.githubHandle}` : item.authorName;

      lines.push(`- ${scopeBadge}${item.subject}${prLink} by ${authorMention}`);
    }
    lines.push('');
  }

  // 3. New / Founding Contributors
  if (firstTimeContributors.length > 0) {
    lines.push(`## ${isInitial ? '🎉 Founding Contributors' : '🎉 New Contributors'}`);
    lines.push(
      isInitial
        ? 'A huge thank you to all the founding contributors who launched the initial version of KrocPDF:'
        : 'Welcome and thank you to the new contributors who landed their first changes in this release:'
    );
    lines.push('');

    for (const author of firstTimeContributors) {
      const handleMention = author.handle ? `@${author.handle}` : author.name;
      // First chronological commit in this batch
      const firstCommit = author.commits[author.commits.length - 1];
      const prRef = firstCommit.prNumber
        ? `[#${firstCommit.prNumber}](${repoInfo.url}/pull/${firstCommit.prNumber})`
        : `[${firstCommit.shortHash}](${repoInfo.url}/commit/${firstCommit.hash})`;

      lines.push(`- ${handleMention} made their ${isInitial ? 'founding' : 'first'} contribution in ${prRef} (${firstCommit.originalSubject})`);
    }
    lines.push('');
  }

  // 4. Stacks & Change per Contributor
  lines.push('## 👥 Contributions by Author');
  lines.push('Detailed breakdown of changes delivered by each contributor in this release:');
  lines.push('');

  for (const author of contributors) {
    const handleMention = author.handle ? `@${author.handle}` : author.name;
    const meaningfulCommits = author.commits.filter((c) => !c.isMergeCommit);
    if (meaningfulCommits.length === 0 && author.commits.length > 0) {
      // Author only has merge commits
      meaningfulCommits.push(...author.commits);
    }
    const prCount = author.prs.size;
    const commitCount = meaningfulCommits.length;
    const summaryBadge = `(${commitCount} commit${commitCount === 1 ? '' : 's'}${prCount > 0 ? `, ${prCount} PR${prCount === 1 ? '' : 's'}` : ''})`;

    lines.push(`#### ${handleMention} ${summaryBadge}`);
    lines.push('');

    for (const c of meaningfulCommits) {
      const prLink = c.prNumber ? ` in [#${c.prNumber}](${repoInfo.url}/pull/${c.prNumber})` : '';
      lines.push(`- ${c.originalSubject}${prLink}`);
    }
    lines.push('');
  }

  // 5. Full Diff / Comparison Link
  lines.push('---');
  lines.push('');
  if (isInitial) {
    lines.push(`**Full History**: [Initial Release History](${repoInfo.url}/commits/${tag})`);
  } else {
    lines.push(`**Full Changelog**: https://github.com/${repoInfo.owner}/${repoInfo.repo}/compare/${fromRef}...${tag}`);
  }
  lines.push('');

  return lines.join('\n');
}

/**
 * Prepend or update CHANGELOG.md with Keep-a-Changelog structure
 */
function updateChangelogFile(tag, markdownContent) {
  const changelogPath = resolve(REPO_ROOT, 'CHANGELOG.md');
  let currentContent = '';

  if (existsSync(changelogPath)) {
    currentContent = readFileSync(changelogPath, 'utf8');
  } else {
    currentContent = '# Changelog\n\nAll notable changes to KrocPDF are documented in this file.\n\n## [Unreleased]\n\n';
  }

  const tagHeader = `## [${tag.replace(/^v/, '')}]`;
  if (currentContent.includes(tagHeader)) {
    console.log(`[Changelog] Section for ${tag} already present in CHANGELOG.md. Skipping prepend.`);
    return;
  }

  const unreleasedMatch = currentContent.match(/(## \[Unreleased\][\s\S]*?)(?=^## \[|\Z)/m);

  let newContent = '';
  const changelogEntry = `\n${markdownContent.replace(/^# 🚀 KrocPDF [^\n]+/, `## [${tag.replace(/^v/, '')}] - ${new Date().toISOString().split('T')[0]}`)}\n`;

  if (unreleasedMatch) {
    const unreleasedEnd = unreleasedMatch.index + unreleasedMatch[0].length;
    newContent = currentContent.slice(0, unreleasedEnd) + changelogEntry + currentContent.slice(unreleasedEnd);
  } else {
    newContent = `${currentContent}\n${changelogEntry}`;
  }

  writeFileSync(changelogPath, newContent, 'utf8');
  console.log(`[Changelog] Successfully updated ${changelogPath} with ${tag} release.`);
}

/**
 * Main execution
 */
async function main() {
  const repoInfo = getRepoInfo();
  const { fromRef, toRef, isInitial } = resolveRefs();

  const tag = customTag || (toRef.startsWith('v') ? toRef : `vNext`);

  console.log(`[Release Notes] Repo: ${repoInfo.url}`);
  console.log(`[Release Notes] Target Tag: ${tag}`);
  console.log(`[Release Notes] Range: ${fromRef} -> ${toRef} ${isInitial ? '(Initial Release Mode)' : ''}`);

  const commits = parseCommits(fromRef, toRef, isInitial);
  console.log(`[Release Notes] Total raw commits analyzed: ${commits.length}`);

  const historicalAuthors = getHistoricalAuthors(fromRef, isInitial);
  const categories = categorizeCommits(commits);
  const contributors = groupContributionsByAuthor(commits);

  // Identify first-time / founding contributors
  const firstTimeContributors = contributors.filter((c) => {
    if (isInitial) return true;
    const emailMatch = c.email && historicalAuthors.has(c.email.toLowerCase().trim());
    const nameMatch = c.name && historicalAuthors.has(c.name.toLowerCase().trim());
    return !emailMatch && !nameMatch;
  });

  console.log(`[Release Notes] Unique contributors: ${contributors.length}`);
  console.log(`[Release Notes] ${isInitial ? 'Founding' : 'New'} contributors: ${firstTimeContributors.length}`);

  const releaseNotes = renderReleaseNotes({
    tag,
    fromRef,
    toRef,
    isInitial,
    repoInfo,
    commits,
    categories,
    contributors,
    firstTimeContributors,
  });

  if (isPreview) {
    console.log('\n=================== RELEASE NOTES PREVIEW ===================\n');
    console.log(releaseNotes);
    console.log('\n============================================================\n');
  }

  if (outputFile) {
    const outPath = resolve(REPO_ROOT, outputFile);
    writeFileSync(outPath, releaseNotes, 'utf8');
    console.log(`[Release Notes] Wrote release notes to ${outPath}`);
  }

  if (writeChangelog) {
    updateChangelogFile(tag, releaseNotes);
  }

  return releaseNotes;
}

main().catch((err) => {
  console.error('[Release Notes Error]', err);
  process.exit(1);
});
