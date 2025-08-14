"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common';

interface ReinicioEstudiosRequest {
  motivoReinicio: string;
  ultimoPeriodoCursado: string;
  periodoReinicio: string;
  programaId: string;
  mencionId?: string;
  observaciones?: string;
  documentosRequeridos: string[];
}

export default function ReinicioEstudiosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estudianteId, setEstudianteId] = useState('');
  const [formData, setFormData] = useState<ReinicioEstudiosRequest>({
    motivoReinicio: '',
    ultimoPeriodoCursado: '',
    periodoReinicio: '',
    programaId: '',
    observaciones: '',
    documentosRequeridos: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simular envío de datos
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('✅ Reinicio de estudios activado exitosamente');
      
      // Limpiar formulario
      setEstudianteId('');
      setFormData({
        motivoReinicio: '',
        ultimoPeriodoCursado: '',
        periodoReinicio: '',
        programaId: '',
        observaciones: '',
        documentosRequeridos: []
      });
    } catch (error) {
      setError('Error al procesar el reinicio de estudios');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
                <span className="text-4xl">🔄</span>
                Activación de Reinicio de Estudios
              </h1>
              <p className="text-slate-600">
                Activar reinicio de estudios para la matrícula de un estudiante
              </p>
            </div>
            <Button
              onClick={() => router.push('/campus-virtual/matricula')}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
            >
              ← Volver
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ID del Estudiante */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ID del Estudiante *
              </label>
              <input
                type="text"
                value={estudianteId}
                onChange={(e) => setEstudianteId(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ingrese el ID del estudiante"
                required
              />
            </div>

            {/* Motivo del Reinicio */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Motivo del Reinicio *
              </label>
              <select
                value={formData.motivoReinicio}
                onChange={(e) => setFormData(prev => ({ ...prev, motivoReinicio: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar motivo</option>
                <option value="ABANDONO_TEMPORAL">Abandono temporal</option>
                <option value="MOTIVOS_LABORALES">Motivos laborales</option>
                <option value="MOTIVOS_FAMILIARES">Motivos familiares</option>
                <option value="MOTIVOS_ECONOMICOS">Motivos económicos</option>
                <option value="MOTIVOS_SALUD">Motivos de salud</option>
                <option value="CAMBIO_RESIDENCIA">Cambio de residencia</option>
                <option value="OTRO">Otro motivo</option>
              </select>
            </div>

            {/* Períodos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Último Período Cursado *
                </label>
                <input
                  type="text"
                  value={formData.ultimoPeriodoCursado}
                  onChange={(e) => setFormData(prev => ({ ...prev, ultimoPeriodoCursado: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ej: 2023-I"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Período de Reinicio *
                </label>
                <input
                  type="text"
                  value={formData.periodoReinicio}
                  onChange={(e) => setFormData(prev => ({ ...prev, periodoReinicio: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ej: 2024-I"
                  required
                />
              </div>
            </div>

            {/* Programa de Estudios */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Programa de Estudios *
              </label>
              <select
                value={formData.programaId}
                onChange={(e) => setFormData(prev => ({ ...prev, programaId: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar programa</option>
                <option value="DOC001">Doctorado en Ciencias Empresariales</option>
                <option value="DOC002">Doctorado en Derecho y Ciencia Política</option>
                <option value="DOC003">Doctorado en Educación</option>
                <option value="MAE001">Maestría en Gestión Empresarial</option>
                <option value="MAE002">Maestría en Gestión Pública</option>
              </select>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Observaciones
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Observaciones adicionales sobre el reinicio de estudios"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 px-6 rounded-lg font-medium hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Procesando...
                </>
              ) : (
                <>
                  🔄 Activar Reinicio de Estudios
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
