$body = @{
    name = "Test User"
    email = "test@example.com"
    subject = "Test Subject"
    message = "This is a test message to verify the API is working"
} | ConvertTo-Json

Write-Host "Testing Contact API..." -ForegroundColor Cyan
Write-Host "Sending request to http://localhost:3000/api/contact" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/contact" -Method POST -ContentType "application/json" -Body $body -ErrorAction Stop
    
    Write-Host "`n✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10
}
catch {
    Write-Host "`n❌ ERROR!" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails) {
        Write-Host "`nError Details:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message
    }
    
    if ($_.Exception.Response) {
        Write-Host "`nResponse Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
    }
}
