# Debug Contact Form API
Write-Host "🔍 Testing Contact Form API..." -ForegroundColor Cyan
Write-Host ""

# Wait for server to be ready
Write-Host "⏳ Waiting for server..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Test data
$testData = @{
    name = "Test User"
    email = "test@example.com"
    phone = "081234567890"
    subject = "Testing Contact Form"
    message = "This is a test message to verify the contact form API is working."
} | ConvertTo-Json

Write-Host "📤 Sending POST request..." -ForegroundColor Cyan
Write-Host "URL: http://localhost:3000/api/contact" -ForegroundColor Gray
Write-Host "Data: $testData" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/contact" `
        -Method POST `
        -ContentType "application/json" `
        -Body $testData `
        -UseBasicParsing

    Write-Host "✅ Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    Write-Host ""
    Write-Host "📥 Response:" -ForegroundColor Cyan
    Write-Host $response.Content -ForegroundColor White
    Write-Host ""
    Write-Host "✅ SUCCESS! Contact form is working!" -ForegroundColor Green
}
catch {
    Write-Host "❌ ERROR!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    Write-Host ""
    
    # Try to read error response
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "📥 Error Response:" -ForegroundColor Yellow
        Write-Host $responseBody -ForegroundColor White
        Write-Host ""
    }
    
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Possible causes:" -ForegroundColor Yellow
    Write-Host "  1. Migration not applied to Neon database" -ForegroundColor Gray
    Write-Host "  2. Database connection issue" -ForegroundColor Gray
    Write-Host "  3. Table 'contact_submission' does not exist" -ForegroundColor Gray
    Write-Host "  4. Validation error" -ForegroundColor Gray
}
