import { useState, useEffect } from 'react';
import { Authority } from '@/types/authority';
import { authoritiesData } from '@/data/authorities';

export const useAuthorities = () => {
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Simular carga de datos (en el futuro podría ser una API call)
      setAuthorities(authoritiesData);
      setLoading(false);
    } catch {
      setError('Error al cargar las autoridades');
      setLoading(false);
    }
  }, []);

  const getAuthorityById = (id: string): Authority | undefined => {
    return authorities.find(authority => authority.id === id);
  };

  const getAuthoritiesByRole = (title: string): Authority[] => {
    return authorities.filter(authority => 
      authority.title.toLowerCase().includes(title.toLowerCase())
    );
  };

  return {
    authorities,
    loading,
    error,
    getAuthorityById,
    getAuthoritiesByRole,
  };
};

export default useAuthorities;
