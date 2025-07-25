import { useState, useCallback, useRef, useEffect } from 'react';
import { UsuarioResponse, Role } from '@/types/auth';
import { API_CONFIG, getAuthHeaders } from '@/lib/api';

interface UseUserSearchProps {
  selectedRole: Role | 'ALL';
  showInactiveUsers: boolean;
  onUsersUpdate: (users: UsuarioResponse[]) => void;
  loadUsers: () => Promise<void>;
}

interface UseUserSearchReturn {
  searchText: string;
  isSearching: boolean;
  handleSearchChange: (text: string) => void;
  searchUsers: () => Promise<void>;
  clearSearch: () => void;
}

export function useUserSearch({ 
  selectedRole, 
  showInactiveUsers, 
  onUsersUpdate, 
  loadUsers 
}: UseUserSearchProps): UseUserSearchReturn {
  const [searchText, setSearchText] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchUsers = useCallback(async () => {
    if (!searchText.trim()) {
      // Si no hay texto de búsqueda, cargar todos los usuarios
      await loadUsers();
      return;
    }

    try {
      setIsSearching(true);

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/usuarios/buscar?texto=${encodeURIComponent(searchText.trim())}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        let filteredData = Array.isArray(data) ? data : [];
        
        // Aplicar filtros de rol si es necesario
        if (selectedRole !== 'ALL') {
          filteredData = filteredData.filter(usuario => usuario.role === selectedRole);
        }
        
        // Aplicar filtro de usuarios inactivos si es necesario
        if (!showInactiveUsers) {
          filteredData = filteredData.filter(usuario => usuario.activo === true);
        }
        
        onUsersUpdate(filteredData);
      } else {
        throw new Error('Error en la búsqueda');
      }
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      // En caso de error, mantener la lista actual
    } finally {
      setIsSearching(false);
    }
  }, [searchText, selectedRole, showInactiveUsers, onUsersUpdate, loadUsers]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
    
    // Limpiar timeout anterior si existe
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce automático de búsqueda después de 800ms de inactividad
    if (text.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        searchUsers();
      }, 800);
    } else if (text.trim().length === 0) {
      // Si se borra todo el texto, recargar todos los usuarios inmediatamente
      loadUsers();
    }
  }, [searchUsers, loadUsers]);

  const clearSearch = useCallback(() => {
    setSearchText('');
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    loadUsers();
  }, [loadUsers]);

  // Cleanup del timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    searchText,
    isSearching,
    handleSearchChange,
    searchUsers,
    clearSearch
  };
}
