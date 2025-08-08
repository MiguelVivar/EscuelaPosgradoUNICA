    export interface PeriodoAcademico {
    id: number;
    nombre: string;
    codigo: string;
    fechaInicio: string;
    fechaFin: string;
    fechaInicioMatriculas: string;
    fechaFinMatriculas: string;
    estado: EstadoPeriodo;
    activo: boolean;
    anio: number;
    semestre: number;
    descripcion?: string;
    }

    export enum EstadoPeriodo {
    PLANIFICACION = 'PLANIFICACION',
    MATRICULAS_ABIERTAS = 'MATRICULAS_ABIERTAS',
    EN_CURSO = 'EN_CURSO',
    EVALUACIONES = 'EVALUACIONES',
    FINALIZADO = 'FINALIZADO',
    CERRADO = 'CERRADO'
    }

    export const ESTADOS_PERIODO_LABELS = {
    [EstadoPeriodo.PLANIFICACION]: 'En Planificación',
    [EstadoPeriodo.MATRICULAS_ABIERTAS]: 'Matrículas Abiertas',
    [EstadoPeriodo.EN_CURSO]: 'En Curso',
    [EstadoPeriodo.EVALUACIONES]: 'Período de Evaluaciones',
    [EstadoPeriodo.FINALIZADO]: 'Finalizado',
    [EstadoPeriodo.CERRADO]: 'Cerrado'
    };