#!/bin/bash

# Script de inicio para el microservicio de autenticación
echo "=========================================="
echo "Iniciando Microservicio de Autenticación"
echo "=========================================="

# Mostrar información del entorno
echo "Java Version: $(java -version 2>&1 | head -n 1)"
echo "Profile activo: ${SPRING_PROFILES_ACTIVE:-default}"
echo "Base de datos URL: ${SPRING_DATASOURCE_URL:-No configurada}"
echo "Usuario BD: ${SPRING_DATASOURCE_USERNAME:-No configurado}"

# Verificar que la aplicación existe
if [ ! -f "app.jar" ]; then
    echo "ERROR: No se encontró app.jar"
    exit 1
fi

echo "=========================================="
echo "Iniciando aplicación Spring Boot..."
echo "=========================================="

# Ejecutar la aplicación con configuraciones optimizadas para contenedores
exec java \
    -XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -Djava.security.egd=file:/dev/./urandom \
    -Dserver.port=8080 \
    -jar app.jar
