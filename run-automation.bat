@echo off
echo.
echo ========================================
echo   AUTOMAÇÃO WEB - 2 SCRIPTS
echo ========================================
echo.

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js nao encontrado!
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo.

REM Fechar Chrome existente  
echo 🔄 Fechando Chrome existente...
taskkill /f /im chrome.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM SCRIPT 1: Automação Playwright (abre, faz login, navega) - BACKGROUND
echo 🎬 SCRIPT 1: Iniciando Playwright em background...
start /MIN node "scripts\1-playwright-automation.js"

REM Aguardar janelas ficarem prontas
echo ⏳ Aguardando TODAS as 3 janelas ficarem prontas...
:wait_loop
timeout /t 3 /nobreak >nul
powershell -Command "$windows = Get-Process | Where-Object {$_.ProcessName -eq 'chrome' -and ($_.MainWindowTitle -like '*Dashboard*' -or $_.MainWindowTitle -like '*Perfil*' -or $_.MainWindowTitle -like '*Staging*')}; Write-Host 'Janelas encontradas:' $windows.Count; if ($windows.Count -ge 3) { exit 0 } else { exit 1 }" >nul 2>&1
if errorlevel 1 (
    echo   Aguardando todas as 3 janelas... tentando novamente
    goto wait_loop
)

echo ✅ Todas as 3 janelas detectadas!
echo ⏳ Aguardando carregamento completo das páginas (5 segundos)...
timeout /t 5 /nobreak >nul
echo.

REM SCRIPT 2: Organizar janelas verticalmente  
echo 📐 SCRIPT 2: Organizando janelas verticalmente...
powershell -ExecutionPolicy Bypass -File "scripts\2-organize-windows.ps1"
if errorlevel 1 (
    echo ❌ Erro ao organizar janelas
    pause
    exit /b 1
)

echo.
echo ✅ AUTOMAÇÃO COMPLETA FINALIZADA!
echo.
echo 🎯 Resultado:
echo    ┌─────────────────────────────────────┐
echo    │ TOPO    - Dashboard                 │
echo    ├─────────────────────────────────────┤  
echo    │ MEIO    - Perfil                    │
echo    ├─────────────────────────────────────┤
echo    │ BAIXO   - Staging                   │
echo    └─────────────────────────────────────┘
echo.
echo 💡 As janelas estão logadas e organizadas verticalmente!
echo ⚠️  O Playwright continua rodando em background
echo    Para fechar completamente: taskkill /f /im node.exe
echo.
pause
