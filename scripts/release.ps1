# KrocPDF Windows PowerShell Release Assistant
# Usage: .\scripts\release.ps1 [-Tag "v2.2.0"]

param(
    [string]$Tag = ""
)

$ErrorActionPreference = "Stop"

$repoRoot = (git rev-parse --show-toplevel).Trim()
Set-Location $repoRoot

Write-Host "=== 🚀 KrocPDF Release Assistant ===" -ForegroundColor Cyan

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "❌ Error: Working tree is dirty. Please commit or stash your changes before releasing." -ForegroundColor Red
    exit 1
}

if (-not $Tag) {
    $latestTag = "None"
    try {
        $latestTag = (git describe --tags --abbrev=0 2>$null).Trim()
    } catch {}

    Write-Host "Latest git tag: $latestTag" -ForegroundColor Yellow
    $Tag = Read-Host "Enter new release tag (e.g. v2.2.0)"
}

if (-not $Tag) {
    Write-Host "❌ Error: Release tag cannot be empty." -ForegroundColor Red
    exit 1
}

if ($Tag -notmatch '^v\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$') {
    Write-Host "⚠️ Warning: '$Tag' does not strictly match SemVer format (vX.Y.Z)." -ForegroundColor Yellow
    $confirm = Read-Host "Continue anyway? (y/N)"
    if ($confirm -ne 'y' -and $confirm -ne 'Y') {
        exit 1
    }
}

Write-Host "`nGenerating Release Notes preview for $Tag..." -ForegroundColor Cyan
node scripts/generate-release-notes.mjs --tag "$Tag" --preview

$proceed = Read-Host "`nProceed with tag creation and CHANGELOG update for $Tag? (y/N)"
if ($proceed -ne 'y' -and $proceed -ne 'Y') {
    Write-Host "Release cancelled." -ForegroundColor Yellow
    exit 0
}

# Update CHANGELOG.md
Write-Host "Updating CHANGELOG.md..." -ForegroundColor Cyan
node scripts/generate-release-notes.mjs --tag "$Tag" --write-changelog

$changelogChanged = git status --porcelain CHANGELOG.md
if ($changelogChanged) {
    git add CHANGELOG.md
    git commit -m "chore(release): update changelog for $Tag"
    Write-Host "Committed updated CHANGELOG.md" -ForegroundColor Green
}

# Create annotated tag
git tag -a "$Tag" -m "Release $Tag"
Write-Host "✅ Created git tag $Tag" -ForegroundColor Green

Write-Host "`nTo publish this release to GitHub and trigger the automated release workflow, run:" -ForegroundColor Cyan
Write-Host "  git push origin main --tags" -ForegroundColor White
Write-Host "Or push only the tag:" -ForegroundColor Cyan
Write-Host "  git push origin $Tag" -ForegroundColor White
