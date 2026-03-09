#!/usr/bin/env bash
set -euo pipefail

echo "AskYaCham one-click deployment starting..."

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed. Install Docker first."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose is not available. Install Docker Compose first."
  exit 1
fi

if [[ ! -f .env.deploy && -f .env.deploy.example ]]; then
  cp .env.deploy.example .env.deploy
  echo "Created .env.deploy from template. Update JWT_SECRET before production use."
fi

docker compose --env-file .env.deploy up -d --build

echo "Deployment complete."
echo "Open: http://localhost:4444"

