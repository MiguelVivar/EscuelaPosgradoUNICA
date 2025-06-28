"use client";

import React, { createContext, useContext, useState, useEffect} from 'react';
import { AuthContextType, AuthResponse, LoginRequest, UpdateProfileRequest, ChangePasswordRequest, MessageResponse } from '@/types/auth';
import authService from '@/services/authService';
import { AuthProviderProps } from '@/types/auth'; 

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

  const loginWithGoogle = async (googleToken: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.loginWithGoogle(googleToken);
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

  const updateProfile = async (profileData: UpdateProfileRequest): Promise<MessageResponse> => {
    try {
      const response = await authService.updateProfile(profileData);
      
      // Si la actualización fue exitosa, actualizar los datos del usuario local
      if (response.success && user) {
        const updatedUser = { 
          ...user,
          // Solo actualizar los campos que pueden haberse modificado
          ...(profileData.telefono !== undefined && { telefono: profileData.telefono }),
          ...(profileData.direccion !== undefined && { direccion: profileData.direccion })
        };
        setUser(updatedUser);
        
        // También actualizar en localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (passwordData: ChangePasswordRequest): Promise<MessageResponse> => {
    try {
      const response = await authService.changePassword(passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    loginWithGoogle,
    logout,
    updateProfile,
    changePassword,
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
