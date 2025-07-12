export interface Comision {
  id: number;
  nombre: string;
  codigo: string;
  tipo: string;
  presidente?: string;
  secretario?: string;
  miembros?: string;
  activo: boolean;
  descripcion?: string;
  funciones?: string;
  fechaInicioGestion?: string;
  fechaFinGestion?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  facultad: {
    id: number;
    nombre: string;
    codigo: string;
  };
}

export interface ComisionRequest {
  nombre: string;
  codigo: string;
  tipo: string;
  presidente?: string;
  secretario?: string;
  miembros?: string;
  descripcion?: string;
  funciones?: string;
  fechaInicioGestion?: string;
  fechaFinGestion?: string;
  facultadId: number;
}
