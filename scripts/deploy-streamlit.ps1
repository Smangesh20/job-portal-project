param(
  [ValidateSet("voice", "responsible")]
  [string]$App = "voice"
)

$remoteUrl = git config --get remote.origin.url
if (-not $remoteUrl) {
  Write-Host "No git origin remote found." -ForegroundColor Red
  exit 1
}

$pattern = "github\.com[:/](?<owner>[^/]+)/(?<repo>[^/.]+)(\.git)?$"
$match = [regex]::Match($remoteUrl, $pattern)
if (-not $match.Success) {
  Write-Host "Origin remote is not a GitHub URL: $remoteUrl" -ForegroundColor Red
  exit 1
}

$owner = $match.Groups["owner"].Value
$repo = $match.Groups["repo"].Value
$branch = git rev-parse --abbrev-ref HEAD

$mainModule = if ($App -eq "responsible") {
  "streamlit_responsible_app.py"
} else {
  "streamlit_voice_app.py"
}

$encodedBranch = [System.Uri]::EscapeDataString($branch)
$deployUrl = "https://share.streamlit.io/deploy?owner=$owner&repo=$repo&branch=$encodedBranch&mainModule=$mainModule"

Write-Host "Opening Streamlit one-click deploy page..." -ForegroundColor Cyan
Write-Host $deployUrl -ForegroundColor Green
Start-Process $deployUrl

