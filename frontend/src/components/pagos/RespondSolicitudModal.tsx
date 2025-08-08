'use client';

import { useState } from 'react';
import { RespondSolicitudRequest } from '@/types/pagos';

interface RespondSolicitudModalProps {
  isOpen: boolean;
  onClose: () => void;
  solicitudId: number;
  asunto: string;
  descripcion: string;
  onSubmit: (responseData: RespondSolicitudRequest) => Promise<boolean>;
}

export default function RespondSolicitudModal({ 
  isOpen, 
  onClose, 
  solicitudId,
  asunto,
  descripcion,
  onSubmit 
}: RespondSolicitudModalProps) {
  const [formData, setFormData] = useState({
    estado: 'APROBADA' as 'APROBADA' | 'RECHAZADA',
    respuesta: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const responseData: RespondSolicitudRequest = {
      solicitudId,
      estado: formData.estado,
      respuesta: formData.respuesta
    };
    
    const success = await onSubmit(responseData);
    
    if (success) {
      setFormData({
        estado: 'APROBADA',
        respuesta: ''
      });
      onClose();
    }
    
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Responder Solicitud</h2>
        
        {/* Información de la solicitud */}
        <div className="bg-gray-50 p-4 rounded mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Información de la Solicitud</h3>
          <p className="text-sm mb-2"><strong>Asunto:</strong> {asunto}</p>
          <p className="text-sm"><strong>Descripción:</strong></p>
          <div className="bg-white p-3 rounded mt-1 text-sm max-h-32 overflow-y-auto">
            {descripcion}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Estado de la Respuesta */}
          <div>
            <label className="block text-sm font-medium mb-1">Estado de la Respuesta *</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 ${
                formData.estado === 'APROBADA' 
                  ? 'focus:ring-green-500' 
                  : 'focus:ring-red-500'
              }`}
            >
              <option value="APROBADA">✅ Aprobar</option>
              <option value="RECHAZADA">❌ Rechazar</option>
            </select>
          </div>

          {/* Respuesta */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Respuesta {formData.estado === 'APROBADA' ? '(Aprobación)' : '(Rechazo)'} *
            </label>
            <textarea
              name="respuesta"
              value={formData.respuesta}
              onChange={handleChange}
              required
              rows={5}
              placeholder={
                formData.estado === 'APROBADA'
                  ? 'Especifica los términos de aprobación, condiciones, fechas, etc.'
                  : 'Explica los motivos del rechazo y posibles alternativas.'
              }
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Información adicional según el estado */}
          {formData.estado === 'APROBADA' && (
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-green-700">
                <strong>Aprobación:</strong> Asegúrate de incluir todos los detalles relevantes como fechas, 
                montos, condiciones especiales, etc.
              </p>
            </div>
          )}

          {formData.estado === 'RECHAZADA' && (
            <div className="bg-red-50 p-3 rounded">
              <p className="text-sm text-red-700">
                <strong>Rechazo:</strong> Proporciona una explicación clara y, si es posible, 
                sugiere alternativas o pasos que el usuario puede tomar.
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
              className={`flex-1 px-4 py-2 text-white rounded hover:opacity-90 disabled:bg-gray-400 ${
                formData.estado === 'APROBADA' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {loading ? 'Enviando...' : `${formData.estado === 'APROBADA' ? 'Aprobar' : 'Rechazar'} Solicitud`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
