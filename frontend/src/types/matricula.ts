// ===== TIPOS PARA EL MÓDULO DE MATRÍCULA =====

// Tipos base para matrícula
export interface Estudiante {
  id: string;
  codigoEstudiante: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  dni: string;
  fechaNacimiento?: string;
  direccion?: string;
  programa?: ProgramaEstudio;
  sede?: Sede;
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO' | 'EGRESADO';
  fechaIngreso: string;
  creditosAcumulados?: number;
  semestre?: number;
}

export interface ProgramaEstudio {
  id: string;
  codigo: string;
  nombre: string;
  tipo: 'MAESTRIA' | 'DOCTORADO' | 'DIPLOMADO';
  creditosTotales: number;
  semestres: number;
  facultad: Facultad;
  mencion?: Mencion;
  activo: boolean;
}

export interface Facultad {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface Mencion {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface Sede {
  id: string;
  codigo: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono?: string;
  activo: boolean;
}

// Tipos para matrícula
export interface Matricula {
  id: string;
  estudiante: Estudiante;
  programaEstudio: ProgramaEstudio;
  sede: Sede;
  periodoAcademico: PeriodoAcademico;
  fechaMatricula: string;
  estado: 'MATRICULADO' | 'PENDIENTE' | 'CANCELADO' | 'RETIRADO';
  turno: TurnoMatricula;
  creditosMatriculados: number;
  montoTotal: number;
  observaciones?: string;
  cursosMatriculados: CursoMatricula[];
}

export interface CursoMatricula {
  id: string;
  curso: Curso;
  aula?: Aula;
  horario?: string;
  docente?: string;
  creditos: number;
  estado: 'MATRICULADO' | 'RETIRADO';
}

export interface Curso {
  id: string;
  codigo: string;
  nombre: string;
  creditos: number;
  tipo: 'OBLIGATORIO' | 'ELECTIVO' | 'PRACTICA';
  semestre: number;
  prerequisitos?: string[];
  descripcion?: string;
  activo: boolean;
}

export interface PeriodoAcademico {
  id: string;
  codigo: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  fechaInicioMatricula: string;
  fechaFinMatricula: string;
  estado: 'PROXIMO' | 'ACTIVO' | 'FINALIZADO';
  activo: boolean;
}

export interface TurnoMatricula {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  capacidadMaxima?: number;
  matriculasActuales?: number;
  activo: boolean;
}

export interface Aula {
  id: string;
  codigo: string;
  nombre: string;
  capacidad: number;
  sede: Sede;
  tipo: 'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDA';
  equipamiento?: string[];
  activo: boolean;
}

// Tipos para pagos
export interface Pago {
  id: string;
  estudiante: Estudiante;
  concepto: ConceptoPago;
  monto: number;
  moneda: 'PEN' | 'USD';
  fechaPago: string;
  fechaVencimiento?: string;
  estado: 'PENDIENTE' | 'PAGADO' | 'VENCIDO' | 'ANULADO';
  metodoPago?: string;
  numeroTransaccion?: string;
  comprobante?: string;
  observaciones?: string;
}

export interface ConceptoPago {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  monto: number;
  tipo: 'MATRICULA' | 'PENSION' | 'CERTIFICADO' | 'DERECHO' | 'OTRO';
  obligatorio: boolean;
  activo: boolean;
}

export interface Cuota {
  id: string;
  estudiante: Estudiante;
  periodoAcademico: PeriodoAcademico;
  numeroCuota: number;
  monto: number;
  fechaVencimiento: string;
  estado: 'PENDIENTE' | 'PAGADO' | 'VENCIDO';
  pago?: Pago;
  mora?: number;
}

// Tipos para seguimiento académico
export interface SeguimientoAcademico {
  estudiante: Estudiante;
  periodoActual: PeriodoAcademico;
  creditosTotales: number;
  creditosAprobados: number;
  creditosPendientes: number;
  promedioGeneral: number;
  semestresCompletados: number;
  porcentajeAvance: number;
  estado: 'REGULAR' | 'OBSERVADO' | 'RIESGO_ACADEMICO';
  notas: NotaAcademica[];
  asistencias?: AsistenciaEstudiante[];
}

export interface NotaAcademica {
  id: string;
  curso: Curso;
  estudiante: Estudiante;
  periodoAcademico: PeriodoAcademico;
  notaFinal?: number;
  notasParciales: {
    tipo: string;
    nota: number;
    peso: number;
    fecha: string;
  }[];
  estado: 'CURSANDO' | 'APROBADO' | 'DESAPROBADO' | 'RETIRADO';
  observaciones?: string;
}

export interface AsistenciaEstudiante {
  id: string;
  estudiante: Estudiante;
  curso: Curso;
  fecha: string;
  presente: boolean;
  tardanza: boolean;
  observaciones?: string;
}

// Tipos para reportes
export interface ReporteMatricula {
  periodoAcademico: PeriodoAcademico;
  totalMatriculados: number;
  matriculadosPorPrograma: {
    programa: ProgramaEstudio;
    cantidad: number;
  }[];
  matriculadosPorSede: {
    sede: Sede;
    cantidad: number;
  }[];
  ingresosPorConcepto: {
    concepto: ConceptoPago;
    monto: number;
  }[];
  fechaGeneracion: string;
}

// Tipos para formularios
export interface MatriculaRequest {
  estudianteId: string;
  programaEstudioId: string;
  sedeId: string;
  periodoAcademicoId: string;
  turnoMatriculaId: string;
  cursosIds: string[];
  observaciones?: string;
}

export interface PagoRequest {
  estudianteId: string;
  conceptoPagoId: string;
  monto: number;
  metodoPago: string;
  numeroTransaccion?: string;
  observaciones?: string;
}

// Tipos para respuestas de API
export interface MatriculaResponse {
  success: boolean;
  message: string;
  data?: Matricula;
  errors?: { [key: string]: string[] };
}

export interface PagoResponse {
  success: boolean;
  message: string;
  data?: Pago;
  errors?: { [key: string]: string[] };
}

// Tipos para filtros y paginación
export interface FiltrosMatricula {
  programaId?: string;
  sedeId?: string;
  periodoId?: string;
  estado?: string;
  busqueda?: string;
}

export interface PaginacionRequest {
  page: number;
  size: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

export interface PaginacionResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
}

// Tipos para validación de formularios
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: ValidationError[];
}

// Tipos para hooks
export interface UseMatriculaReturn {
  matriculas: Matricula[];
  loading: boolean;
  error: string | null;
  crearMatricula: (data: MatriculaRequest) => Promise<MatriculaResponse>;
  obtenerMatriculas: (filtros?: FiltrosMatricula) => Promise<void>;
  obtenerMatriculaPorId: (id: string) => Promise<Matricula | null>;
  actualizarMatricula: (id: string, data: Partial<MatriculaRequest>) => Promise<MatriculaResponse>;
  cancelarMatricula: (id: string) => Promise<MatriculaResponse>;
}

export interface UsePagosReturn {
  pagos: Pago[];
  cuotas: Cuota[];
  loading: boolean;
  error: string | null;
  realizarPago: (data: PagoRequest) => Promise<PagoResponse>;
  obtenerPagos: (estudianteId?: string) => Promise<void>;
  obtenerCuotas: (estudianteId?: string) => Promise<void>;
  generarCuotas: (estudianteId: string, periodoId: string) => Promise<void>;
}

export interface UseSeguimientoReturn {
  seguimiento: SeguimientoAcademico | null;
  loading: boolean;
  error: string | null;
  obtenerSeguimiento: (estudianteId: string) => Promise<void>;
  actualizarNota: (notaId: string, nota: number) => Promise<void>;
  registrarAsistencia: (data: Omit<AsistenciaEstudiante, 'id'>) => Promise<void>;
}
