'use client';

import { useState, useEffect } from 'react';
import { Encuesta, CreateEncuestaRequest } from '@/types/encuestas';
import Swal from 'sweetalert2';

export const useEncuestas = () => {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEncuestas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/encuestas');
      if (!response.ok) {
        throw new Error('Error al cargar las encuestas');
      }
      const data = await response.json();
      setEncuestas(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error al cargar encuestas:', err);
    } finally {
      setLoading(false);
    }
  };

  const crearEncuesta = async (encuestaData: CreateEncuestaRequest): Promise<boolean> => {
    try {
      const response = await fetch('/api/encuestas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(encuestaData),
      });

      if (!response.ok) {
        throw new Error('Error al crear la encuesta');
      }

      await Swal.fire({
        title: '¡Éxito!',
        text: 'La encuesta ha sido creada correctamente',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      fetchEncuestas();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return false;
    }
  };

  const eliminarEncuesta = async (id: number): Promise<boolean> => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) {
        return false;
      }

      const response = await fetch(`/api/encuestas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la encuesta');
      }

      await Swal.fire({
        title: '¡Eliminada!',
        text: 'La encuesta ha sido eliminada correctamente',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      fetchEncuestas();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return false;
    }
  };

  const actualizarEstadoEncuesta = async (id: number, estado: boolean): Promise<boolean> => {
    try {
      const response = await fetch(`/api/encuestas/${id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la encuesta');
      }

      await Swal.fire({
        title: '¡Actualizada!',
        text: 'El estado de la encuesta ha sido actualizado',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      fetchEncuestas();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return false;
    }
  };

  const refreshEncuestas = () => {
    fetchEncuestas();
  };

  useEffect(() => {
    fetchEncuestas();
  }, []);

  return {
    encuestas,
    loading,
    error,
    crearEncuesta,
    eliminarEncuesta,
    actualizarEstadoEncuesta,
    refreshEncuestas,
  };
};
