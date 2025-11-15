# PowerShell script to add dynamic export to all API routes
# Run this in PowerShell: .\scripts\add-dynamic-export.ps1

Write-Host "Adding 'export const dynamic = force-dynamic' to all API routes..." -ForegroundColor Cyan

$apiRoutes = Get-ChildItem -Path "src\app\api" -Filter "route.ts" -Recurse

$updatedCount = 0
$skippedCount = 0

foreach ($file in $apiRoutes) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if already has dynamic export
    if ($content -match "export const dynamic") {
        Write-Host "✓ $($file.FullName) already has dynamic export" -ForegroundColor Green
        $skippedCount++
        continue
    }
    
    # Check if file uses cookies or auth
    if ($content -match "(cookies|requireAuth|verifyAuth)") {
        Write-Host "📝 Adding dynamic export to $($file.FullName)" -ForegroundColor Yellow
        
        # Find the position after imports and before first export function
        $lines = Get-Content $file.FullName
        $insertIndex = -1
        
        for ($i = 0; $i -lt $lines.Length; $i++) {
            if ($lines[$i] -match "^export (async )?function") {
                $insertIndex = $i
                break
            }
        }
        
        if ($insertIndex -gt 0) {
            # Insert the dynamic export
            $newLines = @()
            $newLines += $lines[0..($insertIndex-1)]
            $newLines += ""
            $newLines += "// Force dynamic rendering for this route"
            $newLines += "export const dynamic = 'force-dynamic';"
            $newLines += ""
            $newLines += $lines[$insertIndex..($lines.Length-1)]
            
            # Write back to file
            $newLines | Set-Content $file.FullName
            Write-Host "✅ Added to $($file.FullName)" -ForegroundColor Green
            $updatedCount++
        }
    } else {
        Write-Host "⊘ $($file.FullName) doesn't need dynamic export" -ForegroundColor Gray
        $skippedCount++
    }
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Updated: $updatedCount files" -ForegroundColor Green
Write-Host "  Skipped: $skippedCount files" -ForegroundColor Yellow
Write-Host "Done!" -ForegroundColor Cyan
