@echo off
chcp 65001 >nul 2>nul
title Limpando Cache
echo.
echo ================================================
echo         LIMPANDO CACHE DO PROJETO
echo ================================================
echo.

if exist ".next" (
    echo Removendo pasta .next...
    rmdir /s /q ".next"
    echo [OK] Pasta .next removida
) else (
    echo [OK] Pasta .next nao existe
)

echo.
echo ================================================
echo    CACHE LIMPO! Agora execute iniciar.bat
echo ================================================
echo.
pause
