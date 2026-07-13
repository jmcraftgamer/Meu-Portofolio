Write-Host "============================================" -ForegroundColor Yellow
Write-Host "        DevPro Portfolio - Iniciando..." -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "[1/2] Iniciando servidor backend (porta 3001)..." -ForegroundColor Cyan
$server = Start-Process -FilePath "npx" -ArgumentList "tsx src/index.ts" -WorkingDirectory "$PSScriptRoot\server" -NoNewWindow -PassThru

Start-Sleep -Seconds 3

Write-Host "[2/2] Iniciando frontend (porta 5173)..." -ForegroundColor Cyan
$frontend = Start-Process -FilePath "npx" -ArgumentList "vite --host" -WorkingDirectory "$PSScriptRoot\portfolio" -NoNewWindow -PassThru

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host " Site iniciado!" -ForegroundColor Green
Write-Host " Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host " Backend:  http://localhost:3001" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Login Admin: administrador@gmail.com" -ForegroundColor Magenta
Write-Host ""
Write-Host "Pressione qualquer tecla para parar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Stop-Process -Id $server.Id -Force
Stop-Process -Id $frontend.Id -Force
