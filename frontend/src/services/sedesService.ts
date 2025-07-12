import { getAuthHeaders, validateStoredToken } from '@/lib/api';
import { Sede, SedeRequest } from '@/types/sede';

// Configuración específica para el microservicio de Matrícula - Sedes
const SEDES_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_MATRICULA_API_URL || 'http://localhost:8082',
  ENDPOINTS: {
    SEDES: {
      LIST: '/api/matricula/sedes',
      LIST_ACTIVE: '/api/matricula/sedes/activas',
      CREATE: '/api/matricula/sedes',
      UPDATE: (id: number) => `/api/matricula/sedes/${id}`,
      DELETE: (id: number) => `/api/matricula/sedes/${id}`,
      TOGGLE_ACTIVE: (id: number) => `/api/matricula/sedes/${id}/toggle-active`,
      BY_ID: (id: number) => `/api/matricula/sedes/${id}`,
      SEARCH: '/api/matricula/sedes/buscar'
    }
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

class SedesService {

  /**
   * Verificar estado del servicio de matrícula
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SEDES_API_CONFIG.BASE_URL}/actuator/health`, {
        method: 'GET',
        headers: {
          ...SEDES_API_CONFIG.HEADERS,
          ...getAuthHeaders()
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Error verificando salud del servicio:', error);
      return false;
    }
  }

  /**
   * Obtener todas las sedes
   */
  async getSedes(): Promise<Sede[]> {
    try {
      // Validar token antes de hacer la petición
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...SEDES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [SEDES SERVICE] Realizando petición a:', `${SEDES_API_CONFIG.BASE_URL}${SEDES_API_CONFIG.ENDPOINTS.SEDES.LIST}`);
      console.log('🔍 [SEDES SERVICE] Headers:', headers);

      const response = await fetch(`${SEDES_API_CONFIG.BASE_URL}${SEDES_API_CONFIG.ENDPOINTS.SEDES.LIST}`, {
        method: 'GET',
        headers,
      });

      console.log('🔍 [SEDES SERVICE] Response status:', response.status);
      console.log('🔍 [SEDES SERVICE] Response ok:', response.ok);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. Token inválido o permisos insuficientes`);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Intentar parsear la respuesta de diferentes maneras (microservicios pueden tener diferentes estructuras)
      const responseText = await response.text();
      console.log('🔍 [SEDES SERVICE] RAW RESPONSE TEXT:', responseText);
      
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return [];
      }
      
      console.log('🔍 [SEDES SERVICE] PARSED RESPONSE:', result);

      // Manejar diferentes estructuras de respuesta típicas de microservicios
      let finalData: Sede[] = [];
      
      if (Array.isArray(result)) {
        // Respuesta directa como array
        finalData = result;
        console.log('🔍 [SEDES SERVICE] DIRECT ARRAY RESPONSE');
      } else if (result.data && Array.isArray(result.data)) {
        // Respuesta envuelta en objeto con propiedad 'data'
        finalData = result.data;
        console.log('🔍 [SEDES SERVICE] WRAPPED DATA RESPONSE');
      } else if (result.content && Array.isArray(result.content)) {
        // Respuesta paginada con Spring Boot
        finalData = result.content;
        console.log('🔍 [SEDES SERVICE] PAGINATED CONTENT RESPONSE');
      } else if (result.items && Array.isArray(result.items)) {
        // Otra estructura común
        finalData = result.items;
        console.log('🔍 [SEDES SERVICE] ITEMS RESPONSE');
      } else if (result.success && result.data) {
        // Estructura con success flag
        finalData = Array.isArray(result.data) ? result.data : [result.data];
        console.log('🔍 [SEDES SERVICE] SUCCESS FLAG RESPONSE');
      } else {
        console.warn('🔍 [SEDES SERVICE] UNKNOWN RESPONSE STRUCTURE:', result);
        finalData = [];
      }
      
      console.log('🔍 [SEDES SERVICE] FINAL DATA TO RETURN:', finalData);
      console.log('🔍 [SEDES SERVICE] FINAL DATA LENGTH:', finalData.length);
      
      return finalData;
    } catch (error) {
      console.error('Error al obtener sedes:', error);
      throw error;
    }
  }

  /**
   * Obtener sedes activas
   */
  async getSedesActivas(): Promise<Sede[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...SEDES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${SEDES_API_CONFIG.BASE_URL}${SEDES_API_CONFIG.ENDPOINTS.SEDES.LIST_ACTIVE}`, {
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
      console.error('Error al obtener sedes activas:', error);
      throw error;
    }
  }

  /**
   * Obtener sede por ID
   */
  async getSedeById(id: number): Promise<Sede> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...SEDES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const response = await fetch(`${SEDES_API_CONFIG.BASE_URL}${SEDES_API_CONFIG.ENDPOINTS.SEDES.BY_ID(id)}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Sede con ID ${id} no encontrada`);
        }
        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. Token inválido o permisos insuficientes`);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener sede por ID:', error);
      throw error;
    }
  }

  /**
   * Crear nueva sede
   */
  async createSede(sedeData: SedeRequest): Promise<Sede> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...SEDES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [SEDES SERVICE] Creando sede:', sedeData);

      const response = await fetch(`${SEDES_API_CONFIG.BASE_URL}${SEDES_API_CONFIG.ENDPOINTS.SEDES.CREATE}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(sedeData),
      });

      console.log('🔍 [SEDES SERVICE] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('🔍 [SEDES SERVICE] Error response text:', errorText);
        
        let errorData: any = {};
        if (errorText) {
          try {
            errorData = JSON.parse(errorText);
          } catch (parseError) {
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
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Error al parsear la respuesta del servidor');
      }

      // La respuesta puede venir envuelta en un MessageResponse
      if (result.success && result.data) {
        return result.data;
      } else if (result.id) {
        // Respuesta directa de la sede creada
        return result;
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error al crear sede:', error);
      throw error;
    }
  }

  /**
   * Actualizar sede existente
   */
  async updateSede(id: number, sedeData: SedeRequest): Promise<Sede> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...SEDES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [SEDES SERVICE] Actualizando sede:', id, sedeData);

      const response = await fetch(`${SEDES_API_CONFIG.BASE_URL}${SEDES_API_CONFIG.ENDPOINTS.SEDES.UPDATE(id)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(sedeData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: any = {};
        if (errorText) {
          try {
            errorData = JSON.parse(errorText);
          } catch (parseError) {
            errorData.message = errorText;
          }
        }

        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. ${errorData.message || 'Token inválido o permisos insuficientes'}`);
        } else if (response.status === 404) {
          throw new Error(`Error 404: La sede con ID ${id} no fue encontrada.`);
        } else if (response.status === 400) {
          throw new Error(`Error de validación: ${errorData.message || 'Datos inválidos'}`);
        } else if (response.status >= 500) {
          throw new Error(`Error del servidor (${response.status}): ${errorData.message || 'Error interno del servidor'}`);
        } else {
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
      }

      const responseText = await response.text();
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Error al parsear la respuesta del servidor');
      }

      // La respuesta puede venir envuelta en un MessageResponse
      if (result.success && result.data) {
        return result.data;
      } else if (result.id) {
        // Respuesta directa de la sede actualizada
        return result;
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error al actualizar sede:', error);
      throw error;
    }
  }

  /**
   * Alternar estado activo de una sede
   */
  async toggleSedeActiva(id: number): Promise<Sede> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...SEDES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [SEDES SERVICE] Alternando estado de sede:', id);

      const response = await fetch(`${SEDES_API_CONFIG.BASE_URL}${SEDES_API_CONFIG.ENDPOINTS.SEDES.TOGGLE_ACTIVE(id)}`, {
        method: 'PATCH',
        headers,
      });

      console.log('🔍 [SEDES SERVICE] Response status:', response.status);

      if (!response.ok) {
        let errorData: any = {};
        let errorText = '';
        
        try {
          errorText = await response.text();
          console.log('🔍 [SEDES SERVICE] Error response text:', errorText);
          
          if (errorText) {
            try {
              errorData = JSON.parse(errorText);
            } catch (parseError) {
              errorData.message = errorText;
            }
          }
        } catch (textError) {
          console.error('🔍 [SEDES SERVICE] Error al leer response text:', textError);
        }
        
        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. ${errorData.message || errorText || 'Token inválido o permisos insuficientes'}`);
        } else if (response.status === 404) {
          throw new Error(`Error 404: La sede con ID ${id} no fue encontrada.`);
        } else if (response.status >= 500) {
          throw new Error(`Error del servidor (${response.status}): ${errorData.message || errorText || 'Error interno del servidor'}`);
        } else {
          throw new Error(errorData.message || errorText || `Error ${response.status}: ${response.statusText}`);
        }
      }

      const responseText = await response.text();
      console.log('🔍 [SEDES SERVICE] Response text exitoso:', responseText);
      
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Error al parsear la respuesta del servidor');
      }

      console.log('🔍 [SEDES SERVICE] Parsed result:', result);

      // La respuesta puede venir envuelta en un MessageResponse
      if (result.success && result.data) {
        return result.data;
      } else if (result.id) {
        // Respuesta directa de la sede
        return result;
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error al alternar estado de sede:', error);
      throw error;
    }
  }

  /**
   * Eliminar sede (borrado lógico)
   */
  async deleteSede(id: number): Promise<void> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...SEDES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      console.log('🔍 [SEDES SERVICE] Eliminando sede:', id);

      const response = await fetch(`${SEDES_API_CONFIG.BASE_URL}${SEDES_API_CONFIG.ENDPOINTS.SEDES.DELETE(id)}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: any = {};
        if (errorText) {
          try {
            errorData = JSON.parse(errorText);
          } catch (parseError) {
            errorData.message = errorText;
          }
        }

        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. ${errorData.message || 'Token inválido o permisos insuficientes'}`);
        } else if (response.status === 404) {
          throw new Error(`Error 404: La sede con ID ${id} no fue encontrada.`);
        } else if (response.status >= 500) {
          throw new Error(`Error del servidor (${response.status}): ${errorData.message || 'Error interno del servidor'}`);
        } else {
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
      }

      // La eliminación exitosa puede no devolver contenido
      console.log('🔍 [SEDES SERVICE] Sede eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar sede:', error);
      throw error;
    }
  }

  /**
   * Buscar sedes por nombre
   */
  async searchSedesByNombre(nombre: string): Promise<Sede[]> {
    try {
      if (!validateStoredToken()) {
        throw new Error('Token no válido o expirado');
      }

      const headers = {
        ...SEDES_API_CONFIG.HEADERS,
        ...getAuthHeaders()
      };

      const url = `${SEDES_API_CONFIG.BASE_URL}${SEDES_API_CONFIG.ENDPOINTS.SEDES.SEARCH}?nombre=${encodeURIComponent(nombre)}`;

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
      console.error('Error al buscar sedes:', error);
      throw error;
    }
  }
}

export const sedesService = new SedesService();
