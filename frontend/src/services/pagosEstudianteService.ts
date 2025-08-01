    import { 
    PagoEstudiante, 
    PagoEstudianteForm, 
    RegistrarPagoForm, 
    EstadisticasPago,
    EstadoPago 
    } from '@/types/pagoEstudiante';

    class PagosEstudianteService {
    private baseUrl = '/api/pagos-estudiante';

    // Obtener pagos de un estudiante específico
    async getPagosByEstudiante(estudianteId: number): Promise<PagoEstudiante[]> {
        try {
        // Simulación - reemplazar con llamada real a la API
        return [
            {
            id: 1,
            estudianteId: estudianteId,
            tasaPagoId: 1,
            monto: 500.00,
            moneda: 'PEN',
            fechaVencimiento: '2024-03-15',
            estado: EstadoPago.PENDIENTE,
            creadoPor: 1,
            fechaCreacion: '2024-01-15T10:00:00Z',
            fechaActualizacion: '2024-01-15T10:00:00Z',
            estudiante: {
                id: estudianteId,
                nombres: 'Juan Carlos',
                apellidos: 'Pérez García',
                codigo: 'EST-001'
            },
            tasaPago: {
                id: 1,
                concepto: 'Matrícula Semestre I',
                codigo: 'MAT-001',
                monto: 500.00,
                moneda: 'PEN',
                obligatorio: true,
                tipo: 'MATRICULA'
            }
            }
        ];
        } catch (error) {
        console.error('Error al obtener pagos del estudiante:', error);
        throw error;
        }
    }

    // Obtener todos los pagos con filtros
    async getPagos(filtros?: {
        estudianteId?: number;
        estado?: EstadoPago;
        tasaPagoId?: number;
        fechaDesde?: string;
        fechaHasta?: string;
    }): Promise<PagoEstudiante[]> {
        try {
        // Simulación - reemplazar con llamada real a la API
        const params = new URLSearchParams();
        if (filtros?.estudianteId) params.append('estudianteId', filtros.estudianteId.toString());
        if (filtros?.estado) params.append('estado', filtros.estado);
        if (filtros?.tasaPagoId) params.append('tasaPagoId', filtros.tasaPagoId.toString());
        if (filtros?.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
        if (filtros?.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);

        return [];
        } catch (error) {
        console.error('Error al obtener pagos:', error);
        throw error;
        }
    }

    // Crear nuevo pago para estudiante
    async createPagoEstudiante(data: PagoEstudianteForm): Promise<PagoEstudiante> {
        try {
        // Simulación - reemplazar con llamada real a la API
        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Error al crear pago');
        }

        return await response.json();
        } catch (error) {
        console.error('Error al crear pago:', error);
        throw error;
        }
    }

    // Registrar pago realizado
    async registrarPago(data: RegistrarPagoForm): Promise<PagoEstudiante> {
        try {
        const response = await fetch(`${this.baseUrl}/${data.pagoEstudianteId}/registrar-pago`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Error al registrar pago');
        }

        return await response.json();
        } catch (error) {
        console.error('Error al registrar pago:', error);
        throw error;
        }
    }

    // Obtener estadísticas de pagos
    async getEstadisticasPago(estudianteId?: number): Promise<EstadisticasPago> {
        try {
        const params = estudianteId ? `?estudianteId=${estudianteId}` : '';
        
        // Simulación - reemplazar con llamada real a la API
        return {
            totalPendientes: 5,
            totalPagados: 15,
            totalVencidos: 2,
            montoTotalPendiente: 2500.00,
            montoTotalPagado: 7500.00,
            porcentajeCumplimiento: 75
        };
        } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        throw error;
        }
    }

    // Generar pagos automáticos para un estudiante basado en su programa
    async generarPagosAutomaticos(estudianteId: number, programaId: number): Promise<PagoEstudiante[]> {
        try {
        const response = await fetch(`${this.baseUrl}/generar-automaticos`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estudianteId, programaId }),
        });

        if (!response.ok) {
            throw new Error('Error al generar pagos automáticos');
        }

        return await response.json();
        } catch (error) {
        console.error('Error al generar pagos automáticos:', error);
        throw error;
        }
    }
    }

    export const pagosEstudianteService = new PagosEstudianteService();
