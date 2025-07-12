export interface TurnoMatricula {
  id: number;
  nombre: string;
  codigo: string;
  fechaInicio: string;
  fechaFin: string;
  ordenTurno: number;
  activo: boolean;
  habilitado: boolean;
  descripcion?: string;
  requisitos?: string;
  periodoAcademico: {
    id: number;
    nombre: string;
    codigo: string;
  };
  programaEstudio: {
    id: number;
    nombre: string;
    codigo: string;
  };
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface TurnoMatriculaForm {
  nombre: string;
  codigo: string;
  fechaInicio: string;
  fechaFin: string;
  ordenTurno: number;
  habilitado: boolean;
  descripcion: string;
  requisitos: string;
  periodoAcademicoId: number;
  programaEstudioId: number;
}

export interface TurnoMatriculaRequest {
  nombre: string;
  codigo: string;
  fechaInicio: string;
  fechaFin: string;
  ordenTurno: number;
  habilitado?: boolean;
  descripcion?: string;
  requisitos?: string;
  periodoAcademicoId: number;
  programaEstudioId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PeriodoAcademico {
  id: number;
  nombre: string;
  codigo: string;
  activo: boolean;
}

export interface ProgramaEstudio {
  id: number;
  nombre: string;
  codigo: string;
  activo: boolean;
}
