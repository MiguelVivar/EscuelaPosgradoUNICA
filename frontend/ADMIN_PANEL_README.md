# Panel de Administración - Campus Virtual

## Descripción

Se ha implementado una página de administración del campus virtual que está **exclusivamente disponible para usuarios con rol ADMIN o COORDINADOR** del microservicio de autenticación.

## Ubicación

**Ruta:** `/campus-virtual/admin`
**Archivo:** `frontend/src/app/campus-virtual/admin/page.tsx`

## Características Implementadas

### 🔐 Seguridad y Acceso

- **Verificación de Autenticación**: La página verifica que el usuario esté autenticado
- **Control de Roles**: Solo permite acceso a usuarios con rol `ADMIN` o `COORDINADOR`
- **Redirección Automática**: 
  - Si no está autenticado → `/iniciar-sesion`
  - Si no tiene permisos → `/campus-virtual`
- **Middleware Actualizado**: Se actualizó el middleware para proteger rutas de administración

### 👨‍💼 Funcionalidades para ADMIN

#### Dashboard de Estadísticas
- **Total de usuarios** en el sistema
- **Usuarios por rol**: Admins, Docentes, Alumnos, Coordinadores, Postulantes
- Visualización en tarjetas con colores distintivos

#### Gestión de Usuarios
- **Listar todos los usuarios** del sistema
- **Filtrar por rol** (Todos, Admin, Coordinador, Docente, Alumno, Postulante)
- **Activar/Desactivar usuarios** con un solo clic
- **Ver información completa**: nombres, email, rol, estado, último acceso
- **Códigos específicos**: Código de estudiante/docente según corresponda

#### Endpoints Utilizados
- `GET /api/admin/estadisticas` - Estadísticas del sistema
- `GET /api/admin/usuarios` - Lista completa de usuarios
- `GET /api/admin/usuarios/rol/{role}` - Usuarios filtrados por rol
- `PUT /api/admin/usuarios/{id}/activar` - Activar usuario
- `PUT /api/admin/usuarios/{id}/desactivar` - Desactivar usuario

### 👨‍🏫 Funcionalidades para COORDINADOR

#### Gestión Académica
- **Ver docentes** del sistema
- **Ver alumnos** registrados
- **Ver postulantes** activos
- **Ver otros coordinadores**
- **Visualización sin modificación**: Los coordinadores pueden ver pero no modificar

#### Endpoints Utilizados
- `GET /api/coordinador/docentes` - Lista de docentes
- `GET /api/coordinador/alumnos` - Lista de alumnos
- `GET /api/coordinador/postulantes` - Lista de postulantes
- `GET /api/coordinador/coordinadores` - Lista de coordinadores

## 🎨 Diseño y Estilo

### Consistencia con el Frontend
- **Mismo esquema de colores**: Gradientes azul/ámbar/slate
- **Componentes glassmorphism**: Fondo translúcido con blur
- **Responsive design**: Adaptable a diferentes pantallas
- **Animaciones suaves**: Transiciones de 200ms
- **Tipografía consistente**: Mismas fuentes y tamaños

### Solo Clases Predeterminadas de Tailwind
- No se utilizó CSS personalizado
- Todas las clases son estándar de Tailwind CSS
- Colores de la paleta predeterminada: blue, red, green, purple, amber, etc.

## 🔗 Integración con el Sistema

### Acceso desde Campus Virtual
- Se agregó un botón en la sección "Acceso Rápido" del campus virtual
- **Visible solo para ADMIN y COORDINADOR**
- Texto diferenciado según el rol:
  - ADMIN: "Panel de Administración"
  - COORDINADOR: "Panel de Coordinación"

### Tipos de TypeScript Actualizados
- Se agregó la propiedad `activo: boolean` al tipo `UsuarioResponse`
- Mantiene compatibilidad con la API del backend

## 🛡️ Seguridad Implementada

### Frontend
1. **Verificación de autenticación** en `useEffect`
2. **Verificación de rol** antes de mostrar contenido
3. **Redirección automática** para usuarios no autorizados
4. **Middleware actualizado** para proteger rutas

### Backend (Existente)
1. **JWT Token validation** en todas las llamadas
2. **Role-based access control** mediante `@PreAuthorize`
3. **Endpoints específicos** por rol

## 📊 Funcionalidades Técnicas

### Manejo de Estados
- `useState` para gestión del estado local
- `useEffect` para carga inicial y verificaciones
- `useAuth` para contexto de autenticación
- `useRouter` para navegación

### Llamadas a la API
- Configuración centralizada en `lib/api.ts`
- Headers de autorización automáticos
- Manejo de errores con try/catch
- Feedback visual para el usuario

### Componentes
- **Tablas responsivas** para listado de usuarios
- **Cards de estadísticas** con contadores
- **Filtros dinámicos** por rol
- **Botones de acción** con estados visuales

## 🚀 Próximas Mejoras Sugeridas

1. **Paginación** para listas grandes de usuarios
2. **Búsqueda por texto** en la tabla de usuarios
3. **Exportación de datos** en formato Excel/PDF
4. **Logs de actividad** administrativa
5. **Notificaciones** para acciones administrativas

## 📝 Notas de Desarrollo

- La página está completamente funcional y lista para producción
- Sigue las mejores prácticas de React y Next.js
- Mantiene la consistencia visual del sistema
- Implementa toda la funcionalidad requerida del microservicio de autenticación
