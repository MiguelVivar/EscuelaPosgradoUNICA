import { getAuthHeaders, validateStoredToken } from '@/lib/api';
import { PeriodoAcademico, EstadoPeriodo } from '@/types/periodoAcademico';

// Interface para diferentes estructuras de respuesta del microservicio
interface MicroserviceResponse {
  data?: PeriodoAcademico[];
  content?: PeriodoAcademico[];
  items?: PeriodoAcademico[];
  success?: boolean;
  [key: string]: unknown;
}

// Configuración específica para el microservicio de Matrícula - Períodos Académicos
const PERIODOS_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_MATRICULA_API_URL || 'http://localhost:8082',
  ENDPOINTS: {
    PERIODOS: {
      LIST: '/api/periodos-academicos',
      LIST_ACTIVE: '/api/periodos-academicos/activos',
      BY_ID: (id: number) => `/api/periodos-academicos/${id}`
    }
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

class PeriodosAcademicosService {
  private baseUrl = '/api/periodos-academicos';

  /**
   * Obtener todos los períodos académicos
   */
  async getPeriodos(): Promise<PeriodoAcademico[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...PERIODOS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${PERIODOS_API_CONFIG.BASE_URL}${PERIODOS_API_CONFIG.ENDPOINTS.PERIODOS.LIST}`, {
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
      let result: PeriodoAcademico[] | MicroserviceResponse;
      try {
        result = JSON.parse(responseText);
      } catch {
        console.error('Error parsing JSON');
        return [];
      }

      // Manejar diferentes estructuras de respuesta típicas de microservicios
      let finalData: PeriodoAcademico[] = [];
      
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
        console.warn('🔍 [PERIODOS SERVICE] UNKNOWN RESPONSE STRUCTURE:', result);
        finalData = [];
      }
      
      return finalData;
    } catch (error) {
      console.error('Error al obtener períodos académicos:', error);
      throw error;
    }
  }

  /**
   * Obtener períodos académicos activos
   */
  async getPeriodosActivos(): Promise<PeriodoAcademico[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...PERIODOS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${PERIODOS_API_CONFIG.BASE_URL}${PERIODOS_API_CONFIG.ENDPOINTS.PERIODOS.LIST_ACTIVE}`, {
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
      let result: PeriodoAcademico[] | MicroserviceResponse;
      try {
        result = JSON.parse(responseText);
      } catch {
        console.error('Error parsing JSON');
        return [];
      }

      let finalData: PeriodoAcademico[] = [];
      
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
      console.error('Error al obtener períodos académicos activos:', error);
      throw error;
    }
  }

  /**
   * Obtener período académico por ID
   */
  async getPeriodoById(id: number): Promise<PeriodoAcademico> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...PERIODOS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${PERIODOS_API_CONFIG.BASE_URL}${PERIODOS_API_CONFIG.ENDPOINTS.PERIODOS.BY_ID(id)}`, {
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
      console.error(`Error al obtener período académico con ID ${id}:`, error);
      throw error;
    }
  }

  async getPeriodoActivo(): Promise<PeriodoAcademico | null> {
    try {
      const periodos = await this.getPeriodos();
      return periodos.find(p => p.activo && p.estado === EstadoPeriodo.EN_CURSO) || null;
    } catch (error) {
      console.error('Error al obtener período activo:', error);
      throw error;
    }
  }
}

// Instancia singleton del servicio
export const periodosAcademicosService = new PeriodosAcademicosService();
