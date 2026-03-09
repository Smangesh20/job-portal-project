#!/usr/bin/env bash
set -euo pipefail

APP="${1:-voice}"
if [[ "$APP" != "voice" && "$APP" != "responsible" ]]; then
  echo "Usage: ./scripts/deploy-streamlit.sh [voice|responsible]"
  exit 1
fi

REMOTE_URL="$(git config --get remote.origin.url || true)"
if [[ -z "$REMOTE_URL" ]]; then
  echo "No git origin remote found."
  exit 1
fi

if [[ "$REMOTE_URL" =~ github\.com[:/]([^/]+)/([^/.]+)(\.git)?$ ]]; then
  OWNER="${BASH_REMATCH[1]}"
  REPO="${BASH_REMATCH[2]}"
else
  echo "Origin remote is not a GitHub URL: $REMOTE_URL"
  exit 1
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
MAIN_MODULE="streamlit_voice_app.py"
if [[ "$APP" == "responsible" ]]; then
  MAIN_MODULE="streamlit_responsible_app.py"
fi

ENCODED_BRANCH="${BRANCH//\//%2F}"
DEPLOY_URL="https://share.streamlit.io/deploy?owner=${OWNER}&repo=${REPO}&branch=${ENCODED_BRANCH}&mainModule=${MAIN_MODULE}"

echo "Open this Streamlit one-click deploy URL:"
echo "$DEPLOY_URL"

