@echo off
title Iniciar Loja Local
cd /d %~dp0

echo ==========================================
echo  IMPERIO MODAS - Iniciando servidor...  
echo ==========================================
echo.

REM Verifica se node_modules existe
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo ERRO: Falha ao instalar dependencias.
        pause
        exit /b 1
    )
) else (
    echo Dependencias ja instaladas.
)

echo.
echo Iniciando servidor Next.js...
start "Servidor Next.js" /min cmd /c "npm run dev"

echo Aguardando servidor iniciar...
timeout /t 5 /nobreak >nul

echo Abrindo navegador...
start "" "http://localhost:3000"

echo.
echo ==========================================
echo  Servidor rodando em http://localhost:3000
echo  Pressione qualquer tecla para encerrar  
echo ==========================================
pause >nul

echo Encerrando servidor...
taskkill /FI "WINDOWTITLE eq Servidor Next.js" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq c:\WINDOWS\system32\cmd.exe - npm run dev" /F >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1

echo Servidor encerrado.
timeout /t 2 /nobreak >nul
