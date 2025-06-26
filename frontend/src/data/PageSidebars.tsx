import { SidebarItemProps } from "@/types";
import { 
  FaUser, 
  FaBook,
  FaChartBar,
  FaUsers,
  FaHome,
  FaCog,
  FaGraduationCap,
  FaClipboardList,
  FaCalendarAlt,
  FaFileAlt,
  FaBell,
  FaQuestionCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaAward,
  FaComments
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
        id: "dashboard",
        icon: <FaTachometerAlt />,
        label: "Dashboard",
        href: "/campus-virtual"
      },
      {
        id: "perfil",
        icon: <FaUser />,
        label: "Mi Perfil",
        href: "/campus-virtual/perfil"
      },
      {
        id: "admin-panel",
        icon: <FaUsers />,
        label: "Administración",
        href: "/campus-virtual/admin"
      },
      {
        id: "estadisticas",
        icon: <FaChartBar />,
        label: "Estadísticas",
        href: "/campus-virtual/estadisticas"
      },
      {
        id: "configuracion",
        icon: <FaCog />,
        label: "Configuración",
        href: "/campus-virtual/configuracion"
      }
    ],
    "COORDINADOR": [
      {
        id: "dashboard",
        icon: <FaTachometerAlt />,
        label: "Dashboard",
        href: "/campus-virtual"
      },
      {
        id: "perfil",
        icon: <FaUser />,
        label: "Mi Perfil",
        href: "/campus-virtual/perfil"
      },
      {
        id: "coordinacion",
        icon: <FaUsers />,
        label: "Coordinación",
        href: "/campus-virtual/admin"
      },
      {
        id: "cursos",
        icon: <FaBook />,
        label: "Gestión Cursos",
        href: "/campus-virtual/cursos-gestion"
      },
      {
        id: "reportes",
        icon: <FaChartBar />,
        label: "Reportes",
        href: "/campus-virtual/reportes"
      }
    ],
    "DOCENTE": [
      {
        id: "dashboard",
        icon: <FaTachometerAlt />,
        label: "Dashboard",
        href: "/campus-virtual"
      },
      {
        id: "perfil",
        icon: <FaUser />,
        label: "Mi Perfil",
        href: "/campus-virtual/perfil"
      },
      {
        id: "mis-cursos",
        icon: <FaChalkboardTeacher />,
        label: "Mis Cursos",
        href: "/campus-virtual/mis-cursos"
      },
      {
        id: "calificaciones",
        icon: <FaClipboardList />,
        label: "Calificaciones",
        href: "/campus-virtual/calificaciones"
      },
      {
        id: "horarios",
        icon: <FaCalendarAlt />,
        label: "Horarios",
        href: "/campus-virtual/horarios"
      },
      {
        id: "biblioteca",
        icon: <FaBookOpen />,
        label: "Biblioteca",
        href: "/campus-virtual/biblioteca"
      }
    ],
    "ALUMNO": [
      {
        id: "dashboard",
        icon: <FaTachometerAlt />,
        label: "Dashboard",
        href: "/campus-virtual"
      },
      {
        id: "perfil",
        icon: <FaUser />,
        label: "Mi Perfil",
        href: "/campus-virtual/perfil"
      },
      {
        id: "mis-cursos",
        icon: <FaUserGraduate />,
        label: "Mis Cursos",
        href: "/campus-virtual/mis-cursos"
      },
      {
        id: "notas",
        icon: <FaAward />,
        label: "Mis Notas",
        href: "/campus-virtual/notas"
      },
      {
        id: "horarios",
        icon: <FaCalendarAlt />,
        label: "Horarios",
        href: "/campus-virtual/horarios"
      },
      {
        id: "biblioteca",
        icon: <FaBookOpen />,
        label: "Biblioteca",
        href: "/campus-virtual/biblioteca"
      },
      {
        id: "foros",
        icon: <FaComments />,
        label: "Foros",
        href: "/campus-virtual/foros"
      }
    ],
    "POSTULANTE": [
      {
        id: "dashboard",
        icon: <FaTachometerAlt />,
        label: "Dashboard",
        href: "/campus-virtual"
      },
      {
        id: "perfil",
        icon: <FaUser />,
        label: "Mi Perfil",
        href: "/campus-virtual/perfil"
      },
      {
        id: "postulacion",
        icon: <FaFileAlt />,
        label: "Mi Postulación",
        href: "/campus-virtual/postulacion"
      },
      {
        id: "documentos",
        icon: <FaClipboardList />,
        label: "Documentos",
        href: "/campus-virtual/documentos"
      },
      {
        id: "resultados",
        icon: <FaAward />,
        label: "Resultados",
        href: "/campus-virtual/resultados"
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
        id: "roles",
        icon: <FaCog />,
        label: "Gestión Roles",
        href: "/campus-virtual/admin/roles"
      },
      {
        id: "configuracion-sistema",
        icon: <FaCog />,
        label: "Config. Sistema",
        href: "/campus-virtual/admin/configuracion"
      },
      {
        id: "logs",
        icon: <FaFileAlt />,
        label: "Logs del Sistema",
        href: "/campus-virtual/admin/logs"
      },
      {
        id: "estadisticas-detalladas",
        icon: <FaChartBar />,
        label: "Estadísticas",
        href: "/campus-virtual/admin/estadisticas"
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
        id: "docentes",
        icon: <FaChalkboardTeacher />,
        label: "Gestión Docentes",
        href: "/campus-virtual/admin/docentes"
      },
      {
        id: "estudiantes",
        icon: <FaUserGraduate />,
        label: "Gestión Estudiantes",
        href: "/campus-virtual/admin/estudiantes"
      },
      {
        id: "reportes",
        icon: <FaChartBar />,
        label: "Reportes",
        href: "/campus-virtual/admin/reportes"
      }
    ]
  }
};

