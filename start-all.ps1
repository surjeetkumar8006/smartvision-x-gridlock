# SmartVision X - Unified Start Script for Windows

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   SmartVision X: Unified Installation & Start" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# 1. Install & Start Backend
Write-Host "`n[1/4] Configuring Backend Engine..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\backend"
npm install

Write-Host "`n[2/4] Starting REST API Server in the background..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/c npm start" -WindowStyle Hidden

# 2. Install & Start Frontend
Write-Host "`n[3/4] Configuring React (Vite) Frontend..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\frontend"
npm install

Write-Host "`n[4/4] Launching Web Application. Happy Hacking!" -ForegroundColor Green
npm run dev
