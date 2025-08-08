import { 
  ReporteMatriculas, 
  ReportePagos, 
  ReporteAcademico, 
  FiltrosReporte,
  TipoReporte 
} from '@/types/reporte';

class ReportesService {
  private baseUrl = '/api/reportes';

  async getReporteMatriculas(filtros: FiltrosReporte): Promise<ReporteMatriculas> {
    try {
      // Simulación con datos de ejemplo
      return {
        periodoAcademico: {
          id: filtros.periodoAcademicoId || 1,
          nombre: '2024-I',
          codigo: '2024-1'
        },
        totalMatriculados: 1247,
        matriculadosPorPrograma: [
          {
            programaId: 1,
            programaNombre: 'Maestría en Educación',
            facultad: 'Facultad de Educación',
            totalMatriculados: 456,
            nuevosIngresos: 120,
            reingresantes: 336,
            porcentaje: 36.6
          },
          {
            programaId: 2,
            programaNombre: 'Maestría en Administración',
            facultad: 'Facultad de Ciencias Empresariales',
            totalMatriculados: 398,
            nuevosIngresos: 95,
            reingresantes: 303,
            porcentaje: 31.9
          },
          {
            programaId: 3,
            programaNombre: 'Doctorado en Educación',
            facultad: 'Facultad de Educación',
            totalMatriculados: 234,
            nuevosIngresos: 45,
            reingresantes: 189,
            porcentaje: 18.8
          },
          {
            programaId: 4,
            programaNombre: 'Maestría en Derecho',
            facultad: 'Facultad de Derecho',
            totalMatriculados: 159,
            nuevosIngresos: 38,
            reingresantes: 121,
            porcentaje: 12.7
          }
        ],
        matriculadosPorSede: [
          {
            sedeId: 1,
            sedeNombre: 'Chincha',
            totalMatriculados: 1247,
            porcentaje: 100
          }
        ],
        matriculadosPorEstado: [
          { estado: 'ACTIVO', cantidad: 1087, porcentaje: 87.2 },
          { estado: 'INGRESANTE', cantidad: 298, porcentaje: 23.9 },
          { estado: 'RETIRADO', cantidad: 45, porcentaje: 3.6 },
          { estado: 'GRADUADO', cantidad: 115, porcentaje: 9.2 }
        ],
        evolucionMatriculas: [
          { fecha: '2024-01-15', matriculados: 45, acumulado: 45 },
          { fecha: '2024-01-22', matriculados: 123, acumulado: 168 },
          { fecha: '2024-01-29', matriculados: 234, acumulado: 402 },
          { fecha: '2024-02-05', matriculados: 298, acumulado: 700 },
          { fecha: '2024-02-12', matriculados: 267, acumulado: 967 },
          { fecha: '2024-02-19', matriculados: 189, acumulado: 1156 },
          { fecha: '2024-02-26', matriculados: 91, acumulado: 1247 }
        ],
        estadisticasGenerales: {
          promedioEdad: 32.4,
          porcentajeHombres: 43.2,
          porcentajeMujeres: 56.8,
          estudiantesRegulares: 1089,
          estudiantesIrregulares: 158,
          tasaRetencion: 87.3,
          tasaDesercion: 12.7
        }
      };
    } catch (error) {
      console.error('Error al obtener reporte de matrículas:', error);
      throw error;
    }
  }

  async getReportePagos(filtros: FiltrosReporte): Promise<ReportePagos> {
    try {
      return {
        periodoAcademico: {
          id: filtros.periodoAcademicoId || 1,
          nombre: '2024-I'
        },
        totalRecaudado: 2456780.50,
        totalPendiente: 543219.25,
        pagosPorTipo: [
          {
            tipoTasa: 'MATRICULA',
            concepto: 'Matrícula',
            montoRecaudado: 1234567.00,
            cantidadPagos: 1087,
            porcentaje: 50.3
          },
          {
            tipoTasa: 'PENSION',
            concepto: 'Pensión Académica',
            montoRecaudado: 876543.50,
            cantidadPagos: 956,
            porcentaje: 35.7
          },
          {
            tipoTasa: 'DERECHO_GRADO',
            concepto: 'Derecho de Grado',
            montoRecaudado: 345670.00,
            cantidadPagos: 115,
            porcentaje: 14.0
          }
        ],
        pagosPorMes: [
          { mes: 'Enero', montoRecaudado: 456789.25, cantidadPagos: 298 },
          { mes: 'Febrero', montoRecaudado: 678934.50, cantidadPagos: 456 },
          { mes: 'Marzo', montoRecaudado: 567823.75, cantidadPagos: 389 },
          { mes: 'Abril', montoRecaudado: 445623.00, cantidadPagos: 334 },
          { mes: 'Mayo', montoRecaudado: 307610.00, cantidadPagos: 245 }
        ],
        estadisticasPagos: {
          porcentajeCumplimiento: 81.9,
          montoPromedioPago: 2259.73,
          estudiantesAlDia: 1022,
          estudiantesConDeuda: 225
        }
      };  
    } catch (error) {
      console.error('Error al obtener reporte de pagos:', error);
      throw error;
    }
  }

  async getReporteAcademico(filtros: FiltrosReporte): Promise<ReporteAcademico> {
    try {
      return {
        periodoAcademico: {
          id: filtros.periodoAcademicoId || 1,
          nombre: '2024-I'
        },
        rendimientoGeneral: {
          promedioGeneral: 16.8,
          estudiantesAprobados: 1089,
          estudiantesDesaprobados: 158,
          tasaAprobacion: 87.3
        },
        rendimientoPorPrograma: [
          {
            programaId: 1,
            programaNombre: 'Maestría en Educación',
            promedioPrograma: 17.2,
            estudiantesAprobados: 398,
            estudiantesDesaprobados: 58,
            tasaAprobacion: 87.3
          },
          {
            programaId: 2,
            programaNombre: 'Maestría en Administración',
            promedioPrograma: 16.9,
            estudiantesAprobados: 345,
            estudiantesDesaprobados: 53,
            tasaAprobacion: 86.7
          }
        ],
        asistencia: {
          promedioAsistencia: 84.5,
          estudiantesAsistenciaBaja: 123,
          estudiantesAsistenciaMedia: 456,
          estudiantesAsistenciaAlta: 668
        },
        evaluaciones: {
          evaluacionesRealizadas: 2456,
          evaluacionesPendientes: 234,
          promedioCalificaciones: 16.8
        }
      };
    } catch (error) {
      console.error('Error al obtener reporte académico:', error);
      throw error;
    }
  }

  async exportarReporte(tipoReporte: TipoReporte, filtros: FiltrosReporte, formato: 'PDF' | 'EXCEL'): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/exportar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipoReporte,
          filtros,
          formato
        }),
      });

      if (!response.ok) {
        throw new Error('Error al exportar reporte');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${tipoReporte.toLowerCase()}-${new Date().toISOString().split('T')[0]}.${formato.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al exportar reporte:', error);
      throw error;
    }
  }
}

export const reportesService = new ReportesService();
