# 📚 Documentación API - Microservicio de Autenticación

## 🚀 Acceso a la Documentación

Una vez que el microservicio esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

### 🌐 URLs de Acceso

- **Swagger UI (Interfaz Interactiva)**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs
- **OpenAPI YAML**: http://localhost:8080/v3/api-docs.yaml

## 📋 Características de la Documentación

### ✅ Funcionalidades Incluidas

- **Documentación Completa**: Todos los endpoints están documentados con ejemplos
- **Autenticación JWT**: Configuración integrada para pruebas con tokens JWT
- **Ejemplos de Requests/Responses**: Casos de uso reales con datos de ejemplo
- **Validaciones**: Descripción de todas las validaciones de entrada
- **Códigos de Error**: Documentación completa de respuestas de error
- **Agrupación por Roles**: Endpoints organizados por tipo de usuario

### 📑 Controladores Documentados

| Controlador | Descripción | Tag |
|-------------|-------------|-----|
| **AuthController** | Autenticación y registro | 🔐 Autenticación |
| **AdminController** | Operaciones administrativas | 👨‍💼 Administración |
| **DocenteController** | Endpoints para docentes | 👨‍🏫 Docentes |
| **AlumnoController** | Endpoints para alumnos | 🎓 Alumnos |
| **CoordinadorController** | Endpoints para coordinadores | 👨‍💼 Coordinadores |
| **PostulanteController** | Endpoints para postulantes | 📝 Postulantes |
| **HealthController** | Estado del sistema | 💊 Salud del Sistema |

## 🔑 Cómo Usar la Autenticación en Swagger

### Paso 1: Obtener Token JWT

1. Ve a `POST /api/auth/login`
2. Usa las credenciales predeterminadas:
   ```json
   {
     "usernameOrEmail": "admin",
     "password": "admin123"
   }
   ```
3. Copia el token JWT de la respuesta

### Paso 2: Configurar Autenticación

1. Haz clic en el botón **"Authorize"** (🔒) en la parte superior de Swagger UI
2. Ingresa: `Bearer tu-jwt-token-aquí`
3. Haz clic en **"Authorize"**
4. ¡Ahora puedes probar todos los endpoints protegidos!

## 📊 Ejemplos de Endpoints Principales

### 🔓 Endpoints Públicos

```bash
# Health Check
GET /api/health/status

# Login
POST /api/auth/login
{
  "usernameOrEmail": "admin",
  "password": "admin123"
}

# Registro
POST /api/auth/registro
{
  "username": "nuevo.usuario",
  "email": "nuevo@unica.edu.pe",
  "password": "password123",
  "nombres": "Nuevo",
  "apellidos": "Usuario",
  "role": "ALUMNO"
}
```

### 🔒 Endpoints Protegidos (Requieren JWT)

```bash
# Perfil actual
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN

# Perfil de alumno
GET /api/alumno/perfil
Authorization: Bearer YOUR_JWT_TOKEN

# Usuarios (Solo Admin)
GET /api/admin/usuarios
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🛠️ Configuración Técnica

### Dependencias Agregadas

```xml
<!-- Swagger/OpenAPI Documentation -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.6.0</version>
</dependency>

<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-api</artifactId>
    <version>2.6.0</version>
</dependency>
```

### Configuración en application.properties

```properties
# Swagger/OpenAPI Configuration
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
springdoc.swagger-ui.tryItOutEnabled=true
springdoc.swagger-ui.filter=true
```

## 📚 Información de la API

### Metadatos

- **Título**: 🔐 Microservicio de Autenticación - Escuela de Posgrado UNICA
- **Versión**: 1.0.0
- **Descripción**: Sistema de autenticación y autorización para la Escuela de Posgrado
- **Contacto**: posgrado@unica.edu.pe
- **Licencia**: MIT License

### Esquemas de Autenticación

- **Tipo**: HTTP Bearer
- **Esquema**: bearer
- **Formato**: JWT
- **Header**: Authorization

## 🚀 Ejecutar y Probar

### 1. Iniciar el Microservicio

```bash
cd backend/Autenticacion
./mvnw spring-boot:run
```

### 2. Verificar que Swagger está Disponible

```bash
curl http://localhost:8080/v3/api-docs
```

### 3. Abrir Swagger UI

Navega a: http://localhost:8080/swagger-ui.html

## 🎯 Roles y Permisos

| Rol | Endpoints Disponibles |
|-----|----------------------|
| **ADMIN** | Todos los endpoints + gestión de usuarios |
| **COORDINADOR** | Perfil, docentes, alumnos, postulantes |
| **DOCENTE** | Perfil, alumnos, colegas |
| **ALUMNO** | Perfil, docentes, compañeros |
| **POSTULANTE** | Perfil, docentes, coordinadores |

## 🔧 Personalización

Para personalizar la documentación, puedes modificar:

- `SwaggerConfig.java`: Configuración general y metadatos
- Controladores: Anotaciones `@Operation`, `@ApiResponse`, etc.
- DTOs: Anotaciones `@Schema` para documentar modelos
- `application.properties`: Configuración de Swagger UI

---

¡La documentación está lista! 🎉 Ahora puedes explorar y probar todos los endpoints de manera interactiva.