// Sidebar para la gestión de cursos
export const cursosGestionSidebar: PageSidebarConfig = {
  "/campus-virtual/cursos-gestion": {
    "COORDINADOR": [
      {
        id: "volver",
        icon: <FaHome />,
        label: "Campus Virtual",
        href: "/campus-virtual"
      },
      {
        id: "lista-cursos",
        icon: <FaBook />,
        label: "Lista de Cursos",
        href: "/campus-virtual/cursos-gestion"
      },
      {
        id: "crear-curso",
        icon: <FaBook />,
        label: "Crear Curso",
        href: "/campus-virtual/cursos-gestion/crear"
      },
      {
        id: "programas",
        icon: <FaGraduationCap />,
        label: "Programas",
        href: "/campus-virtual/cursos-gestion/programas"
      },
      {
        id: "asignaciones",
        icon: <FaChalkboardTeacher />,
        label: "Asignaciones",
        href: "/campus-virtual/cursos-gestion/asignaciones"
      },
      {
        id: "horarios",
        icon: <FaCalendarAlt />,
        label: "Gestión Horarios",
        href: "/campus-virtual/cursos-gestion/horarios"
      }
    ]
  }
};

// Sidebar para la vista de estudiante en sus cursos
export const misCursosSidebar: PageSidebarConfig = {
  "/campus-virtual/mis-cursos": {
    "ALUMNO": [
      {
        id: "volver",
        icon: <FaHome />,
        label: "Campus Virtual",
        href: "/campus-virtual"
      },
      {
        id: "cursos-actuales",
        icon: <FaBook />,
        label: "Cursos Actuales",
        href: "/campus-virtual/mis-cursos"
      },
      {
        id: "tareas",
        icon: <FaClipboardList />,
        label: "Tareas Pendientes",
        href: "/campus-virtual/mis-cursos/tareas"
      },
      {
        id: "examenes",
        icon: <FaFileAlt />,
        label: "Exámenes",
        href: "/campus-virtual/mis-cursos/examenes"
      },
      {
        id: "materiales",
        icon: <FaBookOpen />,
        label: "Materiales",
        href: "/campus-virtual/mis-cursos/materiales"
      },
      {
        id: "foros-curso",
        icon: <FaComments />,
        label: "Foros",
        href: "/campus-virtual/mis-cursos/foros"
      }
    ],
    "DOCENTE": [
      {
        id: "volver",
        icon: <FaHome />,
        label: "Campus Virtual",
        href: "/campus-virtual"
      },
      {
        id: "mis-cursos",
        icon: <FaChalkboardTeacher />,
        label: "Mis Cursos",
        href: "/campus-virtual/mis-cursos"
      },
      {
        id: "planificar",
        icon: <FaCalendarAlt />,
        label: "Planificación",
        href: "/campus-virtual/mis-cursos/planificar"
      },
      {
        id: "crear-contenido",
        icon: <FaFileAlt />,
        label: "Crear Contenido",
        href: "/campus-virtual/mis-cursos/contenido"
      },
      {
        id: "calificar",
        icon: <FaClipboardList />,
        label: "Calificar",
        href: "/campus-virtual/mis-cursos/calificar"
      },
      {
        id: "estudiantes",
        icon: <FaUserGraduate />,
        label: "Mis Estudiantes",
        href: "/campus-virtual/mis-cursos/estudiantes"
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
        id: "configuracion-cuenta",
        icon: <FaCog />,
        label: "Configuración",
        href: "/campus-virtual/perfil/configuracion"
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
        onClick: () => {
          // Esta función se manejará en el componente
          console.log("Cerrar sesión");
        }
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
    cursosGestionSidebar,
    misCursosSidebar,
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
      id: "dashboard",
      icon: <FaTachometerAlt />,
      label: "Dashboard",
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
