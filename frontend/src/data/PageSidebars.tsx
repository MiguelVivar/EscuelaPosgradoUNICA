import { SidebarItemProps } from "@/types";
import { 
  FaUser, 
  FaUsers,
  FaHome,
  FaBell,
  FaQuestionCircle,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";

// Configuración de sidebars por página y rol
export interface PageSidebarConfig {
  [key: string]: {
    [role: string]: SidebarItemProps[];
  };
}

// Sidebar para la página principal del campus virtual
export const campusVirtualMainSidebar: PageSidebarConfig = {
  "/campus-virtual": {
    "ADMIN": [
      {
        id: "campus-virtual",
        icon: <FaHome />,
        label: "Campus Virtual",
        href: "/campus-virtual"
      },
      {
        id: "perfil",
        icon: <FaUser />,
        label: "Mi Perfil",
        href: "/campus-virtual/perfil"
      },
      {
        id: "cerrar-sesion",
        icon: <FaSignOutAlt />,
        label: "Cerrar Sesión",
      }
    ],
    "COORDINADOR": [
      {
        id: "campus-virtual",
        icon: <FaTachometerAlt />,
        label: "Campus Virtual",
        href: "/campus-virtual"
      },
      {
        id: "perfil",
        icon: <FaUser />,
        label: "Mi Perfil",
        href: "/campus-virtual/perfil"
      },
      {
        id: "cerrar-sesion",
        icon: <FaSignOutAlt />,
        label: "Cerrar Sesión",
      }
    ],
    "DOCENTE": [
      {
        id: "campus-virtual",
        icon: <FaTachometerAlt />,
        label: "Campus Virtual",
        href: "/campus-virtual"
      },
      {
        id: "perfil",
        icon: <FaUser />,
        label: "Mi Perfil",
        href: "/campus-virtual/perfil"
      },
      {
        id: "cerrar-sesion",
        icon: <FaSignOutAlt />,
        label: "Cerrar Sesión",
      }
    ],
    "ALUMNO": [
      {
        id: "campus-virtual",
        icon: <FaTachometerAlt />,
        label: "Campus Virtual",
        href: "/campus-virtual"
      },
      {
        id: "perfil",
        icon: <FaUser />,
        label: "Mi Perfil",
        href: "/campus-virtual/perfil"
      },
      {
        id: "cerrar-sesion",
        icon: <FaSignOutAlt />,
        label: "Cerrar Sesión",
      }
    ],
    "POSTULANTE": [
      {
        id: "campus-virtual",
        icon: <FaTachometerAlt />,
        label: "Campus Virtual",
        href: "/campus-virtual"
      },
      {
        id: "perfil",
        icon: <FaUser />,
        label: "Mi Perfil",
        href: "/campus-virtual/perfil"
      },
      {
        id: "cerrar-sesion",
        icon: <FaSignOutAlt />,
        label: "Cerrar Sesión",
      }
    ]
  }
};

// Sidebar para el panel de administración
export const adminPanelSidebar: PageSidebarConfig = {
  "/campus-virtual/admin": {
    "ADMIN": [
      {
        id: "volver",
        icon: <FaHome />,
        label: "Campus Virtual",
        href: "/campus-virtual"
      },
      {
        id: "usuarios",
        icon: <FaUsers />,
        label: "Gestión Usuarios",
        href: "/campus-virtual/admin"
      },
      {
        id: "cerrar-sesion",
        icon: <FaSignOutAlt />,
        label: "Cerrar Sesión",
      }
    ],
    "COORDINADOR": [
      {
        id: "volver",
        icon: <FaHome />,
        label: "Campus Virtual",
        href: "/campus-virtual"
      },
      {
        id: "coordinacion",
        icon: <FaUsers />,
        label: "Panel Coordinación",
        href: "/campus-virtual/admin"
      },
      {
        id: "cerrar-sesion",
        icon: <FaSignOutAlt />,
        label: "Cerrar Sesión",
      }
    ]
  }
};

// Sidebar para el perfil de usuario
export const perfilSidebar: PageSidebarConfig = {
  "/campus-virtual/perfil": {
    "*": [ // Para todos los roles
      {
        id: "volver",
        icon: <FaHome />,
        label: "Campus Virtual",
        href: "/campus-virtual"
      },
      {
        id: "informacion-personal",
        icon: <FaUser />,
        label: "Información Personal",
        href: "/campus-virtual/perfil"
      },
      {
        id: "notificaciones",
        icon: <FaBell />,
        label: "Notificaciones",
        href: "/campus-virtual/perfil/notificaciones"
      },
      {
        id: "ayuda",
        icon: <FaQuestionCircle />,
        label: "Ayuda",
        href: "/campus-virtual/perfil/ayuda"
      },
      {
        id: "cerrar-sesion",
        icon: <FaSignOutAlt />,
        label: "Cerrar Sesión",
      }
    ]
  }
};

// Función para obtener el sidebar apropiado según la página y el rol
export function getSidebarForPage(pathname: string, userRole?: string): SidebarItemProps[] {
  // Configuraciones de sidebar por página
  const sidebarConfigs = [
    campusVirtualMainSidebar,
    adminPanelSidebar,
    perfilSidebar
  ];

  // Buscar configuración exacta
  for (const config of sidebarConfigs) {
    if (config[pathname]) {
      const roleConfig = config[pathname][userRole || ""] || config[pathname]["*"];
      if (roleConfig) {
        return roleConfig;
      }
    }
  }

  // Buscar configuración por patrón (para rutas dinámicas)
  for (const config of sidebarConfigs) {
    for (const configPath of Object.keys(config)) {
      if (pathname.startsWith(configPath) && configPath !== pathname) {
        const roleConfig = config[configPath][userRole || ""] || config[configPath]["*"];
        if (roleConfig) {
          return roleConfig;
        }
      }
    }
  }

  // Fallback: sidebar básico
  return [
    {
      id: "campus-virtual",
      icon: <FaTachometerAlt />,
      label: "Campus Virtual",
      href: "/campus-virtual"
    },
    {
      id: "perfil",
      icon: <FaUser />,
      label: "Mi Perfil",
      href: "/campus-virtual/perfil"
    }
  ];
}
