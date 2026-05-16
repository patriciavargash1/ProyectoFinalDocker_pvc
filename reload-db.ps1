# Script para recargar la base de datos
Write-Host "Deteniendo contenedores y eliminando volúmenes..." -ForegroundColor Yellow
docker compose down -v

Write-Host "Esperando 3 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Levantando los servicios nuevamente..." -ForegroundColor Green
docker compose up -d

Write-Host "Base de datos recargada exitosamente" -ForegroundColor Green
