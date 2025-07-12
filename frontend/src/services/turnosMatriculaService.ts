import { getAuthHeaders, validateStoredToken } from '@/lib/api';
import { TurnoMatricula, TurnoMatriculaRequest } from '@/types/turnoMatricula';

// Configuración específica para el microservicio de Matrícula - Turnos
const TURNOS_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_MATRICULA_API_URL || 'http://localhost:8082',
  ENDPOINTS: {
    TURNOS: {
      LIST: '/api/matricula/turnos-matricula',
      LIST_ACTIVE: '/api/matricula/turnos-matricula/activos',
      LIST_ENABLED: '/api/matricula/turnos-matricula/habilitados',
      CREATE: '/api/matricula/turnos-matricula',
      UPDATE: (id: number) => `/api/matricula/turnos-matricula/${id}`,
      DELETE: (id: number) => `/api/matricula/turnos-matricula/${id}`,
      TOGGLE_ACTIVE: (id: number) => `/api/matricula/turnos-matricula/${id}/toggle-active`,
      TOGGLE_ENABLED: (id: number) => `/api/matricula/turnos-matricula/${id}/toggle-enabled`,
      BY_ID: (id: number) => `/api/matricula/turnos-matricula/${id}`,
      BY_PERIODO: (periodoId: number) => `/api/matricula/turnos-matricula/periodo/${periodoId}`,
      BY_PROGRAMA: (programaId: number) => `/api/matricula/turnos-matricula/programa/${programaId}`,
      BY_PERIODO_PROGRAMA: (periodoId: number, programaId: number) => `/api/matricula/turnos-matricula/periodo/${periodoId}/programa/${programaId}`,
      SEARCH: '/api/matricula/turnos-matricula/buscar'
    }
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

class TurnosMatriculaService {

  /**
   * Verificar estado del servicio de matrícula
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${TURNOS_API_CONFIG.BASE_URL}/health/status`);
      return response.ok;
    } catch (error) {
      console.error('Error al verificar estado del servicio:', error);
      return false;
    }
  }

  /**
   * Obtener todos los turnos
   */
  async getTurnos(): Promise<TurnoMatricula[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TURNOS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [TURNOS SERVICE] Realizando petición a:', `${TURNOS_API_CONFIG.BASE_URL}${TURNOS_API_CONFIG.ENDPOINTS.TURNOS.LIST}`);

      const response = await fetch(`${TURNOS_API_CONFIG.BASE_URL}${TURNOS_API_CONFIG.ENDPOINTS.TURNOS.LIST}`, {
        method: 'GET',
        headers,
      });

      console.log('🔍 [TURNOS SERVICE] Response status:', response.status);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. Token inválido o permisos insuficientes`);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log('🔍 [TURNOS SERVICE] RAW RESPONSE TEXT:', responseText);
      
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return [];
      }

      // Manejar diferentes estructuras de respuesta típicas de microservicios
      let finalData: TurnoMatricula[] = [];
      
      if (Array.isArray(result)) {
        finalData = result;
      } else if (result.data && Array.isArray(result.data)) {
        finalData = result.data;
      } else if (result.content && Array.isArray(result.content)) {
        finalData = result.content;
      } else if (result.items && Array.isArray(result.items)) {
        finalData = result.items;
      } else if (result.success && result.data) {
        finalData = Array.isArray(result.data) ? result.data : [result.data];
      } else {
        console.warn('🔍 [TURNOS SERVICE] UNKNOWN RESPONSE STRUCTURE:', result);
        finalData = [];
      }
      
      console.log('🔍 [TURNOS SERVICE] FINAL DATA TO RETURN:', finalData);
      
      return finalData;
    } catch (error) {
      console.error('Error al obtener turnos:', error);
      throw error;
    }
  }

  /**
   * Obtener turnos activos
   */
  async getTurnosActivos(): Promise<TurnoMatricula[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TURNOS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${TURNOS_API_CONFIG.BASE_URL}${TURNOS_API_CONFIG.ENDPOINTS.TURNOS.LIST_ACTIVE}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. Token inválido o permisos insuficientes`);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return [];
      }

      let finalData: TurnoMatricula[] = [];
      
      if (Array.isArray(result)) {
        finalData = result;
      } else if (result.data && Array.isArray(result.data)) {
        finalData = result.data;
      } else if (result.content && Array.isArray(result.content)) {
        finalData = result.content;
      } else if (result.items && Array.isArray(result.items)) {
        finalData = result.items;
      } else if (result.success && result.data) {
        finalData = Array.isArray(result.data) ? result.data : [result.data];
      }
      
      return finalData;
    } catch (error) {
      console.error('Error al obtener turnos activos:', error);
      throw error;
    }
  }

  /**
   * Obtener turnos habilitados
   */
  async getTurnosHabilitados(): Promise<TurnoMatricula[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TURNOS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${TURNOS_API_CONFIG.BASE_URL}${TURNOS_API_CONFIG.ENDPOINTS.TURNOS.LIST_ENABLED}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        return [];
      }

      let finalData: TurnoMatricula[] = [];
      
      if (Array.isArray(result)) {
        finalData = result;
      } else if (result.data && Array.isArray(result.data)) {
        finalData = result.data;
      } else if (result.content && Array.isArray(result.content)) {
        finalData = result.content;
      } else if (result.items && Array.isArray(result.items)) {
        finalData = result.items;
      } else if (result.success && result.data) {
        finalData = Array.isArray(result.data) ? result.data : [result.data];
      }
      
      return finalData;
    } catch (error) {
      console.error('Error al obtener turnos habilitados:', error);
      throw error;
    }
  }

  /**
   * Obtener turno por ID
   */
  async getTurnoById(id: number): Promise<TurnoMatricula> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TURNOS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${TURNOS_API_CONFIG.BASE_URL}${TURNOS_API_CONFIG.ENDPOINTS.TURNOS.BY_ID(id)}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.data) {
        return result.data;
      } else if (result.success && result.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error(`Error al obtener turno con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener turnos por período académico
   */
  async getTurnosByPeriodo(periodoId: number): Promise<TurnoMatricula[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TURNOS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${TURNOS_API_CONFIG.BASE_URL}${TURNOS_API_CONFIG.ENDPOINTS.TURNOS.BY_PERIODO(periodoId)}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        return [];
      }

      let finalData: TurnoMatricula[] = [];
      
      if (Array.isArray(result)) {
        finalData = result;
      } else if (result.data && Array.isArray(result.data)) {
        finalData = result.data;
      } else if (result.content && Array.isArray(result.content)) {
        finalData = result.content;
      } else if (result.items && Array.isArray(result.items)) {
        finalData = result.items;
      } else if (result.success && result.data) {
        finalData = Array.isArray(result.data) ? result.data : [result.data];
      }
      
      return finalData;
    } catch (error) {
      console.error(`Error al obtener turnos del período ${periodoId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener turnos por programa de estudio
   */
  async getTurnosByPrograma(programaId: number): Promise<TurnoMatricula[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TURNOS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${TURNOS_API_CONFIG.BASE_URL}${TURNOS_API_CONFIG.ENDPOINTS.TURNOS.BY_PROGRAMA(programaId)}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        return [];
      }

      let finalData: TurnoMatricula[] = [];
      
      if (Array.isArray(result)) {
        finalData = result;
      } else if (result.data && Array.isArray(result.data)) {
        finalData = result.data;
      } else if (result.content && Array.isArray(result.content)) {
        finalData = result.content;
      } else if (result.items && Array.isArray(result.items)) {
        finalData = result.items;
      } else if (result.success && result.data) {
        finalData = Array.isArray(result.data) ? result.data : [result.data];
      }
      
      return finalData;
    } catch (error) {
      console.error(`Error al obtener turnos del programa ${programaId}:`, error);
      throw error;
    }
  }

  /**
   * Crear nuevo turno
   */
  async createTurno(turnoData: TurnoMatriculaRequest): Promise<TurnoMatricula> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TURNOS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${TURNOS_API_CONFIG.BASE_URL}${TURNOS_API_CONFIG.ENDPOINTS.TURNOS.CREATE}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(turnoData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.data) {
        return result.data;
      } else if (result.success && result.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error('Error al crear turno:', error);
      throw error;
    }
  }

  /**
   * Actualizar turno existente
   */
  async updateTurno(id: number, turnoData: TurnoMatriculaRequest): Promise<TurnoMatricula> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TURNOS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${TURNOS_API_CONFIG.BASE_URL}${TURNOS_API_CONFIG.ENDPOINTS.TURNOS.UPDATE(id)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(turnoData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.data) {
        return result.data;
      } else if (result.success && result.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error(`Error al actualizar turno ${id}:`, error);
      throw error;
    }
  }

  /**
   * Activar/desactivar turno
   */
  async toggleActive(id: number): Promise<TurnoMatricula> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TURNOS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${TURNOS_API_CONFIG.BASE_URL}${TURNOS_API_CONFIG.ENDPOINTS.TURNOS.TOGGLE_ACTIVE(id)}`, {
        method: 'PATCH',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.data) {
        return result.data;
      } else if (result.success && result.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error(`Error al cambiar estado activo del turno ${id}:`, error);
      throw error;
    }
  }

  /**
   * Habilitar/deshabilitar turno
   */
  async toggleEnabled(id: number): Promise<TurnoMatricula> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TURNOS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${TURNOS_API_CONFIG.BASE_URL}${TURNOS_API_CONFIG.ENDPOINTS.TURNOS.TOGGLE_ENABLED(id)}`, {
        method: 'PATCH',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.data) {
        return result.data;
      } else if (result.success && result.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      console.error(`Error al cambiar estado habilitado del turno ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar turno (borrado lógico)
   */
  async deleteTurno(id: number): Promise<void> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TURNOS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${TURNOS_API_CONFIG.BASE_URL}${TURNOS_API_CONFIG.ENDPOINTS.TURNOS.DELETE(id)}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error al eliminar turno ${id}:`, error);
      throw error;
    }
  }

  /**
   * Buscar turnos por nombre
   */
  async searchTurnos(searchTerm: string): Promise<TurnoMatricula[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TURNOS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${TURNOS_API_CONFIG.BASE_URL}${TURNOS_API_CONFIG.ENDPOINTS.TURNOS.SEARCH}?nombre=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        return [];
      }

      let finalData: TurnoMatricula[] = [];
      
      if (Array.isArray(result)) {
        finalData = result;
      } else if (result.data && Array.isArray(result.data)) {
        finalData = result.data;
      } else if (result.content && Array.isArray(result.content)) {
        finalData = result.content;
      } else if (result.items && Array.isArray(result.items)) {
        finalData = result.items;
      } else if (result.success && result.data) {
        finalData = Array.isArray(result.data) ? result.data : [result.data];
      }
      
      return finalData;
    } catch (error) {
      console.error(`Error al buscar turnos con término "${searchTerm}":`, error);
      throw error;
    }
  }
}

// Instancia singleton del servicio
export const turnosMatriculaService = new TurnosMatriculaService();
