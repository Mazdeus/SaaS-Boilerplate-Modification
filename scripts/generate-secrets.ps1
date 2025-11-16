# PowerShell script to generate secure JWT and Session secrets for production
# Run this locally on Windows

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "  GENERATE PRODUCTION SECRETS" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

Write-Host "Generating secure random secrets...`n" -ForegroundColor Yellow

# Generate JWT_SECRET (64 bytes = 48 base64 characters)
$jwtBytes = New-Object byte[] 64
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($jwtBytes)
$jwtSecret = [Convert]::ToBase64String($jwtBytes)

# Generate SESSION_SECRET (64 bytes = 48 base64 characters)
$sessionBytes = New-Object byte[] 64
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($sessionBytes)
$sessionSecret = [Convert]::ToBase64String($sessionBytes)

Write-Host "JWT_SECRET:" -ForegroundColor Green
Write-Host $jwtSecret -ForegroundColor White
Write-Host ""

Write-Host "SESSION_SECRET:" -ForegroundColor Green
Write-Host $sessionSecret -ForegroundColor White
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "COPY these secrets to your .env.production file" -ForegroundColor Yellow
Write-Host "NEVER commit these secrets to Git!" -ForegroundColor Red
Write-Host "================================================`n" -ForegroundColor Cyan

# Optional: Copy to clipboard
Write-Host "Would you like to save these to a file? (y/n): " -NoNewline -ForegroundColor Yellow
$response = Read-Host

if ($response -eq 'y') {
    $content = @"
# PRODUCTION SECRETS - GENERATED $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# IMPORTANT: Keep these secure and never commit to Git!

JWT_SECRET=$jwtSecret
SESSION_SECRET=$sessionSecret

# Copy these values to your .env.production on Azure VM
"@
    
    $outputFile = "secrets-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
    $content | Out-File -FilePath $outputFile -Encoding UTF8
    Write-Host "`nSecrets saved to: $outputFile" -ForegroundColor Green
    Write-Host "Remember to delete this file after copying to production!`n" -ForegroundColor Red
}
