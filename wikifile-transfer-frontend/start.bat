@echo off
cd /d %~dp0
echo ==========================================
echo Starting Wikifile-Transfer Frontend (MOCK MODE)
echo ==========================================
set VITE_USE_MOCK=true
npm run dev
pause
