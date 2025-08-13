'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useResponderEncuesta } from '@/hooks/useResponderEncuesta';
import encuestasService from '@/services/encuestasService';
import { Pregunta, RespuestaPregunta } from '@/types/encuestas';
import { 
  FaArrowLeft, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaSave
} from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function ResponderEncuestaPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const encuestaId = parseInt(params.id as string);
  
  const {
    encuesta,
    respuestas,
    loading,
    error,
    progreso,
    tiempoInicio,
    setRespuesta,
    isRespuestaValida,
    getSubmitData,
  } = useResponderEncuesta({ encuestaId });

  const [currentPregunta, setCurrentPregunta] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleRespuesta = (pregunta: Pregunta, respuesta: Partial<RespuestaPregunta>) => {
    setRespuesta(pregunta.id, respuesta);
  };

  const handleSubmit = async () => {
    if (!isRespuestaValida()) return;

    setSubmitting(true);
    try {
      const submitData = getSubmitData();
      await encuestasService.submitRespuesta(submitData);
      
      Swal.fire({
        title: '¡Encuesta enviada!',
        text: 'Tu respuesta ha sido registrada exitosamente.',
        icon: 'success',
        confirmButtonColor: '#10b981'
      }).then(() => {
        router.push('/campus-virtual/intranet/encuestas');
      });
    } catch (error) {
      console.error('Error al enviar encuesta:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al enviar tu respuesta. Intenta nuevamente.',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderPregunta = (pregunta: Pregunta) => {
    const respuestaActual = respuestas[pregunta.id];

    switch (pregunta.tipo) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-3">
            {pregunta.opciones?.map((opcion) => (
              <label key={opcion.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={`pregunta-${pregunta.id}`}
                  value={opcion.id}
                  checked={respuestaActual?.opcionSeleccionadaId === opcion.id}
                  onChange={() => handleRespuesta(pregunta, { opcionSeleccionadaId: opcion.id })}
                  className="text-blue-600"
                />
                <span>{opcion.texto}</span>
              </label>
            ))}
          </div>
        );

      case 'ESCALA':
        const min = pregunta.escalaMin || 1;
        const max = pregunta.escalaMax || 5;
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{pregunta.etiquetaMin || 'Muy malo'}</span>
              <span className="text-sm text-gray-600">{pregunta.etiquetaMax || 'Muy bueno'}</span>
            </div>
            <div className="flex justify-between">
              {Array.from({ length: max - min + 1 }, (_, i) => {
                const valor = min + i;
                return (
                  <label key={valor} className="flex flex-col items-center space-y-2">
                    <input
                      type="radio"
                      name={`pregunta-${pregunta.id}`}
                      value={valor}
                      checked={respuestaActual?.valorNumerico === valor}
                      onChange={() => handleRespuesta(pregunta, { valorNumerico: valor })}
                      className="text-blue-600"
                    />
                    <span className="text-sm font-medium">{valor}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case 'SI_NO':
        return (
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={`pregunta-${pregunta.id}`}
                value="1"
                checked={respuestaActual?.valorNumerico === 1}
                onChange={() => handleRespuesta(pregunta, { valorNumerico: 1 })}
                className="text-blue-600"
              />
              <span>Sí</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={`pregunta-${pregunta.id}`}
                value="0"
                checked={respuestaActual?.valorNumerico === 0}
                onChange={() => handleRespuesta(pregunta, { valorNumerico: 0 })}
                className="text-blue-600"
              />
              <span>No</span>
            </label>
          </div>
        );

      case 'TEXTO_CORTO':
        return (
          <input
            type="text"
            value={respuestaActual?.valorTexto || ''}
            onChange={(e) => handleRespuesta(pregunta, { valorTexto: e.target.value })}
            placeholder="Escribe tu respuesta..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'TEXTO_LIBRE':
        return (
          <textarea
            value={respuestaActual?.valorTexto || ''}
            onChange={(e) => handleRespuesta(pregunta, { valorTexto: e.target.value })}
            placeholder="Escribe tu respuesta..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      default:
        return <div>Tipo de pregunta no soportado</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando encuesta...</p>
        </div>
      </div>
    );
  }

  if (error || !encuesta) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error || 'No se pudo cargar la encuesta'}</p>
          <button
            onClick={() => router.push('/campus-virtual/intranet/encuestas/encuestas')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver a encuestas
          </button>
        </div>
      </div>
    );
  }

  const preguntaActual = encuesta.preguntas[currentPregunta];
  const tiempoTranscurrido = tiempoInicio ? 
    Math.round((new Date().getTime() - tiempoInicio.getTime()) / (1000 * 60)) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/campus-virtual/intranet/encuestas/encuestas')}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{encuesta.titulo}</h1>
                <p className="text-sm text-gray-600">
                  Pregunta {currentPregunta + 1} de {encuesta.preguntas.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <FaClock />
                <span>{tiempoTranscurrido}m</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaCheckCircle />
                <span>{progreso}% completado</span>
              </div>
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Pregunta */}
          <div className="mb-8">
            <div className="flex items-start space-x-3">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {currentPregunta + 1}
              </span>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  {preguntaActual.texto}
                  {preguntaActual.obligatoria && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </h2>
                <div className="mt-4">
                  {renderPregunta(preguntaActual)}
                </div>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              onClick={() => setCurrentPregunta(Math.max(0, currentPregunta - 1))}
              disabled={currentPregunta === 0}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <span className="text-sm text-gray-500">
              {currentPregunta + 1} de {encuesta.preguntas.length}
            </span>

            {currentPregunta < encuesta.preguntas.length - 1 ? (
              <button
                onClick={() => setCurrentPregunta(currentPregunta + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || !isRespuestaValida()}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <FaSave />
                <span>{submitting ? 'Enviando...' : 'Enviar Respuestas'}</span>
              </button>
            )}
          </div>

          {/* Indicador de preguntas obligatorias */}
          {!isRespuestaValida() && currentPregunta === encuesta.preguntas.length - 1 && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-sm">
              <FaExclamationTriangle className="inline mr-2" />
              Faltan preguntas obligatorias por completar
            </div>
          )}
        </div>

        {/* Vista rápida de todas las preguntas */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Progreso de respuestas</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {encuesta.preguntas.map((pregunta, index) => {
              const respondida = respuestas[pregunta.id] !== undefined;
              const esPreguntaActual = index === currentPregunta;
              
              return (
                <button
                  key={pregunta.id}
                  onClick={() => setCurrentPregunta(index)}
                  className={`
                    w-8 h-8 rounded text-sm font-medium transition-colors
                    ${esPreguntaActual 
                      ? 'bg-blue-600 text-white' 
                      : respondida 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
