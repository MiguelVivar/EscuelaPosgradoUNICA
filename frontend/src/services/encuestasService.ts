import { API_CONFIG, getAuthHeaders } from '@/lib/api';
import { 
  Encuesta, 
  EncuestaDetallada,
  RespuestaEncuesta,
  CreateEncuestaRequest,
  SubmitRespuestaRequest,
  EncuestaStats 
} from '@/types/encuestas';
import { ApiError } from '@/types/auth';

class EncuestasService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = 'Error en la petición';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new ApiError(errorMessage, response.status);
    }
    return response.json();
  }

  // ========== ENCUESTAS PARA ESTUDIANTES ==========
  
  // Obtener encuestas disponibles para el usuario
  async getEncuestasDisponibles(): Promise<EncuestaDetallada[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/encuestas/disponibles`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<EncuestaDetallada[]>(response);
  }

  // Obtener una encuesta específica para responder
  async getEncuestaParaResponder(encuestaId: number): Promise<EncuestaDetallada> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/encuestas/${encuestaId}/responder`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<EncuestaDetallada>(response);
  }

  // Enviar respuesta de encuesta
  async submitRespuesta(respuestaData: SubmitRespuestaRequest): Promise<RespuestaEncuesta> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/encuestas/responder`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(respuestaData),
    });
    return this.handleResponse<RespuestaEncuesta>(response);
  }

  // Obtener mis respuestas completadas
  async getMisRespuestas(): Promise<RespuestaEncuesta[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/encuestas/mis-respuestas`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<RespuestaEncuesta[]>(response);
  }

  // Obtener estadísticas personales
  async getMisEstadisticas(): Promise<Partial<EncuestaStats>> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/encuestas/mis-estadisticas`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<Partial<EncuestaStats>>(response);
  }

  // ========== GESTIÓN DE ENCUESTAS (ADMIN) ==========
  
  // Admin: Obtener todas las encuestas
  async getAllEncuestas(): Promise<Encuesta[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/encuestas`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<Encuesta[]>(response);
  }

  // Admin: Crear nueva encuesta
  async createEncuesta(encuestaData: CreateEncuestaRequest): Promise<Encuesta> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/encuestas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(encuestaData),
    });
    return this.handleResponse<Encuesta>(response);
  }

  // Admin: Actualizar encuesta
  async updateEncuesta(encuestaId: number, encuestaData: Partial<CreateEncuestaRequest>): Promise<Encuesta> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/encuestas/${encuestaId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(encuestaData),
    });
    return this.handleResponse<Encuesta>(response);
  }

  // Admin: Eliminar encuesta
  async deleteEncuesta(encuestaId: number): Promise<void> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/encuestas/${encuestaId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new ApiError('Error al eliminar la encuesta', response.status);
    }
  }

  // Admin: Activar/Desactivar encuesta
  async toggleEncuestaStatus(encuestaId: number, activa: boolean): Promise<Encuesta> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/encuestas/${encuestaId}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ activa }),
    });
    return this.handleResponse<Encuesta>(response);
  }

  // Admin: Obtener respuestas de una encuesta
  async getRespuestasEncuesta(encuestaId: number): Promise<RespuestaEncuesta[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/encuestas/${encuestaId}/respuestas`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<RespuestaEncuesta[]>(response);
  }

  // Admin: Obtener estadísticas generales
  async getEstadisticasGenerales(): Promise<EncuestaStats> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/encuestas/estadisticas`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<EncuestaStats>(response);
  }

  // Admin: Obtener estadísticas de una encuesta específica
  async getEstadisticasEncuesta(encuestaId: number): Promise<EncuestaStats> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/encuestas/${encuestaId}/estadisticas`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<EncuestaStats>(response);
  }

  // Admin: Duplicar encuesta
  async duplicarEncuesta(encuestaId: number): Promise<Encuesta> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/encuestas/${encuestaId}/duplicar`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<Encuesta>(response);
  }

  // ========== UTILIDADES ==========
  
  // Validar si una encuesta está disponible para responder
  validateEncuestaDisponible(encuesta: Encuesta): { 
    disponible: boolean; 
    razon?: string 
  } {
    const now = new Date();
    const fechaInicio = new Date(encuesta.fechaInicio);
    const fechaCierre = new Date(encuesta.fechaCierre);

    if (!encuesta.activa) {
      return { disponible: false, razon: 'La encuesta no está activa' };
    }

    if (now < fechaInicio) {
      return { 
        disponible: false, 
        razon: `La encuesta estará disponible desde el ${fechaInicio.toLocaleDateString('es-PE')}` 
      };
    }

    if (now > fechaCierre) {
      return { 
        disponible: false, 
        razon: `La encuesta cerró el ${fechaCierre.toLocaleDateString('es-PE')}` 
      };
    }

    return { disponible: true };
  }

  // Calcular progreso de una respuesta
  calcularProgreso(totalPreguntas: number, respuestasCompletadas: number): number {
    if (totalPreguntas === 0) return 0;
    return Math.round((respuestasCompletadas / totalPreguntas) * 100);
  }

  // Formatear duración
  formatearDuracion(minutos: number): string {
    if (minutos < 60) {
      return `${minutos} minutos`;
    }
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}m`;
  }
}

const encuestasService = new EncuestasService();
export default encuestasService;
