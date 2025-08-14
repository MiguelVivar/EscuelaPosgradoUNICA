'use client';

import { useState } from 'react';
import { useEncuestas } from '@/hooks/useEncuestas';
import { CreateEncuestaRequest } from '@/types/encuestas';
import { 
  FaTimes, 
  FaPlus, 
  FaTrash, 
  FaSave,
  FaQuestionCircle,
  FaList,
  FaSlidersH,
  FaCheckSquare,
  FaAlignLeft,
  FaFont
} from 'react-icons/fa';

interface CreateEncuestaModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

type TipoPregunta = 'MULTIPLE_CHOICE' | 'ESCALA' | 'SI_NO' | 'TEXTO_CORTO' | 'TEXTO_LIBRE';

// Tipos para el formulario (sin IDs)
interface FormPregunta {
  texto: string;
  tipo: TipoPregunta;
  obligatoria: boolean;
  orden: number;
  opciones?: FormOpcion[];
  escalaMin?: number;
  escalaMax?: number;
  etiquetaMin?: string;
  etiquetaMax?: string;
}

interface FormOpcion {
  texto: string;
  orden: number;
}

export default function CreateEncuestaModal({ onClose, onSuccess }: CreateEncuestaModalProps) {
  const { crearEncuesta } = useEncuestas();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'SATISFACCION' as 'SATISFACCION' | 'EVALUACION_DOCENTE' | 'SERVICIOS' | 'INFRAESTRUCTURA' | 'OTRO',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaCierre: '',
    duracionEstimada: 10,
    obligatoria: false
  });

  const [preguntas, setPreguntas] = useState<FormPregunta[]>([{
    texto: '',
    tipo: 'MULTIPLE_CHOICE' as TipoPregunta,
    obligatoria: true,
    orden: 1,
    opciones: [
      { texto: '', orden: 1 },
      { texto: '', orden: 2 }
    ]
  }]);

  const tiposPregunta = [
    { value: 'MULTIPLE_CHOICE', label: 'Opción múltiple', icon: FaList },
    { value: 'ESCALA', label: 'Escala numérica', icon: FaSlidersH },
    { value: 'SI_NO', label: 'Sí/No', icon: FaCheckSquare },
    { value: 'TEXTO_CORTO', label: 'Texto corto', icon: FaFont },
    { value: 'TEXTO_LIBRE', label: 'Texto libre', icon: FaAlignLeft }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.descripcion.trim()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (preguntas.length === 0) {
      alert('Debes agregar al menos una pregunta');
      return;
    }

    // Validar preguntas
    for (let i = 0; i < preguntas.length; i++) {
      const pregunta = preguntas[i];
      if (!pregunta.texto?.trim()) {
        alert(`La pregunta ${i + 1} no puede estar vacía`);
        return;
      }

      if (pregunta.tipo === 'MULTIPLE_CHOICE' && (!pregunta.opciones || pregunta.opciones.length < 2)) {
        alert(`La pregunta ${i + 1} debe tener al menos 2 opciones`);
        return;
      }

      if (pregunta.tipo === 'MULTIPLE_CHOICE') {
        for (let j = 0; j < (pregunta.opciones?.length || 0); j++) {
          if (!pregunta.opciones![j].texto?.trim()) {
            alert(`La opción ${j + 1} de la pregunta ${i + 1} no puede estar vacía`);
            return;
          }
        }
      }
    }

    setLoading(true);
    try {
      const createData: CreateEncuestaRequest = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        tipo: formData.tipo,
        fechaInicio: formData.fechaInicio,
        fechaCierre: formData.fechaCierre,
        duracionEstimada: formData.duracionEstimada,
        obligatoria: formData.obligatoria,
        preguntas: preguntas.map((p, index) => ({
          texto: p.texto,
          tipo: p.tipo,
          obligatoria: p.obligatoria || false,
          orden: index + 1,
          opciones: p.tipo === 'MULTIPLE_CHOICE' ? 
            p.opciones?.map((o: FormOpcion, oIndex: number) => ({
              texto: o.texto,
              valor: oIndex + 1,
              orden: oIndex + 1
            })) : undefined,
          escalaMin: p.tipo === 'ESCALA' ? (p.escalaMin || 1) : undefined,
          escalaMax: p.tipo === 'ESCALA' ? (p.escalaMax || 5) : undefined,
          etiquetaMin: p.tipo === 'ESCALA' ? p.etiquetaMin : undefined,
          etiquetaMax: p.tipo === 'ESCALA' ? p.etiquetaMax : undefined
        }))
      };

      const success = await crearEncuesta(createData);
      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating survey:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPregunta = () => {
    setPreguntas([...preguntas, {
      texto: '',
      tipo: 'MULTIPLE_CHOICE',
      obligatoria: true,
      orden: preguntas.length + 1,
      opciones: [
        { texto: '', orden: 1 },
        { texto: '', orden: 2 }
      ]
    }]);
  };

  const removePregunta = (index: number) => {
    if (preguntas.length > 1) {
      setPreguntas(preguntas.filter((_, i) => i !== index));
    }
  };

  const updatePregunta = (index: number, field: keyof FormPregunta, value: string | number | boolean | TipoPregunta) => {
    const newPreguntas = [...preguntas];
    
    if (field === 'tipo') {
      // Reset campos específicos cuando cambia el tipo
      const pregunta = { ...newPreguntas[index] };
      pregunta.tipo = value as TipoPregunta;
      
      if (value === 'MULTIPLE_CHOICE') {
        pregunta.opciones = [
          { texto: '', orden: 1 },
          { texto: '', orden: 2 }
        ];
        delete pregunta.escalaMin;
        delete pregunta.escalaMax;
        delete pregunta.etiquetaMin;
        delete pregunta.etiquetaMax;
      } else if (value === 'ESCALA') {
        pregunta.escalaMin = 1;
        pregunta.escalaMax = 5;
        pregunta.etiquetaMin = 'Muy malo';
        pregunta.etiquetaMax = 'Muy bueno';
        delete pregunta.opciones;
      } else {
        delete pregunta.opciones;
        delete pregunta.escalaMin;
        delete pregunta.escalaMax;
        delete pregunta.etiquetaMin;
        delete pregunta.etiquetaMax;
      }
      
      newPreguntas[index] = pregunta;
    } else {
      newPreguntas[index] = {
        ...newPreguntas[index],
        [field]: value
      };
    }
    
    setPreguntas(newPreguntas);
  };

  const addOpcion = (preguntaIndex: number) => {
    const newPreguntas = [...preguntas];
    const opciones = newPreguntas[preguntaIndex].opciones || [];
    newPreguntas[preguntaIndex].opciones = [
      ...opciones,
      { texto: '', orden: opciones.length + 1 }
    ];
    setPreguntas(newPreguntas);
  };

  const removeOpcion = (preguntaIndex: number, opcionIndex: number) => {
    const newPreguntas = [...preguntas];
    const opciones = newPreguntas[preguntaIndex].opciones || [];
    if (opciones.length > 2) {
      newPreguntas[preguntaIndex].opciones = opciones.filter((_, i) => i !== opcionIndex);
      setPreguntas(newPreguntas);
    }
  };

  const updateOpcion = (preguntaIndex: number, opcionIndex: number, texto: string) => {
    const newPreguntas = [...preguntas];
    if (newPreguntas[preguntaIndex].opciones) {
      newPreguntas[preguntaIndex].opciones![opcionIndex].texto = texto;
      setPreguntas(newPreguntas);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FaQuestionCircle className="text-2xl text-amber-600" />
            <h2 className="text-xl font-bold text-gray-900">Nueva Encuesta</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Información General</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la encuesta *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Ej: Evaluación del curso de..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Describe el propósito de esta encuesta..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de encuesta
                  </label>
                    <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value as 'SATISFACCION' | 'EVALUACION_DOCENTE' | 'SERVICIOS' | 'INFRAESTRUCTURA' | 'OTRO'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                    <option value="SATISFACCION">Satisfacción</option>
                    <option value="EVALUACION_DOCENTE">Evaluación Docente</option>
                    <option value="SERVICIOS">Servicios</option>
                    <option value="INFRAESTRUCTURA">Infraestructura</option>
                    <option value="OTRO">Otro</option>
                    </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración estimada (minutos)
                  </label>
                  <input
                    type="number"
                    value={formData.duracionEstimada}
                    onChange={(e) => setFormData({...formData, duracionEstimada: parseInt(e.target.value)})}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de cierre
                  </label>
                  <input
                    type="date"
                    value={formData.fechaCierre}
                    onChange={(e) => setFormData({...formData, fechaCierre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.obligatoria}
                    onChange={(e) => setFormData({...formData, obligatoria: e.target.checked})}
                    className="mr-2 text-amber-600"
                  />
                  <span className="text-sm text-gray-700">Encuesta obligatoria</span>
                </label>
              </div>
            </div>

            {/* Preguntas */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Preguntas</h3>
                <button
                  type="button"
                  onClick={addPregunta}
                  className="flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200"
                >
                  <FaPlus />
                  <span>Agregar Pregunta</span>
                </button>
              </div>

              {preguntas.map((pregunta, preguntaIndex) => (
                <div key={preguntaIndex} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Pregunta {preguntaIndex + 1}</h4>
                    {preguntas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePregunta(preguntaIndex)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto de la pregunta *
                    </label>
                    <input
                      type="text"
                      value={pregunta.texto || ''}
                      onChange={(e) => updatePregunta(preguntaIndex, 'texto', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Escribe tu pregunta..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de pregunta
                      </label>
                      <select
                        value={pregunta.tipo}
                        onChange={(e) => updatePregunta(preguntaIndex, 'tipo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {tiposPregunta.map((tipo) => (
                          <option key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={pregunta.obligatoria || false}
                          onChange={(e) => updatePregunta(preguntaIndex, 'obligatoria', e.target.checked)}
                          className="mr-2 text-amber-600"
                        />
                        <span className="text-sm text-gray-700">Pregunta obligatoria</span>
                      </label>
                    </div>
                  </div>

                  {/* Opciones para múltiple choice */}
                  {pregunta.tipo === 'MULTIPLE_CHOICE' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Opciones</label>
                        <button
                          type="button"
                          onClick={() => addOpcion(preguntaIndex)}
                          className="text-sm text-amber-600 hover:text-amber-700"
                        >
                          + Agregar opción
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(pregunta.opciones || []).map((opcion, opcionIndex) => (
                          <div key={opcionIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={opcion.texto || ''}
                              onChange={(e) => updateOpcion(preguntaIndex, opcionIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              placeholder={`Opción ${opcionIndex + 1}`}
                            />
                            {(pregunta.opciones?.length || 0) > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOpcion(preguntaIndex, opcionIndex)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded"
                              >
                                <FaTrash className="text-sm" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Configuración para escalas */}
                  {pregunta.tipo === 'ESCALA' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Valor mínimo
                        </label>
                        <input
                          type="number"
                          value={pregunta.escalaMin || 1}
                          onChange={(e) => updatePregunta(preguntaIndex, 'escalaMin', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Valor máximo
                        </label>
                        <input
                          type="number"
                          value={pregunta.escalaMax || 5}
                          onChange={(e) => updatePregunta(preguntaIndex, 'escalaMax', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Etiqueta mínima
                        </label>
                        <input
                          type="text"
                          value={pregunta.etiquetaMin || ''}
                          onChange={(e) => updatePregunta(preguntaIndex, 'etiquetaMin', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="Ej: Muy malo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Etiqueta máxima
                        </label>
                        <input
                          type="text"
                          value={pregunta.etiquetaMax || ''}
                          onChange={(e) => updatePregunta(preguntaIndex, 'etiquetaMax', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="Ej: Muy bueno"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-400"
          >
            <FaSave />
            <span>{loading ? 'Creando...' : 'Crear Encuesta'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
