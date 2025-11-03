Write-Host "🔍 Testing Contact Form API with Neon..." -ForegroundColor Cyan
Write-Host ""

$testData = @{
    name = "Test User"
    email = "test@example.com"
    phone = "08123456789"
    subject = "Testing"
    message = "Test message for contact form"
} | ConvertTo-Json

Write-Host "📤 Sending request to API..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/contact" -Method POST -ContentType "application/json" -Body $testData -UseBasicParsing

    Write-Host "✅ SUCCESS! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    Write-Host $response.Content -ForegroundColor White
    Write-Host ""
    Write-Host "🎉 Contact form is working perfectly!" -ForegroundColor Green
}
catch {
    Write-Host "❌ ERROR! Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        Write-Host "Error Response:" -ForegroundColor Yellow
        Write-Host $body -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "💡 TO FIX:" -ForegroundColor Yellow
    Write-Host "1. Go to https://console.neon.tech" -ForegroundColor White
    Write-Host "2. Click 'SQL Editor'" -ForegroundColor White
    Write-Host "3. Run the SQL from FIX_NEON_MIGRATION.md" -ForegroundColor White
}
