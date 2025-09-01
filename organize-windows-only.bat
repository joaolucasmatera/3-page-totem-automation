@echo off
echo.
echo ========================================
echo   ORGANIZADOR DE JANELAS CHROME
echo ========================================
echo.

REM Verificar se há janelas Chrome abertas
echo 🔍 Verificando janelas Chrome abertas...
powershell -Command "$windows = Get-Process | Where-Object {$_.ProcessName -eq 'chrome' -and $_.MainWindowHandle -ne 0 -and ($_.MainWindowTitle -like '*Dashboard*' -or $_.MainWindowTitle -like '*Perfil*' -or $_.MainWindowTitle -like '*Staging*')}; Write-Host 'Janelas encontradas:' $windows.Count; if ($windows.Count -eq 0) { Write-Host 'Nenhuma janela Chrome relevante encontrada!' -ForegroundColor Red; exit 1 } else { Write-Host 'Encontradas' $windows.Count 'janelas Chrome' -ForegroundColor Green; exit 0 }" 

if errorlevel 1 (
    echo.
    echo ❌ ERRO: Nenhuma janela Chrome encontrada!
    echo    As janelas devem conter os termos: Dashboard, Perfil ou Staging
    echo.
    echo 💡 Certifique-se de que as janelas do Chrome estão abertas
    echo    com os títulos corretos antes de executar este organizador.
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Janelas Chrome encontradas!

REM Executar o organizador de janelas
echo 📐 Organizando janelas verticalmente...
powershell -ExecutionPolicy Bypass -File "scripts\2-organize-windows.ps1"
if errorlevel 1 (
    echo ❌ Erro ao organizar janelas
    pause
    exit /b 1
)

echo.
echo ✅ ORGANIZAÇÃO COMPLETA!
echo.
echo 🎯 Layout aplicado:
echo    ┌─────────────────────────────────────┐
echo    │ TOPO    - Dashboard                 │
echo    ├─────────────────────────────────────┤  
echo    │ MEIO    - Perfil                    │
echo    ├─────────────────────────────────────┤
echo    │ BAIXO   - Staging                   │
echo    └─────────────────────────────────────┘
echo.
echo 💡 As janelas foram organizadas verticalmente!
echo.
pause