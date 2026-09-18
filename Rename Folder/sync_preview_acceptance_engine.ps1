# PowerShell Sync Script for Modality-Aware Acceptance Letter Engine
$ErrorActionPreference = "Stop"

$SourceDir = Join-Path $PSScriptRoot "staged_scholarvault_webapp"
$PreviewDir = "C:\Users\Shyam\Scholar Vault 2\ScholarVault Web App v2\.codex-deploy\preview"
$WebAppDir = "C:\Users\Shyam\Scholar Vault 2\ScholarVault Web App v2"

Write-Host "Syncing Acceptance Letter Engine updates to ScholarVault Web App v2 Preview..." -ForegroundColor Cyan

$FilesToSync = @(
    "src\features\conferences\acceptanceLetterEngine.ts",
    "src\app\conference\[slug]\submission\[reference]\page.tsx",
    "src\features\conferences\OrganizerAcceptanceLetterSettings.tsx",
    "src\app\api\conferences\[slug]\submissions\[reference]\acceptance-letter\route.ts"
)

foreach ($rel in $FilesToSync) {
    $src = Join-Path $SourceDir $rel
    if (Test-Path -LiteralPath $src) {
        # Copy to .codex-deploy\preview
        $destPreview = Join-Path $PreviewDir $rel
        $folderPreview = [System.IO.Path]::GetDirectoryName($destPreview)
        if (!(Test-Path -LiteralPath $folderPreview)) { New-Item -ItemType Directory -Path $folderPreview -Force | Out-Null }
        Copy-Item -LiteralPath $src -Destination $destPreview -Force
        Write-Host "  [OK -> Preview] $rel" -ForegroundColor Green

        # Also copy to root WebAppDir if present
        if (Test-Path -LiteralPath $WebAppDir) {
            $destRoot = Join-Path $WebAppDir $rel
            $folderRoot = [System.IO.Path]::GetDirectoryName($destRoot)
            if (!(Test-Path -LiteralPath $folderRoot)) { New-Item -ItemType Directory -Path $folderRoot -Force | Out-Null }
            Copy-Item -LiteralPath $src -Destination $destRoot -Force
            Write-Host "  [OK -> Root WebApp] $rel" -ForegroundColor Green
        }
    } else {
        Write-Warning "Source file not found: $src"
    }
}

Write-Host "Sync completed successfully!" -ForegroundColor Green
