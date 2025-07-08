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

### Paso 3: Registrar Nuevos Usuarios (Solo ADMIN/COORDINADOR)

1. Asegúrate de estar autenticado con un token de ADMIN o COORDINADOR
2. Ve a `POST /api/auth/registro`
3. El endpoint ahora requiere autenticación y autorización adecuada

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
```

### 🔒 Endpoints Protegidos (Requieren JWT)

```bash
# Registro (Solo ADMIN y COORDINADOR)
POST /api/auth/registro
Authorization: Bearer YOUR_JWT_TOKEN
{
  "username": "nuevo.usuario",
  "email": "nuevo@unica.edu.pe",
  "password": "password123",
  "nombres": "Nuevo",
  "apellidos": "Usuario",
  "role": "ALUMNO"
}

# Perfil actual
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN

# Actualizar perfil personal (Solo teléfono y contraseña)
PUT /api/auth/actualizar-perfil
Authorization: Bearer YOUR_JWT_TOKEN
{
  "telefono": "987654321",
  "password": "nuevaPassword123",
  "confirmarPassword": "nuevaPassword123"
}

# Perfil de alumno
GET /api/alumno/perfil
Authorization: Bearer YOUR_JWT_TOKEN

# Usuarios (Solo Admin)
GET /api/admin/usuarios
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🔒 Actualización de Perfil Personal

### 🚫 Campos NO Actualizables

Por razones de seguridad y integridad de datos, los siguientes campos **NO** pueden ser modificados a través del endpoint de actualización de perfil:

- **Rol (role)**: Solo administradores pueden cambiar roles
- **Username**: Identificador único e inmutable
- **Email**: Correo institucional controlado por administración
- **Nombres**: Datos personales oficiales
- **Apellidos**: Datos personales oficiales  
- **DNI**: Documento de identidad oficial
- **Código de Estudiante (codigoEstudiante)**: Asignado por la institución
- **Código de Docente (codigoDocente)**: Asignado por la institución
- **Especialidad**: Información académica oficial
- **Programas de Interés (programaInteres)**: Requiere validación académica

### ✅ Campos Actualizables

Los usuarios pueden actualizar únicamente:

- **Teléfono**: Número de contacto personal
- **Contraseña**: Con confirmación obligatoria

### 📝 Ejemplo de Uso

```json
{
  "telefono": "987654321",
  "password": "nuevaPassword123",
  "confirmarPassword": "nuevaPassword123"
}
```

### ⚠️ Notas Importantes

- La contraseña es **opcional** en la actualización
- Si se proporciona contraseña, la confirmación es **obligatoria**
- Las contraseñas deben coincidir exactamente
- El teléfono puede actualizarse independientemente
- Mínimo 6 caracteres para nuevas contraseñas

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
| **ADMIN** | Todos los endpoints + gestión de usuarios + registro de nuevos usuarios |
| **COORDINADOR** | Perfil, docentes, alumnos, postulantes + registro de nuevos usuarios |
| **DOCENTE** | Perfil, alumnos, colegas |
| **ALUMNO** | Perfil, docentes, compañeros |
| **POSTULANTE** | Perfil, docentes, coordinadores |

### 📝 Notas Importantes sobre el Registro

- **Acceso Restringido**: Solo usuarios con rol `ADMIN` o `COORDINADOR` pueden registrar nuevos usuarios
- **Autenticación Requerida**: Debes autenticarte primero y obtener un token JWT válido
- **Autorización**: El token debe pertenecer a un usuario con los permisos adecuados

## 🔧 Personalización

Para personalizar la documentación, puedes modificar:

- `SwaggerConfig.java`: Configuración general y metadatos
- Controladores: Anotaciones `@Operation`, `@ApiResponse`, etc.
- DTOs: Anotaciones `@Schema` para documentar modelos
- `application.properties`: Configuración de Swagger UI

---

¡La documentación está lista! 🎉 Ahora puedes explorar y probar todos los endpoints de manera interactiva.
