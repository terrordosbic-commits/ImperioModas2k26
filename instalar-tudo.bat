@echo off
chcp 65001 >nul
title Instalador - Imperio Modas
cls

echo ============================================
echo   INSTALADOR AUTOMATICO
echo   Imperio Modas - Deploy Netlify
echo ============================================
echo.
echo Vou verificar e instalar tudo que voce precisa.
echo Nao feche esta janela!
echo.
pause
cls

REM ============================================
REM 1. NODE.JS
REM ============================================
echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js NAO encontrado no seu computador.
    echo.
    echo Vou abrir o site do Node.js para voce baixar.
    echo Passos:
    echo 1. Clique no botao VERDE "LTS"
    echo 2. Execute o arquivo baixado
    echo 3. Clique "Next" ate terminar (aceite os padroes)
    echo 4. REABRA este script depois de instalar
    echo.
    start https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%a in ('node --version') do echo ✅ Node.js encontrado: %%a

REM ============================================
REM 2. GIT
REM ============================================
echo.
echo [2/5] Verificando Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git NAO encontrado no seu computador.
    echo.
    echo Vou abrir o site do Git para voce baixar.
    echo Passos:
    echo 1. Baixe a versao para Windows
    echo 2. Execute o instalador
    echo 3. Clique "Next" ate terminar (aceite os padroes)
    echo 4. REABRA este script depois de instalar
    echo.
    start https://git-scm.com/download/win
    pause
    exit /b 1
)
for /f "tokens=*" %%a in ('git --version') do echo ✅ Git encontrado: %%a

REM ============================================
REM 3. DEPENDENCIAS DO PROJETO
REM ============================================
echo.
echo [3/5] Instalando dependencias do projeto...
echo    (pode demorar 2-3 minutos na primeira vez)
echo.
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependencias.
    echo    Tente executar manualmente: npm install
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas com sucesso!

REM ============================================
REM 4. SUPABASE
REM ============================================
echo.
echo [4/5] Verificando Supabase...
if not exist "node_modules\@supabase\supabase-js" (
    echo    Instalando pacote do Supabase...
    call npm install @supabase/supabase-js
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar Supabase.
        pause
        exit /b 1
    )
)
echo ✅ Supabase instalado!

REM ============================================
REM 5. ARQUIVO DE CONFIGURACAO
REM ============================================
echo.
echo [5/5] Verificando arquivo de configuracao...
if not exist ".env.local" (
    echo    Criando .env.local a partir do modelo...
    copy .env.local.example .env.local >nul
    echo ✅ .env.local criado!
    echo.
    echo ⚠️  IMPORTANTE: Edite o arquivo .env.local
    echo    e coloque suas chaves do Supabase!
) else (
    echo ✅ .env.local ja existe.
)

REM ============================================
REM TESTE DE BUILD
REM ============================================
echo.
echo ============================================
echo   TESTANDO BUILD...
echo ============================================
echo    (verificando se o projeto compila)
echo.
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ❌ BUILD FALHOU!
    echo    Verifique os erros acima.
    pause
    exit /b 1
)

REM ============================================
REM FINAL
REM ============================================
cls
echo ============================================
echo   ✅ TUDO PRONTO!
echo ============================================
echo.
echo Seu projeto esta instalado e funcionando.
echo.
echo PROXIMOS PASSOS:
echo 1. Leia o arquivo PASSO-A-PASSO-DEPLOY.md
(echo    ele ensina a criar conta no Supabase e Netlify)
echo 2. Edite o arquivo .env.local com suas chaves
echo 3. Use o arquivo subir-github.bat para enviar pro GitHub
echo 4. Conecte no Netlify e faca o deploy!
echo.
echo Para testar localmente, execute:
echo    npm run dev
echo.
pause

