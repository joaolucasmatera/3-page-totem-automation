# Organizador de Janelas Web
Write-Host "Organizador de Janelas Web - VERSAO CORRIGIDA" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# APIs do Windows
$signature = @'
[DllImport("user32.dll")]
public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);
[DllImport("user32.dll")]
public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
[DllImport("user32.dll")]
public static extern bool IsZoomed(IntPtr hWnd);
[DllImport("user32.dll")]
public static extern bool BringWindowToTop(IntPtr hWnd);
[DllImport("user32.dll")]
public static extern bool SetForegroundWindow(IntPtr hWnd);
'@

Add-Type -MemberDefinition $signature -Name Win32API -Namespace Win32
Add-Type -AssemblyName System.Windows.Forms

# Calcular resolucao da tela
$screen = [System.Windows.Forms.Screen]::PrimaryScreen
$screenWidth = $screen.WorkingArea.Width
$screenHeight = $screen.WorkingArea.Height
$windowWidth = $screenWidth
$windowHeight = [math]::Floor($screenHeight / 3)

Write-Host "Resolucao da tela: $screenWidth x $screenHeight" -ForegroundColor Cyan
Write-Host "Tamanho por janela: $windowWidth x $windowHeight" -ForegroundColor Cyan

# Encontrar janelas Chrome
$windows = Get-Process | Where-Object {
    $_.ProcessName -eq "chrome" -and 
    $_.MainWindowHandle -ne 0 -and 
    ($_.MainWindowTitle -like "*Dashboard*" -or 
     $_.MainWindowTitle -like "*Perfil*" -or 
     $_.MainWindowTitle -like "*Staging*")
}

if ($windows.Count -eq 0) {
    Write-Host "ERRO: Nenhuma janela encontrada!" -ForegroundColor Red
    exit 1
}

# Ordenar janelas
$orderedWindows = @()
$dashboardWindow = $windows | Where-Object { $_.MainWindowTitle -like "*Dashboard*" }
$perfilWindow = $windows | Where-Object { $_.MainWindowTitle -like "*Perfil*" }
$stagingWindow = $windows | Where-Object { $_.MainWindowTitle -like "*Staging*" }

if ($dashboardWindow) { $orderedWindows += $dashboardWindow }
if ($perfilWindow) { $orderedWindows += $perfilWindow }
if ($stagingWindow) { $orderedWindows += $stagingWindow }

Write-Host ""
Write-Host "Encontradas $($orderedWindows.Count) janelas" -ForegroundColor Green

# Posicoes das janelas
$positions = @(
    @{ X = 0; Y = 0; Name = "TOPO (Dashboard)" },
    @{ X = 0; Y = $windowHeight; Name = "MEIO (Perfil)" }, 
    @{ X = 0; Y = ($windowHeight * 2); Name = "BAIXO (Staging)" }
)

# Organizar cada janela
for ($i = 0; $i -lt [Math]::Min($orderedWindows.Count, 3); $i++) {
    $window = $orderedWindows[$i]
    $pos = $positions[$i]
    $windowNum = $i + 1
    
    Write-Host ""
    Write-Host "JANELA $windowNum ($($pos.Name)): $($window.MainWindowTitle)" -ForegroundColor Cyan
    
    # Verificar se maximizada
    $isMaximized = [Win32.Win32API]::IsZoomed($window.MainWindowHandle)
    Write-Host "  Status maximizada: $isMaximized" -ForegroundColor Yellow
    
    # Desmaximir se necessario
    if ($isMaximized) {
        Write-Host "  Desmaxizando janela..." -ForegroundColor Yellow
        $restoreResult = [Win32.Win32API]::ShowWindow($window.MainWindowHandle, 1)
        Write-Host "  Resultado: $restoreResult" -ForegroundColor White
        Start-Sleep -Milliseconds 300
    }
    
    # Posicionar janela
    Write-Host "  Posicionando em: ($($pos.X), $($pos.Y)) ${windowWidth}x${windowHeight}" -ForegroundColor Yellow
    $moveResult = [Win32.Win32API]::SetWindowPos(
        $window.MainWindowHandle,
        [IntPtr]::Zero,
        $pos.X,
        $pos.Y,
        $windowWidth,
        $windowHeight,
        0x0040
    )
    
    # Trazer janela para frente
    if ($moveResult) {
        Write-Host "  Trazendo janela para frente..." -ForegroundColor Yellow
        $bringToTopResult = [Win32.Win32API]::BringWindowToTop($window.MainWindowHandle)
        $setForegroundResult = [Win32.Win32API]::SetForegroundWindow($window.MainWindowHandle)
        
        Write-Host "  SUCESSO! Janela $windowNum posicionada e trazida para frente!" -ForegroundColor Green
        Write-Host "    BringToTop: $bringToTopResult, SetForeground: $setForegroundResult" -ForegroundColor White
    } else {
        Write-Host "  ERRO ao posicionar janela $windowNum!" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 200
}

Write-Host ""
Write-Host "ORGANIZACAO FINALIZADA!" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

# Etapa final: garantir que todas as janelas estejam visíveis
Write-Host ""
Write-Host "Garantindo que todas as janelas estejam visíveis..." -ForegroundColor Cyan
for ($i = 0; $i -lt [Math]::Min($orderedWindows.Count, 3); $i++) {
    $window = $orderedWindows[$i]
    $windowNum = $i + 1
    
    Write-Host "  Trazendo janela $windowNum para frente: $($window.MainWindowTitle)" -ForegroundColor Yellow
    [Win32.Win32API]::BringWindowToTop($window.MainWindowHandle)
    [Win32.Win32API]::SetForegroundWindow($window.MainWindowHandle)
    Start-Sleep -Milliseconds 150
}

Write-Host ""
Write-Host "Layout aplicado:"
Write-Host "  TOPO    - Dashboard"
Write-Host "  MEIO    - Perfil"
Write-Host "  BAIXO   - Staging"
Write-Host "Todas as janelas organizadas verticalmente e visíveis!" -ForegroundColor Green
