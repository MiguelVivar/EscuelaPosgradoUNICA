import { getAuthHeaders, validateStoredToken } from '@/lib/api';
import { ProgramaEstudio, ProgramaEstudioRequest } from '@/types/programaEstudio';

// Configuración específica para el microservicio de Matrícula - Programas de Estudio
const PROGRAMAS_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_MATRICULA_API_URL || 'http://localhost:8082',
  ENDPOINTS: {
    PROGRAMAS: {
      LIST: '/api/matricula/programas-estudio',
      LIST_ACTIVE: '/api/matricula/programas-estudio/activos',
      LIST_AVAILABLE: '/api/matricula/programas-estudio/disponibles',
      CREATE: '/api/matricula/programas-estudio',
      UPDATE: (id: number) => `/api/matricula/programas-estudio/${id}`,
      DELETE: (id: number) => `/api/matricula/programas-estudio/${id}`,
      TOGGLE_ACTIVE: (id: number) => `/api/matricula/programas-estudio/${id}/toggle-active`,
      TOGGLE_DISPONIBLE: (id: number) => `/api/matricula/programas-estudio/${id}/toggle-disponible`,
      BY_ID: (id: number) => `/api/matricula/programas-estudio/${id}`,
      BY_FACULTAD: (facultadId: number) => `/api/matricula/programas-estudio/facultad/${facultadId}`,
      BY_NIVEL: (nivel: string) => `/api/matricula/programas-estudio/nivel/${nivel}`,
      NIVELES: '/api/matricula/programas-estudio/niveles',
      MODALIDADES: '/api/matricula/programas-estudio/modalidades'
    }
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

class ProgramasEstudioService {

  /**
   * Verificar estado del servicio de matrícula
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${PROGRAMAS_API_CONFIG.BASE_URL}/health/status`);
      return response.ok;
    } catch (error) {
      console.error('Error al verificar estado del servicio:', error);
      return false;
    }
  }

  /**
   * Obtener todos los programas de estudio
   */
  async getProgramas(): Promise<ProgramaEstudio[]> {
    try {
      // Validar token antes de hacer la petición
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...PROGRAMAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [PROGRAMAS SERVICE] Realizando petición a:', `${PROGRAMAS_API_CONFIG.BASE_URL}${PROGRAMAS_API_CONFIG.ENDPOINTS.PROGRAMAS.LIST}`);

      const response = await fetch(`${PROGRAMAS_API_CONFIG.BASE_URL}${PROGRAMAS_API_CONFIG.ENDPOINTS.PROGRAMAS.LIST}`, {
        method: 'GET',
        headers,
      });

      console.log('🔍 [PROGRAMAS SERVICE] Response status:', response.status);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. Token inválido o permisos insuficientes`);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log('🔍 [PROGRAMAS SERVICE] RAW RESPONSE TEXT:', responseText);
      
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return [];
      }

      console.log('🔍 [PROGRAMAS SERVICE] PARSED RESPONSE:', result);

      // Manejar diferentes estructuras de respuesta típicas de microservicios
      let finalData: ProgramaEstudio[] = [];
      
      if (Array.isArray(result)) {
        finalData = result;
      } else if (result.data && Array.isArray(result.data)) {
        finalData = result.data;
      } else if (result.content && Array.isArray(result.content)) {
        finalData = result.content;
      } else if (result.items && Array.isArray(result.items)) {
        finalData = result.items;
      } else {
        console.warn('Estructura de respuesta no reconocida:', result);
        return [];
      }

      console.log('🔍 [PROGRAMAS SERVICE] FINAL DATA:', finalData);
      return finalData;

    } catch (error) {
      console.error('Error en getProgramas:', error);
      throw error;
    }
  }

  /**
   * Obtener programas activos
   */
  async getProgramasActivos(): Promise<ProgramaEstudio[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...PROGRAMAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${PROGRAMAS_API_CONFIG.BASE_URL}${PROGRAMAS_API_CONFIG.ENDPOINTS.PROGRAMAS.LIST_ACTIVE}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return Array.isArray(result) ? result : result.data || result.content || result.items || [];
    } catch (error) {
      console.error('Error en getProgramasActivos:', error);
      throw error;
    }
  }

  /**
   * Obtener programas disponibles para matrícula
   */
  async getProgramasDisponibles(): Promise<ProgramaEstudio[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...PROGRAMAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${PROGRAMAS_API_CONFIG.BASE_URL}${PROGRAMAS_API_CONFIG.ENDPOINTS.PROGRAMAS.LIST_AVAILABLE}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return Array.isArray(result) ? result : result.data || result.content || result.items || [];
    } catch (error) {
      console.error('Error en getProgramasDisponibles:', error);
      throw error;
    }
  }

  /**
   * Obtener programa por ID
   */
  async getProgramaById(id: number): Promise<ProgramaEstudio> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...PROGRAMAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${PROGRAMAS_API_CONFIG.BASE_URL}${PROGRAMAS_API_CONFIG.ENDPOINTS.PROGRAMAS.BY_ID(id)}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error en getProgramaById:', error);
      throw error;
    }
  }

  /**
   * Obtener programas por facultad
   */
  async getProgramasByFacultad(facultadId: number): Promise<ProgramaEstudio[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...PROGRAMAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${PROGRAMAS_API_CONFIG.BASE_URL}${PROGRAMAS_API_CONFIG.ENDPOINTS.PROGRAMAS.BY_FACULTAD(facultadId)}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return Array.isArray(result) ? result : result.data || result.content || result.items || [];
    } catch (error) {
      console.error('Error en getProgramasByFacultad:', error);
      throw error;
    }
  }

  /**
   * Obtener niveles únicos
   */
  async getNiveles(): Promise<string[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...PROGRAMAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${PROGRAMAS_API_CONFIG.BASE_URL}${PROGRAMAS_API_CONFIG.ENDPOINTS.PROGRAMAS.NIVELES}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return Array.isArray(result) ? result : result.data || result.content || result.items || [];
    } catch (error) {
      console.error('Error en getNiveles:', error);
      throw error;
    }
  }

  /**
   * Obtener modalidades únicas
   */
  async getModalidades(): Promise<string[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...PROGRAMAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${PROGRAMAS_API_CONFIG.BASE_URL}${PROGRAMAS_API_CONFIG.ENDPOINTS.PROGRAMAS.MODALIDADES}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return Array.isArray(result) ? result : result.data || result.content || result.items || [];
    } catch (error) {
      console.error('Error en getModalidades:', error);
      throw error;
    }
  }

  /**
   * Crear nuevo programa
   */
  async createPrograma(programa: ProgramaEstudioRequest): Promise<void> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...PROGRAMAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [PROGRAMAS SERVICE] Creando programa:', programa);

      const response = await fetch(`${PROGRAMAS_API_CONFIG.BASE_URL}${PROGRAMAS_API_CONFIG.ENDPOINTS.PROGRAMAS.CREATE}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(programa),
      });

      console.log('🔍 [PROGRAMAS SERVICE] Response status (CREATE):', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Error en createPrograma:', error);
      throw error;
    }
  }

  /**
   * Actualizar programa existente
   */
  async updatePrograma(id: number, programa: ProgramaEstudioRequest): Promise<void> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...PROGRAMAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [PROGRAMAS SERVICE] Actualizando programa:', id, programa);

      const response = await fetch(`${PROGRAMAS_API_CONFIG.BASE_URL}${PROGRAMAS_API_CONFIG.ENDPOINTS.PROGRAMAS.UPDATE(id)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(programa),
      });

      console.log('🔍 [PROGRAMAS SERVICE] Response status (UPDATE):', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Error en updatePrograma:', error);
      throw error;
    }
  }

  /**
   * Cambiar estado activo/inactivo
   */
  async toggleActivePrograma(id: number): Promise<void> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...PROGRAMAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${PROGRAMAS_API_CONFIG.BASE_URL}${PROGRAMAS_API_CONFIG.ENDPOINTS.PROGRAMAS.TOGGLE_ACTIVE(id)}`, {
        method: 'PATCH',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Error en toggleActivePrograma:', error);
      throw error;
    }
  }

  /**
   * Cambiar disponibilidad para matrícula
   */
  async toggleDisponiblePrograma(id: number): Promise<void> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...PROGRAMAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${PROGRAMAS_API_CONFIG.BASE_URL}${PROGRAMAS_API_CONFIG.ENDPOINTS.PROGRAMAS.TOGGLE_DISPONIBLE(id)}`, {
        method: 'PATCH',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Error en toggleDisponiblePrograma:', error);
      throw error;
    }
  }

  /**
   * Eliminar programa
   */
  async deletePrograma(id: number): Promise<void> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...PROGRAMAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${PROGRAMAS_API_CONFIG.BASE_URL}${PROGRAMAS_API_CONFIG.ENDPOINTS.PROGRAMAS.DELETE(id)}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Error en deletePrograma:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
export const programasEstudioService = new ProgramasEstudioService();
