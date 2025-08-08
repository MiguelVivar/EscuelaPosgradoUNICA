export interface Deuda {
  id: number;
  usuarioId: number;
  tipo: string;
  codigo: string;
  concepto: string;
  fechaEmision: string;
  fechaVencimiento: string;
  importe: number;
  estado: 'PENDIENTE' | 'PAGADA' | 'VENCIDA';
  descripcion?: string;
  creadaPor: number;
  fechaCreacion: string;
  usuario?: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    codigoEstudiante?: string;
  };
}

export interface HistorialPago {
  id: number;
  usuarioId: number;
  deudaOriginalId: number;
  tipo: string;
  codigo: string;
  concepto: string;
  importe: number;
  fechaPago: string;
  metodoPago: string;
  numeroTransaccion?: string;
  descripcion?: string;
  usuario?: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    codigoEstudiante?: string;
  };
}

export interface Solicitud {
  id: number;
  usuarioId: number;
  tipo: 'FRACCIONAMIENTO' | 'EXONERACION' | 'BECA' | 'OTRO';
  asunto: string;
  descripcion: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'EN_REVISION';
  fechaSolicitud: string;
  fechaRespuesta?: string;
  respuesta?: string;
  documentosAdjuntos?: string[];
  usuario?: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    codigoEstudiante?: string;
  };
}

export interface CreateDeudaRequest {
  usuarioId: number;
  tipo: string;
  codigo: string;
  concepto: string;
  fechaVencimiento: string;
  importe: number;
  descripcion?: string;
}

export interface CreateSolicitudRequest {
  tipo: 'FRACCIONAMIENTO' | 'EXONERACION' | 'BECA' | 'OTRO';
  asunto: string;
  descripcion: string;
  documentosAdjuntos?: string[];
}

export interface PagarDeudaRequest {
  deudaId: number;
  metodoPago: string;
  numeroTransaccion?: string;
}

export interface RespondSolicitudRequest {
  solicitudId: number;
  estado: 'APROBADA' | 'RECHAZADA';
  respuesta: string;
}

export interface PagosStats {
  totalDeudas: number;
  totalDeudasPendientes: number;
  montoTotalPendiente: number;
  totalPagos: number;
  montoTotalPagado: number;
  totalSolicitudes: number;
  solicitudesPendientes: number;
}
