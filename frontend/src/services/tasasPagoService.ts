import { getAuthHeaders, validateStoredToken } from '@/lib/api';
import { TasaPago, TasaPagoRequest } from '@/types/tasaPago';

// Interface para diferentes estructuras de respuesta del microservicio
interface MicroserviceResponse {
  data?: TasaPago[];
  content?: TasaPago[];
  items?: TasaPago[];
  success?: boolean;
  [key: string]: unknown;
}

// Configuración específica para el microservicio de Matrícula - Tasas de Pago
const TASAS_PAGO_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_MATRICULA_API_URL || 'http://localhost:8082',
  ENDPOINTS: {
    TASAS_PAGO: {
      LIST: '/api/matricula/tasas-pago',
      LIST_ACTIVE: '/api/matricula/tasas-pago/activas',
      CREATE: '/api/matricula/tasas-pago',
      UPDATE: (id: number) => `/api/matricula/tasas-pago/${id}`,
      DELETE: (id: number) => `/api/matricula/tasas-pago/${id}`,
      TOGGLE_ACTIVE: (id: number) => `/api/matricula/tasas-pago/${id}/toggle-active`,
      BY_ID: (id: number) => `/api/matricula/tasas-pago/${id}`,
      BY_PROGRAMA: (programaId: number) => `/api/matricula/tasas-pago/programa/${programaId}`,
      BY_TIPO: (tipo: string) => `/api/matricula/tasas-pago/tipo/${tipo}`,
      SEARCH: '/api/matricula/tasas-pago/buscar',
      OBLIGATORIAS: '/api/matricula/tasas-pago/obligatorias',
      TIPOS: '/api/matricula/tasas-pago/tipos'
    }
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

class TasasPagoService {

  /**
   * Verificar estado del servicio de matrícula
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${TASAS_PAGO_API_CONFIG.BASE_URL}/health/status`);
      return response.ok;
    } catch (error) {
      console.error('Error al verificar estado del servicio:', error);
      return false;
    }
  }

  /**
   * Obtener todas las tasas de pago
   */
  async getTasasPago(): Promise<TasaPago[]> {
    try {
      // Validar token antes de hacer la petición
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TASAS_PAGO_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [TASAS PAGO SERVICE] Realizando petición a:', `${TASAS_PAGO_API_CONFIG.BASE_URL}${TASAS_PAGO_API_CONFIG.ENDPOINTS.TASAS_PAGO.LIST}`);
      console.log('🔍 [TASAS PAGO SERVICE] Headers:', headers);

      const response = await fetch(`${TASAS_PAGO_API_CONFIG.BASE_URL}${TASAS_PAGO_API_CONFIG.ENDPOINTS.TASAS_PAGO.LIST}`, {
        method: 'GET',
        headers,
      });

      console.log('🔍 [TASAS PAGO SERVICE] Response status:', response.status);
      console.log('🔍 [TASAS PAGO SERVICE] Response ok:', response.ok);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. Token inválido o permisos insuficientes`);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Intentar parsear la respuesta de diferentes maneras (microservicios pueden tener diferentes estructuras)
      const responseText = await response.text();
      console.log('🔍 [TASAS PAGO SERVICE] RAW RESPONSE TEXT:', responseText);
      
      let result: TasaPago[] | MicroserviceResponse;
      try {
        result = JSON.parse(responseText);
      } catch {
        console.error('Error parsing JSON');
        return [];
      }

      console.log('🔍 [TASAS PAGO SERVICE] PARSED RESPONSE:', result);

      // Manejar diferentes estructuras de respuesta típicas de microservicios
      let finalData: TasaPago[] = [];
      
      if (Array.isArray(result)) {
        // Respuesta directa como array
        finalData = result;
        console.log('🔍 [TASAS PAGO SERVICE] DIRECT ARRAY RESPONSE');
      } else if (result.data && Array.isArray(result.data)) {
        // Respuesta envuelta en objeto con propiedad 'data'
        finalData = result.data;
        console.log('🔍 [TASAS PAGO SERVICE] WRAPPED DATA RESPONSE');
      } else if (result.content && Array.isArray(result.content)) {
        // Respuesta paginada con Spring Boot
        finalData = result.content;
        console.log('🔍 [TASAS PAGO SERVICE] PAGINATED CONTENT RESPONSE');
      } else if (result.items && Array.isArray(result.items)) {
        // Otra estructura común
        finalData = result.items;
        console.log('🔍 [TASAS PAGO SERVICE] ITEMS RESPONSE');
      } else if (result.success && result.data) {
        // Estructura con success flag
        finalData = Array.isArray(result.data) ? result.data : [result.data];
        console.log('🔍 [TASAS PAGO SERVICE] SUCCESS FLAG RESPONSE');
      } else {
        console.warn('🔍 [TASAS PAGO SERVICE] UNKNOWN RESPONSE STRUCTURE:', result);
        finalData = [];
      }
      
      console.log('🔍 [TASAS PAGO SERVICE] FINAL DATA TO RETURN:', finalData);
      console.log('🔍 [TASAS PAGO SERVICE] FINAL DATA LENGTH:', finalData.length);
      
      return finalData;
    } catch (error) {
      console.error('Error al obtener tasas de pago:', error);
      throw error;
    }
  }

  /**
   * Obtener tasas de pago activas
   */
  async getTasasPagoActivas(): Promise<TasaPago[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TASAS_PAGO_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${TASAS_PAGO_API_CONFIG.BASE_URL}${TASAS_PAGO_API_CONFIG.ENDPOINTS.TASAS_PAGO.LIST_ACTIVE}`, {
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
      let result: TasaPago[] | MicroserviceResponse;
      try {
        result = JSON.parse(responseText);
      } catch {
        console.error('Error parsing JSON');
        return [];
      }

      let finalData: TasaPago[] = [];
      
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
        console.warn('🔍 [TASAS PAGO SERVICE] UNKNOWN RESPONSE STRUCTURE:', result);
        finalData = [];
      }
      
      return finalData;
    } catch (error) {
      console.error('Error al obtener tasas de pago activas:', error);
      throw error;
    }
  }

  /**
   * Obtener tasas de pago por programa
   */
  async getTasasPagoByPrograma(programaId: number): Promise<TasaPago[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TASAS_PAGO_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${TASAS_PAGO_API_CONFIG.BASE_URL}${TASAS_PAGO_API_CONFIG.ENDPOINTS.TASAS_PAGO.BY_PROGRAMA(programaId)}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let result: TasaPago[] | MicroserviceResponse;
      try {
        result = JSON.parse(responseText);
      } catch {
        return [];
      }

      let finalData: TasaPago[] = [];
      
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
      console.error('Error al obtener tasas de pago por programa:', error);
      throw error;
    }
  }

  /**
   * Obtener tasas de pago obligatorias
   */
  async getTasasPagoObligatorias(): Promise<TasaPago[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TASAS_PAGO_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${TASAS_PAGO_API_CONFIG.BASE_URL}${TASAS_PAGO_API_CONFIG.ENDPOINTS.TASAS_PAGO.OBLIGATORIAS}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      let finalData: TasaPago[] = [];
      
      if (Array.isArray(result)) {
        finalData = result;
      } else if (result.data && Array.isArray(result.data)) {
        finalData = result.data;
      } else if (result.content && Array.isArray(result.content)) {
        finalData = result.content;
      }
      
      return finalData;
    } catch (error) {
      console.error('Error al obtener tasas de pago obligatorias:', error);
      throw error;
    }
  }

  /**
   * Obtener tipos de tasas disponibles
   */
  async getTiposTasas(): Promise<string[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TASAS_PAGO_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${TASAS_PAGO_API_CONFIG.BASE_URL}${TASAS_PAGO_API_CONFIG.ENDPOINTS.TASAS_PAGO.TIPOS}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error al obtener tipos de tasas:', error);
      return [];
    }
  }

  /**
   * Crear nueva tasa de pago
   */
  async createTasaPago(tasaPagoData: TasaPagoRequest): Promise<TasaPago> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TASAS_PAGO_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [TASAS PAGO SERVICE] Creando tasa de pago:', tasaPagoData);

      const response = await fetch(`${TASAS_PAGO_API_CONFIG.BASE_URL}${TASAS_PAGO_API_CONFIG.ENDPOINTS.TASAS_PAGO.CREATE}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(tasaPagoData),
      });

      console.log('🔍 [TASAS PAGO SERVICE] Create response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear tasa de pago:', error);
      throw error;
    }
  }

  /**
   * Actualizar tasa de pago existente
   */
  async updateTasaPago(id: number, tasaPagoData: TasaPagoRequest): Promise<TasaPago> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TASAS_PAGO_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [TASAS PAGO SERVICE] Actualizando tasa de pago:', id, tasaPagoData);

      const response = await fetch(`${TASAS_PAGO_API_CONFIG.BASE_URL}${TASAS_PAGO_API_CONFIG.ENDPOINTS.TASAS_PAGO.UPDATE(id)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(tasaPagoData),
      });

      console.log('🔍 [TASAS PAGO SERVICE] Update response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar tasa de pago:', error);
      throw error;
    }
  }

  /**
   * Alternar estado activo/inactivo de tasa de pago
   */
  async toggleActiveTasaPago(id: number): Promise<TasaPago> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TASAS_PAGO_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [TASAS PAGO SERVICE] Alternando estado activo para tasa:', id);

      const response = await fetch(`${TASAS_PAGO_API_CONFIG.BASE_URL}${TASAS_PAGO_API_CONFIG.ENDPOINTS.TASAS_PAGO.TOGGLE_ACTIVE(id)}`, {
        method: 'PATCH',
        headers,
      });

      console.log('🔍 [TASAS PAGO SERVICE] Toggle active response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al alternar estado de tasa de pago:', error);
      throw error;
    }
  }

  /**
   * Eliminar tasa de pago
   */
  async deleteTasaPago(id: number): Promise<TasaPago> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TASAS_PAGO_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [TASAS PAGO SERVICE] Eliminando tasa de pago:', id);

      const response = await fetch(`${TASAS_PAGO_API_CONFIG.BASE_URL}${TASAS_PAGO_API_CONFIG.ENDPOINTS.TASAS_PAGO.DELETE(id)}`, {
        method: 'DELETE',
        headers,
      });

      console.log('🔍 [TASAS PAGO SERVICE] Delete response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al eliminar tasa de pago:', error);
      throw error;
    }
  }

  /**
   * Buscar tasas de pago
   */
  async searchTasasPago(searchTerm: string): Promise<TasaPago[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...TASAS_PAGO_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${TASAS_PAGO_API_CONFIG.BASE_URL}${TASAS_PAGO_API_CONFIG.ENDPOINTS.TASAS_PAGO.SEARCH}?q=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      let finalData: TasaPago[] = [];
      
      if (Array.isArray(result)) {
        finalData = result;
      } else if (result.data && Array.isArray(result.data)) {
        finalData = result.data;
      } else if (result.content && Array.isArray(result.content)) {
        finalData = result.content;
      }
      
      return finalData;
    } catch (error) {
      console.error('Error al buscar tasas de pago:', error);
      throw error;
    }
  }
}

// Instancia singleton del servicio
export const tasasPagoService = new TasasPagoService();
