'use client';

import { useState } from 'react';
import { PagarDeudaRequest } from '@/types/pagos';

interface PagarDeudaModalProps {
  isOpen: boolean;
  onClose: () => void;
  deudaId: number;
  concepto: string;
  importe: number;
  onSubmit: (pagoData: PagarDeudaRequest) => Promise<boolean>;
}

export default function PagarDeudaModal({ 
  isOpen, 
  onClose, 
  deudaId,
  concepto,
  importe,
  onSubmit 
}: PagarDeudaModalProps) {
  const [formData, setFormData] = useState({
    metodoPago: '',
    numeroTransaccion: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const pagoData: PagarDeudaRequest = {
      deudaId,
      metodoPago: formData.metodoPago,
      numeroTransaccion: formData.numeroTransaccion || undefined
    };
    
    const success = await onSubmit(pagoData);
    
    if (success) {
      setFormData({
        metodoPago: '',
        numeroTransaccion: ''
      });
      onClose();
    }
    
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Marcar Deuda como Pagada</h2>
        
        {/* Información de la deuda */}
        <div className="bg-gray-50 p-4 rounded mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Información de la Deuda</h3>
          <p className="text-sm"><strong>Concepto:</strong> {concepto}</p>
          <p className="text-sm"><strong>Importe:</strong> S/. {importe.toFixed(2)}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Método de Pago */}
          <div>
            <label className="block text-sm font-medium mb-1">Método de Pago *</label>
            <select
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar método</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="TRANSFERENCIA">Transferencia Bancaria</option>
              <option value="DEPOSITO">Depósito Bancario</option>
              <option value="TARJETA">Tarjeta de Crédito/Débito</option>
              <option value="YAPE">Yape</option>
              <option value="PLIN">Plin</option>
              <option value="OTROS">Otros</option>
            </select>
          </div>

          {/* Número de Transacción */}
          {formData.metodoPago && formData.metodoPago !== 'EFECTIVO' && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Número de Transacción/Operación
              </label>
              <input
                type="text"
                name="numeroTransaccion"
                value={formData.numeroTransaccion}
                onChange={handleChange}
                placeholder="Ej: 123456789"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Procesando...' : 'Marcar como Pagada'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
