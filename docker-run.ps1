# ============================================================================
# Docker Run Script - Test Locally
# ============================================================================
# Usage: .\docker-run.ps1
# ============================================================================

Write-Host "
╔════════════════════════════════════════════════════════════╗
║  Docker Run Script - Test Locally                         ║
╚════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# Check if .env.production exists
if (!(Test-Path ".env.production")) {
    Write-Host "Error: .env.production not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Starting Docker container..." -ForegroundColor Cyan
Write-Host "Container will be available at: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the container" -ForegroundColor Gray
Write-Host ""

# Run container with environment file
docker run -p 3000:3000 --env-file .env.production company-profile:latest
