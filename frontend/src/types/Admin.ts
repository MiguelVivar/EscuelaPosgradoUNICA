import { AuthResponse } from "@/types/auth";
import { Role, UsuarioResponse } from "@/types/auth";
import { ReactNode } from "react";

export interface UserStats {
  totalUsuarios: number;
  admins: number;
  docentes: number;
  alumnos: number;
  coordinadores: number;
  postulantes: number;
}

export interface AdminPageHeaderProps {
  user: AuthResponse;
  onLogout: () => void;
}

export interface AdminLoadingProps {
  message?: string;
}

export interface ErrorMessageProps {
  message: string;
}

export interface AdminInfoPanelProps {
  userRole: Role;
}

export interface UserFormData {
  nombres: string;
  apellidos: string;
  email: string;
  username: string;
  password?: string;
  role: Role;
  codigoEstudiante?: string;
  codigoDocente?: string;
  especialidad?: string;
  programaInteres?: string;
}

export interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  editingUser?: UsuarioResponse | null;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export interface UserFormData {
  nombres: string;
  apellidos: string;
  email: string;
  username: string;
  password?: string;
  role: Role;
  codigoEstudiante?: string;
  codigoDocente?: string;
}

export interface UserFormFieldsProps {
  formData: UserFormData;
  isEditMode: boolean;
  onChange: (field: keyof UserFormData, value: string) => void;
}

export interface UsersTableProps {
  users: UsuarioResponse[];
  userRole: Role;
  onEditUser: (user: UsuarioResponse) => void;
  onToggleUserStatus: (userId: number, isActive: boolean) => void;
}

export interface StatusBadgeProps {
  isActive: boolean;
}

export interface RoleBadgeProps {
  role: Role;
}

export interface UserManagementFiltersProps {
  selectedRole: Role | "ALL";
  showInactiveUsers: boolean;
  userRole: Role;
  onRoleChange: (role: Role | "ALL") => void;
  onToggleInactive: (checked: boolean) => void;
  onCreateUser: () => void;
  onFilterUsers: () => void;
}

export interface UserStats {
  totalUsuarios: number;
  admins: number;
  docentes: number;
  alumnos: number;
  coordinadores: number;
  postulantes: number;
}

export interface StatsCardProps {
  title: string;
  value: number;
  color: string;
}
