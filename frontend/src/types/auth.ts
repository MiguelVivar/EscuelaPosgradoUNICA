import { ReactNode } from "react";

export type Role = 'ADMIN' | 'ALUMNO' | 'DOCENTE' | 'COORDINADOR' | 'POSTULANTE';

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  nombres: string;
  apellidos: string;
  telefono?: string;
  direccion?: string;
  role: Role;
  ultimoAcceso?: string;
  // Campos adicionales según el rol
  codigoEstudiante?: string;
  codigoDocente?: string;
  especialidad?: string;
  programaInteres?: string;
}

export interface MessageResponse {
  message: string;
  success: boolean;
}

export interface UsuarioResponse {
  id: number;
  username: string;
  email: string;
  nombres: string;
  apellidos: string;
  dni?: string;
  telefono?: string;
  direccion?: string;
  role: Role;
  activo: boolean;
  ultimoAcceso?: string;
  codigoEstudiante?: string;
  codigoDocente?: string;
  especialidad?: string;
  programaInteres?: string;
}

export interface UpdateProfileRequest {
  telefono?: string;
  direccion?: string;
  password?: string;
  confirmarPassword?: string;
}

export interface ChangePasswordRequest {
  passwordActual: string;
  nuevaPassword: string;
  confirmarNuevaPassword: string;
}

export interface AuthContextType {
  user: AuthResponse | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (profileData: UpdateProfileRequest) => Promise<MessageResponse>;
  changePassword: (passwordData: ChangePasswordRequest) => Promise<MessageResponse>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export class ApiError extends Error {
  public status?: number;
  public success?: boolean;

  constructor(message: string, status?: number, success: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.success = success;
  }
}

export interface AuthProviderProps {
  children: ReactNode;
}