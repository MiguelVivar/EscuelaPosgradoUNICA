    export interface Docente {
    id: number;
    nombres: string;
    apellidos: string;
    codigo: string;
    email: string;
    telefono?: string;
    fechaIngreso: string;
    estado: EstadoDocente;
    activo: boolean;
    
    // Información académica
    titulo: string;
    grados: GradoAcademico[];
    especialidades: string[];
    experienciaAnios: number;
    
    // Relaciones
    sedes: SedeDocente[];
    facultades: FacultadDocente[];
    publicaciones?: Publicacion[];
    
    // Auditoría
    fechaCreacion: string;
    fechaActualizacion: string;
    }

    export interface SedeDocente {
    id: number;
    nombre: string;
    direccion: string;
    activa: boolean;
    }

    export interface FacultadDocente {
    id: number;
    nombre: string;
    codigo: string;
    }

    export interface GradoAcademico {
    id: number;
    tipo: TipoGrado;
    titulo: string;
    institucion: string;
    anioObtencion: number;
    pais?: string;
    validado: boolean;
    }

    export interface Publicacion {
    id: number;
    titulo: string;
    tipo: TipoPublicacion;
    revista?: string;
    editorial?: string;
    anio: number;
    isbn?: string;
    doi?: string;
    url?: string;
    }

    export enum EstadoDocente {
    ACTIVO = 'ACTIVO',
    INACTIVO = 'INACTIVO',
    LICENCIA = 'LICENCIA',
    RETIRADO = 'RETIRADO'
    }

    export enum TipoGrado {
    BACHILLER = 'BACHILLER',
    LICENCIATURA = 'LICENCIATURA',
    MAESTRIA = 'MAESTRIA',
    DOCTORADO = 'DOCTORADO',
    ESPECIALIDAD = 'ESPECIALIDAD',
    DIPLOMADO = 'DIPLOMADO'
    }

    export enum TipoPublicacion {
    ARTICULO_CIENTIFICO = 'ARTICULO_CIENTIFICO',
    LIBRO = 'LIBRO',
    CAPITULO_LIBRO = 'CAPITULO_LIBRO',
    PONENCIA = 'PONENCIA',
    TESIS = 'TESIS',
    PATENT = 'PATENT'
    }

    export interface DocenteForm {
    nombres: string;
    apellidos: string;
    codigo: string;
    email: string;
    telefono?: string;
    titulo: string;
    especialidades: string[];
    experienciaAnios: number;
    sedesIds: number[];
    facultadesIds: number[];
    }

    export interface FiltrosDocente {
    estado?: EstadoDocente;
    sedeId?: string;
    facultadId?: string;
    tipoGrado?: TipoGrado;
    experienciaMinima?: number;
    }

    export interface DocenteEstadisticas {
    totalDocentes: number;
    activos: number;
    inactivos: number;
    enLicencia: number;
    promedioExperiencia: number;
    conDoctorado: number;
    conMaestria: number;
    }

    export const ESTADOS_DOCENTE_LABELS = {
    [EstadoDocente.ACTIVO]: 'Activo',
    [EstadoDocente.INACTIVO]: 'Inactivo',
    [EstadoDocente.LICENCIA]: 'En Licencia',
    [EstadoDocente.RETIRADO]: 'Retirado'
    };

    export const TIPOS_GRADO_LABELS = {
    [TipoGrado.BACHILLER]: 'Bachiller',
    [TipoGrado.LICENCIATURA]: 'Licenciatura',
    [TipoGrado.MAESTRIA]: 'Maestría',
    [TipoGrado.DOCTORADO]: 'Doctorado',
    [TipoGrado.ESPECIALIDAD]: 'Especialidad',
    [TipoGrado.DIPLOMADO]: 'Diplomado'
    };
