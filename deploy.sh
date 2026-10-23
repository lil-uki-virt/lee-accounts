#!/usr/bin/env bash
#
# Publish Lee Accounts to GitHub Pages, the same way fated-list deploys:
# a GitHub Actions workflow that builds Pages from a push to main.
#
# Safe to re-run. The first run creates the repo; later runs just push,
# which re-triggers the deploy.
#
#   bash deploy.sh [repo-name]
#
set -euo pipefail

# The owner decides the Pages hostname: https://<owner>.github.io/<repo>/
# Override with GH_OWNER=someone-else bash deploy.sh
OWNER="${GH_OWNER:-lil-uki-virt}"
REPO="${1:-lee-accounts}"
SLUG="$OWNER/$REPO"

cd "$(dirname "$0")"

if ! command -v gh >/dev/null 2>&1; then
  echo "error: the GitHub CLI (gh) is not installed." >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "error: gh is not authenticated. Run 'gh auth login' first." >&2
  exit 1
fi

if [ ! -d .git ]; then
  echo "==> Initialising repository"
  git init -q
fi
git branch -M main

echo "==> Committing"
git add -A
if git diff --cached --quiet; then
  echo "    nothing to commit"
else
  git commit -qm "Lee Accounts site"
fi

if gh repo view "$SLUG" >/dev/null 2>&1; then
  echo "==> Repo $SLUG already exists"
else
  echo "==> Creating $SLUG"
  # --public is required: GitHub Pages on a private repo needs a paid plan.
  # Created bare, then wired up below, so a half-finished earlier run can't
  # leave an "origin" behind that makes --remote=origin fail.
  gh repo create "$SLUG" --public
fi

echo "==> Pointing origin at $SLUG"
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "https://github.com/$SLUG.git"
else
  git remote add origin "https://github.com/$SLUG.git"
fi

echo "==> Pushing"
git push -u origin main

echo "==> Pointing Pages at GitHub Actions"
# Create the Pages site, or switch an existing one to the workflow build type.
gh api -X POST "repos/$SLUG/pages" -f build_type=workflow >/dev/null 2>&1 \
  || gh api -X PUT "repos/$SLUG/pages" -f build_type=workflow >/dev/null

echo "==> Waiting for the deploy"
sleep 5
RUN_ID="$(gh run list -R "$SLUG" --limit 1 --json databaseId --jq '.[0].databaseId')"
[ -n "$RUN_ID" ] && gh run watch -R "$SLUG" --exit-status "$RUN_ID" || true

echo
echo "Live at: https://$OWNER.github.io/$REPO/"
echo "Runs:    https://github.com/$SLUG/actions"
