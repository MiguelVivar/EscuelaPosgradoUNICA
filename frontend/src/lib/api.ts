// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  MATRICULA_URL: process.env.NEXT_PUBLIC_MATRICULA_API_URL || 'http://localhost:8082',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/registro',
      ME: '/api/auth/me',
      VALIDATE: '/api/auth/validate',
      UPDATE_PROFILE: '/api/auth/actualizar-perfil',
      CHANGE_PASSWORD: '/api/auth/cambiar-password'
    }
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

// Helper function to decode JWT token and check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return true; // Si no se puede decodificar, considerar como expirado
  }
};

// Helper function to check if token is about to expire (within 5 minutes)
export const isTokenAboutToExpire = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const fiveMinutesFromNow = currentTime + (5 * 60); // 5 minutos
    return payload.exp < fiveMinutesFromNow;
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return true;
  }
};

// Helper function to validate current stored token
export const validateStoredToken = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  
  if (isTokenExpired(token)) {
    console.warn('Token expirado, limpiando localStorage');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return false;
  }
  
  return true;
};

// Helper function to get auth headers
export const getAuthHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = { ...API_CONFIG.HEADERS };
  
  let authToken = token;
  
  if (!authToken && typeof window !== 'undefined') {
    authToken = localStorage.getItem('authToken') || undefined;
  }
  
  if (authToken) {
    // Verificar si el token ha expirado
    if (isTokenExpired(authToken)) {
      console.warn('Token expirado, limpiando localStorage');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // No incluir el token expirado en los headers
      return headers;
    }
    
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};
