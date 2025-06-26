import { SidebarItemProps } from "@/types";
import { 
  FaUser, 
  FaBook,
  FaChartBar,
  FaUsers,
} from "react-icons/fa";

export const campusVirtualSidebarItems: SidebarItemProps[] = [
  {
    id: "perfil",
    icon: <FaUser />,
    label: "Mi Perfil",
    href: "/campus-virtual/perfil"
  }
];

export const adminSidebarItems: SidebarItemProps[] = [
  {
    id: "admin-panel",
    icon: <FaUsers />,
    label: "Administración",
    href: "/campus-virtual/admin",
  },
  {
    id: "estadisticas",
    icon: <FaChartBar />,
    label: "Estadísticas",
    href: "/campus-virtual/estadisticas"
  }
];

export const coordinadorSidebarItems: SidebarItemProps[] = [
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
    id: "estadisticas",
    icon: <FaChartBar />,
    label: "Reportes",
    href: "/campus-virtual/reportes"
  }
];
