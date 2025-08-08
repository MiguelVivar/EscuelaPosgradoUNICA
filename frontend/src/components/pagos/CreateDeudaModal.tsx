'use client';

import { useState, useEffect } from 'react';
import { CreateDeudaRequest } from '@/types/pagos';
import { UsuarioResponse } from '@/types/auth';
import { API_CONFIG, getAuthHeaders } from '@/lib/api';

interface CreateDeudaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deudaData: CreateDeudaRequest) => Promise<boolean>;
  preselectedUsuarioId?: number;
}

export default function CreateDeudaModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  preselectedUsuarioId 
}: CreateDeudaModalProps) {
  const [formData, setFormData] = useState<CreateDeudaRequest>({
    usuarioId: preselectedUsuarioId || 0,
    tipo: '',
    codigo: '',
    concepto: '',
    fechaVencimiento: '',
    importe: 0,
    descripcion: ''
  });
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  useEffect(() => {
    if (isOpen && !preselectedUsuarioId) {
      loadUsuarios();
    }
  }, [isOpen, preselectedUsuarioId]);

  useEffect(() => {
    if (preselectedUsuarioId) {
      setFormData(prev => ({ ...prev, usuarioId: preselectedUsuarioId }));
    }
  }, [preselectedUsuarioId]);

  const loadUsuarios = async () => {
    setLoadingUsuarios(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/usuarios/rol/ALUMNO`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Error loading usuarios:', error);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await onSubmit(formData);
    
    if (success) {
      setFormData({
        usuarioId: preselectedUsuarioId || 0,
        tipo: '',
        codigo: '',
        concepto: '',
        fechaVencimiento: '',
        importe: 0,
        descripcion: ''
      });
      onClose();
    }
    
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'importe' || name === 'usuarioId' ? Number(value) : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Crear Nueva Deuda</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Usuario */}
          {!preselectedUsuarioId && (
            <div>
              <label className="block text-sm font-medium mb-1">Usuario *</label>
              <select
                name="usuarioId"
                value={formData.usuarioId}
                onChange={handleChange}
                required
                disabled={loadingUsuarios}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>
                  {loadingUsuarios ? 'Cargando usuarios...' : 'Seleccionar usuario'}
                </option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombres} {usuario.apellidos} ({usuario.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium mb-1">Tipo *</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar tipo</option>
              <option value="MATRICULA">Matrícula</option>
              <option value="PENSION">Pensión</option>
              <option value="CERTIFICADO">Certificado</option>
              <option value="GRADO">Grado</option>
              <option value="OTROS">Otros</option>
            </select>
          </div>

          {/* Código */}
          <div>
            <label className="block text-sm font-medium mb-1">Código *</label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              placeholder="Ej: MAT2024-001"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Concepto */}
          <div>
            <label className="block text-sm font-medium mb-1">Concepto *</label>
            <input
              type="text"
              name="concepto"
              value={formData.concepto}
              onChange={handleChange}
              required
              placeholder="Descripción del concepto"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Fecha Vencimiento */}
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Vencimiento *</label>
            <input
              type="date"
              name="fechaVencimiento"
              value={formData.fechaVencimiento}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Importe */}
          <div>
            <label className="block text-sm font-medium mb-1">Importe (S/.) *</label>
            <input
              type="number"
              name="importe"
              value={formData.importe}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              placeholder="Descripción adicional (opcional)"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botones */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || formData.usuarioId === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Creando...' : 'Crear Deuda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
