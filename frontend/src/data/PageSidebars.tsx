import { SidebarItemProps } from "@/types";
import { 
  FaUser, 
  FaUsers,
  FaHome,
  FaBell,
  FaQuestionCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaGraduationCap,
  FaBuilding,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUniversity,
  FaChartBar,
  FaCreditCard,
  FaHistory,
  FaFileInvoice
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
        id: "admin-panel",
        icon: <FaUsers />,
        label: "Administración",
        href: "/campus-virtual/admin"
      },
      {
        id: "encuestas",
        icon: <FaChartBar />,
        label: "Encuestas",
        href: "/campus-virtual/intranet/encuestas"
      },
      {
        id: "pagos",
        icon: <FaCreditCard />,
        label: "Sistema Pagos",
        href: "/campus-virtual/intranet/pagos"
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
        id: "encuestas",
        icon: <FaChartBar />,
        label: "Encuestas",
        href: "/campus-virtual/intranet/encuestas"
      },
      {
        id: "pagos",
        icon: <FaCreditCard />,
        label: "Pagos",
        href: "/campus-virtual/intranet/pagos"
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
        id: "matricula",
        icon: <FaGraduationCap />,
        label: "Módulo Matrícula",
        href: "/campus-virtual/matricula"
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
        id: "matricula",
        icon: <FaGraduationCap />,
        label: "Módulo Matrícula",
        href: "/campus-virtual/matricula"
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

// Sidebar para el módulo de matrícula
export const matriculaSidebar: PageSidebarConfig = {
  "/campus-virtual/matricula": {
    "ADMIN": [
      {
        id: "volver",
        icon: <FaHome />,
        label: "Campus Virtual",
        href: "/campus-virtual"
      },
      {
        id: "periodos-academicos",
        icon: <FaCalendarAlt />,
        label: "Períodos Académicos",
        href: "/campus-virtual/matricula/periodos-academicos"
      },
      {
        id: "sedes",
        icon: <FaMapMarkerAlt />,
        label: "Gestión de Sedes",
        href: "/campus-virtual/matricula/sedes"
      },
      {
        id: "facultades",
        icon: <FaUniversity />,
        label: "Gestión de Facultades",
        href: "/campus-virtual/matricula/facultades"
      },
      {
        id: "aulas",
        icon: <FaBuilding />,
        label: "Gestión de Aulas",
        href: "/campus-virtual/matricula/aulas"
      },
      {
        id: "programas",
        icon: <FaGraduationCap />,
        label: "Programas Académicos",
        href: "/campus-virtual/matricula/programas"
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
        id: "periodos-academicos",
        icon: <FaCalendarAlt />,
        label: "Períodos Académicos",
        href: "/campus-virtual/matricula/periodos-academicos"
      },
      {
        id: "sedes",
        icon: <FaMapMarkerAlt />,
        label: "Gestión de Sedes",
        href: "/campus-virtual/matricula/sedes"
      },
      {
        id: "facultades",
        icon: <FaUniversity />,
        label: "Gestión de Facultades",
        href: "/campus-virtual/matricula/facultades"
      },
      {
        id: "aulas",
        icon: <FaBuilding />,
        label: "Gestión de Aulas",
        href: "/campus-virtual/matricula/aulas"
      },
      {
        id: "cerrar-sesion",
        icon: <FaSignOutAlt />,
        label: "Cerrar Sesión",
      }
    ]
  }
};

// Sidebar para el módulo de encuestas
export const encuestasSidebar: PageSidebarConfig = {
  "/campus-virtual/intranet/encuestas": {
    "ADMIN": [
      {
        id: "volver",
        icon: <FaHome />,
        label: "Campus Virtual",
        href: "/campus-virtual"
      },
      {
        id: "encuestas-admin",
        icon: <FaChartBar />,
        label: "Gestión Encuestas",
        href: "/campus-virtual/intranet/encuestas/admin"
      },
      {
        id: "pagos",
        icon: <FaCreditCard />,
        label: "Deudas",
        href: "/campus-virtual/intranet/pagos/deudas"
      },
      {
        id: "historial",
        icon: <FaHistory />,
        label: "Historial",
        href: "/campus-virtual/intranet/pagos/historial"
      },
      {
        id: "solicitudes",
        icon: <FaFileInvoice />,
        label: "Solicitudes",
        href: "/campus-virtual/intranet/pagos/solicitudes"
      },
      {
        id: "cerrar-sesion",
        icon: <FaSignOutAlt />,
        label: "Cerrar Sesión",
      }
    ],
    "ALUMNO": [
      {
        id: "volver",
        icon: <FaHome />,
        label: "Campus Virtual",
        href: "/campus-virtual"
      },
      {
        id: "encuestas",
        icon: <FaChartBar />,
        label: "Encuestas",
        href: "/campus-virtual/intranet/encuestas/encuestas"
      },
      {
        id: "pagos",
        icon: <FaCreditCard />,
        label: "Deudas",
        href: "/campus-virtual/intranet/pagos/deudas"
      },
      {
        id: "historial",
        icon: <FaHistory />,
        label: "Historial",
        href: "/campus-virtual/intranet/pagos/historial"
      },
      {
        id: "solicitudes",
        icon: <FaFileInvoice />,
        label: "Solicitudes",
        href: "/campus-virtual/intranet/pagos/solicitudes"
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
    perfilSidebar,
    matriculaSidebar,
    encuestasSidebar
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
