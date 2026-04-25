@echo off
chcp 65001 >nul
title Enviar projeto para GitHub
cls

echo ==========================================
echo  ENVIAR PROJETO PARA GITHUB AUTOMATICO
echo ==========================================
echo.

REM Verifica se o Git existe
if exist "C:\Program Files\Git\bin\git.exe" (
    set GIT="C:\Program Files\Git\bin\git.exe"
) else (
    echo [ERRO] Git nao encontrado!
    echo Instale o Git primeiro.
    pause
    exit /b 1
)

echo [OK] Git encontrado
%GIT% --version
echo.

REM Pergunta o URL do repositório
set /p REPO_URL="Digite o URL do seu repositorio GitHub (ex: https://github.com/seuusuario/imperio-modas.git): "

if "%REPO_URL%"=="" (
    echo [ERRO] Voce precisa digitar o URL!
    pause
    exit /b 1
)

echo.
echo [1/4] Configurando repositorio remoto...
%GIT% remote remove origin 2>nul
%GIT% remote add origin %REPO_URL%

%GIT% branch -M main

echo [2/4] Enviando codigo para GitHub...
%GIT% push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha ao enviar!
    echo.
    echo Possiveis causas:
    echo - Repositorio nao existe no GitHub
    echo - URL incorreto
    echo - Nao esta logado no GitHub no navegador
    echo - Precisa criar um Token de Acesso Pessoal
    echo.
    echo Para criar um token:
    echo 1. Va em https://github.com/settings/tokens
    echo 2. Clique "Generate new token (classic)"
    echo 3. Marque a opcao "repo"
    echo 4. Copie o token e use como senha quando pedir
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo [SUCESSO] Codigo enviado para GitHub!
echo ==========================================
echo.
echo Agora va no Render e conecte seu repositorio.
echo.
pause

