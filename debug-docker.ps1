# Script para diagnosticar problemas con Docker Compose
# Ejecutar desde el directorio raíz del proyecto

Write-Host "============================================" -ForegroundColor Green
Write-Host "Diagnóstico de Docker Compose" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

# 0. Verificar archivos críticos
Write-Host "0. Verificando archivos críticos..." -ForegroundColor Yellow
$files = @(
    ".\docker-compose.yml",
    ".\backend\Autenticacion\Dockerfile",
    ".\backend\Autenticacion\docker-entrypoint.sh"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✓ $file existe" -ForegroundColor Green
    } else {
        Write-Host "✗ $file NO EXISTE" -ForegroundColor Red
    }
}

# Convertir line endings del script de entrada
Write-Host "0.1. Convirtiendo line endings de docker-entrypoint.sh..." -ForegroundColor Yellow
$scriptPath = ".\backend\Autenticacion\docker-entrypoint.sh"
if (Test-Path $scriptPath) {
    $content = Get-Content $scriptPath -Raw
    $content = $content -replace "`r`n", "`n"
    $content = $content -replace "`r", "`n"
    [System.IO.File]::WriteAllText((Resolve-Path $scriptPath), $content, [System.Text.Encoding]::UTF8)
    Write-Host "✓ Line endings convertidos" -ForegroundColor Green
}

# 1. Limpiar contenedores previos
Write-Host "1. Limpiando contenedores previos..." -ForegroundColor Yellow
docker-compose down -v

# 2. Limpiar imágenes
Write-Host "2. Eliminando imágenes antiguas..." -ForegroundColor Yellow
docker system prune -f

# 3. Reconstruir las imágenes
Write-Host "3. Reconstruyendo imágenes..." -ForegroundColor Yellow
docker-compose build --no-cache

# 4. Iniciar servicios uno por uno para debugging
Write-Host "4. Iniciando base de datos..." -ForegroundColor Yellow
docker-compose up -d db

# Esperar a que la DB esté lista
Start-Sleep -Seconds 30

Write-Host "5. Verificando estado de la base de datos..." -ForegroundColor Yellow
docker-compose logs db

Write-Host "6. Iniciando microservicio de autenticación..." -ForegroundColor Yellow
docker-compose up -d autenticacion

# Esperar y mostrar logs
Start-Sleep -Seconds 20
Write-Host "7. Mostrando logs del microservicio de autenticación..." -ForegroundColor Yellow
docker-compose logs autenticacion

Write-Host "8. Estado de los contenedores:" -ForegroundColor Yellow
docker-compose ps

Write-Host "============================================" -ForegroundColor Green
Write-Host "Para ver logs en tiempo real, ejecuta:" -ForegroundColor Green
Write-Host "docker-compose logs -f autenticacion" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Green
