@echo off
echo ========================================================
echo Applying ScholarVault Landing Page Updates
echo ========================================================
cd /d "%~dp0"
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Running deployment via Node.js...
    node apply_updates.js
) else (
    echo Running deployment via PowerShell...
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0apply_updates.ps1"
)
echo.
echo ========================================================
echo Update Execution Complete!
echo ========================================================
pause
