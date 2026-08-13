@echo off
cd /d "%~dp0"
set "EXPO_PUBLIC_API_BASE_URL=https://medbangladesh.com/api"
echo Using live API: %EXPO_PUBLIC_API_BASE_URL%
npx.cmd expo start --tunnel --clear
