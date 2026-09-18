# PowerShell Sync Script for ScholarVault Configuration-Driven Conference Platform & Web Kit v2
$ErrorActionPreference = "Stop"

$SourceDir = Join-Path $PSScriptRoot "staged_scholarvault_webapp"
$TargetDir = "c:\Users\Shyam\Scholar Vault 2\ScholarVault Web App v2"

Write-Host "Syncing Conference Platform files into ScholarVault Web App v2..." -ForegroundColor Cyan
Write-Host "  Source: $SourceDir" -ForegroundColor Gray
Write-Host "  Target: $TargetDir" -ForegroundColor Gray

if (!(Test-Path $SourceDir)) {
    throw "Source directory not found: $SourceDir"
}

Get-ChildItem -Path $SourceDir -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Substring($SourceDir.Length).TrimStart("\")
    $destFile = Join-Path $TargetDir $relativePath
    $destFolder = Split-Path $destFile -Parent
    if (!(Test-Path $destFolder)) {
        New-Item -ItemType Directory -Path $destFolder -Force | Out-Null
    }
    Copy-Item -Path $_.FullName -Destination $destFile -Force
    Write-Host "  [OK] $relativePath" -ForegroundColor Green
}

Write-Host "Sync complete! Running TypeScript validation in ScholarVault Web App v2..." -ForegroundColor Cyan
Set-Location $TargetDir
npx tsc --noEmit
Write-Host "TypeScript check completed successfully!" -ForegroundColor Green
