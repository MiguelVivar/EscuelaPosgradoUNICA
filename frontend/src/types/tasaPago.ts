export interface TasaPago {
  id: number;
  concepto: string;
  codigo: string;
  monto: number;
  moneda: string;
  tipo?: string;
  activo: boolean;
  obligatorio: boolean;
  descripcion?: string;
  fechaVigenciaInicio?: string;
  fechaVigenciaFin?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  programaEstudio: {
    id: number;
    nombre: string;
    codigo: string;
  };
}

export interface TasaPagoForm {
  concepto: string;
  codigo: string;
  monto: number;
  moneda: string;
  tipo: string;
  obligatorio: boolean;
  descripcion: string;
  fechaVigenciaInicio: string;
  fechaVigenciaFin: string;
  programaEstudioId: number;
}

export interface TasaPagoRequest {
  concepto: string;
  codigo: string;
  monto: number;
  moneda?: string;
  tipo?: string;
  obligatorio?: boolean;
  descripcion?: string;
  fechaVigenciaInicio?: string;
  fechaVigenciaFin?: string;
  programaEstudioId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Constantes para tipos de tasas
export const TIPOS_TASA = [
  'MATRICULA',
  'PENSION',
  'DERECHO_GRADO',
  'CERTIFICADO',
  'CONSTANCIA',
  'EXAMEN',
  'OTROS'
] as const;

export type TipoTasa = typeof TIPOS_TASA[number];

// Constantes para monedas
export const MONEDAS = [
  { value: 'PEN', label: 'Soles (PEN)' },
  { value: 'USD', label: 'Dólares (USD)' },
  { value: 'EUR', label: 'Euros (EUR)' }
] as const;
