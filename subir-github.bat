@echo off
chcp 65001 >nul
echo ============================================
echo   SUBIR PROJETO PARA O GITHUB
echo ============================================
echo.
echo Este script vai preparar seu projeto para o GitHub.
echo Voce precisa ja ter criado um repositorio em:
echo https://github.com/new
echo.
echo.

REM Verificar git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git NAO encontrado!
    echo    Va em https://git-scm.com/download/win e instale o Git.
    pause
    exit /b 1
)

REM Inicializar repositorio
if not exist ".git" (
    echo [1/4] Inicializando repositorio Git...
    git init
    git branch -M main
) else (
    echo [1/4] Repositorio Git ja existe.
)

echo.
echo [2/4] Adicionando arquivos...
git add .

echo.
echo [3/4] Criando commit...
git commit -m "deploy: adaptacao para Netlify + Supabase"

echo.
echo [4/4] Configuracao final...
echo.
echo ============================================
echo   AGORA E COM VOCE!
echo ============================================
echo.
echo Va em https://github.com/new e crie um repositorio novo.
echo Depois cole e execute os comandos que o GitHub vai te mostrar,
echo que vao ser mais ou menos assim:
echo.
echo    git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPO.git
echo    git push -u origin main
echo.
echo 💡 Dica: Copie os comandos exatos do GitHub, porque o link muda
echo    de acordo com o nome que voce escolher para o repositorio.
echo.
pause

