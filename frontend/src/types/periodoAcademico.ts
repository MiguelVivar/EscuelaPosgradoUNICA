export interface PeriodoAcademico {
id: number;
codigo: string;
nombre: string;
anio: string;
semestre: string;
fechaInicio: Date;
fechaFin: Date;
fechaInicioMatricula?: Date;
fechaFinMatricula?: Date;
activo: boolean;
descripcion?: string;
fechaCreacion: string;
fechaActualizacion: string;
}

export interface PeriodoAcademicoForm {
codigo: string;
nombre: string;
anio: string;
semestre: string;
fechaInicio: Date;
fechaFin: Date;
fechaInicioMatricula?: Date;
fechaFinMatricula?: Date;
descripcion?: string;
}

export interface PeriodoAcademicoRequest {
codigo: string;
nombre: string;
anio: string;
semestre: string;
fechaInicio: string;
fechaFin: string;
fechaInicioMatricula?: string;
fechaFinMatricula?: string;
descripcion?: string;
}

export interface ApiResponse<T> {
success: boolean;
message: string;
data?: T;
errors?: string[];
}