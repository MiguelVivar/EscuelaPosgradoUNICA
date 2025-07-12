export interface Aula {
  id: number;
  nombre: string;
  codigo: string;
  capacidad: number;
  tipo?: string;
  equipamiento?: string;
  descripcion?: string;
  activo: boolean;
  sede: {
    id: number;
    nombre: string;
    codigo: string;
  };
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface AulaForm {
  nombre: string;
  codigo: string;
  capacidad: number;
  tipo: string;
  equipamiento: string;
  descripcion: string;
  sedeId: number;
}

export interface AulaRequest {
  nombre: string;
  codigo: string;
  capacidad: number;
  tipo?: string;
  equipamiento?: string;
  descripcion?: string;
  sedeId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
