# PowerShell Sync Script for Search Enhancements & Command Palette Rich Discovery
$ErrorActionPreference = "Stop"

$SourceDir = Join-Path $PSScriptRoot "staged_scholarvault_webapp"
$PreviewDir = "C:\Users\Shyam\Scholar Vault 2\ScholarVault Web App v2\.codex-deploy\preview"

Write-Host "Syncing Search Enhancements & Discovery updates to ScholarVault Web App v2 Preview..." -ForegroundColor Cyan

$FilesToSync = @(
    "src\features\portal\PortalShell.tsx",
    "src\features\portal\researcher-workspace\SCVSWorkspace.tsx",
    "src\features\portal\verify-search-enhancements.mjs"
)

foreach ($rel in $FilesToSync) {
    $src = Join-Path $SourceDir $rel
    if (Test-Path -LiteralPath $src) {
        $destPreview = Join-Path $PreviewDir $rel
        $folderPreview = [System.IO.Path]::GetDirectoryName($destPreview)
        if (!(Test-Path -LiteralPath $folderPreview)) { 
            New-Item -ItemType Directory -Path $folderPreview -Force | Out-Null 
        }
        Copy-Item -LiteralPath $src -Destination $destPreview -Force
        Write-Host "  [OK -> Preview] $rel" -ForegroundColor Green
    } else {
        Write-Warning "Source file not found: $src"
    }
}

Write-Host "`nAll search enhancement files synced successfully to Preview directory!" -ForegroundColor Green
