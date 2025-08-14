import { useState, useEffect, useCallback } from 'react';
import { Solicitud, CreateSolicitudRequest, RespondSolicitudRequest } from '@/types/pagos';
import { Role } from '@/types/auth';
import pagosService from '@/services/pagosService';
import Swal from 'sweetalert2';

interface UseSolicitudesProps {
  userRole: Role;
  isAuthenticated: boolean;
}

interface UseSolicitudesReturn {
  solicitudes: Solicitud[];
  loading: boolean;
  error: string | null;
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  loadSolicitudes: () => Promise<void>;
  createSolicitud: (solicitudData: CreateSolicitudRequest) => Promise<boolean>;
  respondSolicitud: (responseData: RespondSolicitudRequest) => Promise<boolean>;
}

export function useSolicitudes({ userRole, isAuthenticated }: UseSolicitudesProps): UseSolicitudesReturn {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadSolicitudes = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);
    
    try {
      let solicitudesData: Solicitud[];
      
      if (userRole === 'ADMIN') {
        solicitudesData = await pagosService.getAllSolicitudes();
      } else {
        solicitudesData = await pagosService.getMisSolicitudes();
      }
      
      setSolicitudes(solicitudesData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las solicitudes';
      setError(errorMessage);
      console.error('Error loading solicitudes:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userRole]);

  const createSolicitud = async (solicitudData: CreateSolicitudRequest): Promise<boolean> => {
    try {
      const result = await Swal.fire({
        title: '¿Enviar solicitud?',
        text: `Se enviará una solicitud de ${solicitudData.tipo.toLowerCase()}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return false;

      await pagosService.createSolicitud(solicitudData);
      
      await Swal.fire({
        title: '¡Éxito!',
        text: 'Tu solicitud ha sido enviada correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      await loadSolicitudes();
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'No se pudo enviar la solicitud';
      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      });
      return false;
    }
  };

  const respondSolicitud = async (responseData: RespondSolicitudRequest): Promise<boolean> => {
    try {
      const action = responseData.estado === 'APROBADA' ? 'aprobar' : 'rechazar';
      const color = responseData.estado === 'APROBADA' ? '#16a34a' : '#dc2626';
      
      const result = await Swal.fire({
        title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} solicitud?`,
        text: 'Esta acción enviará una respuesta al usuario',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: color,
        cancelButtonColor: '#6b7280',
        confirmButtonText: `Sí, ${action}`,
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return false;

      await pagosService.respondSolicitud(responseData);
      
      await Swal.fire({
        title: '¡Éxito!',
        text: `La solicitud ha sido ${responseData.estado.toLowerCase()}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      await loadSolicitudes();
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'No se pudo responder la solicitud';
      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      });
      return false;
    }
  };

  useEffect(() => {
    loadSolicitudes();
  }, [loadSolicitudes]);

  return {
    solicitudes,
    loading,
    error,
    showCreateModal,
    setShowCreateModal,
    loadSolicitudes,
    createSolicitud,
    respondSolicitud,
  };
}
