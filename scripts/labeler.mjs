#!/usr/bin/env node

/**
 * Local CLI Runner for KrocPDF Auto-Labeler
 *
 * Usage:
 *   npm run labeler                     # Triggers labeler for current branch PR
 *   node scripts/labeler.mjs --pr 35    # Triggers labeler workflow for PR #35
 *   node scripts/labeler.mjs --status   # Checks latest runs of the labeler workflow
 */

import { execSync } from 'node:child_process';

const args = process.argv.slice(2);

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'inherit' });
  } catch (err) {
    process.exit(1);
  }
}

function getOutput(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    return '';
  }
}

const isStatus = args.includes('--status') || args.includes('-s');
const prIndex = args.indexOf('--pr');
const prNumber = prIndex !== -1 && prIndex + 1 < args.length ? args[prIndex + 1] : null;

console.log('🏷️  KrocPDF Monorepo Auto-Labeler CLI\n');

if (isStatus) {
  console.log('Fetching recent labeler runs...\n');
  run('gh run list --workflow=labeler.yml --limit 5');
  process.exit(0);
}

// Current git branch
const currentBranch = getOutput('git rev-parse --abbrev-ref HEAD') || 'main';

console.log(`Triggering 'Advanced Monorepo Labeler' on branch [${currentBranch}]...`);
run(`gh workflow run labeler.yml --ref ${currentBranch}`);

console.log('\n✅ Dispatched labeler workflow run successfully!');
console.log('To view live progress, run:');
console.log('  gh run watch --workflow=labeler.yml');
console.log('To view labels on PR:');
console.log(`  gh pr view ${prNumber || ''}`);
