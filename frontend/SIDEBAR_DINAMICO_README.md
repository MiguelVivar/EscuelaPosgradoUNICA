# 🎨 Sistema de Sidebars Dinámicos - Campus Virtual

## 📋 Descripción

Este sistema permite que el sidebar del campus virtual sea diferente para cada página, adaptándose automáticamente según:
- **Página actual** (ruta)
- **Rol del usuario** (ADMIN, COORDINADOR, DOCENTE, ALUMNO, POSTULANTE)
- **Contexto de la aplicación**

## 🚀 Características

### ✨ Sidebars Adaptables
- **Página Principal** (`/campus-virtual`): Dashboard personalizado por rol
- **Panel de Administración** (`/campus-virtual/admin`): Herramientas administrativas
- **Gestión de Cursos** (`/campus-virtual/cursos-gestion`): Para coordinadores
- **Mis Cursos** (`/campus-virtual/mis-cursos`): Vista estudiante/docente
- **Mi Perfil** (`/campus-virtual/perfil`): Configuración personal

### 🎨 Variantes Visuales
Cada página tiene su propio tema de colores:
- **Dashboard**: Zinc/Amber (por defecto)
- **Administración**: Rojo
- **Gestión de Cursos**: Verde  
- **Mis Cursos**: Azul
- **Perfil**: Púrpura

### 🧩 Componentes Incluidos
- **PageHeader**: Header dinámico con breadcrumbs
- **useSidebar Hook**: Lógica centralizada del sidebar
- **Configuración por Roles**: Items específicos según permisos

## 📂 Estructura de Archivos

```
src/
├── data/
│   ├── PageSidebars.tsx          # ✨ Configuración principal
│   └── SidebarItems.tsx          # (Deprecated)
├── hooks/
│   └── useSidebar.ts             # ✨ Hook personalizado
├── components/layout/
│   ├── PageHeader.tsx            # ✨ Header dinámico
│   └── Sidebar/
│       └── Sidebar.tsx           # ✨ Actualizado con variantes
└── app/campus-virtual/
    ├── layout.tsx                # ✨ Layout simplificado
    ├── page.tsx                  # ✨ Dashboard principal
    ├── mis-cursos/page.tsx       # ✨ Vista de cursos
    ├── cursos-gestion/page.tsx   # ✨ Gestión coordinador
    └── perfil/page.tsx           # ✨ Perfil de usuario
```

## 🔧 Configuración de Sidebars

### Estructura de Configuración

```typescript
export interface PageSidebarConfig {
  [pathname: string]: {
    [role: string]: SidebarItemProps[];
  };
}
```

### Ejemplo de Configuración

```typescript
export const campusVirtualMainSidebar: PageSidebarConfig = {
  "/campus-virtual": {
    "ADMIN": [
      {
        id: "dashboard",
        icon: <FaTachometerAlt />,
        label: "Dashboard",
        href: "/campus-virtual"
      },
      {
        id: "admin-panel",
        icon: <FaUsers />,
        label: "Administración",
        href: "/campus-virtual/admin"
      }
      // ... más items
    ],
    "DOCENTE": [
      // Items específicos para docentes
    ]
  }
};
```

## 📱 Páginas Implementadas

### 1. **Dashboard Principal** (`/campus-virtual`)
- **Todos los roles**: Acceso personalizado
- **ADMIN**: Panel de administración, estadísticas, configuración
- **COORDINADOR**: Coordinación, gestión de cursos, reportes
- **DOCENTE**: Mis cursos, calificaciones, horarios
- **ALUMNO**: Mis cursos, notas, horarios, foros
- **POSTULANTE**: Postulación, documentos, resultados

### 2. **Panel de Administración** (`/campus-virtual/admin`)
- **ADMIN**: Gestión completa del sistema
- **COORDINADOR**: Gestión académica limitada
- **Tema**: Rojo - Indica sección administrativa

### 3. **Gestión de Cursos** (`/campus-virtual/cursos-gestion`)
- **Solo COORDINADOR**: Crear cursos, asignar docentes, gestionar horarios
- **Tema**: Verde - Representa crecimiento y gestión

### 4. **Mis Cursos** (`/campus-virtual/mis-cursos`)
- **DOCENTE**: Gestionar cursos, estudiantes, calificaciones
- **ALUMNO**: Ver cursos, tareas, materiales, exámenes
- **Tema**: Azul - Representa aprendizaje y conocimiento

### 5. **Mi Perfil** (`/campus-virtual/perfil`)
- **Todos los roles**: Información personal, configuraciones
- **Tema**: Púrpura - Representa personalización

