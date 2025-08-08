import { Sede } from "./sede";
import { PeriodoAcademico } from "./turnoMatricula";
// Interface principal del estudiante
export interface Estudiante {
  id: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  programa: {
    id: number;
    nombre: string;
    codigo: string;
    facultad:
      | string
      | {
          // ✅ Acepta ambos tipos
          id: number;
          nombre: string;
        };
  };
  estado: "INGRESANTE" | "ACTIVO" | "RESERVADO" | "GRADUADO" | "RETIRADO";
  fechaIngreso: Date;
  semestreActual: number;
  creditosAprobados: number;
  creditosTotales: number;
  promedioGeneral: number;
  periodoActual?: {
    id: number;
    codigo: string;
    nombre: string;
  };
  estadoFinanciero: "AL_DIA" | "MORA" | "BECADO";
  ultimaMatricula?: Date;
  sede: Sede;
  fechaRegistro: string; // Fecha de registro del estudiante
}

// Formulario para crear/editar estudiante
export interface EstudianteForm {
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  programaId: number;
  fechaIngreso: Date;
  semestreActual: number;
  estado: "ACTIVO" | "INACTIVO" | "GRADUADO" | "RETIRADO";
  estadoFinanciero: "AL_DIA" | "MORA" | "BECADO";
}

// Para peticiones al API
export interface EstudianteRequest {
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  programaId: number;
  fechaIngreso: string;
  semestreActual: number;
  estado?: string;
  estadoFinanciero?: string;
}

// Filtros para búsqueda (equivale a tu FiltrosEstudiante)
export interface FiltrosEstudiante {
  busqueda?: string; // ✅ AGREGAR ESTE CAMPO
  codigoMin?: string;
  codigoMax?: string;
  programa?: string;
  estado?: string;
  periodo?: PeriodoAcademico;
  sede?: string; // CAMBIAR: de Sede a string (solo el ID)
  semestre?: string;
}

// Para carga masiva Excel
export interface UploadResult {
  procesados: number;
  errores: number;
  detalles: string[];
}

// Estadísticas generales
export interface EstudianteEstadisticas {
  totalEstudiantes: number;
  activos: number;
  graduados: number;
  retirados: number;
  promedioGeneral: number;
}

// Respuesta genérica del API (igual que en aula.ts)
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
