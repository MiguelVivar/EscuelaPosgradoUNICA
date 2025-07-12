import { getAuthHeaders, validateStoredToken } from '@/lib/api';
import { Facultad, FacultadRequest } from '@/types/facultad';

// Configuración específica para el microservicio de Matrícula - Facultades
const FACULTADES_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_MATRICULA_API_URL || 'http://localhost:8082',
  ENDPOINTS: {
    FACULTADES: {
      LIST: '/api/matricula/facultades',
      LIST_ACTIVE: '/api/matricula/facultades/activas',
      CON_PROGRAMAS: '/api/matricula/facultades/con-programas',
      CREATE: '/api/matricula/facultades',
      UPDATE: (id: number) => `/api/matricula/facultades/${id}`,
      DELETE: (id: number) => `/api/matricula/facultades/${id}`,
      TOGGLE_ACTIVE: (id: number) => `/api/matricula/facultades/${id}/toggle-active`,
      BY_ID: (id: number) => `/api/matricula/facultades/${id}`,
      SEARCH: '/api/matricula/facultades/buscar',
      SEARCH_BY_DECANO: '/api/matricula/facultades/buscar-por-decano'
    }
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

class FacultadesService {

  /**
   * Verificar estado del servicio de matrícula
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${FACULTADES_API_CONFIG.BASE_URL}/health/status`);
      return response.ok;
    } catch (error) {
      console.error('Error al verificar estado del servicio:', error);
      return false;
    }
  }

  /**
   * Obtener todas las facultades
   */
  async getFacultades(): Promise<Facultad[]> {
    try {
      // Validar token antes de hacer la petición
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...FACULTADES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [FACULTADES SERVICE] Realizando petición a:', `${FACULTADES_API_CONFIG.BASE_URL}${FACULTADES_API_CONFIG.ENDPOINTS.FACULTADES.LIST}`);
      console.log('🔍 [FACULTADES SERVICE] Headers:', headers);

      const response = await fetch(`${FACULTADES_API_CONFIG.BASE_URL}${FACULTADES_API_CONFIG.ENDPOINTS.FACULTADES.LIST}`, {
        method: 'GET',
        headers,
      });

      console.log('🔍 [FACULTADES SERVICE] Response status:', response.status);
      console.log('🔍 [FACULTADES SERVICE] Response ok:', response.ok);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. Token inválido o permisos insuficientes`);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Intentar parsear la respuesta de diferentes maneras (microservicios pueden tener diferentes estructuras)
      const responseText = await response.text();
      console.log('🔍 [FACULTADES SERVICE] RAW RESPONSE TEXT:', responseText);
      
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return [];
      }

      console.log('🔍 [FACULTADES SERVICE] PARSED RESPONSE:', result);

      // Manejar diferentes estructuras de respuesta típicas de microservicios
      let finalData: Facultad[] = [];
      
      if (Array.isArray(result)) {
        // Respuesta directa como array
        finalData = result;
        console.log('🔍 [FACULTADES SERVICE] DIRECT ARRAY RESPONSE');
      } else if (result.data && Array.isArray(result.data)) {
        // Respuesta envuelta en objeto con propiedad 'data'
        finalData = result.data;
        console.log('🔍 [FACULTADES SERVICE] WRAPPED DATA RESPONSE');
      } else if (result.content && Array.isArray(result.content)) {
        // Respuesta paginada con 'content'
        finalData = result.content;
        console.log('🔍 [FACULTADES SERVICE] PAGINATED CONTENT RESPONSE');
      } else if (typeof result === 'object' && result !== null) {
        // Si es un objeto pero no tiene data ni content, podría ser un error o respuesta inesperada
        console.warn('🔍 [FACULTADES SERVICE] UNEXPECTED RESPONSE STRUCTURE:', result);
        
        // Intentar verificar si el objeto tiene alguna propiedad que indique datos
        const possibleArrayKeys = Object.keys(result).filter(key => Array.isArray(result[key]));
        if (possibleArrayKeys.length > 0) {
          finalData = result[possibleArrayKeys[0]];
          console.log(`🔍 [FACULTADES SERVICE] USING ARRAY FROM KEY: ${possibleArrayKeys[0]}`);
        } else {
          finalData = [];
        }
      }

      console.log('🔍 [FACULTADES SERVICE] FINAL DATA COUNT:', finalData.length);
      console.log('🔍 [FACULTADES SERVICE] FINAL DATA SAMPLE:', finalData.slice(0, 2));

      return finalData;
    } catch (error) {
      console.error('🔍 [FACULTADES SERVICE] Error completo:', error);
      throw error;
    }
  }

  /**
   * Obtener facultades activas
   */
  async getFacultadesActivas(): Promise<Facultad[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...FACULTADES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${FACULTADES_API_CONFIG.BASE_URL}${FACULTADES_API_CONFIG.ENDPOINTS.FACULTADES.LIST_ACTIVE}`, {
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
      
      // Manejar diferentes estructuras de respuesta
      if (Array.isArray(result)) {
        return result;
      } else if (result.data && Array.isArray(result.data)) {
        return result.data;
      } else if (result.content && Array.isArray(result.content)) {
        return result.content;
      }
      
      return [];
    } catch (error) {
      console.error('Error al obtener facultades activas:', error);
      throw error;
    }
  }

  /**
   * Obtener facultad por ID
   */
  async getFacultadById(id: number): Promise<Facultad> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...FACULTADES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${FACULTADES_API_CONFIG.BASE_URL}${FACULTADES_API_CONFIG.ENDPOINTS.FACULTADES.BY_ID(id)}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Facultad no encontrada');
        }
        if (response.status === 403) {
          throw new Error('Acceso denegado');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // El resultado puede venir directamente o envuelto
      return result.data || result;
    } catch (error) {
      console.error('Error al obtener facultad por ID:', error);
      throw error;
    }
  }

  /**
   * Obtener facultades con programas activos
   */
  async getFacultadesConProgramas(): Promise<Facultad[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...FACULTADES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${FACULTADES_API_CONFIG.BASE_URL}${FACULTADES_API_CONFIG.ENDPOINTS.FACULTADES.CON_PROGRAMAS}`, {
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
      
      // Manejar diferentes estructuras de respuesta
      if (Array.isArray(result)) {
        return result;
      } else if (result.data && Array.isArray(result.data)) {
        return result.data;
      } else if (result.content && Array.isArray(result.content)) {
        return result.content;
      }
      
      return [];
    } catch (error) {
      console.error('Error al obtener facultades con programas:', error);
      throw error;
    }
  }

  /**
   * Crear nueva facultad
   */
  async createFacultad(facultadData: FacultadRequest): Promise<Facultad> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...FACULTADES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [FACULTADES SERVICE] Creando facultad:', facultadData);

      const response = await fetch(`${FACULTADES_API_CONFIG.BASE_URL}${FACULTADES_API_CONFIG.ENDPOINTS.FACULTADES.CREATE}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(facultadData),
      });

      const responseText = await response.text();
      console.log('🔍 [FACULTADES SERVICE] Response text:', responseText);

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
          
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.join(', ');
          }
        } catch (parseError) {
          console.warn('No se pudo parsear la respuesta de error');
        }
        
        throw new Error(errorMessage);
      }

      const result = JSON.parse(responseText);
      console.log('🔍 [FACULTADES SERVICE] Create result:', result);

      // El resultado puede venir en result.data o directamente
      return result.data || result;
    } catch (error) {
      console.error('Error al crear facultad:', error);
      throw error;
    }
  }

  /**
   * Actualizar facultad existente
   */
  async updateFacultad(id: number, facultadData: FacultadRequest): Promise<Facultad> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...FACULTADES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [FACULTADES SERVICE] Actualizando facultad:', { id, facultadData });

      const response = await fetch(`${FACULTADES_API_CONFIG.BASE_URL}${FACULTADES_API_CONFIG.ENDPOINTS.FACULTADES.UPDATE(id)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(facultadData),
      });

      const responseText = await response.text();
      console.log('🔍 [FACULTADES SERVICE] Update response text:', responseText);

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
          
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.join(', ');
          }
        } catch (parseError) {
          console.warn('No se pudo parsear la respuesta de error');
        }
        
        throw new Error(errorMessage);
      }

      const result = JSON.parse(responseText);
      console.log('🔍 [FACULTADES SERVICE] Update result:', result);

      // El resultado puede venir en result.data o directamente
      return result.data || result;
    } catch (error) {
      console.error('Error al actualizar facultad:', error);
      throw error;
    }
  }

  /**
   * Eliminar facultad (borrado lógico)
   */
  async deleteFacultad(id: number): Promise<void> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...FACULTADES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [FACULTADES SERVICE] Eliminando facultad ID:', id);

      const response = await fetch(`${FACULTADES_API_CONFIG.BASE_URL}${FACULTADES_API_CONFIG.ENDPOINTS.FACULTADES.DELETE(id)}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Facultad no encontrada');
        }
        if (response.status === 403) {
          throw new Error('No tienes permisos para eliminar facultades');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      console.log('🔍 [FACULTADES SERVICE] Facultad eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar facultad:', error);
      throw error;
    }
  }

  /**
   * Activar/desactivar facultad
   */
  async toggleFacultadActive(id: number): Promise<Facultad> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...FACULTADES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [FACULTADES SERVICE] Toggle active facultad ID:', id);

      const response = await fetch(`${FACULTADES_API_CONFIG.BASE_URL}${FACULTADES_API_CONFIG.ENDPOINTS.FACULTADES.TOGGLE_ACTIVE(id)}`, {
        method: 'PATCH',
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Facultad no encontrada');
        }
        if (response.status === 403) {
          throw new Error('No tienes permisos para modificar facultades');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('🔍 [FACULTADES SERVICE] Toggle result:', result);

      // El resultado puede venir en result.data o directamente
      return result.data || result;
    } catch (error) {
      console.error('Error al cambiar estado de facultad:', error);
      throw error;
    }
  }

  /**
   * Buscar facultades por nombre
   */
  async searchFacultadesByNombre(nombre: string): Promise<Facultad[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...FACULTADES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const url = `${FACULTADES_API_CONFIG.BASE_URL}${FACULTADES_API_CONFIG.ENDPOINTS.FACULTADES.SEARCH}?nombre=${encodeURIComponent(nombre)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Acceso denegado');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Manejar diferentes estructuras de respuesta
      if (Array.isArray(result)) {
        return result;
      } else if (result.data && Array.isArray(result.data)) {
        return result.data;
      } else if (result.content && Array.isArray(result.content)) {
        return result.content;
      }
      
      return [];
    } catch (error) {
      console.error('Error al buscar facultades por nombre:', error);
      throw error;
    }
  }

  /**
   * Buscar facultades por decano
   */
  async searchFacultadesByDecano(decano: string): Promise<Facultad[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...FACULTADES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const url = `${FACULTADES_API_CONFIG.BASE_URL}${FACULTADES_API_CONFIG.ENDPOINTS.FACULTADES.SEARCH_BY_DECANO}?decano=${encodeURIComponent(decano)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Acceso denegado');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Manejar diferentes estructuras de respuesta
      if (Array.isArray(result)) {
        return result;
      } else if (result.data && Array.isArray(result.data)) {
        return result.data;
      } else if (result.content && Array.isArray(result.content)) {
        return result.content;
      }
      
      return [];
    } catch (error) {
      console.error('Error al buscar facultades por decano:', error);
      throw error;
    }
  }
}

// Instancia singleton del servicio
export const facultadesService = new FacultadesService();

// Exportación por defecto
export default facultadesService;
