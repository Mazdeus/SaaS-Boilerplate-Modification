# Docker Build Script with Environment Variables
# Usage: .\docker-build.ps1

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host " Docker Build Script - Company Profile & CMS" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.production exists
if (!(Test-Path ".env.production")) {
    Write-Host "[ERROR] .env.production not found!" -ForegroundColor Red
    Write-Host "Please create .env.production from .env.production.example" -ForegroundColor Yellow
    exit 1
}

Write-Host "[INFO] Loading environment variables from .env.production..." -ForegroundColor Cyan

# Function to read env file
function Get-EnvValue {
    param($Key)
    $line = Get-Content .env.production | Where-Object { $_ -match "^$Key=" }
    if ($line) {
        $value = ($line -split '=', 2)[1].Trim('"')
        return $value
    }
    return ""
}

# Load environment variables
$DATABASE_URL = Get-EnvValue "DATABASE_URL"
$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = Get-EnvValue "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
$CLERK_SECRET_KEY = Get-EnvValue "CLERK_SECRET_KEY"
$NEXT_PUBLIC_CLERK_SIGN_IN_URL = Get-EnvValue "NEXT_PUBLIC_CLERK_SIGN_IN_URL"
$NEXTAUTH_SECRET = Get-EnvValue "NEXTAUTH_SECRET"
$NEXTAUTH_URL = Get-EnvValue "NEXTAUTH_URL"

# Validate required variables
$missingVars = @()
if ([string]::IsNullOrEmpty($DATABASE_URL)) { $missingVars += "DATABASE_URL" }
if ([string]::IsNullOrEmpty($NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)) { $missingVars += "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" }
if ([string]::IsNullOrEmpty($CLERK_SECRET_KEY)) { $missingVars += "CLERK_SECRET_KEY" }
if ([string]::IsNullOrEmpty($NEXTAUTH_SECRET)) { $missingVars += "NEXTAUTH_SECRET" }

if ($missingVars.Count -gt 0) {
    Write-Host "[ERROR] Missing required environment variables:" -ForegroundColor Red
    $missingVars | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    exit 1
}

Write-Host "[OK] Environment variables loaded successfully" -ForegroundColor Green
Write-Host ""
Write-Host "[INFO] Building Docker image..." -ForegroundColor Cyan
Write-Host "[INFO] This may take 5-10 minutes..." -ForegroundColor Yellow
Write-Host ""

# Build Docker image with build arguments
docker build `
    --build-arg DATABASE_URL="$DATABASE_URL" `
    --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" `
    --build-arg CLERK_SECRET_KEY="$CLERK_SECRET_KEY" `
    --build-arg NEXT_PUBLIC_CLERK_SIGN_IN_URL="$NEXT_PUBLIC_CLERK_SIGN_IN_URL" `
    --build-arg NEXTAUTH_SECRET="$NEXTAUTH_SECRET" `
    --build-arg NEXTAUTH_URL="$NEXTAUTH_URL" `
    -t company-profile:latest `
    .

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[SUCCESS] Docker image built successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Test locally:  .\docker-run.ps1" -ForegroundColor White
    Write-Host "2. Deploy to Azure:  .\deploy.ps1" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "[FAILED] Docker build failed!" -ForegroundColor Red
    Write-Host "Check the error messages above for details." -ForegroundColor Yellow
    exit 1
}
