@echo off
chcp 65001 >nul
echo ============================================
echo   VERIFICACAO PRE-DEPLOY
echo ============================================
echo.

REM Verificar Node.js
echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js NAO encontrado!
    echo    Va em https://nodejs.org e instale a versao LTS.
    pause
    exit /b 1
)
for /f "tokens=*" %%a in ('node --version') do echo ✅ Node.js encontrado: %%a

echo.

REM Verificar se node_modules existe
echo [2/4] Verificando dependencias...
if not exist "node_modules" (
    echo ⚠️  Pasta node_modules nao encontrada.
    echo    Executando npm install...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar dependencias.
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencias instaladas.
)

echo.

REM Verificar se @supabase esta instalado
echo [3/4] Verificando Supabase...
if not exist "node_modules\@supabase\supabase-js" (
    echo ⚠️  Supabase nao instalado. Instalando...
    call npm install @supabase/supabase-js
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar Supabase.
        pause
        exit /b 1
    )
) else (
    echo ✅ Supabase instalado.
)

echo.

REM Verificar .env.local
echo [4/4] Verificando variaveis de ambiente...
if not exist ".env.local" (
    echo ⚠️  Arquivo .env.local NAO encontrado.
    echo    Criando a partir do modelo...
    copy .env.local.example .env.local >nul
    echo ✅ Modelo criado: .env.local
    echo    ⚠️  IMPORTANTE: Edite o arquivo .env.local e coloque suas chaves do Supabase!
) else (
    echo ✅ .env.local encontrado.
    findstr /C:"SUPABASE_URL" .env.local >nul
    if %errorlevel% equ 0 (
        echo    ✅ SUPABASE_URL configurado.
    ) else (
        echo    ❌ SUPABASE_URL NAO encontrado no .env.local
    )
)

echo.
echo ============================================
echo   VERIFICACAO CONCLUIDA
echo ============================================
echo.
echo Proximos passos:
echo 1. Edite o arquivo .env.local com suas chaves do Supabase
echo 2. Execute: npm run build
echo 3. Se o build passar, suba no GitHub e conecte no Netlify
echo.
echo Leia o arquivo PASSO-A-PASSO-DEPLOY.md para instrucoes detalhadas.
echo.
pause

