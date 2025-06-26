"use client";

import React, { createContext, useContext, useState, useEffect} from 'react';
import { AuthContextType, AuthResponse, LoginRequest } from '@/types/auth';
import authService from '@/services/authService';
import { AuthProviderProps } from '@/types/auth'; // Asegúrate de que este tipo esté definido en tu archivo de tipos

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la aplicación
    const initializeAuth = async () => {
      try {
        const storedToken = authService.getToken();
        const storedUser = authService.getStoredUser();

        if (storedToken && storedUser) {
          // Validar si el token sigue siendo válido
          const isValid = await authService.validateToken();
          
          if (isValid) {
            setToken(storedToken);
            setUser(storedUser);
          } else {
            // Token inválido, limpiar datos
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response);
      setToken(response.token);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
