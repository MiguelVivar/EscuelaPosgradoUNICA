export interface Sede {
  id: number;
  nombre: string;
  codigo: string;
  direccion: string;
  telefono?: string;
  email?: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface SedeForm {
  nombre: string;
  codigo: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface SedeRequest {
  nombre: string;
  codigo: string;
  direccion: string;
  telefono?: string;
  email?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
