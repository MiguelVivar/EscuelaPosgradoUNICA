export interface Mencion {
  id: number;
  nombre: string;
  codigo: string;
  activo: boolean;
  disponible: boolean;
  descripcion?: string;
  requisitos?: string;
  programaEstudio: {
    id: number;
    nombre: string;
    codigo: string;
  };
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface MencionForm {
  nombre: string;
  codigo: string;
  descripcion: string;
  requisitos: string;
  programaEstudioId: number;
}

export interface MencionRequest {
  nombre: string;
  codigo: string;
  descripcion?: string;
  requisitos?: string;
  programaEstudioId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
