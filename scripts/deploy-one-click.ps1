Write-Host "AskYaCham one-click deployment starting..." -ForegroundColor Cyan

$hasDockerCompose = $false
try {
  docker compose version | Out-Null
  $hasDockerCompose = $true
} catch {
  $hasDockerCompose = $false
}

if (-not $hasDockerCompose) {
  Write-Host "Docker Compose is not available. Install Docker Desktop first." -ForegroundColor Red
  exit 1
}

if (-not (Test-Path ".env.deploy")) {
  if (Test-Path ".env.deploy.example") {
    Copy-Item ".env.deploy.example" ".env.deploy"
    Write-Host "Created .env.deploy from template. Update JWT_SECRET before production use." -ForegroundColor Yellow
  }
}

docker compose --env-file .env.deploy up -d --build

if ($LASTEXITCODE -ne 0) {
  Write-Host "Deployment failed." -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "Deployment complete." -ForegroundColor Green
Write-Host "Open: http://localhost:4444" -ForegroundColor Green

