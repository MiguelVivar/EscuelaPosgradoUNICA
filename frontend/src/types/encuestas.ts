export interface Encuesta {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'EVALUACION_DOCENTE' | 'SERVICIOS' | 'INFRAESTRUCTURA' | 'SATISFACCION' | 'OTRO';
  fechaInicio: string;
  fechaCierre: string;
  duracionEstimada: number; // en minutos
  obligatoria: boolean;
  activa: boolean;
  preguntas: Pregunta[];
  creadaPor: number;
  fechaCreacion: string;
  totalRespuestas: number;
  maxRespuestas?: number;
}

export interface Pregunta {
  id: number;
  encuestaId: number;
  texto: string;
  tipo: 'MULTIPLE_CHOICE' | 'ESCALA' | 'TEXTO_LIBRE' | 'TEXTO_CORTO' | 'SI_NO';
  opciones?: OpcionPregunta[];
  obligatoria: boolean;
  orden: number;
  escalaMin?: number;
  escalaMax?: number;
  etiquetaMin?: string;
  etiquetaMax?: string;
}

export interface OpcionPregunta {
  id: number;
  preguntaId: number;
  texto: string;
  valor: number;
  orden: number;
}

export interface RespuestaEncuesta {
  id: number;
  encuestaId: number;
  usuarioId: number;
  fechaRespuesta: string;
  tiempoEmpleado: number; // en minutos
  completada: boolean;
  respuestas: RespuestaPregunta[];
  usuario?: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    codigoEstudiante?: string;
  };
}

export interface RespuestaPregunta {
  id: number;
  respuestaEncuestaId: number;
  preguntaId: number;
  valorNumerico?: number;
  valorTexto?: string;
  opcionSeleccionadaId?: number;
}

export interface CreateEncuestaRequest {
  titulo: string;
  descripcion: string;
  tipo: 'EVALUACION_DOCENTE' | 'SERVICIOS' | 'INFRAESTRUCTURA' | 'SATISFACCION' | 'OTRO';
  fechaInicio: string;
  fechaCierre: string;
  duracionEstimada: number;
  obligatoria: boolean;
  preguntas: CreatePreguntaRequest[];
}

export interface CreatePreguntaRequest {
  texto: string;
  tipo: 'MULTIPLE_CHOICE' | 'ESCALA' | 'TEXTO_LIBRE' | 'TEXTO_CORTO' | 'SI_NO';
  opciones?: CreateOpcionRequest[];
  obligatoria: boolean;
  orden: number;
  escalaMin?: number;
  escalaMax?: number;
  etiquetaMin?: string;
  etiquetaMax?: string;
}

export interface CreateOpcionRequest {
  texto: string;
  valor: number;
  orden: number;
}

export interface SubmitRespuestaRequest {
  encuestaId: number;
  respuestas: SubmitRespuestaPreguntaRequest[];
  tiempoEmpleado: number;
}

export interface SubmitRespuestaPreguntaRequest {
  preguntaId: number;
  valorNumerico?: number;
  valorTexto?: string;
  opcionSeleccionadaId?: number;
}

export interface EncuestaStats {
  totalEncuestas: number;
  encuestasActivas: number;
  totalRespuestas: number;
  promedioTiempoRespuesta: number;
  encuestasPendientes: number;
  encuestasCompletadas: number;
}

export interface EncuestaDetallada extends Encuesta {
  misRespuestas?: RespuestaEncuesta;
  yaRespondida: boolean;
  puedeResponder: boolean;
  estadisticas?: {
    totalRespuestas: number;
    promedioTiempo: number;
    porcentajeCompletado: number;
  };
}
