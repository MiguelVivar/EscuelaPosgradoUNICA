    import { PagoDocente, EstadoPagoDocente, EstadisticasPagoDocente } from '@/types/pagoDocente';

    class PagosDocenteService {
    private baseUrl = '/api/pagos-docente';

    async getPagosByDocente(docenteId: number): Promise<PagoDocente[]> {
        try {
        // Simulación - reemplazar con llamada real a la API
        return [
            {
            id: 1,
            docenteId: docenteId,
            mes: 'Enero',
            anio: 2024,
            sueldoBase: 3500.00,
            bonificaciones: 500.00,
            descuentos: 300.00,
            sueldoNeto: 3700.00,
            moneda: 'PEN',
            fechaPago: '2024-01-31',
            estado: EstadoPagoDocente.PAGADO,
            docente: {
                id: docenteId,
                nombres: 'María Elena',
                apellidos: 'Rodríguez Vásquez',
                codigo: 'DOC-001'
            }
            },
            {
            id: 2,
            docenteId: docenteId,
            mes: 'Febrero',
            anio: 2024,
            sueldoBase: 3500.00,
            bonificaciones: 200.00,
            descuentos: 300.00,
            sueldoNeto: 3400.00,
            moneda: 'PEN',
            estado: EstadoPagoDocente.PENDIENTE,
            docente: {
                id: docenteId,
                nombres: 'María Elena',
                apellidos: 'Rodríguez Vásquez',
                codigo: 'DOC-001'
            }
            }
        ];
        } catch (error) {
        console.error('Error al obtener pagos del docente:', error);
        throw error;
        }
    }

    async getEstadisticasPago(docenteId?: number): Promise<EstadisticasPagoDocente> {
        try {
        // Simulación - reemplazar con llamada real a la API
        return {
            totalPendientes: 5,
            totalPagados: 45,
            montoTotalMes: 175000.00,
            promedioSueldo: 3500.00
        };
        } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        throw error;
        }
    }
    }

    export const pagosDocenteService = new PagosDocenteService();
