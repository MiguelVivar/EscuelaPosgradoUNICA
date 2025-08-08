    export interface PagoEstudiante {
    id: number;
    estudianteId: number;
    tasaPagoId: number;
    monto: number;
    moneda: string;
    fechaPago?: string;
    fechaVencimiento?: string;
    estado: EstadoPago;
    metodoPago?: string;
    numeroTransaccion?: string;
    observaciones?: string;
    creadoPor: number;
    fechaCreacion: string;
    fechaActualizacion: string;
    
    // Relaciones
    estudiante: {
        id: number;
        nombres: string;
        apellidos: string;
        codigo: string;
    };
    tasaPago: {
        id: number;
        concepto: string;
        codigo: string;
        monto: number;
        moneda: string;
        obligatorio: boolean;
        tipo?: string;
    };
    }

    export enum EstadoPago {
    PENDIENTE = 'PENDIENTE',
    PAGADO = 'PAGADO',
    VENCIDO = 'VENCIDO',
    PARCIAL = 'PARCIAL',
    ANULADO = 'ANULADO'
    }

    export interface PagoEstudianteForm {
    estudianteId: number;
    tasaPagoId: number;
    monto: number;
    fechaVencimiento?: string;
    observaciones?: string;
    }

    export interface RegistrarPagoForm {
    pagoEstudianteId: number;
    monto: number;
    fechaPago: string;
    metodoPago: string;
    numeroTransaccion?: string;
    observaciones?: string;
    }

    export interface EstadisticasPago {
    totalPendientes: number;
    totalPagados: number;
    totalVencidos: number;
    montoTotalPendiente: number;
    montoTotalPagado: number;
    porcentajeCumplimiento: number;
    }

    export const METODOS_PAGO = [
    'EFECTIVO',
    'TRANSFERENCIA_BANCARIA',
    'TARJETA_CREDITO',
    'TARJETA_DEBITO',
    'DEPOSITO_BANCARIO',
    'PAGO_ONLINE'
    ] as const;

    export const ESTADOS_PAGO_LABELS = {
    [EstadoPago.PENDIENTE]: 'Pendiente',
    [EstadoPago.PAGADO]: 'Pagado',
    [EstadoPago.VENCIDO]: 'Vencido',
    [EstadoPago.PARCIAL]: 'Pago Parcial',
    [EstadoPago.ANULADO]: 'Anulado'
    };
