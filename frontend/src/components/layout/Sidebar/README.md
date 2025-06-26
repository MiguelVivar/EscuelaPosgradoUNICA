# Sidebar Component

Un componente de sidebar reutilizable para la aplicación de la Escuela de Posgrado UNICA.

## Características

- **Responsive**: Soporte para modo angosto y ancho
- **Tooltips**: Muestra tooltips en modo angosto al hacer hover
- **Hover Content**: Algunos items pueden mostrar contenido expandido
- **Enlaces y Acciones**: Soporte tanto para navegación (href) como acciones (onClick)
- **Estado Activo**: Indica visualmente el item actualmente seleccionado
- **Totalmente Reutilizable**: Fácil configuración para diferentes casos de uso

## Uso Básico

```tsx
import Sidebar from "@/components/layout/Sidebar";
import { SidebarItemProps } from "@/types";

const sidebarItems: SidebarItemProps[] = [
  {
    id: "inicio",
    icon: <HomeIcon />,
    label: "Inicio",
    href: "/",
    isActive: true,
  },
  {
    id: "perfil",
    icon: <UserIcon />,
    label: "Perfil",
    onClick: () => console.log("Perfil clicked"),
  }
];

function App() {
  return (
    <Sidebar
      items={sidebarItems}
      width="narrow"
      position="left"
    />
  );
}
```

## Props del Sidebar

### `SidebarProps`

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `items` | `SidebarItemProps[]` | - | Array de items del sidebar |
| `className` | `string` | `""` | Clases CSS adicionales |
| `width` | `"narrow" \| "wide"` | `"narrow"` | Ancho del sidebar |
| `position` | `"left" \| "right"` | `"left"` | Posición del sidebar |
| `backgroundColor` | `string` | `"bg-gray-900/95"` | Color de fondo |

### `SidebarItemProps`

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `id` | `string` | - | Identificador único del item |
| `icon` | `ReactNode` | - | Icono del item |
| `label` | `string` | - | Texto del item |
| `href` | `string` | - | URL para navegación (opcional) |
| `onClick` | `() => void` | - | Función para manejar clicks (opcional) |
| `isActive` | `boolean` | `false` | Si el item está activo |
| `hasHover` | `boolean` | `false` | Si debe mostrar contenido al hover |
| `hoverContent` | `object` | - | Contenido a mostrar en hover |

### `hoverContent`

```tsx
{
  title?: string;      // Título del contenido hover
  items?: string[];    // Lista de items a mostrar
}
```

## Ejemplos de Uso

### Sidebar con Enlaces

```tsx
const navigationItems: SidebarItemProps[] = [
  {
    id: "dashboard",
    icon: <DashboardIcon />,
    label: "Dashboard",
    href: "/dashboard",
    isActive: currentPath === "/dashboard",
  },
  {
    id: "users",
    icon: <UsersIcon />,
    label: "Usuarios",
    href: "/users",
    isActive: currentPath === "/users",
  }
];
```

### Sidebar con Contenido Hover

```tsx
const academicItems: SidebarItemProps[] = [
  {
    id: "academic-info",
    icon: <InfoIcon />,
    label: "Info. Académica",
    hasHover: true,
    hoverContent: {
      title: "Información Académica",
      items: [
        "Notas",
        "Plan de estudios", 
        "Inasistencias",
        "Situación Académica"
      ]
    },
    onClick: () => handleAcademicInfo(),
  }
];
```

### Sidebar con Acciones

```tsx
const actionItems: SidebarItemProps[] = [
  {
    id: "logout",
    icon: <LogoutIcon />,
    label: "Cerrar Sesión",
    onClick: () => {
      // Lógica de logout
      logout();
    },
  }
];
```

## Estilos

El sidebar utiliza Tailwind CSS con las siguientes características:

- **Fondo**: `bg-gray-900/95` con backdrop blur
- **Hover**: Efectos de hover suaves con `hover:bg-white/10`
- **Transiciones**: Animaciones suaves de 200-300ms
- **Sombras**: `shadow-2xl` para profundidad
- **Bordes**: `border-gray-700/50` para separación sutil

## Iconos

Puedes usar cualquier librería de iconos. Ejemplos populares:

- **Heroicons**: `import { HomeIcon } from '@heroicons/react/24/outline'`
- **Lucide React**: `import { Home } from 'lucide-react'`
- **React Icons**: `import { FaHome } from 'react-icons/fa'`

## Integración con Next.js

Para usar con Next.js App Router:

```tsx
// layout.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar items={sidebarItems} />
      <main className="flex-1 ml-16"> {/* ml-16 para narrow, ml-64 para wide */}
        {children}
      </main>
    </div>
  );
}
```

## Estados y Manejo

```tsx
function MyApp() {
  const [activeItem, setActiveItem] = useState("inicio");
  const [sidebarWidth, setSidebarWidth] = useState<"narrow" | "wide">("narrow");

  const items = sidebarData.map(item => ({
    ...item,
    isActive: item.id === activeItem,
    onClick: () => setActiveItem(item.id),
  }));

  return (
    <Sidebar 
      items={items} 
      width={sidebarWidth}
      onWidthChange={setSidebarWidth}
    />
  );
}
```

## Responsive Design

El sidebar es totalmente responsive:

- **Mobile**: Se puede ocultar/mostrar con un botón
- **Tablet**: Modo narrow por defecto
- **Desktop**: Modo wide disponible

## Accesibilidad

- Soporte completo para teclado
- ARIA labels apropiados
- Contraste de colores accesible
- Focus states visibles