## 🎯 Uso del Sistema

### 1. **Hook useSidebar**

```typescript
import { useSidebarConfig } from "@/hooks/useSidebar";

function MiComponente() {
  const sidebarConfig = useSidebarConfig();
  
  // sidebarConfig.items -> Items del sidebar
  // sidebarConfig.pageType -> Tipo de página
  // sidebarConfig.pageTitle -> Título de la página
}
```

### 2. **PageHeader Component**

```typescript
import PageHeader from "@/components/layout/PageHeader";

function MiPagina() {
  return (
    <div>
      <PageHeader 
        showBreadcrumbs={true}
        showPageInfo={true}
      />
      {/* Contenido de la página */}
    </div>
  );
}
```

### 3. **Agregar Nueva Página**

```typescript
// 1. Agregar configuración en PageSidebars.tsx
export const nuevaPaginaSidebar: PageSidebarConfig = {
  "/campus-virtual/nueva-pagina": {
    "ADMIN": [
      {
        id: "nuevo-item",
        icon: <FaIcon />,
        label: "Nuevo Item",
        href: "/campus-virtual/nueva-pagina/seccion"
      }
    ]
  }
};

// 2. Agregar al array de configuraciones
const sidebarConfigs = [
  // ... configuraciones existentes
  nuevaPaginaSidebar
];

// 3. Actualizar variantes de color (opcional)
// En Sidebar.tsx, agregar caso en getSidebarVariant()
```

## 🎨 Personalización de Temas

### Colores por Página

```typescript
// En Sidebar.tsx
const getSidebarVariant = () => {
  if (pathname.startsWith("/campus-virtual/admin")) {
    return {
      backgroundColor: "bg-red-900/95",
      borderColor: "border-red-700/50", 
      accentColor: "bg-red-600"
    };
  }
  // ... más variantes
};
```

### Agregar Nuevo Tema

```typescript
if (pathname.startsWith("/campus-virtual/mi-nueva-seccion")) {
  return {
    backgroundColor: "bg-indigo-900/95",
    borderColor: "border-indigo-700/50",
    accentColor: "bg-indigo-600"
  };
}
```

## 🔄 Migraciones

### Desde el Sistema Anterior

El sistema anterior (`SidebarItems.tsx`) ha sido reemplazado por `PageSidebars.tsx`. 

**Cambios principales:**
- ✅ Configuración por página y rol
- ✅ Temas visuales automáticos
- ✅ Header dinámico integrado
- ✅ Breadcrumbs automáticos
- ✅ Mejor organización del código

## 🚀 Próximas Mejoras

### Funcionalidades Pendientes
- [ ] **Sidebar responsivo**: Toggle para móvil
- [ ] **Temas personalizables**: Por usuario
- [ ] **Animaciones**: Transiciones suaves entre páginas
- [ ] **Shortcuts**: Atajos de teclado
- [ ] **Favoritos**: Items marcados como favoritos
- [ ] **Búsqueda**: Búsqueda dentro del sidebar

### Optimizaciones
- [ ] **Lazy loading**: Cargar items bajo demanda
- [ ] **Caché**: Cache de configuraciones
- [ ] **Performance**: Optimizar re-renders

## 📝 Notas de Desarrollo

### Principios de Diseño
1. **Consistencia**: Misma estructura para todas las páginas
2. **Flexibilidad**: Fácil agregar nuevas páginas/roles
3. **Mantenibilidad**: Código limpio y organizado
4. **Accesibilidad**: Componentes accesibles por defecto

### Patrones Utilizados
- **Compound Components**: Sidebar + SidebarItem
- **Custom Hooks**: useSidebar para lógica reutilizable
- **Configuration Objects**: PageSidebarConfig para escalabilidad
- **Theme Variants**: Colores dinámicos por contexto

### Mejores Prácticas
- ✅ **TypeScript**: Tipado completo
- ✅ **Responsive Design**: Adaptable a dispositivos
- ✅ **Accessibility**: ARIA labels y navegación por teclado
- ✅ **Performance**: React.memo en componentes pesados
- ✅ **SEO**: Meta tags dinámicos por página

---

## 🎉 ¡Resultado Final!

Con este sistema, cada página del campus virtual ahora tiene:
- ✨ **Sidebar único** adaptado a su función
- 🎨 **Tema visual** diferenciado
- 🧭 **Navegación contextual** relevante al rol
- 📱 **Header dinámico** con información útil
- 🔄 **Breadcrumbs automáticos** para orientación

El sistema es **escalable**, **mantenible** y **fácil de extender** para futuras funcionalidades.
