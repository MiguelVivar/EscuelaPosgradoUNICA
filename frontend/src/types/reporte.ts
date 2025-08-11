export interface ReporteMatriculas {
  periodoAcademico: {
    id: number;
    nombre: string;
    codigo: string;
  };
  totalMatriculados: number;
  matriculadosPorPrograma: MatriculadosPorPrograma[];
  matriculadosPorSede: MatriculadosPorSede[];
  matriculadosPorEstado: MatriculadosPorEstado[];
  evolucionMatriculas: EvolucionMatriculas[];
  estadisticasGenerales: EstadisticasGenerales;
}

export interface MatriculadosPorPrograma {
  programaId: number;
  programaNombre: string;
  facultad: string;
  totalMatriculados: number;
  nuevosIngresos: number;
  reingresantes: number;
  porcentaje: number;
}

export interface MatriculadosPorSede {
  sedeId: number;
  sedeNombre: string;
  totalMatriculados: number;
  porcentaje: number;
}

export interface MatriculadosPorEstado {
  estado: string;
  cantidad: number;
  porcentaje: number;
}

export interface EvolucionMatriculas {
  fecha: string;
  matriculados: number;
  acumulado: number;
}

export interface EstadisticasGenerales {
  promedioEdad: number;
  porcentajeHombres: number;
  porcentajeMujeres: number;
  estudiantesRegulares: number;
  estudiantesIrregulares: number;
  tasaRetencion: number;
  tasaDesercion: number;
}

export interface ReportePagos {
  periodoAcademico: {
    id: number;
    nombre: string;
  };
  totalRecaudado: number;
  totalPendiente: number;
  pagosPorTipo: PagosPorTipo[];
  pagosPorMes: PagosPorMes[];
  estadisticasPagos: EstadisticasPagos;
}

export interface PagosPorTipo {
  tipoTasa: string;
  concepto: string;
  montoRecaudado: number;
  cantidadPagos: number;
  porcentaje: number;
}

export interface PagosPorMes {
  mes: string;
  montoRecaudado: number;
  cantidadPagos: number;
}

export interface EstadisticasPagos {
  porcentajeCumplimiento: number;
  montoPromedioPago: number;
  estudiantesAlDia: number;
  estudiantesConDeuda: number;
}

export interface ReporteAcademico {
  periodoAcademico: {
    id: number;
    nombre: string;
  };
  rendimientoGeneral: RendimientoGeneral;
  rendimientoPorPrograma: RendimientoPorPrograma[];
  asistencia: EstadisticasAsistencia;
  evaluaciones: EstadisticasEvaluaciones;
}

export interface RendimientoGeneral {
  promedioGeneral: number;
  estudiantesAprobados: number;
  estudiantesDesaprobados: number;
  tasaAprobacion: number;
}

export interface RendimientoPorPrograma {
  programaId: number;
  programaNombre: string;
  promedioPrograma: number;
  estudiantesAprobados: number;
  estudiantesDesaprobados: number;
  tasaAprobacion: number;
}

export interface EstadisticasAsistencia {
  promedioAsistencia: number;
  estudiantesAsistenciaBaja: number;
  estudiantesAsistenciaMedia: number;
  estudiantesAsistenciaAlta: number;
}

export interface EstadisticasEvaluaciones {
  evaluacionesRealizadas: number;
  evaluacionesPendientes: number;
  promedioCalificaciones: number;
}

export interface FiltrosReporte {
  periodoAcademicoId?: number;
  programaId?: number;
  sedeId?: number;
  fechaInicio?: string;
  fechaFin?: string;
  tipoReporte?: TipoReporte;
}

export enum TipoReporte {
  MATRICULAS = "MATRICULAS",
  PAGOS = "PAGOS",
  ACADEMICO = "ACADEMICO",
  CONSOLIDADO = "CONSOLIDADO",
  DETALLADO = "DETALLADO",
}

export const TIPOS_REPORTE_LABELS = {
  [TipoReporte.MATRICULAS]: "Reporte de Matrículas",
  [TipoReporte.PAGOS]: "Reporte de Pagos",
  [TipoReporte.ACADEMICO]: "Reporte Académico",
  [TipoReporte.CONSOLIDADO]: "Reporte Consolidado",
};
