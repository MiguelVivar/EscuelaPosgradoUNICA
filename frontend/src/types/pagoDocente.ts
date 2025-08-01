    export interface PagoDocente {
    id: number;
    docenteId: number;
    mes: string;
    anio: number;
    sueldoBase: number;
    bonificaciones: number;
    descuentos: number;
    sueldoNeto: number;
    moneda: string;
    fechaPago?: string;
    estado: EstadoPagoDocente;
    observaciones?: string;
    
    // Relaciones
    docente: {
        id: number;
        nombres: string;
        apellidos: string;
        codigo: string;
    };
    }

    export enum EstadoPagoDocente {
    PENDIENTE = 'PENDIENTE',
    PAGADO = 'PAGADO',
    CANCELADO = 'CANCELADO'
    }

    export interface EstadisticasPagoDocente {
    totalPendientes: number;
    totalPagados: number;
    montoTotalMes: number;
    promedioSueldo: number;
    }

    export const ESTADOS_PAGO_DOCENTE_LABELS = {
    [EstadoPagoDocente.PENDIENTE]: 'Pendiente',
    [EstadoPagoDocente.PAGADO]: 'Pagado',
    [EstadoPagoDocente.CANCELADO]: 'Cancelado'
    };
