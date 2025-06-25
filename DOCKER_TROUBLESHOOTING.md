# Solución de Problemas con Docker Compose

## Problema: Servicio de Autenticación se detiene después del inicio

### Síntomas
- El servicio de autenticación se inicia pero luego se detiene automáticamente
- Los otros servicios pueden fallar al no poder conectarse al servicio de autenticación
- Errores en los logs relacionados con health checks

### Causa Raíz
El problema era causado por:
1. **Falta de dependencia Actuator**: Los Dockerfiles configuraban health checks que dependían del endpoint `/actuator/health`, pero la dependencia `spring-boot-starter-actuator` no estaba incluida en los archivos `pom.xml`.
2. **Dependencias débiles en docker-compose**: Los servicios no esperaban a que la base de datos estuviera completamente lista antes de intentar conectarse.
3. **Falta de configuración de reinicio**: Los servicios no tenían configuración de reinicio automático.

### Solución Implementada

#### 1. Agregada dependencia Actuator a todos los microservicios
```xml
<!-- Actuator for health checks -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

#### 2. Mejorada configuración de docker-compose.yml
- **Health checks robustos**: Configurados con tiempos de espera adecuados
- **Dependencias condicionales**: Los servicios ahora esperan que sus dependencias estén saludables
- **Reinicio automático**: Agregado `restart: unless-stopped`
- **Tiempos de inicio extendidos**: `start_period: 90s` para dar tiempo suficiente a Spring Boot

#### 3. Configuración de Health Checks
```yaml
healthcheck:
  test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1"]
  interval: 30s
  timeout: 10s
  retries: 5
  start_period: 90s
```

#### 4. Dependencias Mejoradas
```yaml
depends_on:
  db:
    condition: service_healthy
```

### Instrucciones para tu compañero

1. **Hacer pull de los cambios** desde el repositorio
2. **Limpiar contenedores e imágenes existentes**:
   ```bash
   docker-compose down -v
   docker system prune -a
   ```
3. **Reconstruir e iniciar**:
   ```bash
   docker-compose up --build
   ```

### Verificación
Para verificar que todo funciona correctamente:

1. **Verificar estado de servicios**:
   ```bash
   docker-compose ps
   ```

2. **Verificar health checks**:
   ```bash
   curl http://localhost:8080/actuator/health
   curl http://localhost:8081/actuator/health
   curl http://localhost:8082/actuator/health
   ```

3. **Revisar logs si hay problemas**:
   ```bash
   docker-compose logs autenticacion
   docker-compose logs intranet
   docker-compose logs matricula
   ```

### Tiempos de Inicio Esperados
- **Base de datos**: 30-60 segundos
- **Microservicios**: 60-90 segundos cada uno
- **Frontend**: 30-45 segundos (después de que los microservicios estén listos)

### Notas Adicionales
- Los servicios ahora tienen un `start_period` de 90 segundos, lo que significa que Docker esperará hasta 90 segundos antes de considerar que el health check ha fallado.
- Si un servicio falla, se reiniciará automáticamente gracias a `restart: unless-stopped`.
- La base de datos tiene su propio health check que los microservicios esperan antes de iniciar.
