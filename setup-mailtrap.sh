#!/bin/bash

# Script para configurar variables de entorno de Mailtrap en Docker
# Ejecutar desde la raíz del proyecto

echo "🔧 Configurando variables de entorno de Mailtrap para Docker..."

# Verificar si existe docker-compose.yml
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml no encontrado. Ejecutar desde la raíz del proyecto."
    exit 1
fi

# Crear/actualizar .env en la raíz del proyecto
echo "📝 Configurando .env principal..."

read -p "Ingresa tu MAILTRAP_USER (obtén de tu cuenta Mailtrap): " mailtrap_user
read -s -p "Ingresa tu MAILTRAP_PASSWORD: " mailtrap_password
echo ""

cat > .env << EOF
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
EOF

# Crear/actualizar .env en frontend/ para desarrollo local
echo "📝 Configurando .env para frontend..."

cat > frontend/.env << EOF
# Variables de entorno para desarrollo local (sin Docker)
MAILTRAP_USER=$mailtrap_user
MAILTRAP_PASSWORD=$mailtrap_password
MAILTRAP_FROM_EMAIL=noreply@unica.edu.pe
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
EOF

echo "✅ Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Reiniciar contenedores: docker-compose down && docker-compose up --build"
echo "2. Probar en: http://localhost:3000/debug-mailtrap"
echo "3. Para desarrollo sin Docker: cd frontend && pnpm dev"
echo ""
echo "🔍 Para debugging:"
echo "- Ver logs del contenedor: docker-compose logs frontend"
echo "- Conectar al contenedor: docker exec -it \$(docker-compose ps -q frontend) sh"
echo "- Verificar variables: docker exec -it \$(docker-compose ps -q frontend) printenv | grep MAILTRAP"
