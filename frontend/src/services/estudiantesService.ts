import {
  Estudiante,
  FiltrosEstudiante,
  UploadResult,
  EstudianteEstadisticas,
} from "@/types/estudiante";

class EstudiantesService {
  // Datos de prueba temporales (simula la API)
  private estudiantesPrueba: Estudiante[] = [
    {
      id: 1,
      codigo: "2024001234",
      nombres: "Juan Carlos",
      apellidos: "Pérez García",
      email: "juan.perez@example.com",
      telefono: "987654321",
      programa: {
        id: 1,
        nombre: "Maestría en Ingeniería de Sistemas",
        codigo: "MIS-001",
        facultad: "Ingeniería",
      },
      estado: "ACTIVO",
      fechaIngreso: new Date("2024-03-01"),
      semestreActual: 3,
      creditosAprobados: 45,
      creditosTotales: 180,
      promedioGeneral: 15.2,
      estadoFinanciero: "AL_DIA",
      sede: null,
    },
    {
      id: 2,
      codigo: "2024001235",
      nombres: "María Elena",
      apellidos: "Rodríguez López",
      email: "maria.rodriguez@example.com",
      telefono: "987654322",
      programa: {
        id: 2,
        nombre: "Maestría en Administración",
        codigo: "MAD-001",
        facultad: "Ciencias Empresariales",
      },
      estado: "ACTIVO",
      fechaIngreso: new Date("2024-03-01"),
      semestreActual: 2,
      creditosAprobados: 32,
      creditosTotales: 160,
      promedioGeneral: 13.8,
      estadoFinanciero: "BECADO",
      sede: null,
    },
    {
      id: 3,
      codigo: "2023001100",
      nombres: "Carlos Alberto",
      apellidos: "González Ruiz",
      email: "carlos.gonzalez@example.com",
      telefono: "987654323",
      programa: {
        id: 1,
        nombre: "Maestría en Ingeniería de Sistemas",
        codigo: "MIS-001",
        facultad: "Ingeniería",
      },
      estado: "GRADUADO",
      fechaIngreso: new Date("2020-03-01"),
      semestreActual: 10,
      creditosAprobados: 180,
      creditosTotales: 180,
      promedioGeneral: 16.5,
      estadoFinanciero: "AL_DIA",
      sede: null,
    },
    {
      id: 4,
      codigo: "2024001240",
      nombres: "Ana Sofía",
      apellidos: "Mendoza Torres",
      email: "ana.mendoza@example.com",
      telefono: "987654324",
      programa: {
        id: 3,
        nombre: "Doctorado en Educación",
        codigo: "DOE-001",
        facultad: "Educación",
      },
      estado: "ACTIVO",
      fechaIngreso: new Date("2024-03-01"),
      semestreActual: 1,
      creditosAprobados: 15,
      creditosTotales: 200,
      promedioGeneral: 14.5,
      estadoFinanciero: "AL_DIA",
      sede: null,
    },
    {
      id: 5,
      codigo: "2023001150",
      nombres: "Luis Fernando",
      apellidos: "Vásquez Morales",
      email: "luis.vasquez@example.com",
      telefono: "987654325",
      programa: {
        id: 2,
        nombre: "Maestría en Administración",
        codigo: "MAD-001",
        facultad: "Ciencias Empresariales",
      },
      estado: "RETIRADO",
      fechaIngreso: new Date("2023-03-01"),
      semestreActual: 2,
      creditosAprobados: 28,
      creditosTotales: 160,
      promedioGeneral: 10.5,
      estadoFinanciero: "MORA",
      sede: null,
    },
  ];

