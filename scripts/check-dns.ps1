# Quick DNS Check for brodofootwear.studio
# PowerShell version
# Usage: .\scripts\check-dns.ps1

Write-Host "🔍 Checking DNS propagation for brodofootwear.studio..." -ForegroundColor Cyan
Write-Host ""

# Check root domain
Write-Host "📍 Root domain (@):" -ForegroundColor Yellow
nslookup brodofootwear.studio
Write-Host ""

# Check www subdomain
Write-Host "📍 WWW subdomain:" -ForegroundColor Yellow
nslookup www.brodofootwear.studio
Write-Host ""

# Expected IP
$EXPECTED_IP = "40.81.26.137"
Write-Host "✅ Expected IP: $EXPECTED_IP" -ForegroundColor Green
Write-Host ""

# Try to get current IP
try {
    $result = Resolve-DnsName -Name brodofootwear.studio -Type A -ErrorAction SilentlyContinue
    $currentIP = $result.IPAddress
    
    if ($currentIP -eq $EXPECTED_IP) {
        Write-Host "✅ DNS propagation complete! Domain is pointing to Azure VM." -ForegroundColor Green
    } else {
        Write-Host "⏳ DNS not yet propagated. Current IP: $currentIP" -ForegroundColor Yellow
        Write-Host "   Please wait a few minutes and try again." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  DNS lookup failed. Domain might not be configured yet." -ForegroundColor Red
    Write-Host "   Please check DNS records at name.com." -ForegroundColor Red
}

Write-Host ""
Write-Host "💡 Tip: DNS propagation can take 5 minutes to 48 hours." -ForegroundColor Cyan
