# =====================================================
# Deploy to Azure VM Script
# =====================================================
# This script helps deploy the application to Azure VM
# VM IP: 40.81.26.137
# =====================================================

param(
    [string]$VMUser = "azureuser",
    [string]$VMIP = "40.81.26.137",
    [string]$SSHKeyPath = "",
    [switch]$UseGit = $false
)

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Deploy to Azure VM - Company Profile App" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.production exists
if (-not (Test-Path ".env.production")) {
    Write-Host "❌ Error: .env.production not found!" -ForegroundColor Red
    Write-Host "Please create .env.production file first." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ .env.production found" -ForegroundColor Green
Write-Host ""

# Display deployment options
Write-Host "Deployment Options:" -ForegroundColor Yellow
Write-Host "1. Deploy using Git (clone repository on VM)" -ForegroundColor White
Write-Host "2. Deploy using SCP (transfer files from local)" -ForegroundColor White
Write-Host ""

if ($UseGit) {
    $deployMethod = "1"
} else {
    $deployMethod = Read-Host "Select deployment method (1 or 2)"
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Step 1: Testing SSH Connection" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Build SSH command
$sshCmd = "ssh"
if ($SSHKeyPath -ne "") {
    $sshCmd += " -i `"$SSHKeyPath`""
}
$sshCmd += " $VMUser@$VMIP"

Write-Host "Testing connection to $VMIP..." -ForegroundColor Yellow

# Test SSH connection
$testConnection = "$sshCmd 'echo Connection successful'"
try {
    Invoke-Expression $testConnection | Out-Null
    Write-Host "✅ SSH connection successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to connect to VM" -ForegroundColor Red
    Write-Host "Please ensure:" -ForegroundColor Yellow
    Write-Host "  1. VM is running" -ForegroundColor White
    Write-Host "  2. SSH port (22) is open in Azure NSG" -ForegroundColor White
    Write-Host "  3. Correct SSH credentials" -ForegroundColor White
    exit 1
}

Write-Host ""

if ($deployMethod -eq "1") {
    # ============================================
    # Method 1: Deploy using Git
    # ============================================
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "  Step 2: Deploy using Git" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    
    Write-Host "Cloning repository on VM..." -ForegroundColor Yellow
    
    $gitCommands = @"
cd ~
if [ -d "SaaS-Boilerplate-Modification" ]; then
    echo "Repository exists, pulling latest changes..."
    cd SaaS-Boilerplate-Modification
    git pull origin cms-integrated
else
    echo "Cloning repository..."
    git clone https://github.com/Mazdeus/SaaS-Boilerplate-Modification.git
    cd SaaS-Boilerplate-Modification
    git checkout cms-integrated
fi
"@
    
    Invoke-Expression "$sshCmd '$gitCommands'"
    
    Write-Host "✅ Repository deployed" -ForegroundColor Green
    
    # Transfer .env.production
    Write-Host ""
    Write-Host "Transferring .env.production file..." -ForegroundColor Yellow
    
    $scpCmd = "scp"
    if ($SSHKeyPath -ne "") {
        $scpCmd += " -i `"$SSHKeyPath`""
    }
    $scpCmd += " .env.production $VMUser@$VMIP`:~/SaaS-Boilerplate-Modification/"
    
    Invoke-Expression $scpCmd
    Write-Host "✅ .env.production transferred" -ForegroundColor Green
    
} else {
    # ============================================
    # Method 2: Deploy using SCP
    # ============================================
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "  Step 2: Transfer Files using SCP" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    
    Write-Host "Creating project directory on VM..." -ForegroundColor Yellow
    Invoke-Expression "$sshCmd 'mkdir -p ~/SaaS-Boilerplate-Modification'"
    
    Write-Host "Transferring files (this may take a while)..." -ForegroundColor Yellow
    
    $scpCmd = "scp -r"
    if ($SSHKeyPath -ne "") {
        $scpCmd += " -i `"$SSHKeyPath`""
    }
    
    # Transfer essential files only
    $filesToTransfer = @(
        "src",
        "public",
        "migrations",
        "database",
        "package.json",
        "package-lock.json",
        "next.config.mjs",
        "tsconfig.json",
        "tailwind.config.ts",
        "postcss.config.js",
        "Dockerfile",
        "docker-compose.yml",
        ".dockerignore",
        ".env.production",
        "drizzle.config.ts",
        "setup-database.js"
    )
    
    foreach ($file in $filesToTransfer) {
        if (Test-Path $file) {
            Write-Host "  Transferring $file..." -ForegroundColor Gray
            $transferCmd = "$scpCmd `"$file`" $VMUser@$VMIP`:~/SaaS-Boilerplate-Modification/"
            Invoke-Expression $transferCmd
        }
    }
    
    Write-Host "✅ Files transferred" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Step 3: Setup & Build on VM" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

Write-Host "Building Docker container on VM..." -ForegroundColor Yellow

$buildCommands = @"
cd ~/SaaS-Boilerplate-Modification
echo "Stopping existing containers..."
docker-compose --env-file .env.production down 2>/dev/null || true
echo "Building new image..."
docker-compose --env-file .env.production build
echo "Starting containers..."
docker-compose --env-file .env.production up -d
echo "Checking container status..."
docker ps
"@

Invoke-Expression "$sshCmd '$buildCommands'"

Write-Host "✅ Build complete" -ForegroundColor Green

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Step 4: Verify Deployment" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

Write-Host "Waiting for application to start (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host "Testing application endpoint..." -ForegroundColor Yellow
$verifyCmd = "$sshCmd 'curl -s -o /dev/null -w `"%{http_code}`" http://localhost:3000'"
$statusCode = Invoke-Expression $verifyCmd

if ($statusCode -eq "200") {
    Write-Host "✅ Application is running!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Application may not be ready yet (HTTP $statusCode)" -ForegroundColor Yellow
    Write-Host "Check logs with: docker-compose --env-file .env.production logs" -ForegroundColor Gray
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Application URLs:" -ForegroundColor Yellow
Write-Host "   Homepage:        http://$VMIP:3000" -ForegroundColor White
Write-Host "   Company Profile: http://$VMIP:3000/en/company-profile" -ForegroundColor White
Write-Host "   CMS Login:       http://$VMIP:3000/cms/login" -ForegroundColor White
Write-Host "   Dashboard:       http://$VMIP:3000/en/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "📊 View Logs:" -ForegroundColor Yellow
Write-Host "   ssh $VMUser@$VMIP" -ForegroundColor White
Write-Host "   cd ~/SaaS-Boilerplate-Modification" -ForegroundColor White
Write-Host "   docker-compose --env-file .env.production logs -f" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Important:" -ForegroundColor Yellow
Write-Host "   Make sure port 3000 is open in Azure Network Security Group!" -ForegroundColor White
Write-Host ""
