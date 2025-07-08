#!/bin/bash

# Script para limpiar duplicados en la base de datos
# Uso: ./cleanup-duplicates.sh

echo "🧹 Iniciando limpieza de registros duplicados..."

# URL base del servicio de autenticación
BASE_URL="http://localhost:8081/api"

# Credenciales del administrador
ADMIN_USER="admin"
ADMIN_PASS="admin123"

echo "🔐 Obteniendo token de administrador..."

# Obtener token de administrador
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"usernameOrEmail\": \"${ADMIN_USER}\",
    \"password\": \"${ADMIN_PASS}\"
  }")

# Extraer el token de la respuesta
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | sed 's/"token":"//;s/"//')

if [ -z "$TOKEN" ]; then
    echo "❌ Error: No se pudo obtener el token de administrador"
    echo "Respuesta del login: $LOGIN_RESPONSE"
    exit 1
fi

echo "✅ Token obtenido exitosamente"
echo "🧹 Ejecutando limpieza de duplicados..."

# Ejecutar limpieza de duplicados
CLEANUP_RESPONSE=$(curl -s -X POST "${BASE_URL}/admin/limpiar-duplicados" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}")

echo "📋 Respuesta de la limpieza:"
echo $CLEANUP_RESPONSE | jq . 2>/dev/null || echo $CLEANUP_RESPONSE

echo "✅ Proceso de limpieza completado"
