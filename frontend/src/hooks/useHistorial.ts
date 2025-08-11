import { useState, useEffect, useCallback } from 'react';
import { HistorialPago } from '@/types/pagos';
import { Role } from '@/types/auth';
import pagosService from '@/services/pagosService';

interface UseHistorialProps {
  userRole: Role;
  isAuthenticated: boolean;
}

interface UseHistorialReturn {
  historial: HistorialPago[];
  loading: boolean;
  error: string | null;
  selectedUsuarioId: number | null;
  setSelectedUsuarioId: (id: number | null) => void;
  loadHistorial: () => Promise<void>;
}

export function useHistorial({ userRole, isAuthenticated }: UseHistorialProps): UseHistorialReturn {
  const [historial, setHistorial] = useState<HistorialPago[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | null>(null);

  const loadHistorial = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);
    
    try {
      let historialData: HistorialPago[];
      
      if (userRole === 'ADMIN') {
        if (selectedUsuarioId) {
          historialData = await pagosService.getHistorialByUsuario(selectedUsuarioId);
        } else {
          historialData = await pagosService.getAllHistorial();
        }
      } else {
        historialData = await pagosService.getMiHistorial();
      }
      
      setHistorial(historialData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el historial';
      setError(errorMessage);
      console.error('Error loading historial:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userRole, selectedUsuarioId]);

  useEffect(() => {
    loadHistorial();
  }, [loadHistorial]);

  return {
    historial,
    loading,
    error,
    selectedUsuarioId,
    setSelectedUsuarioId,
    loadHistorial,
  };
}
