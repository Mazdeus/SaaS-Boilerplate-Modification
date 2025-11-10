# ===================================================================
# Fix Environment Variables for Docker Compose
# ===================================================================
# Script ini akan mengatasi masalah environment variables yang tidak terbaca

# Set environment variables from .env.production
$envFile = ".env.production"

if (Test-Path $envFile) {
    Write-Host "🔧 Loading environment variables from $envFile..." -ForegroundColor Green
    
    # Read .env.production and set environment variables
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^[^#].*=.*$') {
            $name, $value = $_ -split '=', 2
            $value = $value.Trim('"')
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
            Write-Host "✅ Set $name" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n📋 Environment Variables Summary:" -ForegroundColor Cyan
    Write-Host "- DATABASE_URL: $($env:DATABASE_URL.Substring(0, [Math]::Min(30, $env:DATABASE_URL.Length)))..." -ForegroundColor White
    Write-Host "- NEXTAUTH_SECRET: $($env:NEXTAUTH_SECRET.Substring(0, [Math]::Min(10, $env:NEXTAUTH_SECRET.Length)))..." -ForegroundColor White
    Write-Host "- NEXTAUTH_URL: $env:NEXTAUTH_URL" -ForegroundColor White
    Write-Host "- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: $($env:NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.Substring(0, [Math]::Min(20, $env:NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.Length)))..." -ForegroundColor White
    
    Write-Host "`n🧹 Stopping existing containers..." -ForegroundColor Green
    docker-compose down --remove-orphans
    
    Write-Host "`n🗑️ Removing old images..." -ForegroundColor Green
    docker image rm -f saas-boilerplate-modification_web 2>$null
    
    Write-Host "`n🏗️ Building and starting application..." -ForegroundColor Green
    docker-compose up -d --build
    
    Write-Host "`n⏳ Waiting for container to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
    
    Write-Host "`n📋 Container status:" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host "`n📝 Recent logs:" -ForegroundColor Cyan
    docker-compose logs --tail=20
    
    Write-Host "`n🎉 Deployment completed!" -ForegroundColor Green
    Write-Host "🌐 Application URL: $env:NEXTAUTH_URL" -ForegroundColor Yellow
    Write-Host "📊 Use 'docker-compose logs -f' to view real-time logs" -ForegroundColor White
    
} else {
    Write-Host "❌ Error: .env.production file not found!" -ForegroundColor Red
    exit 1
}