  private async simulateDelay(ms: number = 800): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Método principal para buscar estudiantes
  async buscarEstudiantes(
    filtros: FiltrosEstudiante,
    page = 1,
    limit = 50
  ): Promise<{
    estudiantes: Estudiante[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    await this.simulateDelay(600);

    let estudiantes = [...this.estudiantesPrueba];

    // Aplicar filtro de búsqueda general
    if (filtros.codigoMin) {
      const searchTerm = filtros.codigoMin.toLowerCase();
      estudiantes = estudiantes.filter(
        (e) =>
          e.codigo.toLowerCase().includes(searchTerm) ||
          e.nombres.toLowerCase().includes(searchTerm) ||
          e.apellidos.toLowerCase().includes(searchTerm) ||
          e.programa.nombre.toLowerCase().includes(searchTerm) ||
          e.email.toLowerCase().includes(searchTerm)
      );
    }

    // Aplicar filtro por estado
    if (filtros.estado) {
      estudiantes = estudiantes.filter((e) => e.estado === filtros.estado);
    }

    // Aplicar filtro por programa
    if (filtros.programa) {
      const programaId = parseInt(filtros.programa, 10);
      if (!isNaN(programaId)) {
        estudiantes = estudiantes.filter((e) => e.programa.id === programaId);
      }
    }

    // Aplicar filtro por rango de código
    if (filtros.codigoMax) {
      estudiantes = estudiantes.filter(
        (e) => e.codigo <= (filtros.codigoMax as string)
      );
    }

    // Simular paginación
    const total = estudiantes.length;
    const offset = (page - 1) * limit;
    const paginatedEstudiantes = estudiantes.slice(offset, offset + limit);

    return {
      estudiantes: paginatedEstudiantes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Obtener información completa de un estudiante
  async getInformacionEstudiante(id: number): Promise<Estudiante> {
    await this.simulateDelay(400);

    const estudiante = this.estudiantesPrueba.find((e) => e.id === id);
    if (!estudiante) {
      throw new Error("Estudiante no encontrado");
    }

    return estudiante;
  }

  // Obtener historial académico
  async getHistorialAcademico(): Promise<{
    periodos: Array<{
      periodo: {
        id: number;
        codigo: string;
        nombre: string;
        anio: string;
        semestre: string;
      };
      materias: Array<{
        id: number;
        codigo: string;
        nombre: string;
        creditos: number;
        nota: number;
        estado: string;
        profesor: string;
      }>;
      promedioSemestre: number;
      creditosInscritos: number;
      creditosAprobados: number;
    }>;
    resumen: {
      creditosTotalesAprobados: number;
      creditosTotalesInscritos: number;
      promedioAcumulado: number;
      semestresCursados: number;
      materiasAprobadas: number;
      materiasReprobadas: number;
    };
  }> {
    await this.simulateDelay(700);

    // Simular datos de historial académico
    return {
      periodos: [
        {
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
        },
      ],
      resumen: {
        creditosTotalesAprobados: 45,
        creditosTotalesInscritos: 50,
        promedioAcumulado: 15.2,
        semestresCursados: 3,
        materiasAprobadas: 15,
        materiasReprobadas: 1,
      },
    };
  }

  // Subir archivo Excel con estudiantes
  async uploadExcel(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    // Simular progreso de carga
    for (let i = 0; i <= 100; i += 20) {
      await this.simulateDelay(300);
      if (onProgress) onProgress(i);
    }

    // Simular resultado de procesamiento
    return {
      procesados: 25,
      errores: 3,
      detalles: [
        "Fila 1: Estudiante 2024001236 creado exitosamente",
        "Fila 2: Estudiante 2024001237 creado exitosamente",
        "Fila 3: Estudiante 2024001238 creado exitosamente",
        "Fila 15: Error - Email inválido: correo@malformato",
        "Fila 23: Error - Código duplicado: 2024001234",
        "Fila 28: Error - Programa no existe: ID 999",
      ],
    };
  }

  // Descargar plantilla Excel
  async downloadTemplate(): Promise<void> {
    await this.simulateDelay(500);

    // Crear contenido CSV de ejemplo
    const csvContent = [
      "codigo,nombres,apellidos,email,telefono,programa_id,fecha_ingreso,semestre_actual,estado,estado_financiero",
      "2024001238,Juan,Pérez,juan@example.com,987654321,1,01/03/2024,1,ACTIVO,AL_DIA",
      "2024001239,María,García,maria@example.com,987654322,2,01/03/2024,1,ACTIVO,BECADO",
      "2024001240,Carlos,López,carlos@example.com,987654323,3,01/03/2024,1,ACTIVO,AL_DIA",
    ].join("\n");

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "plantilla_estudiantes.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Obtener estadísticas generales
  async getEstadisticas(): Promise<EstudianteEstadisticas> {
    await this.simulateDelay(300);

    return {
      totalEstudiantes: this.estudiantesPrueba.length,
      activos: this.estudiantesPrueba.filter((e) => e.estado === "ACTIVO")
        .length,
      graduados: this.estudiantesPrueba.filter((e) => e.estado === "GRADUADO")
        .length,
      retirados: this.estudiantesPrueba.filter((e) => e.estado === "RETIRADO")
        .length,
      promedioGeneral:
        this.estudiantesPrueba.reduce((acc, e) => acc + e.promedioGeneral, 0) /
        this.estudiantesPrueba.length,
    };
  }

  // Obtener programas únicos (para filtros)
  async getProgramasUnicos(): Promise<
    Array<{
      id: number;
      nombre: string;
      codigo: string;
      facultad: string;
    }>
  > {
    await this.simulateDelay(200);

    const programas = this.estudiantesPrueba.map((e) => e.programa);
    const programasUnicos = programas.filter(
      (programa, index, self) =>
        index === self.findIndex((p) => p.id === programa.id)
    );

    return programasUnicos;
  }
}

// Exportar instancia del servicio
export const estudiantesService = new EstudiantesService();
export default estudiantesService;
