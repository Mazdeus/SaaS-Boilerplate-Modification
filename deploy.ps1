# ============================================================================
# Azure Deployment Script for Company Profile & CMS
# ============================================================================
# Usage: .\deploy.ps1
# Prerequisites: Azure CLI, Docker Desktop installed and running
# ============================================================================

param(
    [string]$ResourceGroup = "rg-company-profile",
    [string]$Location = "southeastasia",
    [string]$AcrName = "acrcompanyprofile",
    [string]$AppName = "app-company-profile",
    [string]$ImageTag = "latest"
)

# Color functions
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Error { Write-Host $args -ForegroundColor Red }

# Banner
Write-Host "
╔════════════════════════════════════════════════════════════╗
║  Azure Deployment Script - Company Profile & CMS          ║
║  Docker → ACR → Container Apps → Namecheap Domain        ║
╚════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# Check prerequisites
Write-Info "Checking prerequisites..."

# Check Azure CLI
try {
    az version | Out-Null
    Write-Success "✓ Azure CLI installed"
} catch {
    Write-Error "✗ Azure CLI not installed. Please install from: https://aka.ms/azure-cli"
    exit 1
}

# Check Docker
try {
    docker version | Out-Null
    Write-Success "✓ Docker installed and running"
} catch {
    Write-Error "✗ Docker not running. Please start Docker Desktop"
    exit 1
}

# Check if logged in to Azure
Write-Info "`nChecking Azure login..."
$account = az account show 2>$null
if (!$account) {
    Write-Warning "Not logged in to Azure. Logging in..."
    az login
    if (!$?) {
        Write-Error "Azure login failed"
        exit 1
    }
}
Write-Success "✓ Logged in to Azure"

# Show current subscription
$subscription = az account show --query name --output tsv
Write-Info "Current subscription: $subscription"

# Confirm before proceeding
Write-Warning "`n⚠️  This will create Azure resources with potential costs!"
$confirm = Read-Host "Continue? (y/n)"
if ($confirm -ne 'y') {
    Write-Info "Deployment cancelled"
    exit 0
}

# ============================================================================
# STEP 1: Create Resource Group
# ============================================================================
Write-Info "`n[1/8] Creating Resource Group..."
$rgExists = az group exists --name $ResourceGroup
if ($rgExists -eq "true") {
    Write-Warning "Resource group '$ResourceGroup' already exists"
} else {
    az group create --name $ResourceGroup --location $Location
    if ($?) {
        Write-Success "✓ Resource group created"
    } else {
        Write-Error "✗ Failed to create resource group"
        exit 1
    }
}

# ============================================================================
# STEP 2: Create Container Registry
# ============================================================================
Write-Info "`n[2/8] Creating Azure Container Registry..."
$acrExists = az acr show --name $AcrName --resource-group $ResourceGroup 2>$null
if ($acrExists) {
    Write-Warning "ACR '$AcrName' already exists"
} else {
    az acr create `
        --resource-group $ResourceGroup `
        --name $AcrName `
        --sku Basic `
        --admin-enabled true
    
    if ($?) {
        Write-Success "✓ Container Registry created"
    } else {
        Write-Error "✗ Failed to create Container Registry"
        exit 1
    }
}

# ============================================================================
# STEP 3: Build Docker Image
# ============================================================================
Write-Info "`n[3/8] Building Docker image..."

# Check if .env.production exists
if (!(Test-Path ".env.production")) {
    Write-Error "✗ .env.production not found!"
    Write-Info "Please copy .env.production.example to .env.production and fill in values"
    exit 1
}

docker build -t company-profile:$ImageTag .
if ($?) {
    Write-Success "✓ Docker image built"
} else {
    Write-Error "✗ Failed to build Docker image"
    exit 1
}

# ============================================================================
# STEP 4: Push to ACR
# ============================================================================
Write-Info "`n[4/8] Pushing image to Azure Container Registry..."

az acr login --name $AcrName
$acrServer = az acr show --name $AcrName --query loginServer --output tsv

docker tag company-profile:$ImageTag "$acrServer/company-profile:$ImageTag"
docker push "$acrServer/company-profile:$ImageTag"

if ($?) {
    Write-Success "✓ Image pushed to ACR"
} else {
    Write-Error "✗ Failed to push image"
    exit 1
}

# ============================================================================
# STEP 5: Get ACR Credentials
# ============================================================================
Write-Info "`n[5/8] Getting ACR credentials..."
$acrUsername = az acr credential show --name $AcrName --query username --output tsv
$acrPassword = az acr credential show --name $AcrName --query "passwords[0].value" --output tsv
Write-Success "✓ ACR credentials retrieved"

# ============================================================================
# STEP 6: Create Container Apps Environment
# ============================================================================
Write-Info "`n[6/8] Setting up Container Apps environment..."

# Install extension
az extension add --name containerapp --upgrade 2>$null
az provider register --namespace Microsoft.App 2>$null
az provider register --namespace Microsoft.OperationalInsights 2>$null

$envName = "env-$AppName"
$envExists = az containerapp env show --name $envName --resource-group $ResourceGroup 2>$null

