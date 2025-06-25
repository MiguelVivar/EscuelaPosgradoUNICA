@echo off
echo.
echo ====================================
echo  🔐 Microservicio de Autenticacion
echo     con Swagger Documentation
echo ====================================
echo.
echo Iniciando el servidor...
echo.
echo Una vez iniciado, puedes acceder a:
echo.
echo   📚 Swagger UI: http://localhost:8080/swagger-ui.html
echo   📄 API Docs:   http://localhost:8080/v3/api-docs
echo   💊 Health:     http://localhost:8080/api/health/status
echo.
echo Presiona Ctrl+C para detener el servidor
echo.
.\mvnw spring-boot:run
