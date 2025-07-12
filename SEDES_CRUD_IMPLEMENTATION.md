# CRUD Completo de Sedes - Implementación TypeScript

## 📋 Resumen de la Implementación

Se ha implementado un **CRUD completo para la gestión de Sedes** en el sistema de la Escuela de Posgrado UNICA, siguiendo la arquitectura de microservicios y utilizando únicamente TypeScript para el frontend.

## 🏗️ Arquitectura del Sistema

### Microservicios Backend
- **Autenticación**: Puerto 8080 (JWT, gestión de usuarios)
- **Intranet**: Puerto 8081 (funcionalidades internas)
- **Matrícula**: Puerto 8082 (gestión de sedes, períodos académicos)

### Frontend
- **Next.js 14** con TypeScript
- **Tailwind CSS** para estilos
- **Autenticación JWT** con manejo de roles
- **SweetAlert2** para notificaciones

## 📁 Archivos Creados/Modificados

### 1. Tipos TypeScript
**`src/types/sede.ts`**
- Interfaces: `Sede`, `SedeForm`, `SedeRequest`
- Validaciones y estructuras de datos

### 2. Servicio de API
**`src/services/sedesService.ts`**
- CRUD completo: crear, leer, actualizar, eliminar
- Funciones adicionales: buscar, activar/desactivar
- Manejo de errores y autenticación JWT
- Configuración para microservicio de Matrícula (puerto 8082)

### 3. Página Principal de Sedes
**`src/app/campus-virtual/matricula/sedes/page.tsx`**
- Interfaz completa con tabla responsiva
- Modales para crear/editar sedes
- Funcionalidades de búsqueda y filtrado
- Confirmaciones para eliminar
- Indicadores de estado (activo/inactivo)

### 4. Configuración de Navegación
**`src/data/PageSidebars.tsx`**
- Menú lateral para módulo de matrícula
- Acceso desde panel de administración
- Breadcrumbs dinámicos

### 5. Servicios y Configuración
**`src/services/matriculaService.ts`** - Endpoints de sedes
**`src/lib/api.ts`** - URL del microservicio de matrícula
**`src/hooks/useSidebar.ts`** - Navegación y títulos

## ⚙️ Funcionalidades Implementadas

### ✅ Operaciones CRUD
- **Crear Sede**: Formulario con validaciones
- **Listar Sedes**: Tabla con paginación y búsqueda
- **Editar Sede**: Modal con datos precargados
- **Eliminar Sede**: Confirmación con SweetAlert2
- **Activar/Desactivar**: Toggle de estado

### ✅ Características Adicionales
- **Búsqueda**: Por nombre de sede
- **Filtros**: Sedes activas/inactivas
- **Validaciones**: Campos obligatorios y formatos
- **Feedback**: Notificaciones de éxito/error
- **Responsive**: Diseño adaptativo móvil

### ✅ Seguridad y Autenticación
- **Control de Acceso**: Solo ADMIN y COORDINADOR
- **JWT**: Validación de tokens
- **Autorización**: Verificación de permisos en cada operación

## 🎯 Endpoints del Backend (Puerto 8082)

```
GET    /api/matricula/sedes                  - Obtener todas las sedes
GET    /api/matricula/sedes/activas          - Obtener sedes activas
GET    /api/matricula/sedes/{id}             - Obtener sede por ID
POST   /api/matricula/sedes                  - Crear nueva sede
PUT    /api/matricula/sedes/{id}             - Actualizar sede
DELETE /api/matricula/sedes/{id}             - Eliminar sede
PATCH  /api/matricula/sedes/{id}/toggle-active - Activar/desactivar sede
GET    /api/matricula/sedes/buscar?nombre=... - Buscar por nombre
```

## 🚀 Cómo Acceder

1. **Iniciar Sesión** como ADMIN o COORDINADOR
2. **Campus Virtual** → **Panel de Administración** → **Módulo Matrícula**
3. **Gestión de Sedes**

## 🔧 Configuración de Desarrollo

### Variables de Entorno
```env
NEXT_PUBLIC_API_URL=http://localhost:8080          # Autenticación
NEXT_PUBLIC_MATRICULA_API_URL=http://localhost:8082 # Matrícula
```

### Comandos
```bash
# Instalar dependencias
pnpm install

# Ejecutar frontend
pnpm dev

# Ejecutar backend (desde cada microservicio)
./mvnw spring-boot:run
```

## 📊 Estructura de Datos

### Modelo Sede
```typescript
interface Sede {
  id: number;
  nombre: string;
  codigo: string;
  direccion: string;
  telefono?: string;
  email?: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}
```

## 🔒 Niveles de Acceso

| Rol | Permisos |
|-----|----------|
| **ADMIN** | CRUD completo, activar/desactivar, eliminar |
| **COORDINADOR** | CRUD completo, activar/desactivar |
| **DOCENTE** | Solo lectura (próximamente) |
| **ALUMNO** | Solo lectura (próximamente) |

## 🎨 Características de UI/UX

- **Diseño Moderno**: Interfaz limpia con Tailwind CSS
- **Responsivo**: Optimizado para móviles y tablets
- **Interactivo**: Modales, confirmaciones, feedback visual
- **Accesible**: Navegación por teclado, labels semánticos
- **Consistente**: Sigue patrones del resto del sistema

## 📈 Próximas Mejoras

- [ ] Paginación avanzada
- [ ] Filtros múltiples
- [ ] Exportación a Excel/PDF
- [ ] Historial de cambios
- [ ] Validación de unicidad en tiempo real
- [ ] Imágenes de sedes

## 🏆 Implementación Completada

✅ **CRUD Completo implementado con TypeScript**  
✅ **Integración con microservicio de Matrícula**  
✅ **Navegación y menús configurados**  
✅ **Autenticación y autorización**  
✅ **Interfaz de usuario completa**  
✅ **Manejo de errores robusto**  

---

**Desarrollado para**: Escuela de Posgrado UNICA  
**Tecnologías**: Next.js 14, TypeScript, Spring Boot, PostgreSQL  
**Arquitectura**: Microservicios con autenticación JWT
