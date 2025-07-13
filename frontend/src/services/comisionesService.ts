import { getAuthHeaders, validateStoredToken } from '@/lib/api';
import { Comision, ComisionRequest } from '@/types/comision';

// Interfaces para las respuestas de la API
interface ApiResponse<T> {
  data?: T;
  content?: T;
  items?: T;
  success?: boolean;
  message?: string;
}

interface ErrorResponse {
  message?: string;
}

// Configuración específica para el microservicio de Matrícula - Comisiones
const COMISIONES_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_MATRICULA_API_URL || 'http://localhost:8082',
  ENDPOINTS: {
    COMISIONES: {
      LIST: '/api/comisiones',
      LIST_ACTIVE: '/api/comisiones/activas',
      CREATE: '/api/comisiones',
      UPDATE: (id: number) => `/api/comisiones/${id}`,
      DELETE: (id: number) => `/api/comisiones/${id}`,
      TOGGLE_ACTIVE: (id: number) => `/api/comisiones/${id}/toggle-activo`,
      BY_ID: (id: number) => `/api/comisiones/${id}`,
      BY_FACULTAD: (facultadId: number) => `/api/comisiones/facultad/${facultadId}`,
      SEARCH: '/api/comisiones/buscar',
      SEARCH_BY_TIPO: '/api/comisiones/tipo',
      SEARCH_BY_PRESIDENTE: '/api/comisiones/presidente'
    }
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

class ComisionesService {

  /**
   * Verificar estado del servicio de matrícula
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${COMISIONES_API_CONFIG.BASE_URL}/health/status`);
      return response.ok;
    } catch (error) {
      console.error('Error al verificar estado del servicio:', error);
      return false;
    }
  }

  /**
   * Obtener todas las comisiones
   */
  async getComisiones(): Promise<Comision[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...COMISIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [COMISIONES SERVICE] Realizando petición a:', `${COMISIONES_API_CONFIG.BASE_URL}${COMISIONES_API_CONFIG.ENDPOINTS.COMISIONES.LIST}`);

      const response = await fetch(`${COMISIONES_API_CONFIG.BASE_URL}${COMISIONES_API_CONFIG.ENDPOINTS.COMISIONES.LIST}`, {
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
      let result: ApiResponse<Comision[]> | Comision[];
      try {
        result = JSON.parse(responseText) as ApiResponse<Comision[]> | Comision[];
      } catch {
        console.error('Error parsing JSON');
        return [];
      }

      // Manejar diferentes estructuras de respuesta típicas de microservicios
      let finalData: Comision[] = [];
      
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
        console.warn('🔍 [COMISIONES SERVICE] UNKNOWN RESPONSE STRUCTURE:', result);
        finalData = [];
      }
      
      return finalData;
    } catch (error) {
      console.error('Error al obtener comisiones:', error);
      throw error;
    }
  }

  /**
   * Obtener comisiones activas
   */
  async getComisionesActivas(): Promise<Comision[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...COMISIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${COMISIONES_API_CONFIG.BASE_URL}${COMISIONES_API_CONFIG.ENDPOINTS.COMISIONES.LIST_ACTIVE}`, {
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
      console.error('Error al obtener comisiones activas:', error);
      throw error;
    }
  }

  /**
   * Obtener comisión por ID
   */
  async getComisionById(id: number): Promise<Comision> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...COMISIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${COMISIONES_API_CONFIG.BASE_URL}${COMISIONES_API_CONFIG.ENDPOINTS.COMISIONES.BY_ID(id)}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener comisión por ID:', error);
      throw error;
    }
  }

  /**
   * Obtener comisiones por facultad
   */
  async getComisionesByFacultad(facultadId: number): Promise<Comision[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...COMISIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${COMISIONES_API_CONFIG.BASE_URL}${COMISIONES_API_CONFIG.ENDPOINTS.COMISIONES.BY_FACULTAD(facultadId)}`, {
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
      console.error('Error al obtener comisiones por facultad:', error);
      throw error;
    }
  }

  /**
   * Crear nueva comisión
   */
  async createComision(comisionData: ComisionRequest): Promise<Comision> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...COMISIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [COMISIONES SERVICE] Creando comisión:', comisionData);

      const response = await fetch(`${COMISIONES_API_CONFIG.BASE_URL}${COMISIONES_API_CONFIG.ENDPOINTS.COMISIONES.CREATE}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(comisionData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: ErrorResponse = {};
        if (errorText) {
          try {
            errorData = JSON.parse(errorText) as ErrorResponse;
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
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
      }

      const responseText = await response.text();
      let result: ApiResponse<Comision> | Comision;
      try {
        result = JSON.parse(responseText) as ApiResponse<Comision> | Comision;
      } catch {
        throw new Error('Error al parsear la respuesta del servidor');
      }

      // La respuesta puede venir envuelta en un MessageResponse
      if ('success' in result && result.success && result.data) {
        return result.data;
      } else if ('id' in result) {
        // Respuesta directa de la comisión creada
        return result;
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error al crear comisión:', error);
      throw error;
    }
  }

  /**
   * Actualizar comisión existente
   */
  async updateComision(id: number, comisionData: ComisionRequest): Promise<Comision> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...COMISIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [COMISIONES SERVICE] Actualizando comisión:', id, comisionData);

      const response = await fetch(`${COMISIONES_API_CONFIG.BASE_URL}${COMISIONES_API_CONFIG.ENDPOINTS.COMISIONES.UPDATE(id)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(comisionData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: ErrorResponse = {};
        if (errorText) {
          try {
            errorData = JSON.parse(errorText) as ErrorResponse;
          } catch {
            errorData.message = errorText;
          }
        }

        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. ${errorData.message || 'Token inválido o permisos insuficientes'}`);
        } else if (response.status === 404) {
          throw new Error(`Error 404: La comisión con ID ${id} no fue encontrada.`);
        } else if (response.status === 400) {
          throw new Error(`Error de validación: ${errorData.message || 'Datos inválidos'}`);
        } else if (response.status >= 500) {
          throw new Error(`Error del servidor (${response.status}): ${errorData.message || 'Error interno del servidor'}`);
        } else {
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
      }

      const responseText = await response.text();
      let result: ApiResponse<Comision> | Comision;
      try {
        result = JSON.parse(responseText) as ApiResponse<Comision> | Comision;
      } catch {
        throw new Error('Error al parsear la respuesta del servidor');
      }

      // La respuesta puede venir envuelta en un MessageResponse
      if ('success' in result && result.success && result.data) {
        return result.data;
      } else if ('id' in result) {
        // Respuesta directa de la comisión actualizada
        return result;
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error al actualizar comisión:', error);
      throw error;
    }
  }

  /**
   * Alternar estado activo de una comisión
   */
  async toggleActiveComision(id: number, activo?: boolean): Promise<Comision> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      // Si no se proporciona el estado, primero obtenemos la comisión actual
      let nuevoEstado = activo;
      if (nuevoEstado === undefined) {
        const comisionActual = await this.getComisionById(id);
        nuevoEstado = !comisionActual.activo;
      }

      const headers = {
        ...COMISIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const url = `${COMISIONES_API_CONFIG.BASE_URL}${COMISIONES_API_CONFIG.ENDPOINTS.COMISIONES.TOGGLE_ACTIVE(id)}?activo=${nuevoEstado}`;

      const response = await fetch(url, {
        method: 'PATCH',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: ErrorResponse = {};
        if (errorText) {
          try {
            errorData = JSON.parse(errorText) as ErrorResponse;
          } catch {
            errorData.message = errorText;
          }
        }

        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. ${errorData.message || 'Token inválido o permisos insuficientes'}`);
        } else if (response.status === 404) {
          throw new Error(`Error 404: La comisión con ID ${id} no fue encontrada.`);
        } else if (response.status >= 500) {
          throw new Error(`Error del servidor (${response.status}): ${errorData.message || 'Error interno del servidor'}`);
        } else {
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
      }

      const responseText = await response.text();
      let result: ApiResponse<Comision> | Comision;
      try {
        result = JSON.parse(responseText) as ApiResponse<Comision> | Comision;
      } catch {
        throw new Error('Error al parsear la respuesta del servidor');
      }

      // La respuesta puede venir envuelta en un MessageResponse
      if ('success' in result && result.success && result.data) {
        return result.data;
      } else if ('id' in result) {
        return result;
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error al cambiar estado de comisión:', error);
      throw error;
    }
  }

  /**
   * Eliminar comisión (borrado lógico)
   */
  async deleteComision(id: number): Promise<void> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...COMISIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${COMISIONES_API_CONFIG.BASE_URL}${COMISIONES_API_CONFIG.ENDPOINTS.COMISIONES.DELETE(id)}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: ErrorResponse = {};
        if (errorText) {
          try {
            errorData = JSON.parse(errorText) as ErrorResponse;
          } catch {
            errorData.message = errorText;
          }
        }

        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. ${errorData.message || 'Token inválido o permisos insuficientes'}`);
        } else if (response.status === 404) {
          throw new Error(`Error 404: La comisión con ID ${id} no fue encontrada.`);
        } else if (response.status >= 500) {
          throw new Error(`Error del servidor (${response.status}): ${errorData.message || 'Error interno del servidor'}`);
        } else {
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
      }

      console.log('🔍 [COMISIONES SERVICE] Comisión eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar comisión:', error);
      throw error;
    }
  }

  /**
   * Buscar comisiones por nombre
   */
  async searchComisionesByNombre(nombre: string): Promise<Comision[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...COMISIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const url = `${COMISIONES_API_CONFIG.BASE_URL}${COMISIONES_API_CONFIG.ENDPOINTS.COMISIONES.SEARCH}?nombre=${encodeURIComponent(nombre)}`;
      
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
      console.error('Error al buscar comisiones por nombre:', error);
      throw error;
    }
  }

  /**
   * Buscar comisiones por tipo
   */
  async searchComisionesByTipo(tipo: string): Promise<Comision[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...COMISIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const url = `${COMISIONES_API_CONFIG.BASE_URL}${COMISIONES_API_CONFIG.ENDPOINTS.COMISIONES.SEARCH_BY_TIPO}?tipo=${encodeURIComponent(tipo)}`;
      
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
      console.error('Error al buscar comisiones por tipo:', error);
      throw error;
    }
  }

  /**
   * Buscar comisiones por presidente
   */
  async searchComisionesByPresidente(presidente: string): Promise<Comision[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...COMISIONES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const url = `${COMISIONES_API_CONFIG.BASE_URL}${COMISIONES_API_CONFIG.ENDPOINTS.COMISIONES.SEARCH_BY_PRESIDENTE}?presidente=${encodeURIComponent(presidente)}`;
      
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
      console.error('Error al buscar comisiones por presidente:', error);
      throw error;
    }
  }
}

export const comisionesService = new ComisionesService();
