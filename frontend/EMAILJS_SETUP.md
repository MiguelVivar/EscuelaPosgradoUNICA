# Configuración de EmailJS para el Formulario de Contacto

## Instrucciones de Configuración

### 1. Crear una cuenta en EmailJS
1. Ve a [EmailJS](https://www.emailjs.com/) y regístrate
2. Verifica tu cuenta por email

### 2. Configurar el Servicio de Email
1. En el dashboard de EmailJS, ve a **Email Services**
2. Haz clic en **Add New Service**
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Sigue las instrucciones para configurar la conexión
5. Anota el **Service ID** que se genera

### 3. Crear una Plantilla de Email
1. Ve a **Email Templates**
2. Haz clic en **Create New Template**
3. Usa esta plantilla como base:

```
Asunto: Nuevo mensaje de contacto - {{subject}}

Hola,

Has recibido un nuevo mensaje de contacto a través del sitio web de la Escuela de Posgrado UNICA:

**Datos del remitente:**
- Nombre: {{from_name}}
- Email: {{from_email}}
- Teléfono: {{phone}}
- Asunto: {{subject}}

**Mensaje:**
{{message}}

---
Este mensaje fue enviado automáticamente desde el formulario de contacto del sitio web.
```

4. Guarda la plantilla y anota el **Template ID**

### 4. Obtener la Public Key
1. Ve a **Account** en la barra lateral
2. Copia tu **Public Key**

### 5. Configurar Variables de Entorno
1. Copia el archivo `.env.local.example` como `.env.local`
2. Reemplaza los valores con tus credenciales de EmailJS:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=tu_service_id_aqui
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=tu_template_id_aqui
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=tu_public_key_aqui
```

### 6. Reiniciar el Servidor de Desarrollo
Después de configurar las variables de entorno, reinicia el servidor:

```bash
pnpm dev
```

## Características del Formulario Mejorado

- ✅ **Validación en tiempo real**: Valida todos los campos antes del envío
- ✅ **Estados de carga**: Muestra el estado de envío con spinner
- ✅ **Mensajes de éxito/error**: Feedback visual para el usuario
- ✅ **Campos adicionales**: Teléfono y selector de asunto
- ✅ **Diseño responsive**: Optimizado para móviles y desktop
- ✅ **Contador de caracteres**: Para el campo de mensaje
- ✅ **Botón de limpiar**: Para resetear el formulario
- ✅ **Placeholders útiles**: Guías visuales para el usuario
- ✅ **Integración con EmailJS**: Envío directo sin backend

## Personalización

### Modificar Asuntos Disponibles
Edita el array de opciones en el select del asunto:

```tsx
<option value="Tu Nuevo Asunto">Tu Nuevo Asunto</option>
```

### Cambiar Email de Destino
Modifica el valor de `to_email` en los `templateParams`:

```tsx
to_email: 'nuevo-email@unica.edu.pe'
```

### Personalizar Mensajes
Modifica los textos en el estado `submitStatus` para personalizar los mensajes de éxito y error.

## Solución de Problemas

### Error: "Public key required"
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que el archivo `.env.local` esté en la raíz del proyecto frontend

### Error: "Template not found"
- Verifica que el Template ID sea correcto
- Asegúrate de que la plantilla esté activa en EmailJS

### Error: "Service not found"
- Verifica que el Service ID sea correcto
- Asegúrate de que el servicio esté configurado y activo en EmailJS

## Límites de EmailJS

- **Plan gratuito**: 200 emails por mes
- **Tiempo de respuesta**: Hasta 10 segundos
- **Tamaño del email**: Máximo 50KB

Para mayor volumen, considera actualizar a un plan pago o implementar una solución backend propia.
