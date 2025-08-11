import { API_CONFIG, getAuthHeaders } from '@/lib/api';
import { 
  Deuda, 
  HistorialPago, 
  Solicitud, 
  CreateDeudaRequest, 
  CreateSolicitudRequest, 
  PagarDeudaRequest, 
  RespondSolicitudRequest,
  PagosStats 
} from '@/types/pagos';
import { ApiError } from '@/types/auth';

class PagosService {
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

  // ========== DEUDAS ==========
  
  // Obtener deudas del usuario autenticado
  async getMisDeudas(): Promise<Deuda[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/pagos/deudas/mis-deudas`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<Deuda[]>(response);
  }

  // Admin: Obtener todas las deudas
  async getAllDeudas(): Promise<Deuda[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/pagos/deudas`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<Deuda[]>(response);
  }

  // Admin: Obtener deudas por usuario
  async getDeudasByUsuario(usuarioId: number): Promise<Deuda[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/pagos/deudas/usuario/${usuarioId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<Deuda[]>(response);
  }

  // Admin: Crear nueva deuda
  async createDeuda(deudaData: CreateDeudaRequest): Promise<Deuda> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/pagos/deudas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(deudaData),
    });
    return this.handleResponse<Deuda>(response);
  }

  // Admin: Marcar deuda como pagada (mover a historial)
  async marcarDeudaPagada(pagoData: PagarDeudaRequest): Promise<HistorialPago> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/pagos/deudas/${pagoData.deudaId}/pagar`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(pagoData),
    });
    return this.handleResponse<HistorialPago>(response);
  }

  // Admin: Eliminar deuda
  async deleteDeuda(deudaId: number): Promise<void> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/pagos/deudas/${deudaId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new ApiError('Error al eliminar la deuda', response.status);
    }
  }

  // ========== HISTORIAL ==========
  
  // Obtener historial de pagos del usuario autenticado
  async getMiHistorial(): Promise<HistorialPago[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/pagos/historial/mi-historial`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<HistorialPago[]>(response);
  }

  // Admin: Obtener todo el historial
  async getAllHistorial(): Promise<HistorialPago[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/pagos/historial`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<HistorialPago[]>(response);
  }

  // Admin: Obtener historial por usuario
  async getHistorialByUsuario(usuarioId: number): Promise<HistorialPago[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/pagos/historial/usuario/${usuarioId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<HistorialPago[]>(response);
  }

  // ========== SOLICITUDES ==========
  
  // Obtener solicitudes del usuario autenticado
  async getMisSolicitudes(): Promise<Solicitud[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/pagos/solicitudes/mis-solicitudes`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<Solicitud[]>(response);
  }

  // Admin: Obtener todas las solicitudes
  async getAllSolicitudes(): Promise<Solicitud[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/pagos/solicitudes`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<Solicitud[]>(response);
  }

  // Crear nueva solicitud
  async createSolicitud(solicitudData: CreateSolicitudRequest): Promise<Solicitud> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/pagos/solicitudes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(solicitudData),
    });
    return this.handleResponse<Solicitud>(response);
  }

  // Admin: Responder solicitud
  async respondSolicitud(responseData: RespondSolicitudRequest): Promise<Solicitud> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/pagos/solicitudes/${responseData.solicitudId}/responder`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        estado: responseData.estado,
        respuesta: responseData.respuesta
      }),
    });
    return this.handleResponse<Solicitud>(response);
  }

  // ========== ESTADÍSTICAS ==========
  
  // Admin: Obtener estadísticas generales
  async getStats(): Promise<PagosStats> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/pagos/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<PagosStats>(response);
  }

  // Obtener estadísticas del usuario autenticado
  async getMisStats(): Promise<Partial<PagosStats>> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/pagos/mis-stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return this.handleResponse<Partial<PagosStats>>(response);
  }
}

const pagosService = new PagosService();
export default pagosService;
