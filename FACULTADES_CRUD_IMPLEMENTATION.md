# 🏛️ CRUD Completo de Facultades - Implementación

## 📋 Resumen de la Implementación

Se ha implementado un **CRUD completo para la gestión de Facultades** en el sistema de la Escuela de Posgrado UNICA, siguiendo la arquitectura de microservicios y el estilo establecido del proyecto.

## 🏗️ Arquitectura del Sistema

### Microservicio Backend
- **Matrícula**: Puerto 8082 (gestión de facultades, sedes, aulas, períodos académicos)

### Frontend
- **Next.js 14** con TypeScript
- **Tailwind CSS** para estilos (solo clases predeterminadas)
- **SweetAlert2** para notificaciones
- **GSAP** para animaciones simples
- **Componentes comunes** reutilizables (Button, etc.)

## 🎯 Endpoints del Backend (Puerto 8082)

```
GET    /api/matricula/facultades                     - Obtener todas las facultades
GET    /api/matricula/facultades/activas             - Obtener facultades activas
GET    /api/matricula/facultades/con-programas       - Obtener facultades con programas activos
GET    /api/matricula/facultades/{id}                - Obtener facultad por ID
POST   /api/matricula/facultades                     - Crear nueva facultad
PUT    /api/matricula/facultades/{id}                - Actualizar facultad
DELETE /api/matricula/facultades/{id}                - Eliminar facultad (borrado lógico)
PATCH  /api/matricula/facultades/{id}/toggle-active  - Activar/desactivar facultad
GET    /api/matricula/facultades/buscar?nombre=...   - Buscar por nombre
GET    /api/matricula/facultades/buscar-por-decano?decano=... - Buscar por decano
```

## 📁 Archivos Creados/Modificados

### 1. Backend (Microservicio Matrícula)

**`backend/Matricula/src/main/java/com/escuelaposgrado/Matricula/service/FacultadService.java`**
- Servicio completo para operaciones CRUD
- Validaciones de negocio (códigos y nombres únicos)
- Búsquedas por nombre y decano
- Borrado lógico

**`backend/Matricula/src/main/java/com/escuelaposgrado/Matricula/controller/FacultadController.java`**
- Controlador REST con todos los endpoints
- Documentación Swagger completa
- Validaciones de seguridad con roles
- Manejo de errores HTTP

### 2. Frontend (Next.js)

**`frontend/src/types/facultad.ts`**
- Interfaces TypeScript para Facultad, FacultadForm, FacultadRequest
- Tipos para respuestas de API

**`frontend/src/services/facultadesService.ts`**
- Servicio completo para comunicación con el backend
- Manejo de autenticación JWT
- Gestión de errores y diferentes estructuras de respuesta
- Logging detallado para debugging

**`frontend/src/app/campus-virtual/matricula/facultades/page.tsx`**
- Página principal del CRUD de facultades
- Tabla responsive con filtros y búsquedas
- Modal para crear/editar facultades
- Estadísticas en tiempo real
- Animaciones GSAP
- Componentes comunes del proyecto

### 3. Configuración de Navegación

**`frontend/src/data/PageSidebars.tsx`**
- Agregado "Gestión de Facultades" al menú de matrícula
- Disponible para roles ADMIN y COORDINADOR
- Icono FaUniversity

**`frontend/src/hooks/useSidebar.ts`**
- Agregado breadcrumbs para facultades
- Integración con el sistema de navegación

**`frontend/src/services/matriculaService.ts`**
- Agregados endpoints de facultades al servicio principal

## 🎨 Características de la Interfaz

### Diseño y Estilos
- **Colores del proyecto**: Amber (dorado) como color principal
- **Solo clases Tailwind CSS**: Sin CSS personalizado
- **Responsive**: Funciona en desktop, tablet y móvil
- **Accesibilidad**: Títulos para elementos interactivos

