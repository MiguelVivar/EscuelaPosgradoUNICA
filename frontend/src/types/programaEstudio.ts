export interface ProgramaEstudio {
  id: number;
  nombre: string;
  codigo: string;
  nivel?: string; // MAESTRIA, DOCTORADO, SEGUNDA_ESPECIALIDAD
  modalidad?: string; // PRESENCIAL, SEMIPRESENCIAL, VIRTUAL
  duracionSemestres?: number;
  creditosTotales?: number;
  activo: boolean;
  disponible: boolean; // Si está disponible para matrícula
  descripcion?: string;
  objetivos?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  facultad: {
    id: number;
    nombre: string;
    codigo: string;
  };
}

export interface ProgramaEstudioForm {
  nombre: string;
  codigo: string;
  nivel: string;
  modalidad: string;
  duracionSemestres: number;
  creditosTotales: number;
  descripcion: string;
  objetivos: string;
  facultadId: number;
}

export interface ProgramaEstudioRequest {
  nombre: string;
  codigo: string;
  nivel?: string;
  modalidad?: string;
  duracionSemestres?: number;
  creditosTotales?: number;
  descripcion?: string;
  objetivos?: string;
  facultadId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
