# 📧 Integración con Mailtrap - Recuperación de Contraseña

## 🚀 Configuración de Mailtrap

### 1. Crear cuenta en Mailtrap

1. Ve a [https://mailtrap.io](https://mailtrap.io)
2. Registra una cuenta gratuita
3. Accede a tu dashboard

### 2. Configurar SMTP

#### Para Desarrollo (Mailtrap Inbox):
1. En tu dashboard, ve a **Email Testing** > **Inboxes**
2. Selecciona tu inbox o crea uno nuevo
3. Ve a la pestaña **SMTP Settings**
4. Copia las credenciales SMTP

#### Para Producción (Mailtrap Send):
1. En tu dashboard, ve a **Email Sending** > **Sending Domains**
2. Configura tu dominio
3. Ve a **SMTP/API Settings**
4. Copia las credenciales de producción

### 3. Variables de Entorno

Crea un archivo `.env.local` en la raíz del frontend con las siguientes variables:

```env
# Configuración de Mailtrap
MAILTRAP_USER=tu_usuario_mailtrap
MAILTRAP_PASSWORD=tu_password_mailtrap
MAILTRAP_FROM_EMAIL=noreply@unica.edu.pe

# URL base de la aplicación
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# URL de la API backend
NEXT_PUBLIC_API_URL=http://localhost:8080
```

#### Para Desarrollo:
```env
MAILTRAP_USER=api
MAILTRAP_PASSWORD=tu_token_de_testing
```

#### Para Producción:
```env
MAILTRAP_USER=api
MAILTRAP_PASSWORD=tu_token_de_produccion
```

## 🔧 Configuración por Entorno

### Desarrollo (Testing)
- **Host**: `sandbox.smtp.mailtrap.io`
- **Puerto**: `2525`
- **Seguridad**: `false`
- Los emails se capturan en tu inbox de testing

### Producción (Envío Real)
- **Host**: `live.smtp.mailtrap.io`
- **Puerto**: `587`
- **Seguridad**: `false` (STARTTLS)
- Los emails se envían realmente a los destinatarios

## 📝 Funcionalidades Implementadas

### ✅ Envío de Email de Recuperación
- **Endpoint**: `POST /api/recover-password`
- **Validaciones**: Email institucional (@unica.edu.pe)
- **Template**: HTML responsive con branding UNICA
- **Token**: Generación segura con expiración de 24h

### ✅ Validación de Token
- **Endpoint**: `POST /api/recover-password/validate`
- **Verificaciones**: Existencia, expiración, uso previo
- **Limpieza**: Tokens expirados se eliminan automáticamente

### ✅ Reset de Contraseña
- **Endpoint**: `POST /api/recover-password/reset`
- **Validaciones**: Contraseña mínima de 6 caracteres
- **Seguridad**: Token de un solo uso
- **Integración**: Backend para actualización real

## 🎨 Template de Email

El template incluye:
- **Diseño responsive** para móviles y desktop
- **Branding UNICA** con colores institucionales
- **Botón CTA** para restablecer contraseña
- **Instrucciones de seguridad** claras
- **Enlace alternativo** para copiar/pegar
- **Footer institucional** con información de contacto

## 🔒 Características de Seguridad

### Token Management
- **Generación aleatoria** de 30 caracteres
- **Expiración automática** en 24 horas
- **Un solo uso** por token
- **Limpieza automática** de tokens expirados

### Validaciones
- **Email institucional** obligatorio (@unica.edu.pe)
- **Contraseña segura** mínimo 6 caracteres
- **Confirmación** de contraseña requerida
- **Rate limiting** implícito por email

## 🚦 Flujo de Usuario

1. **Solicitar recuperación**:
   - Usuario ingresa email institucional
   - Sistema valida formato y dominio
   - Se envía email con enlace único

2. **Recibir email**:
   - Email con template profesional
   - Enlace válido por 24 horas
   - Instrucciones de seguridad

3. **Restablecer contraseña**:
   - Clic en enlace abre página de reset
   - Validación automática del token
   - Formulario para nueva contraseña

4. **Confirmación**:
   - Contraseña actualizada en backend
   - Token marcado como usado
   - Redirección automática al login

## 🧪 Testing

### Para Testing Local:
1. Configura las credenciales de Mailtrap Testing
2. Ejecuta la aplicación: `pnpm dev`
3. Ve a: `http://localhost:3000/recuperar-password`
4. Ingresa un email @unica.edu.pe
5. Revisa tu inbox en Mailtrap.io

### Endpoints de Testing:
```bash
# Solicitar recuperación
curl -X POST http://localhost:3000/api/recover-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@unica.edu.pe"}'

# Validar token
curl -X POST http://localhost:3000/api/recover-password/validate \
  -H "Content-Type: application/json" \
  -d '{"token": "tu_token_aqui"}'

# Reset contraseña
curl -X POST http://localhost:3000/api/recover-password/reset \
  -H "Content-Type: application/json" \
  -d '{
    "token": "tu_token_aqui",
    "newPassword": "nuevaPassword123",
    "confirmPassword": "nuevaPassword123"
  }'
```

## 📋 Checklist de Configuración

- [ ] Cuenta Mailtrap creada
- [ ] Credenciales SMTP obtenidas
- [ ] Variables de entorno configuradas
- [ ] Archivo `.env.local` creado
- [ ] Testing endpoint funcionando
- [ ] Email template visualizado
- [ ] Flujo completo probado
- [ ] Integración backend configurada (opcional)

## 🔗 Enlaces Útiles

- [Mailtrap Documentation](https://help.mailtrap.io/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 🐛 Troubleshooting

### Error: SMTP Authentication Failed
- Verifica las credenciales en `.env.local`
- Asegúrate de usar el token correcto (testing vs producción)

### Error: Template no se ve bien
- Los clientes de email pueden renderizar CSS diferente
- Prueba en diferentes clientes (Gmail, Outlook, etc.)

### Error: Token no válido
- Los tokens expiran en 24 horas
- Solo se pueden usar una vez
- Verifica que el enlace sea completo

### Error: Email no llega
- En desarrollo, revisa tu inbox de Mailtrap
- En producción, verifica configuración de dominio
- Revisa logs del servidor para errores SMTP
