Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   NEON DATABASE - QUICK CHECK" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check .env.local
Write-Host "1️⃣  Checking DATABASE_URL..." -ForegroundColor Yellow

$envContent = Get-Content .env.local -Raw

if ($envContent -match 'DATABASE_URL=postgresql://.*neon\.tech') {
    Write-Host "   ✅ DATABASE_URL configured for Neon" -ForegroundColor Green
    
    # Extract (hide password)
    if ($envContent -match 'DATABASE_URL=(postgresql://[^:]+:)[^@]+(@.+)') {
        $maskedUrl = $matches[1] + "****" + $matches[2]
        Write-Host "   📍 $maskedUrl" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ DATABASE_URL not configured for Neon!" -ForegroundColor Red
    Write-Host "   💡 Check .env.local file" -ForegroundColor Yellow
}

Write-Host ""

# Check migration file
Write-Host "2️⃣  Checking migration file..." -ForegroundColor Yellow

if (Test-Path "migrations\0001_friendly_iron_lad.sql") {
    Write-Host "   ✅ Migration file exists" -ForegroundColor Green
    Write-Host "   📁 migrations\0001_friendly_iron_lad.sql" -ForegroundColor Gray
    
    $sqlContent = Get-Content "migrations\0001_friendly_iron_lad.sql" -Raw
    if ($sqlContent -match 'CREATE TABLE.*contact_submission') {
        Write-Host "   ✅ Contains contact_submission table" -ForegroundColor Green
    }
} else {
    Write-Host "   ❌ Migration file NOT found!" -ForegroundColor Red
}

Write-Host ""

# Check server
Write-Host "3️⃣  Checking server status..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ Server is running on port 3000" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Server is NOT running!" -ForegroundColor Red
    Write-Host "   💡 Run: npm run dev" -ForegroundColor Yellow
}

Write-Host ""

# Test API
Write-Host "4️⃣  Testing API endpoint..." -ForegroundColor Yellow

try {
    $testData = @{
        name = "Quick Test"
        email = "quicktest@example.com"
        phone = "08123456789"
        subject = "Quick Test"
        message = "Testing if API works after Neon migration applied"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/contact" `
        -Method POST `
        -ContentType "application/json" `
        -Body $testData `
        -UseBasicParsing `
        -ErrorAction Stop

    if ($response.StatusCode -eq 201) {
        Write-Host "   ✅ API WORKS! Status: 201 Created" -ForegroundColor Green
        
        $result = $response.Content | ConvertFrom-Json
        if ($result.success) {
            Write-Host "   ✅ Database INSERT successful!" -ForegroundColor Green
            Write-Host "   📊 Submission ID: $($result.data.id)" -ForegroundColor Gray
        }
        
        Write-Host ""
        Write-Host "🎉 SUCCESS! Everything is working!" -ForegroundColor Green
        Write-Host ""
        Write-Host "✅ Database: Connected" -ForegroundColor Green
        Write-Host "✅ Migration: Applied" -ForegroundColor Green
        Write-Host "✅ Table: contact_submission exists" -ForegroundColor Green
        Write-Host "✅ API: Working" -ForegroundColor Green
        Write-Host "✅ Form: Ready to use!" -ForegroundColor Green
        
    } else {
        Write-Host "   ⚠️  Unexpected status: $($response.StatusCode)" -ForegroundColor Yellow
    }
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    Write-Host "   ❌ API Error: Status $statusCode" -ForegroundColor Red
    Write-Host ""
    
    if ($statusCode -eq 500) {
        Write-Host "💡 LIKELY CAUSE: Table not created in Neon!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "TO FIX:" -ForegroundColor Cyan
        Write-Host "1. Open https://console.neon.tech" -ForegroundColor White
        Write-Host "2. Go to SQL Editor" -ForegroundColor White
        Write-Host "3. Paste & run this SQL:" -ForegroundColor White
        Write-Host ""
        Write-Host "CREATE TABLE IF NOT EXISTS ""contact_submission"" (" -ForegroundColor Gray
        Write-Host "  ""id"" serial PRIMARY KEY NOT NULL," -ForegroundColor Gray
        Write-Host "  ""name"" text NOT NULL," -ForegroundColor Gray
        Write-Host "  ""email"" text NOT NULL," -ForegroundColor Gray
        Write-Host "  ""phone"" text," -ForegroundColor Gray
        Write-Host "  ""subject"" text NOT NULL," -ForegroundColor Gray
        Write-Host "  ""message"" text NOT NULL," -ForegroundColor Gray
        Write-Host "  ""status"" text DEFAULT 'new' NOT NULL," -ForegroundColor Gray
        Write-Host "  ""created_at"" timestamp DEFAULT now() NOT NULL," -ForegroundColor Gray
        Write-Host "  ""resolved_at"" timestamp" -ForegroundColor Gray
        Write-Host ");" -ForegroundColor Gray
        Write-Host ""
        Write-Host "4. Run this script again" -ForegroundColor White
    } elseif ($statusCode -eq 400) {
        Write-Host "💡 LIKELY CAUSE: Validation error" -ForegroundColor Yellow
    } else {
        Write-Host "💡 Check error details above" -ForegroundColor Yellow
    }
    
    # Try to show error response
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host ""
            Write-Host "Error Response:" -ForegroundColor Red
            Write-Host $responseBody -ForegroundColor White
        } catch {}
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
