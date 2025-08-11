import { 
  Matricula, 
  MatriculaRequest, 
  Pago, 
  PagoRequest, 
  SeguimientoAcademico,
  ProgramaEstudio,
  Sede,
  TurnoMatricula,
  PeriodoAcademico
} from '@/types/matricula';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

class MatriculaService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // === MATRÍCULAS ===
  async createMatricula(request: MatriculaRequest): Promise<Matricula> {
    const response = await fetch(`${API_BASE_URL}/api/matriculas`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Error al crear la matrícula');
    }

    return await response.json();
  }

  async getMatriculas(): Promise<Matricula[]> {
    const response = await fetch(`${API_BASE_URL}/api/matriculas`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener las matrículas');
    }

    return await response.json();
  }

  async getMatriculaById(id: number): Promise<Matricula> {
    const response = await fetch(`${API_BASE_URL}/api/matriculas/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener la matrícula');
    }

    return await response.json();
  }

  async updateMatricula(id: number, request: Partial<MatriculaRequest>): Promise<Matricula> {
    const response = await fetch(`${API_BASE_URL}/api/matriculas/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la matrícula');
    }

    return await response.json();
  }

  async deleteMatricula(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/matriculas/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la matrícula');
    }
  }

  // === PAGOS ===
  async createPago(request: PagoRequest): Promise<Pago> {
    const response = await fetch(`${API_BASE_URL}/api/pagos`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Error al crear el pago');
    }

    return await response.json();
  }

  async getPagosByMatricula(matriculaId: number): Promise<Pago[]> {
    const response = await fetch(`${API_BASE_URL}/api/pagos/matricula/${matriculaId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener los pagos');
    }

    return await response.json();
  }

  async updatePago(id: number, request: Partial<PagoRequest>): Promise<Pago> {
    const response = await fetch(`${API_BASE_URL}/api/pagos/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el pago');
    }

    return await response.json();
  }

  // === SEGUIMIENTO ACADÉMICO ===
  async getSeguimientoByMatricula(matriculaId: number): Promise<SeguimientoAcademico[]> {
    const response = await fetch(`${API_BASE_URL}/api/seguimiento/matricula/${matriculaId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener el seguimiento académico');
    }

    return await response.json();
  }

  async updateSeguimiento(id: number, data: Partial<SeguimientoAcademico>): Promise<SeguimientoAcademico> {
    const response = await fetch(`${API_BASE_URL}/api/seguimiento/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el seguimiento académico');
    }

    return await response.json();
  }

  // === PROGRAMAS DE ESTUDIO ===
  async getProgramasEstudio(): Promise<ProgramaEstudio[]> {
    const response = await fetch(`${API_BASE_URL}/api/programas`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener los programas de estudio');
    }

    return await response.json();
  }

  // === SEDES ===
  async getSedes(): Promise<Sede[]> {
    const response = await fetch(`${API_BASE_URL}/api/sedes`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener las sedes');
    }

    return await response.json();
  }

  // === TURNOS MATRÍCULA ===
  async getTurnosMatriculaActivos(): Promise<TurnoMatricula[]> {
    const response = await fetch(`${API_BASE_URL}/api/turnos-matricula/activos`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener los turnos de matrícula');
    }

    return await response.json();
  }

  // === PERÍODOS ACADÉMICOS ===
  async getPeriodosAcademicos(): Promise<PeriodoAcademico[]> {
    const response = await fetch(`${API_BASE_URL}/api/periodos-academicos`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener los períodos académicos');
    }

    return await response.json();
  }

  async createPeriodoAcademico(data: Partial<PeriodoAcademico>): Promise<PeriodoAcademico> {
    const response = await fetch(`${API_BASE_URL}/api/periodos-academicos`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al crear el período académico');
    }

    return await response.json();
  }

  async updatePeriodoAcademico(id: number, data: Partial<PeriodoAcademico>): Promise<PeriodoAcademico> {
    const response = await fetch(`${API_BASE_URL}/api/periodos-academicos/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el período académico');
    }

    return await response.json();
  }

  async deletePeriodoAcademico(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/periodos-academicos/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el período académico');
    }
  }

  async togglePeriodoHabilitado(id: number): Promise<PeriodoAcademico> {
    const response = await fetch(`${API_BASE_URL}/api/periodos-academicos/${id}/toggle-habilitado`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al cambiar el estado del período académico');
    }

    return await response.json();
  }
}

export const matriculaService = new MatriculaService();
