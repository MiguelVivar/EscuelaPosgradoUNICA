# Script para verificar la conectividad con Mailtrap
# Ejecutar desde la raíz del proyecto frontend

Write-Host "🔍 Verificando conectividad con Mailtrap..." -ForegroundColor Yellow

# Verificar variables de entorno
Write-Host "`n📋 Verificando variables de entorno..." -ForegroundColor Cyan
$envFile = ".env.local"
if (Test-Path $envFile) {
    Write-Host "✅ Archivo .env.local encontrado" -ForegroundColor Green
    $envContent = Get-Content $envFile
    
    $mailtrapUser = $envContent | Where-Object { $_ -match "MAILTRAP_USER=" }
    $mailtrapPass = $envContent | Where-Object { $_ -match "MAILTRAP_PASSWORD=" }
    
    if ($mailtrapUser) {
        Write-Host "✅ MAILTRAP_USER configurado" -ForegroundColor Green
    } else {
        Write-Host "❌ MAILTRAP_USER no encontrado en .env.local" -ForegroundColor Red
    }
    
    if ($mailtrapPass) {
        Write-Host "✅ MAILTRAP_PASSWORD configurado" -ForegroundColor Green
    } else {
        Write-Host "❌ MAILTRAP_PASSWORD no encontrado en .env.local" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Archivo .env.local no encontrado" -ForegroundColor Red
}

# Verificar conectividad de red
Write-Host "`n🌐 Verificando conectividad de red..." -ForegroundColor Cyan

# Test DNS resolution
try {
    $dnsResult = Resolve-DnsName -Name "sandbox.smtp.mailtrap.io" -ErrorAction Stop
    Write-Host "✅ DNS resuelto: $($dnsResult.IPAddress)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error resolviendo DNS: $($_.Exception.Message)" -ForegroundColor Red
}

# Test connectivity to different ports
$ports = @(2525, 587, 25)
foreach ($port in $ports) {
    Write-Host "`n🔌 Probando puerto $port..." -ForegroundColor Cyan
    
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $result = $tcpClient.BeginConnect("sandbox.smtp.mailtrap.io", $port, $null, $null)
        $success = $result.AsyncWaitHandle.WaitOne(5000)
        
        if ($success) {
            $tcpClient.EndConnect($result)
            Write-Host "✅ Puerto $port - CONECTADO" -ForegroundColor Green
        } else {
            Write-Host "❌ Puerto $port - TIMEOUT" -ForegroundColor Red
        }
        
        $tcpClient.Close()
    } catch {
        Write-Host "❌ Puerto $port - ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Sugerencias
Write-Host "`n💡 Sugerencias de troubleshooting:" -ForegroundColor Yellow
Write-Host "1. Verifica que las credenciales de Mailtrap sean correctas" -ForegroundColor White
Write-Host "2. Revisa si tu firewall está bloqueando los puertos SMTP" -ForegroundColor White
Write-Host "3. Intenta desde otra red (datos móviles, etc.)" -ForegroundColor White
Write-Host "4. Verifica tu cuenta de Mailtrap en https://mailtrap.io/" -ForegroundColor White
Write-Host "5. Considera usar un VPN si hay restricciones de ISP" -ForegroundColor White

Write-Host "`n🔗 Enlaces útiles:" -ForegroundColor Yellow
Write-Host "• Mailtrap Dashboard: https://mailtrap.io/inboxes" -ForegroundColor Cyan
Write-Host "• Documentación SMTP: https://help.mailtrap.io/article/109-getting-started-with-mailtrap-email-testing" -ForegroundColor Cyan

Write-Host "`n✅ Verificación completada!" -ForegroundColor Green
