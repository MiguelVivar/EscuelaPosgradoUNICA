import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getSidebarForPage } from "@/data/PageSidebars";
import { SidebarItemProps } from "@/types";

export interface SidebarConfig {
  items: SidebarItemProps[];
  pageType: 'dashboard' | 'admin' | 'cursos' | 'perfil' | 'default';
  pageTitle: string;
}

export function useSidebarConfig(): SidebarConfig {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Función personalizada para cerrar sesión y redirigir
  const handleLogout = async () => {
    try {
      logout();
      // Redirigir al usuario a la página de inicio de sesión
      router.push('/iniciar-sesion');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Determinar el tipo de página
  const getPageType = (): SidebarConfig['pageType'] => {
    if (pathname.startsWith("/campus-virtual/admin")) return 'admin';
    if (pathname.startsWith("/campus-virtual/cursos-gestion")) return 'cursos';
    if (pathname.startsWith("/campus-virtual/mis-cursos")) return 'cursos';
    if (pathname.startsWith("/campus-virtual/perfil")) return 'perfil';
    if (pathname === "/campus-virtual") return 'dashboard';
    return 'default';
  };

  // Obtener el título de la página
  const getPageTitle = (): string => {
    const pageType = getPageType();
    switch (pageType) {
      case 'admin':
        return user?.role === 'ADMIN' ? 'Panel de Administración' : 'Panel de Coordinación';
      case 'cursos':
        if (pathname.startsWith("/campus-virtual/cursos-gestion")) {
          return 'Gestión de Cursos';
        }
        return user?.role === 'DOCENTE' ? 'Mis Cursos - Docente' : 'Mis Cursos';
      case 'perfil':
        return 'Mi Perfil';
      case 'dashboard':
        return `Campus Virtual - ${user?.role || 'Usuario'}`;
      default:
        return 'Campus Virtual';
    }
  };

  // Procesar items del sidebar
  const processItems = (items: SidebarItemProps[]): SidebarItemProps[] => {
    return items.map(item => ({
      ...item,
      isActive: item.href === pathname,
      // Agregar funcionalidad especial para cerrar sesión
      onClick: item.id === "cerrar-sesion" ? handleLogout : item.onClick
    }));
  };

  // Obtener items del sidebar
  const getSidebarItems = (): SidebarItemProps[] => {
    const items = getSidebarForPage(pathname, user?.role);
    return processItems(items);
  };

  return {
    items: getSidebarItems(),
    pageType: getPageType(),
    pageTitle: getPageTitle()
  };
}

// Hook adicional para obtener información de breadcrumbs
export function useBreadcrumbs() {
  const pathname = usePathname();
  
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    // Siempre empezar con Campus Virtual
    breadcrumbs.push({
      label: 'Campus Virtual',
      href: '/campus-virtual',
      isActive: pathname === '/campus-virtual'
    });
    
    // Agregar segmentos específicos
    if (segments.includes('admin')) {
      breadcrumbs.push({
        label: 'Administración',
        href: '/campus-virtual/admin',
        isActive: pathname === '/campus-virtual/admin'
      });
    }
    
    if (segments.includes('cursos-gestion')) {
      breadcrumbs.push({
        label: 'Gestión de Cursos',
        href: '/campus-virtual/cursos-gestion',
        isActive: pathname === '/campus-virtual/cursos-gestion'
      });
    }
    
    if (segments.includes('mis-cursos')) {
      breadcrumbs.push({
        label: 'Mis Cursos',
        href: '/campus-virtual/mis-cursos',
        isActive: pathname === '/campus-virtual/mis-cursos'
      });
    }
    
    if (segments.includes('perfil')) {
      breadcrumbs.push({
        label: 'Mi Perfil',
        href: '/campus-virtual/perfil',
        isActive: pathname === '/campus-virtual/perfil'
      });
    }
    
    return breadcrumbs;
  };
  
  return getBreadcrumbs();
}
