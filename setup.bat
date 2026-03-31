@echo off
cd /d %~dp0
echo ==========================================
echo Wikifile-Transfer Project Global Setup
echo ==========================================
echo.
echo Navigating to frontend...
cd wikifile-transfer-frontend
call setup.bat
cd ..
echo Global Setup Complete.
pause