### Componentes Utilizados
- **Button**: Componente común del proyecto con variantes
- **SweetAlert2**: Para confirmaciones y notificaciones
- **React Icons**: Iconos consistentes (FaUniversity, FaGraduationCap, etc.)

### Animaciones GSAP
- Entrada de página con fadeIn y slide
- Animación de modal con scale y bounce
- Stagger en filas de tabla
- Animación de estadísticas

### Funcionalidades
- ✅ **CRUD Completo**: Crear, leer, actualizar, eliminar
- ✅ **Búsquedas Múltiples**: Por nombre y por decano
- ✅ **Filtros**: Por estado (activas/inactivas/todas)
- ✅ **Estadísticas**: Totales, activas, inactivas
- ✅ **Validaciones**: Frontend y backend
- ✅ **Confirmaciones**: Para operaciones destructivas
- ✅ **Estados**: Activar/desactivar facultades
- ✅ **Responsivo**: Diseño adaptativo

## 🚀 Cómo Acceder

1. **Iniciar Sesión** como ADMIN o COORDINADOR
2. **Campus Virtual** → **Panel de Administración** → **Módulo Matrícula**
3. **Gestión de Facultades**

## 🔐 Permisos y Roles

- **ADMIN**: Acceso completo (CRUD)
- **COORDINADOR**: Acceso completo (CRUD)
- **USER**: Solo lectura (si se implementa en el futuro)

## 📊 Datos de Facultad

### Campos Obligatorios
- **Nombre**: Nombre completo de la facultad
- **Código**: Código único identificador

### Campos Opcionales
- **Decano**: Nombre del decano actual
- **Descripción**: Descripción de la facultad

### Campos Automáticos
- **ID**: Generado automáticamente
- **Activo**: Estado de la facultad
- **Fecha Creación**: Timestamp de creación
- **Fecha Actualización**: Timestamp de última modificación

## 🔄 Integración con el Sistema

### Entidades Relacionadas
- **ProgramaEstudio**: Los programas pertenecen a facultades
- **ComisionUnidadPosgrado**: Las comisiones pertenecen a facultades

### Consistencia con el Patrón
- Sigue exactamente el patrón de **AulasService** y **SedesService**
- Utiliza los mismos colores y estilos del proyecto
- Mantiene la estructura de carpetas establecida
- Usa los mismos componentes comunes

## 🧪 Validaciones Implementadas

### Frontend
- Campos requeridos (nombre, código)
- Longitud máxima de caracteres
- Validación de formularios

### Backend
- Nombres únicos de facultades
- Códigos únicos de facultades
- Validación de entradas con Bean Validation
- Manejo de excepciones específicas

## 📝 Estructura de Respuestas API

### Éxito
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {
    "id": 1,
    "nombre": "Facultad de Ingeniería",
    "codigo": "FI",
    "decano": "Dr. Juan Pérez",
    "descripcion": "Facultad de carreras de ingeniería",
    "activo": true,
    "fechaCreacion": "2024-01-15T10:00:00",
    "fechaActualizacion": "2024-01-15T10:00:00"
  }
}
```

### Error
```json
{
  "success": false,
  "message": "Ya existe una facultad con el código FI",
  "errors": ["Código duplicado"]
}
```

## 🔍 Búsquedas Disponibles

1. **Por Nombre**: Búsqueda parcial case-insensitive
2. **Por Decano**: Búsqueda parcial case-insensitive
3. **Por Estado**: Filtro por activas/inactivas/todas
4. **Facultades con Programas**: Solo facultades que tienen programas activos

## 📈 Próximas Mejoras Sugeridas

1. **Paginación**: Para listas grandes de facultades
2. **Exportación**: Excel/PDF de listados
3. **Importación**: Carga masiva desde archivos
4. **Auditoría**: Historial de cambios
5. **Dashboard**: Gráficos y métricas avanzadas

---

**Implementación completada siguiendo el patrón establecido del proyecto y utilizando únicamente clases predeterminadas de Tailwind CSS.**
