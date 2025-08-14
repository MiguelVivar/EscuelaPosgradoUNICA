"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common';

interface RectificacionMatriculaRequest {
  motivo: string;
  descripcion: string;
  cursosARectificar: string[];
  observaciones?: string;
  documentosSustento: string[];
}

export default function RectificacionMatriculaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estudianteId, setEstudianteId] = useState('');
  const [formData, setFormData] = useState<RectificacionMatriculaRequest>({
    motivo: '',
    descripcion: '',
    cursosARectificar: [],
    observaciones: '',
    documentosSustento: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simular envío de datos
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('✅ Rectificación de matrícula realizada exitosamente');
      
      // Limpiar formulario
      setEstudianteId('');
      setFormData({
        motivo: '',
        descripcion: '',
        cursosARectificar: [],
        observaciones: '',
        documentosSustento: []
      });
    } catch (error) {
      setError('Error al procesar la rectificación');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
                <span className="text-4xl">🔧</span>
                Rectificación de Matrícula
              </h1>
              <p className="text-slate-600">
                Actualizar ficha de matrícula del estudiante
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ingrese el ID del estudiante"
                required
              />
            </div>

            {/* Motivo de Rectificación */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Motivo de Rectificación *
              </label>
              <select
                value={formData.motivo}
                onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar motivo</option>
                <option value="ERROR_DATOS">Error en datos personales</option>
                <option value="CAMBIO_PROGRAMA">Cambio de programa</option>
                <option value="CAMBIO_SEDE">Cambio de sede</option>
                <option value="CURSOS_INCORRECTOS">Cursos matriculados incorrectos</option>
                <option value="OTRO">Otro motivo</option>
              </select>
            </div>

            {/* Descripción Detallada */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descripción Detallada *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describa detalladamente el motivo de la rectificación"
                required
              />
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Observaciones Adicionales
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Observaciones adicionales (opcional)"
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
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Procesando...
                </>
              ) : (
                <>
                  🔧 Realizar Rectificación
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
