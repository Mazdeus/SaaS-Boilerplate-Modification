# Quick Setup Script for Local Docker Testing
# Run this before deploying to Azure VM

Write-Host "🔧 Brodo CMS - Docker Setup & Testing" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Docker is installed" -ForegroundColor Green

# Check if .env.production exists
Write-Host ""
Write-Host "Checking environment configuration..." -ForegroundColor Yellow
if (!(Test-Path ".env.production")) {
    Write-Host "⚠️  .env.production not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env.production" ".env.production.example" -ErrorAction SilentlyContinue
    Write-Host "⚠️  Please edit .env.production with your actual values!" -ForegroundColor Red
    Write-Host "   Required variables:" -ForegroundColor Yellow
    Write-Host "   - DATABASE_URL" -ForegroundColor Yellow
    Write-Host "   - JWT_SECRET" -ForegroundColor Yellow
    Write-Host "   - NEXT_PUBLIC_API_URL" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ .env.production found" -ForegroundColor Green

# Build Docker image
Write-Host ""
Write-Host "Building Docker image..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
docker-compose build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker image built successfully" -ForegroundColor Green

# Ask if user wants to run the container
Write-Host ""
$run = Read-Host "Do you want to start the container now? (y/n)"

if ($run -eq "y" -or $run -eq "Y") {
    Write-Host ""
    Write-Host "Starting container..." -ForegroundColor Yellow
    docker-compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Container started successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Container Status:" -ForegroundColor Cyan
        docker ps -f name=brodo-cms-app
        Write-Host ""
        Write-Host "🌐 Application should be running at: http://localhost:3000" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Useful commands:" -ForegroundColor Cyan
        Write-Host "   View logs:    docker-compose logs -f" -ForegroundColor Gray
        Write-Host "   Stop:         docker-compose down" -ForegroundColor Gray
        Write-Host "   Restart:      docker-compose restart" -ForegroundColor Gray
        Write-Host "   Shell access: docker exec -it brodo-cms-app sh" -ForegroundColor Gray
    } else {
        Write-Host "❌ Failed to start container!" -ForegroundColor Red
        Write-Host "Check logs with: docker-compose logs" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps for Azure VM deployment:" -ForegroundColor Cyan
Write-Host "1. Push code to GitHub" -ForegroundColor White
Write-Host "2. SSH to Azure VM: ssh azureuser@40.81.26.137" -ForegroundColor White
Write-Host "3. Follow instructions in DEPLOYMENT.md" -ForegroundColor White
Write-Host ""
