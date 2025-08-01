import {
  Docente,
  DocenteForm,
  DocenteEstadisticas,
  EstadoDocente,
  TipoGrado,
  FiltrosDocente,
} from "@/types/docente";

class DocentesService {
  private baseUrl = "/api/docentes";

  async buscarDocentes(
    filtros: FiltrosDocente
  ): Promise<{ docentes: Docente[] }> {
    try {
      // Simulación - reemplazar con llamada real a la API
      // TODO: Implementar filtros cuando se conecte con la API real
      /* @VinnBon ENCARGADA */
      console.log("Filtros aplicados:", filtros);
      const mockDocentes: Docente[] = [
        {
          id: 1,
          nombres: "María Elena",
          apellidos: "Rodríguez Vásquez",
          codigo: "DOC-001",
          email: "maria.rodriguez@unica.edu.pe",
          telefono: "987654321",
          fechaIngreso: "2020-03-15",
          estado: EstadoDocente.ACTIVO,
          activo: true,
          titulo: "Doctora en Educación",
          grados: [
            {
              id: 1,
              tipo: TipoGrado.DOCTORADO,
              titulo: "Doctorado en Educación",
              institucion: "Universidad Nacional Mayor de San Marcos",
              anioObtencion: 2018,
              pais: "Perú",
              validado: true,
            },
            {
              id: 2,
              tipo: TipoGrado.MAESTRIA,
              titulo: "Maestría en Gestión Educativa",
              institucion: "Pontificia Universidad Católica del Perú",
              anioObtencion: 2014,
              pais: "Perú",
              validado: true,
            },
          ],
          especialidades: ["Gestión Educativa", "Investigación Pedagógica"],
          experienciaAnios: 15,
          sedes: [
            {
              id: 1,
              nombre: "Chincha",
              direccion: "Av. Universitaria 123",
              activa: true,
            },
          ],
          facultades: [
            { id: 1, nombre: "Facultad de Educación", codigo: "FAC-EDU" },
          ],
          fechaCreacion: "2020-03-15T10:00:00Z",
          fechaActualizacion: "2024-01-15T10:00:00Z",
        },
        {
          id: 2,
          nombres: "Carlos Alberto",
          apellidos: "Mendoza Silva",
          codigo: "DOC-002",
          email: "carlos.mendoza@unica.edu.pe",
          telefono: "987654322",
          fechaIngreso: "2019-08-20",
          estado: EstadoDocente.ACTIVO,
          activo: true,
          titulo: "Magíster en Administración",
          grados: [
            {
              id: 3,
              tipo: TipoGrado.MAESTRIA,
              titulo: "Maestría en Administración de Empresas",
              institucion: "Universidad del Pacífico",
              anioObtencion: 2017,
              pais: "Perú",
              validado: true,
            },
          ],
          especialidades: ["Gestión Empresarial", "Finanzas"],
          experienciaAnios: 12,
          sedes: [
            {
              id: 1,
              nombre: "Chincha",
              direccion: "Av. Universitaria 123",
              activa: true,
            },
          ],
          facultades: [
            {
              id: 2,
              nombre: "Facultad de Ciencias Empresariales",
              codigo: "FAC-EMP",
            },
          ],
          fechaCreacion: "2019-08-20T10:00:00Z",
          fechaActualizacion: "2024-01-15T10:00:00Z",
        },
      ];

      return { docentes: mockDocentes };
    } catch (error) {
      console.error("Error al buscar docentes:", error);
      throw error;
    }
  }

  async getEstadisticas(): Promise<DocenteEstadisticas> {
    try {
      // Simulación - reemplazar con llamada real a la API
      return {
        totalDocentes: 45,
        activos: 40,
        inactivos: 3,
        enLicencia: 2,
        promedioExperiencia: 12.5,
        conDoctorado: 15,
        conMaestria: 35,
      };
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      throw error;
    }
  }

  async getInformacionDocente(id: number): Promise<Docente> {
    try {
      // Simulación - reemplazar con llamada real a la API
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error("Error al obtener información del docente");
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener información del docente:", error);
      throw error;
    }
  }

  async createDocente(data: DocenteForm): Promise<Docente> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al crear docente");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al crear docente:", error);
      throw error;
    }
  }

  async updateDocente(
    id: number,
    data: Partial<DocenteForm>
  ): Promise<Docente> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar docente");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al actualizar docente:", error);
      throw error;
    }
  }

  async uploadExcel(
    file: File
  ): Promise<{ procesados: number; errores: number; detalles: string[] }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${this.baseUrl}/upload-excel`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al procesar archivo Excel");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al cargar archivo Excel:", error);
      throw error;
    }
  }

  async downloadTemplate(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/template`);
      if (!response.ok) {
        throw new Error("Error al descargar plantilla");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "plantilla-docentes.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error al descargar plantilla:", error);
      throw error;
    }
  }
}

export const docentesService = new DocentesService();
