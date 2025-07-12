import { getAuthHeaders, validateStoredToken } from '@/lib/api';

// Configuración específica para el microservicio de Matrícula
const MATRICULA_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_MATRICULA_API_URL || 'http://localhost:8082',
  ENDPOINTS: {
    PERIODOS: {
      LIST: '/api/periodos-academicos',
      CREATE: '/api/periodos-academicos',
      UPDATE: (id: number) => `/api/periodos-academicos/${id}`,
      DELETE: (id: number) => `/api/periodos-academicos/${id}`,
      TOGGLE_HABILITADO: (id: number) => `/api/periodos-academicos/periodos-toggle?id=${id}`,
      REACTIVAR: (id: number) => `/api/periodos-academicos/periodos-reactivar?id=${id}`
    }
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

export interface PeriodoAcademico {
  id: number;
  codigo: string;
  nombre: string;
  anio: string;
  semestre: string;
  fechaInicio: string;
  fechaFin: string;
  fechaInicioMatricula: string;
  fechaFinMatricula: string;
  activo: boolean;
  habilitado: boolean;
  descripcion?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface PeriodoForm {
  codigo: string;
  nombre: string;
  anio: string;
  semestre: string;
  fechaInicio: string;
  fechaFin: string;
  fechaInicioMatricula: string;
  fechaFinMatricula: string;
  habilitado: boolean;
  descripcion: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

class MatriculaService {
  private baseUrl = MATRICULA_API_CONFIG.BASE_URL;

  /**
   * Obtener todos los períodos académicos
   */
  async getPeriodosAcademicos(): Promise<PeriodoAcademico[]> {
    try {
      console.log('🔍 [MATRICULA SERVICE] Iniciando getPeriodosAcademicos...');
      console.log('🔍 [MATRICULA SERVICE] Base URL:', this.baseUrl);
      console.log('🔍 [MATRICULA SERVICE] Endpoint:', MATRICULA_API_CONFIG.ENDPOINTS.PERIODOS.LIST);
      console.log('🔍 [MATRICULA SERVICE] URL completa:', `${this.baseUrl}${MATRICULA_API_CONFIG.ENDPOINTS.PERIODOS.LIST}`);
      
      // Validar token antes de hacer la solicitud
      if (!validateStoredToken()) {
        console.error('🔍 [MATRICULA SERVICE] Token no válido o expirado');
        throw new Error('Error 403: Token no válido o expirado');
      }

      const token = localStorage.getItem('authToken');
      console.log('🔍 [MATRICULA SERVICE] Token disponible:', !!token);
      console.log('🔍 [MATRICULA SERVICE] Token preview:', token ? `${token.substring(0, 30)}...` : 'No token');
      
      const headers = getAuthHeaders(token ?? undefined);
      console.log('🔍 [MATRICULA SERVICE] Headers:', headers);
      
      console.log('🔍 [MATRICULA SERVICE] Realizando fetch...');
      const response = await fetch(`${this.baseUrl}${MATRICULA_API_CONFIG.ENDPOINTS.PERIODOS.LIST}`, {
        method: 'GET',
        headers,
      });

      console.log('🔍 [MATRICULA SERVICE] Response status:', response.status);
      console.log('🔍 [MATRICULA SERVICE] Response headers:', Object.fromEntries(response.headers.entries()));

      // Si el servicio no está disponible, devolver array vacío
      if (!response.ok) {
        if (response.status === 404 || response.status >= 500) {
          console.warn('Microservicio de Matrícula no disponible, usando datos vacíos');
          return [];
        }
        
        // Para errores 403, verificar token y proporcionar mejor información
        if (response.status === 403) {
          console.error('Error 403 - Acceso denegado');
          console.error('Token actual:', token ? `${token.substring(0, 20)}...` : 'No token');
          
          const errorText = await response.text();
          console.error('Response body:', errorText);
          
          throw new Error(`Error 403: Acceso denegado. ${errorText || 'Token inválido o permisos insuficientes'}`);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Intentar parsejar la respuesta de diferentes maneras (microservicios pueden tener diferentes estructuras)
      const responseText = await response.text();
      console.log('🔍 RAW RESPONSE TEXT:', responseText);
      
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return [];
      }
      
      console.log('🔍 PARSED RESPONSE:', result);
      
      // Manejar diferentes estructuras de respuesta típicas de microservicios
      let finalData: PeriodoAcademico[] = [];
      
      if (Array.isArray(result)) {
        // Respuesta directa como array
        finalData = result;
        console.log('🔍 DIRECT ARRAY RESPONSE');
      } else if (result.data && Array.isArray(result.data)) {
        // Respuesta envuelta en objeto con propiedad 'data'
        finalData = result.data;
        console.log('🔍 WRAPPED DATA RESPONSE');
      } else if (result.content && Array.isArray(result.content)) {
        // Respuesta paginada con Spring Boot
        finalData = result.content;
        console.log('🔍 PAGINATED CONTENT RESPONSE');
      } else if (result.items && Array.isArray(result.items)) {
        // Otra estructura común
        finalData = result.items;
        console.log('🔍 ITEMS RESPONSE');
      } else if (result.success && result.data) {
        // Estructura con success flag
        finalData = Array.isArray(result.data) ? result.data : [result.data];
        console.log('🔍 SUCCESS FLAG RESPONSE');
      } else {
        console.warn('🔍 UNKNOWN RESPONSE STRUCTURE:', result);
        finalData = [];
      }
      
      console.log('🔍 FINAL DATA TO RETURN:', finalData);
      console.log('🔍 FINAL DATA LENGTH:', finalData.length);
      
      return finalData;
    } catch (error) {
      console.error('Error al obtener períodos académicos:', error);
      
      // Si es un error 403, propagar el error para que el componente pueda manejarlo
      if (error instanceof Error && error.message.includes('403')) {
        throw error;
      }
      
      // En caso de otros errores, devolver array vacío para que la aplicación no se rompa
      return [];
    }
  }

  /**
   * Crear un nuevo período académico
   */
  async createPeriodoAcademico(formData: PeriodoForm): Promise<PeriodoAcademico> {
    try {
      const token = localStorage.getItem('authToken');
      
      // Garantizar que siempre haya un código válido
      const codigoFinal = formData.codigo?.trim() || this.generatePeriodCode(formData.anio, formData.semestre);
      
      // Convertir fechas de formato YYYY-MM-DD a YYYY-MM-DDTHH:mm:ss para LocalDateTime
      const formattedData = {
        ...formData,
        codigo: codigoFinal,
        fechaInicio: this.formatDateForBackend(formData.fechaInicio),
        fechaFin: this.formatDateForBackend(formData.fechaFin),
        fechaInicioMatricula: this.formatDateForBackend(formData.fechaInicioMatricula),
        fechaFinMatricula: this.formatDateForBackend(formData.fechaFinMatricula),
      };
      
      console.log('Datos formateados para envío:', formattedData); // Debug
      
      const response = await fetch(`${this.baseUrl}${MATRICULA_API_CONFIG.ENDPOINTS.PERIODOS.CREATE}`, {
        method: 'POST',
        headers: getAuthHeaders(token ?? undefined),
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Manejo específico para errores de duplicados
        if (response.status === 409 || response.status === 400) {
          if (errorData.message && (
            errorData.message.includes('ya existe') ||
            errorData.message.includes('duplicate') ||
            errorData.message.includes('UNIQUE') ||
            errorData.message.includes('Duplicate')
          )) {
            throw new Error(`El período académico "${codigoFinal}" ya existe en la base de datos.`);
          }
        }
        
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      // El backend devuelve directamente el objeto PeriodoAcademico
      const result: PeriodoAcademico = await response.json();
      return result;
    } catch (error) {
      console.error('Error al crear período académico:', error);
      throw error;
    }
  }

  /**
   * Actualizar un período académico existente
   */
  async updatePeriodoAcademico(id: number, formData: PeriodoForm): Promise<PeriodoAcademico> {
    try {
      const token = localStorage.getItem('authToken');
      
      // Garantizar que siempre haya un código válido
      const codigoFinal = formData.codigo?.trim() || this.generatePeriodCode(formData.anio, formData.semestre);
      
      // Convertir fechas de formato YYYY-MM-DD a YYYY-MM-DDTHH:mm:ss para LocalDateTime
      const formattedData = {
        ...formData,
        codigo: codigoFinal,
        fechaInicio: this.formatDateForBackend(formData.fechaInicio),
        fechaFin: this.formatDateForBackend(formData.fechaFin),
        fechaInicioMatricula: this.formatDateForBackend(formData.fechaInicioMatricula),
        fechaFinMatricula: this.formatDateForBackend(formData.fechaFinMatricula),
      };
      
      console.log('Datos formateados para actualización:', formattedData); // Debug
      
      const response = await fetch(`${this.baseUrl}${MATRICULA_API_CONFIG.ENDPOINTS.PERIODOS.UPDATE(id)}`, {
        method: 'PUT',
        headers: getAuthHeaders(token ?? undefined),
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error al actualizar período académico`);
      }

      // El backend devuelve directamente el objeto PeriodoAcademico
      const result: PeriodoAcademico = await response.json();
      return result;
    } catch (error) {
      console.error('Error al actualizar período académico:', error);
      throw error;
    }
  }

  /**
   * Eliminar un período académico
   */
  async deletePeriodoAcademico(id: number): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.baseUrl}${MATRICULA_API_CONFIG.ENDPOINTS.PERIODOS.DELETE(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token ?? undefined),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error al eliminar período académico`);
      }

      // El endpoint DELETE puede devolver solo un mensaje de confirmación o void
    } catch (error) {
      console.error('Error al eliminar período académico:', error);
      throw error;
    }
  }

  /**
   * Alternar estado habilitado de un período académico
   */
  async togglePeriodoHabilitado(id: number): Promise<PeriodoAcademico> {
    try {
      console.log('🔍 [MATRICULA SERVICE] Iniciando togglePeriodoHabilitado...');
      console.log('🔍 [MATRICULA SERVICE] ID del período:', id);
      console.log('🔍 [MATRICULA SERVICE] Base URL:', this.baseUrl);
      console.log('🔍 [MATRICULA SERVICE] Endpoint completo:', `${this.baseUrl}${MATRICULA_API_CONFIG.ENDPOINTS.PERIODOS.TOGGLE_HABILITADO(id)}`);
      
      // Validar token antes de hacer la solicitud
      if (!validateStoredToken()) {
        console.error('🔍 [MATRICULA SERVICE] Token no válido o expirado');
        throw new Error('Error 403: Token no válido o expirado');
      }

      const token = localStorage.getItem('authToken');
      console.log('🔍 [MATRICULA SERVICE] Token disponible:', !!token);
      console.log('🔍 [MATRICULA SERVICE] Token preview:', token ? `${token.substring(0, 30)}...` : 'No token');
      
      const headers = getAuthHeaders(token ?? undefined);
      console.log('🔍 [MATRICULA SERVICE] Headers:', headers);
      
      console.log('🔍 [MATRICULA SERVICE] Realizando fetch para toggle...');
      const response = await fetch(`${this.baseUrl}${MATRICULA_API_CONFIG.ENDPOINTS.PERIODOS.TOGGLE_HABILITADO(id)}`, {
        method: 'POST', // Cambiado temporalmente de PATCH a POST para evitar problemas de CORS
        headers,
      });

      console.log('🔍 [MATRICULA SERVICE] Response status:', response.status);
      console.log('🔍 [MATRICULA SERVICE] Response ok:', response.ok);
      console.log('🔍 [MATRICULA SERVICE] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        console.error('🔍 [MATRICULA SERVICE] Response no exitosa');
        
        // Intentar obtener información del error
        let errorData: any = {};
        let errorText = '';
        
        try {
          errorText = await response.text();
          console.log('🔍 [MATRICULA SERVICE] Error response text:', errorText);
          
          if (errorText) {
            try {
              errorData = JSON.parse(errorText);
              console.log('🔍 [MATRICULA SERVICE] Error data parsed:', errorData);
            } catch (parseError) {
              console.log('🔍 [MATRICULA SERVICE] No se pudo parsear como JSON, usando texto crudo');
              errorData.message = errorText;
            }
          }
        } catch (textError) {
          console.error('🔍 [MATRICULA SERVICE] Error al leer response text:', textError);
        }
        
        // Manejo específico por código de estado
        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. ${errorData.message || errorText || 'Token inválido o permisos insuficientes'}`);
        } else if (response.status === 404) {
          throw new Error(`Error 404: El período académico con ID ${id} no fue encontrado.`);
        } else if (response.status >= 500) {
          throw new Error(`Error del servidor (${response.status}): ${errorData.message || errorText || 'Error interno del servidor'}`);
        } else {
          throw new Error(errorData.message || errorText || `Error ${response.status}: ${response.statusText}`);
        }
      }

      // Leer respuesta exitosa
      const responseText = await response.text();
      console.log('🔍 [MATRICULA SERVICE] Response text exitoso:', responseText);
      
      let result: PeriodoAcademico;
      try {
        result = JSON.parse(responseText);
        console.log('🔍 [MATRICULA SERVICE] Estado cambiado exitosamente:', result);
      } catch (parseError) {
        console.error('🔍 [MATRICULA SERVICE] Error parsing successful response:', parseError);
        throw new Error('Error al procesar la respuesta del servidor');
      }
      
      return result;
    } catch (error) {
      console.error('🔍 [MATRICULA SERVICE] Error completo al cambiar estado del período académico:', error);
      
      // Si es un error de red (Failed to fetch), proporcionar mejor información
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('🔍 [MATRICULA SERVICE] Error de conectividad detectado');
        throw new Error('Error de conexión: No se pudo conectar con el servidor. Verifique su conexión a internet y que el servicio esté disponible.');
      }
      
      // Si es un error personalizado nuestro, propagarlo
      if (error instanceof Error) {
        throw error;
      }
      
      // Error genérico
      throw new Error('Error inesperado al cambiar el estado del período académico');
    }
  }

  /**
   * Reactivar un período académico desactivado
   */
  async reactivarPeriodoAcademico(id: number): Promise<PeriodoAcademico> {
    try {
      console.log('🔍 [MATRICULA SERVICE] Iniciando reactivarPeriodoAcademico...');
      console.log('🔍 [MATRICULA SERVICE] ID del período:', id);
      console.log('🔍 [MATRICULA SERVICE] Base URL:', this.baseUrl);
      console.log('🔍 [MATRICULA SERVICE] Endpoint completo:', `${this.baseUrl}${MATRICULA_API_CONFIG.ENDPOINTS.PERIODOS.REACTIVAR(id)}`);
      
      // Validar token antes de hacer la solicitud
      if (!validateStoredToken()) {
        console.error('🔍 [MATRICULA SERVICE] Token no válido o expirado');
        throw new Error('Error 403: Token no válido o expirado');
      }

      const token = localStorage.getItem('authToken');
      console.log('🔍 [MATRICULA SERVICE] Token disponible:', !!token);
      console.log('🔍 [MATRICULA SERVICE] Token preview:', token ? `${token.substring(0, 30)}...` : 'No token');
      
      const headers = getAuthHeaders(token ?? undefined);
      console.log('🔍 [MATRICULA SERVICE] Headers:', headers);
      
      console.log('🔍 [MATRICULA SERVICE] Realizando fetch para reactivar...');
      const response = await fetch(`${this.baseUrl}${MATRICULA_API_CONFIG.ENDPOINTS.PERIODOS.REACTIVAR(id)}`, {
        method: 'POST', // Cambiado temporalmente de PATCH a POST para evitar problemas de CORS
        headers,
      });

      console.log('🔍 [MATRICULA SERVICE] Response status:', response.status);
      console.log('🔍 [MATRICULA SERVICE] Response ok:', response.ok);
      console.log('🔍 [MATRICULA SERVICE] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        console.error('🔍 [MATRICULA SERVICE] Response no exitosa');
        
        // Intentar obtener información del error
        let errorData: any = {};
        let errorText = '';
        
        try {
          errorText = await response.text();
          console.log('🔍 [MATRICULA SERVICE] Error response text:', errorText);
          
          if (errorText) {
            try {
              errorData = JSON.parse(errorText);
              console.log('🔍 [MATRICULA SERVICE] Error data parsed:', errorData);
            } catch (parseError) {
              console.log('🔍 [MATRICULA SERVICE] No se pudo parsear como JSON, usando texto crudo');
              errorData.message = errorText;
            }
          }
        } catch (textError) {
          console.error('🔍 [MATRICULA SERVICE] Error al leer response text:', textError);
        }
        
        // Manejo específico por código de estado
        if (response.status === 403) {
          throw new Error(`Error 403: Acceso denegado. ${errorData.message || errorText || 'Token inválido o permisos insuficientes'}`);
        } else if (response.status === 404) {
          throw new Error(`Error 404: El período académico con ID ${id} no fue encontrado.`);
        } else if (response.status >= 500) {
          throw new Error(`Error del servidor (${response.status}): ${errorData.message || errorText || 'Error interno del servidor'}`);
        } else {
          throw new Error(errorData.message || errorText || `Error ${response.status}: ${response.statusText}`);
        }
      }

      // Leer respuesta exitosa
      const responseText = await response.text();
      console.log('🔍 [MATRICULA SERVICE] Response text exitoso:', responseText);
      
      let result: PeriodoAcademico;
      try {
        result = JSON.parse(responseText);
        console.log('🔍 [MATRICULA SERVICE] Período reactivado exitosamente:', result);
      } catch (parseError) {
        console.error('🔍 [MATRICULA SERVICE] Error parsing successful response:', parseError);
        throw new Error('Error al procesar la respuesta del servidor');
      }
      
      return result;
    } catch (error) {
      console.error('🔍 [MATRICULA SERVICE] Error completo al reactivar período académico:', error);
      
      // Si es un error de red (Failed to fetch), proporcionar mejor información
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('🔍 [MATRICULA SERVICE] Error de conectividad detectado');
        throw new Error('Error de conexión: No se pudo conectar con el servidor. Verifique su conexión a internet y que el servicio esté disponible.');
      }
      
      // Si es un error personalizado nuestro, propagarlo
      if (error instanceof Error) {
        throw error;
      }
      
      // Error genérico
      throw new Error('Error inesperado al reactivar el período académico');
    }
  }

  /**
   * Verificar si el servicio está disponible
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/actuator/health`, {
        method: 'GET',
        headers: MATRICULA_API_CONFIG.HEADERS,
      });
      return response.ok;
    } catch (error) {
      console.warn('Microservicio de Matrícula no está disponible:', error);
      return false;
    }
  }

  /**
   * Verificar si ya existe un período académico con el mismo código
   */
  async checkPeriodoExists(codigo: string): Promise<boolean> {
    try {
      const periodos = await this.getPeriodosAcademicos();
      return periodos.some(p => p.codigo.toLowerCase() === codigo.toLowerCase());
    } catch (error) {
      console.warn('Error al verificar duplicados:', error);
      return false; // En caso de error, permitir continuar
    }
  }

  /**
   * Formatear fecha de YYYY-MM-DD a YYYY-MM-DDTHH:mm:ss para LocalDateTime
   * Si la fecha ya tiene formato de DateTime, la devuelve sin cambios
   */
  private formatDateForBackend(dateString: string): string {
    // Si ya tiene formato DateTime (contiene 'T'), devolver sin cambios
    if (dateString.includes('T')) {
      return dateString;
    }
    
    // Si es solo fecha, agregar hora por defecto (00:00:00)
    return `${dateString}T00:00:00`;
  }

  /**
   * Generar código del período académico basado en año y semestre
   * Formato: YYYY-S (ejemplo: 2025-I, 2025-II)
   */
  private generatePeriodCode(anio: string, semestre: string): string {
    return `${anio}-${semestre}`;
  }
}

export const matriculaService = new MatriculaService();
