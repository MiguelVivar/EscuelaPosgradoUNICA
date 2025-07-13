import { getAuthHeaders, validateStoredToken } from '@/lib/api';
import { Mencion, MencionRequest } from '@/types/mencion';

// Interface para diferentes estructuras de respuesta del microservicio
interface MicroserviceResponse {
  data?: Mencion[];
  content?: Mencion[];
  items?: Mencion[];
  success?: boolean;
  [key: string]: unknown;
}

// Configuración específica para el microservicio de Matrícula - Menciones
const MENCIONES_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_MATRICULA_API_URL || 'http://localhost:8082',
  ENDPOINTS: {
    MENCIONES: {
      LIST: '/api/matricula/menciones',
      LIST_ACTIVE: '/api/matricula/menciones/activas',
      CREATE: '/api/matricula/menciones',
      UPDATE: (id: number) => `/api/matricula/menciones/${id}`,
      DELETE: (id: number) => `/api/matricula/menciones/${id}`,
      TOGGLE_ACTIVE: (id: number) => `/api/matricula/menciones/${id}/toggle-active`,
      TOGGLE_DISPONIBLE: (id: number) => `/api/matricula/menciones/${id}/toggle-disponible`,
      BY_ID: (id: number) => `/api/matricula/menciones/${id}`,
      BY_PROGRAMA: (programaId: number) => `/api/matricula/menciones/programa/${programaId}`,
      BY_PROGRAMA_DISPONIBLES: (programaId: number) => `/api/matricula/menciones/programa/${programaId}/disponibles`
    }
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

class MencionesService {

  /**
   * Verificar estado del servicio de matrícula
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${MENCIONES_API_CONFIG.BASE_URL}/health/status`);
      return response.ok;
    } catch (error) {
      console.error('Error al verificar estado del servicio:', error);
      return false;
    }
  }

  /**
   * Obtener todas las menciones
   */
  async getMenciones(): Promise<Mencion[]> {
    try {
      // Validar token antes de hacer la petición
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...MENCIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [MENCIONES SERVICE] Realizando petición a:', `${MENCIONES_API_CONFIG.BASE_URL}${MENCIONES_API_CONFIG.ENDPOINTS.MENCIONES.LIST}`);

      const response = await fetch(`${MENCIONES_API_CONFIG.BASE_URL}${MENCIONES_API_CONFIG.ENDPOINTS.MENCIONES.LIST}`, {
        method: 'GET',
        headers,
      });

      console.log('🔍 [MENCIONES SERVICE] Response status:', response.status);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. Token inválido o permisos insuficientes`);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Intentar parsear la respuesta de diferentes maneras (microservicios pueden tener diferentes estructuras)
      const responseText = await response.text();
      console.log('🔍 [MENCIONES SERVICE] RAW RESPONSE TEXT:', responseText);
      
      let result: Mencion[] | MicroserviceResponse;
      try {
        result = JSON.parse(responseText);
      } catch {
        console.error('Error parsing JSON');
        return [];
      }

      console.log('🔍 [MENCIONES SERVICE] PARSED RESPONSE:', result);

      // Manejar diferentes estructuras de respuesta típicas de microservicios
      let finalData: Mencion[] = [];
      
      if (Array.isArray(result)) {
        // Respuesta directa como array
        finalData = result;
        console.log('🔍 [MENCIONES SERVICE] DIRECT ARRAY RESPONSE');
      } else if (result.data && Array.isArray(result.data)) {
        // Respuesta envuelta en objeto con propiedad 'data'
        finalData = result.data;
        console.log('🔍 [MENCIONES SERVICE] WRAPPED DATA RESPONSE');
      } else if (result.content && Array.isArray(result.content)) {
        // Respuesta paginada con Spring Boot
        finalData = result.content;
        console.log('🔍 [MENCIONES SERVICE] PAGINATED RESPONSE');
      } else {
        // Si no es ninguna estructura conocida, retornar array vacío
        console.warn('🔍 [MENCIONES SERVICE] UNKNOWN RESPONSE STRUCTURE:', result);
        finalData = [];
      }

      console.log('🔍 [MENCIONES SERVICE] FINAL DATA LENGTH:', finalData.length);
      
      return finalData;
    } catch (error) {
      console.error('Error al obtener menciones:', error);
      throw error;
    }
  }

  /**
   * Obtener menciones activas
   */
  async getMencionesActivas(): Promise<Mencion[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...MENCIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${MENCIONES_API_CONFIG.BASE_URL}${MENCIONES_API_CONFIG.ENDPOINTS.MENCIONES.LIST_ACTIVE}`, {
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

      const result = await response.json();
      return Array.isArray(result) ? result : (result.data || []);
    } catch (error) {
      console.error('Error al obtener menciones activas:', error);
      throw error;
    }
  }

  /**
   * Obtener mención por ID
   */
  async getMencionById(id: number): Promise<Mencion> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...MENCIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${MENCIONES_API_CONFIG.BASE_URL}${MENCIONES_API_CONFIG.ENDPOINTS.MENCIONES.BY_ID(id)}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Mención no encontrada');
        }
        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. Token inválido o permisos insuficientes`);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error al obtener mención por ID:', error);
      throw error;
    }
  }

  /**
   * Obtener menciones por programa de estudio
   */
  async getMencionesByPrograma(programaId: number): Promise<Mencion[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...MENCIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${MENCIONES_API_CONFIG.BASE_URL}${MENCIONES_API_CONFIG.ENDPOINTS.MENCIONES.BY_PROGRAMA(programaId)}`, {
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

      const result = await response.json();
      return Array.isArray(result) ? result : (result.data || []);
    } catch (error) {
      console.error('Error al obtener menciones por programa:', error);
      throw error;
    }
  }

  /**
   * Crear nueva mención
   */
  async createMencion(mencionData: MencionRequest): Promise<Mencion> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...MENCIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${MENCIONES_API_CONFIG.BASE_URL}${MENCIONES_API_CONFIG.ENDPOINTS.MENCIONES.CREATE}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(mencionData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error al crear mención:', error);
      throw error;
    }
  }

  /**
   * Actualizar mención existente
   */
  async updateMencion(id: number, mencionData: MencionRequest): Promise<Mencion> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...MENCIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${MENCIONES_API_CONFIG.BASE_URL}${MENCIONES_API_CONFIG.ENDPOINTS.MENCIONES.UPDATE(id)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(mencionData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error al actualizar mención:', error);
      throw error;
    }
  }

  /**
   * Activar/desactivar mención
   */
  async toggleActive(id: number): Promise<Mencion> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...MENCIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${MENCIONES_API_CONFIG.BASE_URL}${MENCIONES_API_CONFIG.ENDPOINTS.MENCIONES.TOGGLE_ACTIVE(id)}`, {
        method: 'PATCH',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error al cambiar estado activo de mención:', error);
      throw error;
    }
  }

  /**
   * Activar/desactivar disponibilidad de mención
   */
  async toggleDisponible(id: number): Promise<Mencion> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...MENCIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${MENCIONES_API_CONFIG.BASE_URL}${MENCIONES_API_CONFIG.ENDPOINTS.MENCIONES.TOGGLE_DISPONIBLE(id)}`, {
        method: 'PATCH',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error al cambiar disponibilidad de mención:', error);
      throw error;
    }
  }

  /**
   * Eliminar mención
   */
  async deleteMencion(id: number): Promise<void> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...MENCIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${MENCIONES_API_CONFIG.BASE_URL}${MENCIONES_API_CONFIG.ENDPOINTS.MENCIONES.DELETE(id)}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al eliminar mención:', error);
      throw error;
    }
  }
}

export const mencionesService = new MencionesService();
