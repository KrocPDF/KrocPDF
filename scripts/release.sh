#!/usr/bin/env bash

# KrocPDF Release Assistant
# Usage: ./scripts/release.sh [version_tag]

set -euo pipefail

# Ensure we are at repository root
cd "$(git rev-parse --show-toplevel)"

echo "=== 🚀 KrocPDF Release Assistant ==="

# Check working tree
if [[ -n $(git status --porcelain) ]]; then
  echo "❌ Error: Working tree is dirty. Please commit or stash your changes before releasing."
  exit 1
fi

TAG="${1:-}"

if [[ -z "$TAG" ]]; then
  LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "None")
  echo "Latest tag: $LATEST_TAG"
  read -rp "Enter new release tag (e.g., v2.2.0): " TAG
fi

if [[ -z "$TAG" ]]; then
  echo "❌ Error: Release tag cannot be empty."
  exit 1
fi

if ! [[ "$TAG" =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?$ ]]; then
  echo "⚠️ Warning: '$TAG' does not follow standard SemVer format (vX.Y.Z). Continue? [y/N]"
  read -rp "" CONFIRM
  if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    exit 1
  fi
fi

echo ""
echo "Generating Release Notes preview for $TAG..."
node scripts/generate-release-notes.mjs --tag "$TAG" --preview

echo ""
read -rp "Proceed with tag creation and CHANGELOG update for $TAG? [y/N]: " PROCEED
if [[ "$PROCEED" != "y" && "$PROCEED" != "Y" ]]; then
  echo "Release cancelled."
  exit 0
fi

# Update CHANGELOG.md
echo "Updating CHANGELOG.md..."
node scripts/generate-release-notes.mjs --tag "$TAG" --write-changelog

# Stage CHANGELOG.md if modified
if [[ -n $(git status --porcelain CHANGELOG.md) ]]; then
  git add CHANGELOG.md
  git commit -m "chore(release): update changelog for $TAG"
  echo "Committed updated CHANGELOG.md"
fi

# Create annotated tag
git tag -a "$TAG" -m "Release $TAG"
echo "✅ Created git tag $TAG"

echo ""
echo "To publish the release to GitHub and trigger the release workflow, run:"
echo "  git push origin main --tags"
echo "Or push only the tag:"
echo "  git push origin $TAG"
