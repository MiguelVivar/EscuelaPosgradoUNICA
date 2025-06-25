import { API_CONFIG, getAuthHeaders } from '@/lib/api';
import { LoginRequest, AuthResponse, MessageResponse, UsuarioResponse, ApiError } from '@/types/auth';

class AuthService {
  private baseUrl = API_CONFIG.BASE_URL;

  /**
   * Realiza el login del usuario
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || 'Error al iniciar sesión',
          response.status,
          false
        );
      }

      // Guardar token en localStorage y cookie
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        
        // También establecer cookie para el middleware
        document.cookie = `authToken=${data.token}; path=/; max-age=86400; SameSite=Strict`;
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Error de conexión con el servidor');
    }
  }

  /**
   * Registra un nuevo usuario
   */
  async register(userData: Record<string, unknown>): Promise<MessageResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || 'Error al registrar usuario',
          response.status,
          false
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Error de conexión con el servidor');
    }
  }

  /**
   * Obtiene la información del usuario actual
   */
  async getCurrentUser(): Promise<UsuarioResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.AUTH.ME}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || 'Error al obtener información del usuario',
          response.status,
          false
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Error de conexión con el servidor');
    }
  }

  /**
   * Valida si el token actual es válido
   */
  async validateToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.AUTH.VALIDATE}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // También eliminar la cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  /**
   * Obtiene el token almacenado
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  /**
   * Obtiene el usuario almacenado
   */
  getStoredUser(): AuthResponse | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
export default authService;
