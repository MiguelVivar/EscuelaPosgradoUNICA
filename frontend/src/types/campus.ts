import { StaticImageData } from "next/image";
import { AuthResponse, Role } from "./auth";

export interface CampusModule {
  id: string;
  title: string;
  href: string;
  icon: StaticImageData;
  alt: string;
  isMultiLine?: boolean;
}

export interface CampusVirtualHeaderProps {
  user: AuthResponse;
  onProfileClick: () => void;
  onLogout: () => void;
}

export interface CampusModuleCardProps {
  module: CampusModule;
}

export interface CampusModulesGridProps {
  modules: CampusModule[];
  userRole: Role;
  onAdminClick?: () => void;
}

export interface AdminModuleCardProps {
  onClick: () => void;
}

export interface CampusLoadingStateProps {
  message?: string;
}
