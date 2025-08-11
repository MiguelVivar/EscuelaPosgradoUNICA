'use client';

import { useState } from 'react';
import { CreateSolicitudRequest } from '@/types/pagos';

interface CreateSolicitudModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (solicitudData: CreateSolicitudRequest) => Promise<boolean>;
}

export default function CreateSolicitudModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: CreateSolicitudModalProps) {
  const [formData, setFormData] = useState<CreateSolicitudRequest>({
    tipo: 'FRACCIONAMIENTO',
    asunto: '',
    descripcion: '',
    documentosAdjuntos: []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await onSubmit(formData);
    
    if (success) {
      setFormData({
        tipo: 'FRACCIONAMIENTO',
        asunto: '',
        descripcion: '',
        documentosAdjuntos: []
      });
      onClose();
    }
    
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Nueva Solicitud</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Solicitud */}
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Solicitud *</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="FRACCIONAMIENTO">Fraccionamiento de Pago</option>
              <option value="EXONERACION">Exoneración</option>
              <option value="BECA">Beca</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          {/* Asunto */}
          <div>
            <label className="block text-sm font-medium mb-1">Asunto *</label>
            <input
              type="text"
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              required
              placeholder="Resumen de tu solicitud"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium mb-1">Descripción *</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Describe detalladamente tu solicitud, motivos, situación actual, etc."
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Información adicional según el tipo */}
          {formData.tipo === 'FRACCIONAMIENTO' && (
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-blue-700">
                <strong>Fraccionamiento de Pago:</strong> Especifica en la descripción el monto total, 
                número de cuotas deseadas y fechas propuestas.
              </p>
            </div>
          )}

          {formData.tipo === 'EXONERACION' && (
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-green-700">
                <strong>Exoneración:</strong> Indica los motivos y adjunta documentos que sustenten tu solicitud.
              </p>
            </div>
          )}

          {formData.tipo === 'BECA' && (
            <div className="bg-yellow-50 p-3 rounded">
              <p className="text-sm text-yellow-700">
                <strong>Beca:</strong> Especifica el tipo de beca, porcentaje solicitado y situación económica.
              </p>
            </div>
          )}

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
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
