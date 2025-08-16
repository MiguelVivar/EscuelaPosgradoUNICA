# 🔐 Configuración de Seguridad - Escuela de Posgrado UNICA

Este documento describe las medidas de seguridad implementadas y las mejores prácticas para el manejo de información sensible en el proyecto.

## 🛡️ Variables de Entorno Requeridas

Para mayor seguridad, todas las credenciales y configuraciones sensibles deben configurarse mediante variables de entorno. Nunca hardcodear credenciales en el código fuente.

### Configuración de Producción

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de Base de Datos
POSTGRES_USER=tu_usuario_de_base_de_datos
POSTGRES_PASSWORD=tu_contraseña_segura_de_base_de_datos

# Configuración JWT
JWT_SECRET=tu_clave_secreta_jwt_muy_larga_y_segura_minimo_32_caracteres

# Configuración Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# Configuración Mailtrap
MAILTRAP_USER=tu_usuario_mailtrap
MAILTRAP_PASSWORD=tu_contraseña_mailtrap
MAILTRAP_FROM_EMAIL=noreply@unica.edu.pe

# Configuración pgAdmin
PGADMIN_DEFAULT_PASSWORD=tu_contraseña_pgadmin_segura

# URLs base
NEXT_PUBLIC_BASE_URL=https://tu-dominio-produccion.unica.edu.pe
NEXT_PUBLIC_API_URL=https://api-tu-dominio.unica.edu.pe
```

### Configuración de Desarrollo

Para desarrollo local, puedes usar valores de prueba pero asegúrate de nunca committear credenciales reales:

```env
# Configuración de Base de Datos (desarrollo)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_contraseña_local

# Configuración JWT (desarrollo - usar clave diferente en producción)
JWT_SECRET=desarrollo_clave_secreta_jwt_no_usar_en_produccion

# URLs base (desarrollo)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🚨 Información Sensible Identificada y Corregida

Se han identificado y corregido las siguientes exposiciones de información sensible:

### ✅ Corregido: Credenciales de Mailtrap
- **Antes**: Credenciales reales expuestas en `.env.example`
- **Después**: Reemplazadas con placeholders y movidas a variables de entorno

### ✅ Corregido: Credenciales de Google OAuth
- **Antes**: Client ID y Client Secret reales en `application.properties`
- **Después**: Configurados para usar variables de entorno

### ✅ Corregido: Claves JWT
- **Antes**: Clave secreta hardcodeada en todos los microservicios
- **Después**: Configurada mediante variable de entorno `JWT_SECRET`

### ✅ Corregido: Contraseñas de Base de Datos
- **Antes**: Contraseñas hardcodeadas en archivos de configuración
- **Después**: Configuradas mediante variables de entorno

### ✅ Corregido: Credenciales de pgAdmin
- **Antes**: Contraseña hardcodeada en docker-compose.yml
- **Después**: Configurada mediante variable de entorno

## 🔒 Cuentas Demo Preservadas

Las siguientes cuentas demo son necesarias para el funcionamiento de la aplicación y han sido preservadas:

- `admin@unica.edu.pe` - Cuenta de administrador demo
- `docente.demo@unica.edu.pe` - Cuenta de docente demo
- `coordinador.demo@unica.edu.pe` - Cuenta de coordinador demo
- `alumno.demo@unica.edu.pe` - Cuenta de alumno demo
- `postulante.demo@gmail.com` - Cuenta de postulante demo

## 📋 Lista de Verificación de Seguridad

### Antes de Desplegar en Producción:

- [ ] Configurar todas las variables de entorno requeridas
- [ ] Generar un JWT secret seguro (mínimo 32 caracteres, aleatorio)
- [ ] Cambiar la contraseña por defecto de la base de datos
- [ ] Configurar credenciales reales de Google OAuth
- [ ] Configurar credenciales reales de Mailtrap
- [ ] Cambiar la contraseña de pgAdmin
- [ ] Verificar que el archivo `.env` no esté siendo trackeado por Git
- [ ] Configurar HTTPS en producción
- [ ] Revisar logs para asegurar que no se expongan credenciales

### Mejores Prácticas:

1. **Nunca committear archivos `.env`** - Siempre incluirlos en `.gitignore`
2. **Usar variables de entorno** para toda información sensible
3. **Rotar credenciales regularmente** especialmente JWT secrets
4. **Usar HTTPS en producción** para todas las comunicaciones
5. **Auditar logs** para prevenir exposición accidental de credenciales
6. **Mantener separadas** las configuraciones de desarrollo y producción

## 🔧 Configuración por Microservicio

### Microservicio de Autenticación (Puerto 8080)
Variables requeridas:
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID` 
- `GOOGLE_CLIENT_SECRET`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

### Microservicio de Intranet (Puerto 8081)
Variables requeridas:
- `JWT_SECRET`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

### Microservicio de Matrícula (Puerto 8082)
Variables requeridas:
- `JWT_SECRET`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

### Frontend (Puerto 3000)
Variables requeridas:
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_API_URL`
- `MAILTRAP_USER`
- `MAILTRAP_PASSWORD`
- `MAILTRAP_FROM_EMAIL`

## 📞 Contacto de Seguridad

Si detectas algún problema de seguridad, por favor reportarlo inmediatamente al equipo de desarrollo.