import { useState, useEffect, useCallback } from 'react';
import { Deuda, CreateDeudaRequest, PagarDeudaRequest } from '@/types/pagos';
import { Role } from '@/types/auth';
import pagosService from '@/services/pagosService';
import Swal from 'sweetalert2';

interface UseDeudasProps {
  userRole: Role;
  isAuthenticated: boolean;
}

interface UseDeudasReturn {
  deudas: Deuda[];
  loading: boolean;
  error: string | null;
  selectedUsuarioId: number | null;
  showCreateModal: boolean;
  setSelectedUsuarioId: (id: number | null) => void;
  setShowCreateModal: (show: boolean) => void;
  loadDeudas: () => Promise<void>;
  createDeuda: (deudaData: CreateDeudaRequest) => Promise<boolean>;
  marcarPagada: (pagoData: PagarDeudaRequest) => Promise<boolean>;
  deleteDeuda: (deudaId: number) => Promise<boolean>;
}

export function useDeudas({ userRole, isAuthenticated }: UseDeudasProps): UseDeudasReturn {
  const [deudas, setDeudas] = useState<Deuda[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadDeudas = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);
    
    try {
      let deudasData: Deuda[];
      
      if (userRole === 'ADMIN') {
        if (selectedUsuarioId) {
          deudasData = await pagosService.getDeudasByUsuario(selectedUsuarioId);
        } else {
          deudasData = await pagosService.getAllDeudas();
        }
      } else {
        deudasData = await pagosService.getMisDeudas();
      }
      
      setDeudas(deudasData);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar las deudas';
      setError(errorMessage);
      console.error('Error loading deudas:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userRole, selectedUsuarioId]);

  const createDeuda = async (deudaData: CreateDeudaRequest): Promise<boolean> => {
    try {
      const result = await Swal.fire({
        title: '¿Crear nueva deuda?',
        text: `Se creará una deuda de S/.${deudaData.importe} para el usuario`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return false;

      await pagosService.createDeuda(deudaData);
      
      await Swal.fire({
        title: '¡Éxito!',
        text: 'La deuda ha sido creada correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      await loadDeudas();
      return true;
    } catch (error: any) {
      await Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo crear la deuda',
        icon: 'error'
      });
      return false;
    }
  };

  const marcarPagada = async (pagoData: PagarDeudaRequest): Promise<boolean> => {
    try {
      const result = await Swal.fire({
        title: '¿Marcar como pagada?',
        text: 'Esta acción moverá la deuda al historial de pagos',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, marcar pagada',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return false;

      await pagosService.marcarDeudaPagada(pagoData);
      
      await Swal.fire({
        title: '¡Éxito!',
        text: 'La deuda ha sido marcada como pagada y movida al historial',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      await loadDeudas();
      return true;
    } catch (error: any) {
      await Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo marcar la deuda como pagada',
        icon: 'error'
      });
      return false;
    }
  };

  const deleteDeuda = async (deudaId: number): Promise<boolean> => {
    try {
      const result = await Swal.fire({
        title: '¿Eliminar deuda?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return false;

      await pagosService.deleteDeuda(deudaId);
      
      await Swal.fire({
        title: '¡Eliminada!',
        text: 'La deuda ha sido eliminada correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      await loadDeudas();
      return true;
    } catch (error: any) {
      await Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo eliminar la deuda',
        icon: 'error'
      });
      return false;
    }
  };

  useEffect(() => {
    loadDeudas();
  }, [loadDeudas]);

  return {
    deudas,
    loading,
    error,
    selectedUsuarioId,
    showCreateModal,
    setSelectedUsuarioId,
    setShowCreateModal,
    loadDeudas,
    createDeuda,
    marcarPagada,
    deleteDeuda,
  };
}
