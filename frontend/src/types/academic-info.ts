import { Estudiante } from "./estudiante";

export interface InformacionAcademica {
  estudiante: Estudiante;
  historialAcademico: HistorialAcademico;
  resumenAcademico: ResumenAcademico;
  proyeccion: ProyeccionAcademica;
}

export interface HistorialAcademico {
  periodos: PeriodoAcademico[];
  totalPeriodos: number;
}

export interface PeriodoAcademico {
  id: number;
  periodo: {
    id: number;
    codigo: string;
    nombre: string;
    anio: string;
    semestre: string;
  };
  materias: MateriaHistorial[];
  promedioSemestre: number;
  creditosInscritos: number;
  creditosAprobados: number;
  estado: "COMPLETADO" | "EN_CURSO" | "ABANDONADO";
}

export interface MateriaHistorial {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
  nota: number | null;
  estado: "MATRICULADO" | "APROBADO" | "REPROBADO" | "RETIRADO";
  profesor: string;
  observaciones?: string;
}

export interface ResumenAcademico {
  creditosTotalesRequeridos: number;
  creditosTotalesAprobados: number;
  creditosTotalesInscritos: number;
  promedioAcumulado: number;
  semestresCursados: number;
  materiasAprobadas: number;
  materiasReprobadas: number;
  porcentajeAvance: number;
}

export interface ProyeccionAcademica {
  semestresPendientes: number;
  creditosPendientes: number;
  fechaEstimadaGraduacion: string;
  materiasRequeridas: string[];
  recomendaciones: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
