# 🔐 Microservicio de Autenticación - Escuela de Posgrado UNICA

## 📋 Descripción

Microservicio de autenticación y autorización para el sistema académico de la Escuela de Posgrado de la Universidad Nacional San Luis Gonzaga de Ica (UNICA).

Este servicio maneja:
- **Autenticación** de usuarios mediante JWT
- **Autorización** basada en roles
- **Gestión de usuarios** con diferentes perfiles
- **Seguridad** de endpoints por rol

## � Documentación API con Swagger

### 🚀 Acceso Directo
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/v3/api-docs

### ✨ Características
- ✅ **Documentación Interactiva**: Prueba todos los endpoints desde el navegador
- ✅ **Autenticación JWT**: Configuración integrada para pruebas con tokens
- ✅ **Ejemplos Reales**: Requests y responses con datos de ejemplo
- ✅ **Validaciones**: Documentación completa de validaciones
- ✅ **Agrupación por Roles**: Endpoints organizados por tipo de usuario

> 📖 **Ver**: [SWAGGER-README.md](./SWAGGER-README.md) para guía detallada de uso

## �👥 Roles del Sistema

El sistema maneja los siguientes roles con sus respectivos permisos:

### 🔧 ADMIN
- **Permisos**: Acceso completo al sistema
- **Funciones**:
  - Gestionar todos los usuarios
  - Ver estadísticas del sistema
  - Activar/desactivar usuarios
  - Acceso a todos los endpoints

### 👨‍🏫 DOCENTE
- **Permisos**: Gestión académica limitada
- **Funciones**:
  - Ver perfil personal
  - Consultar lista de alumnos
  - Ver información de colegas docentes

### 👨‍🎓 ALUMNO
- **Permisos**: Acceso estudiantil
- **Funciones**:
  - Ver perfil personal
  - Consultar información de docentes
  - Ver compañeros de estudios
  - Acceder a código de estudiante

### 👨‍💼 COORDINADOR
- **Permisos**: Gestión académica amplia
- **Funciones**:
  - Ver todos los usuarios del sistema
  - Gestionar docentes y alumnos
  - Ver postulantes
  - Generar reportes académicos

### 📝 POSTULANTE
- **Permisos**: Acceso limitado pre-matrícula
- **Funciones**:
  - Ver perfil personal
  - Consultar información de docentes
  - Ver programa de interés
  - Verificar estado de postulación

## 🛠️ Tecnologías Utilizadas

- **Spring Boot 3.5.3** - Framework principal
- **Spring Security 6** - Seguridad y autenticación
- **JWT (jjwt 0.12.6)** - Tokens de autenticación
- **Spring Data JPA** - Persistencia de datos
- **PostgreSQL** - Base de datos
- **BCrypt** - Encriptación de contraseñas
- **Bean Validation** - Validación de datos

## 🚀 Endpoints de la API

### 🔓 Endpoints Públicos

```http
POST /api/auth/login           # Iniciar sesión
POST /api/auth/google-login    # Iniciar sesión con Google OAuth
POST /api/auth/registro        # Registrar usuario
GET  /api/health/status        # Estado del servicio
GET  /api/health/check         # Health check completo
GET  /actuator/health          # Actuator health
```

### 🔒 Endpoints Autenticados

#### Para todos los usuarios autenticados:
```http
GET /api/auth/me               # Información del usuario actual
GET /api/auth/validate         # Validar token JWT
```

#### Solo ADMIN:
```http
GET    /api/admin/usuarios                    # Todos los usuarios
GET    /api/admin/usuarios/rol/{role}         # Usuarios por rol
PUT    /api/admin/usuarios/{id}/activar       # Activar usuario
PUT    /api/admin/usuarios/{id}/desactivar    # Desactivar usuario
GET    /api/admin/estadisticas                # Estadísticas del sistema
GET    /api/admin/docentes                    # Lista de docentes
GET    /api/admin/alumnos                     # Lista de alumnos
GET    /api/admin/coordinadores               # Lista de coordinadores
GET    /api/admin/postulantes                 # Lista de postulantes
```

#### DOCENTE y COORDINADOR:
```http
GET /api/docente/perfil        # Perfil del docente
GET /api/docente/alumnos       # Lista de alumnos
GET /api/docente/colegas       # Otros docentes
GET /api/docente/bienvenida    # Mensaje personalizado
```

#### ALUMNO:
```http
GET /api/alumno/perfil         # Perfil del alumno
GET /api/alumno/docentes       # Lista de docentes
GET /api/alumno/companeros     # Otros alumnos
GET /api/alumno/bienvenida     # Mensaje personalizado
GET /api/alumno/codigo         # Código de estudiante
```

