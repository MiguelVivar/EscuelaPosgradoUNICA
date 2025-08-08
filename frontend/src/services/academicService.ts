import { InformacionAcademica, ApiResponse } from "@/types/academic-info";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class AcademicService {
  private async simulateDelay(ms: number = 800): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Obtener información académica completa del estudiante
  async getInformacionAcademica(
    estudianteId: number
  ): Promise<InformacionAcademica> {
    await this.simulateDelay(1000);

    // Simular datos académicos completos
    return {
      estudiante: {
        id: estudianteId,
        codigo: "2024001234",
        nombres: "Juan Carlos",
        apellidos: "Pérez García",
        email: "juan.perez@example.com",
        telefono: "987654321",
        programa: {
          id: 1,
          nombre: "Maestría en Ingeniería de Sistemas",
          codigo: "MIS-001",
          facultad: {
            id: 1,
            nombre: "Ingeniería",
          },
        },
        estado: "ACTIVO",
        fechaIngreso: new Date("2024-03-01"),
        fechaRegistro: new Date("2024-03-01").toISOString(),
        semestreActual: 3,
        creditosAprobados: 45,
        creditosTotales: 180,
        promedioGeneral: 15.2,
        estadoFinanciero: "AL_DIA",
        sede: {
          id: 1,
          nombre: "Campus Central",
          codigo: "CC-001",
          direccion: "Av. Principal 123, Lima",
          activo: true,
          fechaCreacion: new Date("2020-01-01").toISOString(),
          fechaActualizacion: new Date("2024-01-01").toISOString(),
        },
      },
      historialAcademico: {
        periodos: [
          {
            id: 1,
            periodo: {
              id: 1,
              codigo: "2024-I",
              nombre: "Primer Semestre 2024",
              anio: "2024",
              semestre: "I",
            },
            materias: [
              {
                id: 1,
                codigo: "SIS-701",
                nombre: "Metodología de la Investigación",
                creditos: 3,
                nota: 16,
                estado: "APROBADO",
                profesor: "Dr. Juan Rodríguez",
              },
              {
                id: 2,
                codigo: "SIS-702",
                nombre: "Arquitectura de Software",
                creditos: 4,
                nota: 15,
                estado: "APROBADO",
                profesor: "Mg. Ana Martínez",
              },
            ],
            promedioSemestre: 15.43,
            creditosInscritos: 7,
            creditosAprobados: 7,
            estado: "COMPLETADO",
          },
          {
            id: 2,
            periodo: {
              id: 2,
              codigo: "2024-II",
              nombre: "Segundo Semestre 2024",
              anio: "2024",
              semestre: "II",
            },
            materias: [
              {
                id: 3,
                codigo: "SIS-703",
                nombre: "Gestión de Proyectos TI",
                creditos: 4,
                nota: 14,
                estado: "APROBADO",
                profesor: "Mg. Carlos López",
              },
              {
                id: 4,
                codigo: "SIS-704",
                nombre: "Inteligencia Artificial",
                creditos: 5,
                nota: null,
                estado: "MATRICULADO",
                profesor: "Dr. María González",
              },
            ],
            promedioSemestre: 14.0,
            creditosInscritos: 9,
            creditosAprobados: 4,
            estado: "EN_CURSO",
          },
        ],
        totalPeriodos: 2,
      },
      resumenAcademico: {
        creditosTotalesRequeridos: 180,
        creditosTotalesAprobados: 45,
        creditosTotalesInscritos: 54,
        promedioAcumulado: 15.2,
        semestresCursados: 3,
        materiasAprobadas: 15,
        materiasReprobadas: 1,
        porcentajeAvance: 25.0,
      },
      proyeccion: {
        semestresPendientes: 7,
        creditosPendientes: 135,
        fechaEstimadaGraduacion: "2026-12-15",
        materiasRequeridas: [
          "Tesis I",
          "Tesis II",
          "Seminario de Investigación",
          "Estadística Aplicada",
        ],
        recomendaciones: [
          "Mantener promedio actual para conservar buen rendimiento académico",
          "Considerar adelantar materias electivas en próximo semestre",
          "Iniciar proceso de selección de tema de tesis",
        ],
      },
    };
  }

  // Obtener solo el historial académico
  async getHistorialAcademico(estudianteId: number) {
    await this.simulateDelay(600);

    const infoCompleta = await this.getInformacionAcademica(estudianteId);
    return {
      periodos: infoCompleta.historialAcademico.periodos,
      resumen: infoCompleta.resumenAcademico,
    };
  }

  // Obtener progreso académico
  async getProgresoAcademico(estudianteId: number) {
    await this.simulateDelay(400);

    const infoCompleta = await this.getInformacionAcademica(estudianteId);
    return {
      resumen: infoCompleta.resumenAcademico,
      proyeccion: infoCompleta.proyeccion,
    };
  }
}

export const academicService = new AcademicService();
export default academicService;
