import { getAuthHeaders, validateStoredToken } from '@/lib/api';
import { Aula, AulaRequest } from '@/types/aula';

// Configuración específica para el microservicio de Matrícula - Aulas
const AULAS_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_MATRICULA_API_URL || 'http://localhost:8082',
  ENDPOINTS: {
    AULAS: {
      LIST: '/api/matricula/aulas',
      LIST_ACTIVE: '/api/matricula/aulas/activas',
      CREATE: '/api/matricula/aulas',
      UPDATE: (id: number) => `/api/matricula/aulas/${id}`,
      DELETE: (id: number) => `/api/matricula/aulas/${id}`,
      TOGGLE_ACTIVE: (id: number) => `/api/matricula/aulas/${id}/toggle-active`,
      BY_ID: (id: number) => `/api/matricula/aulas/${id}`,
      BY_SEDE: (sedeId: number) => `/api/matricula/aulas/sede/${sedeId}`,
      SEARCH: '/api/matricula/aulas/buscar',
      SEARCH_BY_CAPACITY: '/api/matricula/aulas/capacidad-minima'
    }
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

class AulasService {

  /**
   * Verificar estado del servicio de matrícula
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${AULAS_API_CONFIG.BASE_URL}/health/status`);
      return response.ok;
    } catch (error) {
      console.error('Error al verificar estado del servicio:', error);
      return false;
    }
  }

  /**
   * Obtener todas las aulas
   */
  async getAulas(): Promise<Aula[]> {
    try {
      // Validar token antes de hacer la petición
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...AULAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [AULAS SERVICE] Realizando petición a:', `${AULAS_API_CONFIG.BASE_URL}${AULAS_API_CONFIG.ENDPOINTS.AULAS.LIST}`);
      console.log('🔍 [AULAS SERVICE] Headers:', headers);

      const response = await fetch(`${AULAS_API_CONFIG.BASE_URL}${AULAS_API_CONFIG.ENDPOINTS.AULAS.LIST}`, {
        method: 'GET',
        headers,
      });

      console.log('🔍 [AULAS SERVICE] Response status:', response.status);
      console.log('🔍 [AULAS SERVICE] Response ok:', response.ok);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. Token inválido o permisos insuficientes`);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Intentar parsear la respuesta de diferentes maneras (microservicios pueden tener diferentes estructuras)
      const responseText = await response.text();
      console.log('🔍 [AULAS SERVICE] RAW RESPONSE TEXT:', responseText);
      
      let result: unknown;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return [];
      }

      console.log('🔍 [AULAS SERVICE] PARSED RESPONSE:', result);

      // Manejar diferentes estructuras de respuesta típicas de microservicios
      let finalData: Aula[] = [];
      
      if (Array.isArray(result)) {
        // Respuesta directa como array
        finalData = result;
        console.log('🔍 [AULAS SERVICE] DIRECT ARRAY RESPONSE');
      } else if (result && typeof result === 'object' && 'data' in result && Array.isArray((result as Record<string, unknown>).data)) {
        // Respuesta envuelta en objeto con propiedad 'data'
        finalData = (result as Record<string, unknown>).data as Aula[];
        console.log('🔍 [AULAS SERVICE] WRAPPED DATA RESPONSE');
      } else if (result && typeof result === 'object' && 'content' in result && Array.isArray((result as Record<string, unknown>).content)) {
        // Respuesta paginada con Spring Boot
        finalData = (result as Record<string, unknown>).content as Aula[];
        console.log('🔍 [AULAS SERVICE] PAGINATED CONTENT RESPONSE');
      } else if (result && typeof result === 'object' && 'items' in result && Array.isArray((result as Record<string, unknown>).items)) {
        // Otra estructura común
        finalData = (result as Record<string, unknown>).items as Aula[];
        console.log('🔍 [AULAS SERVICE] ITEMS RESPONSE');
      } else if (result && typeof result === 'object' && 'success' in result && 'data' in result && (result as Record<string, unknown>).success) {
        // Estructura con success flag
        const data = (result as Record<string, unknown>).data;
        finalData = Array.isArray(data) ? data : [data];
        console.log('🔍 [AULAS SERVICE] SUCCESS FLAG RESPONSE');
      } else {
        console.warn('🔍 [AULAS SERVICE] UNKNOWN RESPONSE STRUCTURE:', result);
        finalData = [];
      }
      
      console.log('🔍 [AULAS SERVICE] FINAL DATA TO RETURN:', finalData);
      console.log('🔍 [AULAS SERVICE] FINAL DATA LENGTH:', finalData.length);
      
      return finalData;
    } catch (error) {
      console.error('Error al obtener aulas:', error);
      throw error;
    }
  }

  /**
   * Obtener aulas activas
   */
  async getAulasActivas(): Promise<Aula[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...AULAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${AULAS_API_CONFIG.BASE_URL}${AULAS_API_CONFIG.ENDPOINTS.AULAS.LIST_ACTIVE}`, {
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
      console.error('Error al obtener aulas activas:', error);
      throw error;
    }
  }

  /**
   * Obtener aula por ID
   */
  async getAulaById(id: number): Promise<Aula> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...AULAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${AULAS_API_CONFIG.BASE_URL}${AULAS_API_CONFIG.ENDPOINTS.AULAS.BY_ID(id)}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Aula con ID ${id} no encontrada`);
        }
        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. Token inválido o permisos insuficientes`);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener aula por ID:', error);
      throw error;
    }
  }

  /**
   * Obtener aulas por sede
   */
  async getAulasBySede(sedeId: number): Promise<Aula[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...AULAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${AULAS_API_CONFIG.BASE_URL}${AULAS_API_CONFIG.ENDPOINTS.AULAS.BY_SEDE(sedeId)}`, {
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
      console.error('Error al obtener aulas por sede:', error);
      throw error;
    }
  }

  /**
   * Crear nueva aula
   */
  async createAula(aulaData: AulaRequest): Promise<Aula> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...AULAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [AULAS SERVICE] Creando aula:', aulaData);

      const response = await fetch(`${AULAS_API_CONFIG.BASE_URL}${AULAS_API_CONFIG.ENDPOINTS.AULAS.CREATE}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(aulaData),
      });

      console.log('🔍 [AULAS SERVICE] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('🔍 [AULAS SERVICE] Error response text:', errorText);
        
        let errorData: Record<string, unknown> = {};
        if (errorText) {
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData.message = errorText;
          }
        }

        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. ${errorData.message || 'Token inválido o permisos insuficientes'}`);
        } else if (response.status === 400) {
          throw new Error(`Error de validación: ${errorData.message || 'Datos inválidos'}`);
        } else if (response.status >= 500) {
          throw new Error(`Error del servidor (${response.status}): ${errorData.message || 'Error interno del servidor'}`);
        } else {
          throw new Error(errorData.message as string || `Error ${response.status}: ${response.statusText}`);
        }
      }

      const responseText = await response.text();
      let result: Record<string, unknown>;
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error('Error al parsear la respuesta del servidor');
      }

      // La respuesta puede venir envuelta en un MessageResponse
      if (result.success && result.data) {
        return result.data as Aula;
      } else if (result.id) {
        // Respuesta directa del aula creada
        return result as unknown as Aula;
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error al crear aula:', error);
      throw error;
    }
  }

  /**
   * Actualizar aula existente
   */
  async updateAula(id: number, aulaData: AulaRequest): Promise<Aula> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...AULAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [AULAS SERVICE] Actualizando aula:', id, aulaData);

      const response = await fetch(`${AULAS_API_CONFIG.BASE_URL}${AULAS_API_CONFIG.ENDPOINTS.AULAS.UPDATE(id)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(aulaData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: Record<string, unknown> = {};
        if (errorText) {
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData.message = errorText;
          }
        }

        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. ${errorData.message || 'Token inválido o permisos insuficientes'}`);
        } else if (response.status === 404) {
          throw new Error(`Error 404: El aula con ID ${id} no fue encontrada.`);
        } else if (response.status === 400) {
          throw new Error(`Error de validación: ${errorData.message || 'Datos inválidos'}`);
        } else if (response.status >= 500) {
          throw new Error(`Error del servidor (${response.status}): ${errorData.message || 'Error interno del servidor'}`);
        } else {
          throw new Error(errorData.message as string || `Error ${response.status}: ${response.statusText}`);
        }
      }

      const responseText = await response.text();
      let result: Record<string, unknown>;
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error('Error al parsear la respuesta del servidor');
      }

      // La respuesta puede venir envuelta en un MessageResponse
      if (result.success && result.data) {
        return result.data as Aula;
      } else if (result.id) {
        // Respuesta directa del aula actualizada
        return result as unknown as Aula;
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error al actualizar aula:', error);
      throw error;
    }
  }

  /**
   * Alternar estado activo de un aula
   */
  async toggleActiveAula(id: number): Promise<Aula> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...AULAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [AULAS SERVICE] Alternando estado activo del aula:', id);

      const response = await fetch(`${AULAS_API_CONFIG.BASE_URL}${AULAS_API_CONFIG.ENDPOINTS.AULAS.TOGGLE_ACTIVE(id)}`, {
        method: 'PATCH',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: Record<string, unknown> = {};
        if (errorText) {
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData.message = errorText;
          }
        }

        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. ${errorData.message || 'Token inválido o permisos insuficientes'}`);
        } else if (response.status === 404) {
          throw new Error(`Error 404: El aula con ID ${id} no fue encontrada.`);
        } else if (response.status >= 500) {
          throw new Error(`Error del servidor (${response.status}): ${errorData.message || 'Error interno del servidor'}`);
        } else {
          throw new Error(errorData.message as string || `Error ${response.status}: ${response.statusText}`);
        }
      }

      const responseText = await response.text();
      let result: Record<string, unknown>;
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error('Error al parsear la respuesta del servidor');
      }

      // La respuesta puede venir envuelta en un MessageResponse
      if (result.success && result.data) {
        return result.data as Aula;
      } else if (result.id) {
        // Respuesta directa del aula actualizada
        return result as unknown as Aula;
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error al alternar estado del aula:', error);
      throw error;
    }
  }

  /**
   * Eliminar aula (borrado lógico)
   */
  async deleteAula(id: number): Promise<void> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...AULAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [AULAS SERVICE] Eliminando aula:', id);

      const response = await fetch(`${AULAS_API_CONFIG.BASE_URL}${AULAS_API_CONFIG.ENDPOINTS.AULAS.DELETE(id)}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: Record<string, unknown> = {};
        if (errorText) {
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData.message = errorText;
          }
        }

        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. ${errorData.message || 'Token inválido o permisos insuficientes'}`);
        } else if (response.status === 404) {
          throw new Error(`Error 404: El aula con ID ${id} no fue encontrada.`);
        } else if (response.status >= 500) {
          throw new Error(`Error del servidor (${response.status}): ${errorData.message || 'Error interno del servidor'}`);
        } else {
          throw new Error(errorData.message as string || `Error ${response.status}: ${response.statusText}`);
        }
      }

      // La eliminación exitosa puede no devolver contenido
      console.log('🔍 [AULAS SERVICE] Aula eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar aula:', error);
      throw error;
    }
  }

  /**
   * Buscar aulas por nombre
   */
  async searchAulasByNombre(nombre: string): Promise<Aula[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...AULAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const url = `${AULAS_API_CONFIG.BASE_URL}${AULAS_API_CONFIG.ENDPOINTS.AULAS.SEARCH}?nombre=${encodeURIComponent(nombre)}`;
      
      const response = await fetch(url, {
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
      console.error('Error al buscar aulas:', error);
      throw error;
    }
  }

  /**
   * Buscar aulas por capacidad mínima
   */
  async searchAulasByCapacidad(capacidad: number): Promise<Aula[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...AULAS_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const url = `${AULAS_API_CONFIG.BASE_URL}${AULAS_API_CONFIG.ENDPOINTS.AULAS.SEARCH_BY_CAPACITY}?capacidad=${capacidad}`;
      
      const response = await fetch(url, {
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
      console.error('Error al buscar aulas por capacidad:', error);
      throw error;
    }
  }
}

export const aulasService = new AulasService();