#### COORDINADOR:
```http
GET /api/coordinador/perfil            # Perfil del coordinador
GET /api/coordinador/docentes          # Todos los docentes
GET /api/coordinador/alumnos           # Todos los alumnos
GET /api/coordinador/postulantes       # Todos los postulantes
GET /api/coordinador/coordinadores     # Otros coordinadores
GET /api/coordinador/bienvenida        # Mensaje personalizado
GET /api/coordinador/resumen           # Resumen académico
```

#### POSTULANTE:
```http
GET /api/postulante/perfil             # Perfil del postulante
GET /api/postulante/docentes           # Lista de docentes
GET /api/postulante/coordinadores      # Lista de coordinadores
GET /api/postulante/bienvenida         # Mensaje personalizado
GET /api/postulante/programa-interes   # Programa de interés
GET /api/postulante/estado             # Estado de postulación
```

## 📊 Esquema de Base de Datos

### Tabla: usuarios

```sql
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni VARCHAR(8),
    telefono VARCHAR(15),
    role VARCHAR(20) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT true,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_actualizacion TIMESTAMP,
    ultimo_acceso TIMESTAMP,
    codigo_estudiante VARCHAR(20),
    codigo_docente VARCHAR(20),
    especialidad VARCHAR(100),
    programa_interes VARCHAR(100)
);
```

## 🔑 Usuarios de Demostración

El sistema crea automáticamente usuarios de prueba:

| Usuario | Contraseña | Rol | Email |
|---------|------------|-----|-------|
| admin | admin123 | ADMIN | admin@unica.edu.pe |
| docente.demo | docente123 | DOCENTE | docente.demo@unica.edu.pe |
| coordinador.demo | coordinador123 | COORDINADOR | coordinador.demo@unica.edu.pe |
| alumno.demo | alumno123 | ALUMNO | alumno.demo@unica.edu.pe |
| postulante.demo | postulante123 | POSTULANTE | postulante.demo@gmail.com |

## 🛡️ Seguridad

### JWT Configuration
- **Algoritmo**: HMAC SHA-256
- **Duración**: 24 horas (86400000 ms)
- **Secret Key**: Configurable via `app.jwtSecret`

### Validaciones
- Contraseñas encriptadas con BCrypt
- Validación de email único
- Validación de username único
- Validación de códigos de estudiante/docente únicos
- Validación de DNI único

### CORS
- Configurado para permitir conexiones desde el frontend
- Headers personalizados permitidos
- Métodos HTTP estándar habilitados

## 🚀 Ejecución

### Desarrollo Local
```bash
cd backend/Autenticacion
./mvnw spring-boot:run
```

### Docker
```bash
docker-compose up autenticacion
```

### Variables de Entorno
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/autenticacion
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SPRING_PROFILES_ACTIVE=docker
```

## 📝 Ejemplos de Uso

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "admin",
    "password": "admin123"
  }'
```

### Login con Google OAuth
```bash
curl -X POST http://localhost:8080/api/auth/google-login \
  -H "Content-Type: application/json" \
  -d '{
    "googleToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
  }'
```

### Registro
```bash
curl -X POST http://localhost:8080/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nuevo.usuario",
    "email": "nuevo@unica.edu.pe",
    "password": "password123",
    "nombres": "Nuevo",
    "apellidos": "Usuario",
    "role": "ALUMNO",
    "codigoEstudiante": "EST2024002"
  }'
```

### Consulta Autenticada
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Configuración

### application.properties
```properties
# Base de datos
spring.datasource.url=jdbc:postgresql://localhost:5432/autenticacion
spring.datasource.username=postgres
spring.datasource.password=postgres

# JWT
app.jwtSecret=${JWT_SECRET:tu-clave-secreta-jwt-aqui}
app.jwtExpirationMs=86400000

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## 📈 Monitoreo

### Health Checks
- `GET /api/health/status` - Estado básico
- `GET /api/health/check` - Verificación completa (DB + servicio)
- `GET /actuator/health` - Spring Boot Actuator

### Logs
- Autenticación exitosa/fallida
- Creación de usuarios
- Errores de validación JWT
- Inicialización de datos

## 🤝 Integración con otros Microservicios

Este microservicio sirve como **servidor de autenticación** para:
- **Microservicio de Intranet** (Puerto 8081)
- **Microservicio de Matrícula** (Puerto 8082)
- **Frontend Next.js** (Puerto 3000)

Los otros servicios deben validar los tokens JWT generados por este microservicio.

## 📄 Licencia

Desarrollado para uso académico de la Universidad Nacional San Luis Gonzaga de Ica.

---

<div align="center">

**🎓 Escuela de Posgrado UNICA - Sistema de Autenticación**

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-brightgreen)
![JWT](https://img.shields.io/badge/JWT-0.12.6-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.5-blue)
![Java](https://img.shields.io/badge/Java-24-orange)

</div>
