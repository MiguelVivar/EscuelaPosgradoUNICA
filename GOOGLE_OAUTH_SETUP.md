# 🔐 Configuración de Google OAuth SSO - Escuela de Posgrado UNICA

Este documento explica cómo configurar la autenticación SSO con Google OAuth en el sistema de la Escuela de Posgrado UNICA.

## 📋 Prerrequisitos

1. Cuenta de Google Workspace o Google Cloud Platform
2. Acceso a la Google Cloud Console
3. Permisos para crear y configurar aplicaciones OAuth

## 🚀 Configuración en Google Cloud Console

### Paso 1: Crear un Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Activa la API de Google+ (opcional, para información adicional del perfil)

### Paso 2: Configurar la Pantalla de Consentimiento OAuth

1. Ve a **APIs & Services** > **OAuth consent screen**
2. Selecciona **External** como tipo de usuario
3. Completa la información requerida:
   - **App name**: Escuela de Posgrado UNICA
   - **User support email**: Tu email
   - **App domain**: `unica.edu.pe`
   - **Developer contact information**: Tu email

### Paso 3: Crear Credenciales OAuth 2.0

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **+ CREATE CREDENTIALS** > **OAuth 2.0 Client IDs**
3. Selecciona **Web application** como tipo de aplicación
4. Configura los campos:
   - **Name**: Escuela Posgrado UNICA Frontend
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (desarrollo)
     - `https://tudominio.unica.edu.pe` (producción)
   - **Authorized redirect URIs**:
     - `http://localhost:3000` (desarrollo)
     - `https://tudominio.unica.edu.pe` (producción)

### Paso 4: Obtener las Credenciales

1. Copia el **Client ID** que se generó
2. Opcional: Copia el **Client Secret** (no necesario para frontend, pero útil para backend)

## ⚙️ Configuración del Backend

### Archivo `application.properties`

```properties
# Google OAuth Configuration
app.googleOAuth.clientId=${GOOGLE_CLIENT_ID:tu-client-id-aqui}
app.googleOAuth.clientSecret=${GOOGLE_CLIENT_SECRET:tu-client-secret-aqui}
```

### Variables de Entorno (Recomendado)

```bash
# Backend - Spring Boot
GOOGLE_CLIENT_ID=tu-client-id-aqui
GOOGLE_CLIENT_SECRET=tu-client-secret-aqui
```

## 🖥️ Configuración del Frontend

### Archivo `.env.local`

```bash
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu-client-id-aqui
```

## 🧪 Pruebas

### Testing en Desarrollo

1. Asegúrate de que tanto backend (puerto 8080) como frontend (puerto 3000) estén ejecutándose
2. Ve a `http://localhost:3000/iniciar-sesion`
3. Prueba tanto el login tradicional como el botón "Continuar con Google"

### Testing de Google OAuth

1. Haz clic en "Continuar con Google"
2. Selecciona una cuenta de Google
3. Verifica que solo se permitan emails `@unica.edu.pe`
4. Confirma que se cree/actualice el usuario en la base de datos
5. Verifica que se genere un JWT token válido

## 📚 Endpoints de la API

### Backend Endpoints

```bash
# Login tradicional
POST /api/auth/login
Content-Type: application/json
{
  "usernameOrEmail": "usuario@unica.edu.pe",
  "password": "password123"
}

# Login con Google OAuth
POST /api/auth/google-login
Content-Type: application/json
{
  "googleToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

## 🔧 Funcionalidades Implementadas

### Backend
- ✅ Verificación de tokens de Google
- ✅ Validación de emails institucionales (@unica.edu.pe)
- ✅ Creación automática de usuarios nuevos
- ✅ Asignación de roles basada en el email
- ✅ Generación de JWT tokens
- ✅ Actualización de último acceso

### Frontend
- ✅ Botón de Google Sign-In integrado
- ✅ Manejo de errores de autenticación
- ✅ Validación de emails institucionales
- ✅ Redirección automática post-login
- ✅ Integración con el contexto de autenticación existente

## 🛡️ Seguridad

### Validaciones Implementadas

1. **Email Institucional**: Solo se permiten emails `@unica.edu.pe`
2. **Token Verification**: Los tokens de Google se verifican con la API de Google
3. **JWT Generation**: Se generan tokens JWT propios para la sesión
4. **Role Assignment**: Los roles se asignan automáticamente basados en el email
5. **Account Status**: Se verifican cuentas activas/inactivas

### Consideraciones de Seguridad

- Los tokens de Google tienen expiración automática
- Se valida la autenticidad del token con Google
- Solo se permite acceso a usuarios con emails institucionales
- Se mantiene la compatibilidad con el sistema de autenticación existente

## 🚀 Despliegue

### Variables de Entorno de Producción

```bash
# Backend
GOOGLE_CLIENT_ID=tu-client-id-de-produccion
GOOGLE_CLIENT_SECRET=tu-client-secret-de-produccion

# Frontend
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu-client-id-de-produccion
```

### Configuración de Dominios

Asegúrate de actualizar en Google Cloud Console:
- Los **Authorized JavaScript origins** con tu dominio de producción
- Los **Authorized redirect URIs** con las URLs correctas

## 📞 Soporte

Para problemas o preguntas sobre la configuración de Google OAuth:

1. Verifica que las URLs estén correctamente configuradas en Google Cloud Console
2. Confirma que las variables de entorno estén establecidas
3. Revisa los logs del backend para errores de verificación de tokens
4. Verifica que el frontend pueda acceder a la API de Google

## 🔄 Flujo de Autenticación

### Flujo Completo

1. **Usuario hace clic en "Continuar con Google"**
2. **Frontend**: Se abre popup de Google OAuth
3. **Google**: Usuario selecciona cuenta y autoriza
4. **Frontend**: Recibe token de Google (credential)
5. **Frontend**: Envía token al backend (`/api/auth/google-login`)
6. **Backend**: Verifica token con Google API
7. **Backend**: Valida que el email sea `@unica.edu.pe`
8. **Backend**: Busca o crea usuario en la base de datos
9. **Backend**: Genera JWT token propio
10. **Backend**: Retorna AuthResponse con JWT
11. **Frontend**: Guarda JWT y redirecciona a campus virtual

Este flujo mantiene la seguridad y compatibilidad con el sistema existente.
