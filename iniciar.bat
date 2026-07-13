@echo off
title DevPro Portfolio

echo ============================================
echo        DevPro Portfolio - Iniciando...
echo ============================================
echo.

echo [1/2] Iniciando servidor backend (porta 3001)...
start "Servidor" cmd /c "cd /d %~dp0server && npx tsx src/index.ts"

timeout /t 3 /nobreak >nul

echo [2/2] Iniciando frontend (porta 5173)...
start "Frontend" cmd /c "cd /d %~dp0portfolio && npx vite --host"

echo.
echo ============================================
echo  Site iniciado!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:3001
echo ============================================
echo.
pause
