# Componentes de Autoridades

Este módulo contiene todos los componentes relacionados con la visualización y gestión de autoridades y jurados de la institución.

## Estructura de Componentes

### 📁 Componentes Principales

#### `AuthoritiesPageLayout`
Layout principal para las páginas de autoridades con estilos consistentes.

#### `AuthorityPageHeader`
Componente de encabezado con título y subtítulo personalizable.

#### `AuthorityGrid`
Grid responsivo que organiza las tarjetas de autoridades.

#### `AuthorityCard`
Tarjeta individual que muestra la información de una autoridad.

### 📁 Componentes Granulares

#### `AuthorityImage`
Componente especializado para mostrar imágenes de autoridades con dimensiones optimizadas.

#### `AuthorityInfo`
Muestra nombre y título de la autoridad.

#### `ResolutionLink`
Enlace especializado para las resoluciones de nombramiento.

#### `AuthorityActionButton`
Botón de acción que maneja enlaces externos e internos.

#### `AuthorityFilters`
Componente de filtros para categorizar autoridades (preparado para futuras implementaciones).

## Tipos TypeScript

### `Authority`
```typescript
interface Authority {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  resolution: string;
  externalLink?: string;
}
```

### Props de Componentes
- `AuthorityCardProps`
- `AuthorityGridProps`
- `AuthorityPageHeaderProps`

## Hook Personalizado

### `useAuthorities`
Hook que maneja la lógica de estado para autoridades:
- Carga de datos
- Estados de loading y error
- Funciones de búsqueda y filtrado

```typescript
const { authorities, loading, error, getAuthorityById, getAuthoritiesByRole } = useAuthorities();
```

## Datos

### `authoritiesData`
Archivo centralizado en `/src/data/authorities.ts` que contiene toda la información de autoridades.

## Uso

```tsx
import { 
  AuthoritiesPageLayout,
  AuthorityPageHeader,
  AuthorityGrid 
} from '@/components/ui/authorities';
import { useAuthorities } from '@/hooks/authorities';

const AuthoritiesPage = () => {
  const { authorities, loading, error } = useAuthorities();

  return (
    <AuthoritiesPageLayout>
      <AuthorityPageHeader title="Autoridades y Jurados" />
      <AuthorityGrid authorities={authorities} />
    </AuthoritiesPageLayout>
  );
};
```

## Ventajas de esta Estructura

1. **Modularidad**: Cada componente tiene una responsabilidad específica
2. **Reutilización**: Los componentes pueden usarse en diferentes contextos
3. **Mantenibilidad**: Código organizado y fácil de mantener
4. **Escalabilidad**: Fácil agregar nuevas funcionalidades
5. **Testing**: Componentes pequeños son más fáciles de probar
6. **TypeScript**: Tipado fuerte para mejor desarrollo

## Futuras Mejoras

- Integración con API backend
- Funcionalidad de búsqueda avanzada
- Filtros dinámicos
- Animaciones con GSAP
- Lazy loading de imágenes
- Paginación para grandes listas
