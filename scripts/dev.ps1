# Start ESC development environment (Postgres + API in Docker, Next.js apps locally).
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

Write-Host "Stopping production Docker stack (if running)..." -ForegroundColor Yellow
docker compose down 2>$null

Write-Host "Starting Postgres + Backend (hot reload)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root'; docker compose -f docker-compose.dev.yml up" -WindowStyle Normal

Write-Host "Waiting for API..." -ForegroundColor Gray
Start-Sleep -Seconds 12

Write-Host "Starting frontends on ports 3000, 3001, 3002..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\apps\public-web'; npm run dev -- --port 3000" -WindowStyle Normal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\apps\user-portal'; npm run dev -- --port 3001" -WindowStyle Normal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\apps\admin-panel'; npm run dev -- --port 3002" -WindowStyle Normal

Write-Host ""
Write-Host "Development URLs:" -ForegroundColor Green
Write-Host "  Public web:  http://localhost:3000"
Write-Host "  User portal: http://localhost:3001"
Write-Host "  Admin panel: http://localhost:3002"
Write-Host "  API / docs:  http://localhost:8000/docs"
Write-Host ""
Write-Host "Save files to reload — no Docker rebuild needed for frontends." -ForegroundColor Gray
