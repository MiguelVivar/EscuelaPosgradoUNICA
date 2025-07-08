# Script PowerShell para limpiar duplicados en la base de datos
# Uso: .\cleanup-duplicates.ps1

Write-Host "🧹 Iniciando limpieza de registros duplicados..." -ForegroundColor Green

# URL base del servicio de autenticación
$BaseUrl = "http://localhost:8081/api"

# Credenciales del administrador
$AdminUser = "admin"
$AdminPass = "admin123"

Write-Host "🔐 Obteniendo token de administrador..." -ForegroundColor Yellow

# Preparar datos de login
$LoginData = @{
    usernameOrEmail = $AdminUser
    password = $AdminPass
} | ConvertTo-Json

try {
    # Obtener token de administrador
    $LoginResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method POST -Body $LoginData -ContentType "application/json"
    
    if (-not $LoginResponse.token) {
        Write-Host "❌ Error: No se pudo obtener el token de administrador" -ForegroundColor Red
        Write-Host "Respuesta: $($LoginResponse | ConvertTo-Json)" -ForegroundColor Red
        exit 1
    }
    
    $Token = $LoginResponse.token
    Write-Host "✅ Token obtenido exitosamente" -ForegroundColor Green
    Write-Host "🧹 Ejecutando limpieza de duplicados..." -ForegroundColor Yellow
    
    # Preparar headers con el token
    $Headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/json"
    }
    
    # Ejecutar limpieza de duplicados
    $CleanupResponse = Invoke-RestMethod -Uri "$BaseUrl/admin/limpiar-duplicados" -Method POST -Headers $Headers
    
    Write-Host "📋 Respuesta de la limpieza:" -ForegroundColor Cyan
    Write-Host ($CleanupResponse | ConvertTo-Json -Depth 3) -ForegroundColor White
    
    if ($CleanupResponse.success) {
        Write-Host "✅ Proceso de limpieza completado exitosamente" -ForegroundColor Green
    } else {
        Write-Host "⚠️ La limpieza completó con advertencias: $($CleanupResponse.message)" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error durante el proceso: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorDetails = $_.Exception.Response | ConvertTo-Json -Depth 3
        Write-Host "Detalles del error: $errorDetails" -ForegroundColor Red
    }
}