if (!$envExists) {
    Write-Info "Creating Log Analytics workspace..."
    $lawName = "law-$AppName"
    
    az monitor log-analytics workspace create `
        --resource-group $ResourceGroup `
        --workspace-name $lawName `
        --location $Location
    
    $workspaceId = az monitor log-analytics workspace show `
        --resource-group $ResourceGroup `
        --workspace-name $lawName `
        --query customerId `
        --output tsv
    
    $workspaceKey = az monitor log-analytics workspace get-shared-keys `
        --resource-group $ResourceGroup `
        --workspace-name $lawName `
        --query primarySharedKey `
        --output tsv
    
    Write-Info "Creating Container Apps environment..."
    az containerapp env create `
        --name $envName `
        --resource-group $ResourceGroup `
        --location $Location `
        --logs-workspace-id $workspaceId `
        --logs-workspace-key $workspaceKey
    
    if ($?) {
        Write-Success "✓ Container Apps environment created"
    } else {
        Write-Error "✗ Failed to create environment"
        exit 1
    }
} else {
    Write-Warning "Container Apps environment already exists"
}

# ============================================================================
# STEP 7: Read Environment Variables
# ============================================================================
Write-Info "`n[7/8] Reading environment variables from .env.production..."

function Get-EnvValue {
    param($Key)
    $line = Get-Content .env.production | Where-Object { $_ -match "^$Key=" }
    if ($line) {
        return ($line -split '=', 2)[1].Trim('"')
    }
    return $null
}

$dbUrl = Get-EnvValue "DATABASE_URL"
$nextAuthSecret = Get-EnvValue "NEXTAUTH_SECRET"
$nextAuthUrl = Get-EnvValue "NEXTAUTH_URL"
$clerkSecret = Get-EnvValue "CLERK_SECRET_KEY"
$clerkPubKey = Get-EnvValue "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"

if (!$dbUrl -or !$nextAuthSecret -or !$clerkSecret) {
    Write-Error "✗ Missing required environment variables in .env.production"
    Write-Info "Required: DATABASE_URL, NEXTAUTH_SECRET, CLERK_SECRET_KEY"
    exit 1
}

Write-Success "✓ Environment variables loaded"

# ============================================================================
# STEP 8: Deploy Container App
# ============================================================================
Write-Info "`n[8/8] Deploying Container App..."

$appExists = az containerapp show --name $AppName --resource-group $ResourceGroup 2>$null

if ($appExists) {
    Write-Warning "Container App exists. Updating..."
    az containerapp update `
        --name $AppName `
        --resource-group $ResourceGroup `
        --image "$acrServer/company-profile:$ImageTag"
} else {
    Write-Info "Creating new Container App..."
    az containerapp create `
        --name $AppName `
        --resource-group $ResourceGroup `
        --environment $envName `
        --image "$acrServer/company-profile:$ImageTag" `
        --target-port 3000 `
        --ingress external `
        --registry-server $acrServer `
        --registry-username $acrUsername `
        --registry-password $acrPassword `
        --cpu 1.0 `
        --memory 2.0Gi `
        --min-replicas 1 `
        --max-replicas 3 `
        --secrets `
            "database-url=$dbUrl" `
            "nextauth-secret=$nextAuthSecret" `
            "clerk-secret=$clerkSecret" `
        --env-vars `
            "DATABASE_URL=secretref:database-url" `
            "NEXTAUTH_SECRET=secretref:nextauth-secret" `
            "CLERK_SECRET_KEY=secretref:clerk-secret" `
            "NEXTAUTH_URL=$nextAuthUrl" `
            "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$clerkPubKey" `
            "NODE_ENV=production" `
            "NEXT_TELEMETRY_DISABLED=1"
}

if ($?) {
    Write-Success "✓ Container App deployed successfully!"
} else {
    Write-Error "✗ Failed to deploy Container App"
    exit 1
}

# ============================================================================
# COMPLETION
# ============================================================================
Write-Success "`n╔════════════════════════════════════════════════════════════╗"
Write-Success "║  ✓ Deployment Completed Successfully!                     ║"
Write-Success "╚════════════════════════════════════════════════════════════╝"

# Get application URL
$appUrl = az containerapp show `
    --name $AppName `
    --resource-group $ResourceGroup `
    --query properties.configuration.ingress.fqdn `
    --output tsv

Write-Info "`nApplication Information:"
Write-Host "  Resource Group: " -NoNewline; Write-Success $ResourceGroup
Write-Host "  Container App:  " -NoNewline; Write-Success $AppName
Write-Host "  Application URL:" -NoNewline; Write-Success " https://$appUrl"

Write-Info "`nTest URLs:"
Write-Host "  Company Profile: " -NoNewline; Write-Success "https://$appUrl/en/company-profile"
Write-Host "  CMS Login:      " -NoNewline; Write-Success "https://$appUrl/cms/login"
Write-Host "  Dashboard:      " -NoNewline; Write-Success "https://$appUrl/en/dashboard"

Write-Info "`nNext Steps:"
Write-Host "  1. Test the application URLs above"
Write-Host "  2. Configure custom domain in Namecheap (see DEPLOYMENT_GUIDE.md)"
Write-Host "  3. Update Clerk domain settings with your production URL"
Write-Host "  4. Setup monitoring and alerts"

Write-Info "`nView logs with:"
Write-Host "  az containerapp logs show --name $AppName --resource-group $ResourceGroup --follow" -ForegroundColor Gray

Write-Info "`nView in Azure Portal:"
Write-Host "  https://portal.azure.com/#resource/subscriptions/$(az account show --query id --output tsv)/resourceGroups/$ResourceGroup/providers/Microsoft.App/containerApps/$AppName" -ForegroundColor Gray

Write-Success "`n🎉 Happy deploying!"
