import { useState, useEffect, useCallback } from 'react';
import { EncuestaDetallada, RespuestaPregunta, SubmitRespuestaRequest } from '@/types/encuestas';
import encuestasService from '@/services/encuestasService';

interface UseResponderEncuestaProps {
  encuestaId: number;
}

interface UseResponderEncuestaReturn {
  encuesta: EncuestaDetallada | null;
  respuestas: Record<number, RespuestaPregunta>;
  loading: boolean;
  error: string | null;
  progreso: number;
  tiempoInicio: Date | null;
  setRespuesta: (preguntaId: number, respuesta: Partial<RespuestaPregunta>) => void;
  isRespuestaValida: () => boolean;
  getSubmitData: () => SubmitRespuestaRequest;
  loadEncuesta: () => Promise<void>;
}

export function useResponderEncuesta({ encuestaId }: UseResponderEncuestaProps): UseResponderEncuestaReturn {
  const [encuesta, setEncuesta] = useState<EncuestaDetallada | null>(null);
  const [respuestas, setRespuestas] = useState<Record<number, RespuestaPregunta>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tiempoInicio, setTiempoInicio] = useState<Date | null>(null);

  const loadEncuesta = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const encuestaData = await encuestasService.getEncuestaParaResponder(encuestaId);
      setEncuesta(encuestaData);
      setTiempoInicio(new Date());
      
      // Si el usuario ya respondió parcialmente, cargar sus respuestas
      if (encuestaData.misRespuestas && !encuestaData.misRespuestas.completada) {
        const respuestasExistentes: Record<number, RespuestaPregunta> = {};
        encuestaData.misRespuestas.respuestas.forEach(respuesta => {
          respuestasExistentes[respuesta.preguntaId] = respuesta;
        });
        setRespuestas(respuestasExistentes);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar la encuesta';
      setError(errorMessage);
      console.error('Error loading encuesta:', err);
    } finally {
      setLoading(false);
    }
  }, [encuestaId]);

  const setRespuesta = useCallback((preguntaId: number, respuesta: Partial<RespuestaPregunta>) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: {
        ...prev[preguntaId],
        id: prev[preguntaId]?.id || 0,
        respuestaEncuestaId: prev[preguntaId]?.respuestaEncuestaId || 0,
        preguntaId,
        ...respuesta
      }
    }));
  }, []);

  const progreso = encuesta ? 
    encuestasService.calcularProgreso(
      encuesta.preguntas.length, 
      Object.keys(respuestas).length
    ) : 0;

  const isRespuestaValida = useCallback((): boolean => {
    if (!encuesta) return false;
    
    const preguntasObligatorias = encuesta.preguntas.filter(p => p.obligatoria);
    
    return preguntasObligatorias.every(pregunta => {
      const respuesta = respuestas[pregunta.id];
      if (!respuesta) return false;
      
      switch (pregunta.tipo) {
        case 'MULTIPLE_CHOICE':
          return respuesta.opcionSeleccionadaId !== undefined;
        case 'ESCALA':
        case 'SI_NO':
          return respuesta.valorNumerico !== undefined;
        case 'TEXTO_LIBRE':
        case 'TEXTO_CORTO':
          return respuesta.valorTexto && respuesta.valorTexto.trim().length > 0;
        default:
          return false;
      }
    });
  }, [encuesta, respuestas]);

  const getSubmitData = useCallback((): SubmitRespuestaRequest => {
    const tiempoEmpleado = tiempoInicio ? 
      Math.round((new Date().getTime() - tiempoInicio.getTime()) / (1000 * 60)) : 0;
    
    return {
      encuestaId,
      tiempoEmpleado,
      respuestas: Object.values(respuestas).map(respuesta => ({
        preguntaId: respuesta.preguntaId,
        valorNumerico: respuesta.valorNumerico,
        valorTexto: respuesta.valorTexto,
        opcionSeleccionadaId: respuesta.opcionSeleccionadaId
      }))
    };
  }, [encuestaId, respuestas, tiempoInicio]);

  useEffect(() => {
    loadEncuesta();
  }, [loadEncuesta]);

  return {
    encuesta,
    respuestas,
    loading,
    error,
    progreso,
    tiempoInicio,
    setRespuesta,
    isRespuestaValida,
    getSubmitData,
    loadEncuesta,
  };
}
