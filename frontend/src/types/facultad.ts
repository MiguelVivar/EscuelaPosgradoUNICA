export interface Facultad {
  id: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
  decano?: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface FacultadForm {
  nombre: string;
  codigo: string;
  descripcion: string;
  decano: string;
}

export interface FacultadRequest {
  nombre: string;
  codigo: string;
  descripcion?: string;
  decano?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
