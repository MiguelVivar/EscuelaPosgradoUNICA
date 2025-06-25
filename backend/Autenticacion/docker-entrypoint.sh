#!/bin/bash
set -e

echo "=========================================="
echo "Starting Authentication Microservice"
echo "=========================================="

# Environment information
echo "Java Version: $(java -version 2>&1 | head -n 1)"
echo "Active Profile: ${SPRING_PROFILES_ACTIVE:-default}"
echo "Database URL: ${SPRING_DATASOURCE_URL:-Not configured}"
echo "Database User: ${SPRING_DATASOURCE_USERNAME:-Not configured}"
echo "Working Directory: $(pwd)"
echo "Current User: $(whoami)"

# List files for debugging
echo "Available files in /app:"
ls -la /app/

# Verify application exists
if [ ! -f "/app/app.jar" ]; then
    echo "ERROR: app.jar not found in /app/"
    echo "Available files:"
    ls -la /app/
    exit 1
fi

# Wait for database to be ready (if configured)
if [ -n "${SPRING_DATASOURCE_URL}" ]; then
    echo "Waiting for database to be ready..."
    # Extract host and port from JDBC URL
    DB_HOST=$(echo ${SPRING_DATASOURCE_URL} | sed 's/.*:\/\/\([^:]*\):.*/\1/')
    DB_PORT=$(echo ${SPRING_DATASOURCE_URL} | sed 's/.*:\([0-9]*\)\/.*/\1/')
    
    echo "Checking database connection to ${DB_HOST}:${DB_PORT}..."
    for i in {1..30}; do
        if nc -z ${DB_HOST} ${DB_PORT} 2>/dev/null; then
            echo "Database is ready!"
            break
        else
            echo "Waiting for database... (attempt $i/30)"
            sleep 2
        fi
        if [ $i -eq 30 ]; then
            echo "WARNING: Database not ready after 60 seconds, proceeding anyway..."
        fi
    done
fi

echo "=========================================="
echo "Starting Spring Boot Application..."
echo "=========================================="

# Execute application with container-optimized settings
exec java \
    -XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -Djava.security.egd=file:/dev/./urandom \
    -Dserver.port=8080 \
    -jar /app/app.jar