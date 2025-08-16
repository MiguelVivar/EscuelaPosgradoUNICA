# Script PowerShell para configurar variables de entorno de Mailtrap en Docker
# Ejecutar desde la raíz del proyecto: .\setup-mailtrap.ps1

Write-Host "🔧 Configurando variables de entorno de Mailtrap para Docker..." -ForegroundColor Cyan

# Verificar si existe docker-compose.yml
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "❌ Error: docker-compose.yml no encontrado. Ejecutar desde la raíz del proyecto." -ForegroundColor Red
    exit 1
}

# Solicitar credenciales de Mailtrap
$mailtrap_user = Read-Host "Ingresa tu MAILTRAP_USER (obtén de tu cuenta Mailtrap)"
$secure_password = Read-Host "Ingresa tu MAILTRAP_PASSWORD" -AsSecureString
$mailtrap_password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure_password))

Write-Host "📝 Configurando .env principal..." -ForegroundColor Yellow

# Crear/actualizar .env en la raíz del proyecto
$envContent = @"
# Variables de entorno para Docker Compose
# Configuración de Mailtrap
MAILTRAP_USER=$mailtrap_user
MAILTRAP_PASSWORD=$mailtrap_password
MAILTRAP_FROM_EMAIL=noreply@unica.edu.pe

# URLs base
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080

# Variables de base de datos
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=escuelaposgrado
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host "📝 Configurando .env para frontend..." -ForegroundColor Yellow

# Crear/actualizar .env en frontend/ para desarrollo local
$frontendEnvContent = @"
# Variables de entorno para desarrollo local (sin Docker)
MAILTRAP_USER=$mailtrap_user
MAILTRAP_PASSWORD=$mailtrap_password
MAILTRAP_FROM_EMAIL=noreply@unica.edu.pe
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
"@

$frontendEnvContent | Out-File -FilePath "frontend/.env" -Encoding UTF8

Write-Host "✅ Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Reiniciar contenedores: docker-compose down; docker-compose up --build"
Write-Host "2. Probar en: http://localhost:3000/debug-mailtrap"
Write-Host "3. Para desarrollo sin Docker: cd frontend; pnpm dev"
Write-Host ""
Write-Host "🔍 Para debugging:" -ForegroundColor Cyan
Write-Host "- Ver logs del contenedor: docker-compose logs frontend"
Write-Host "- Conectar al contenedor: docker exec -it (docker-compose ps -q frontend) sh"
Write-Host "- Verificar variables: docker exec -it (docker-compose ps -q frontend) printenv | findstr MAILTRAP"
