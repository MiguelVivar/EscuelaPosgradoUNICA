// Mock data compartido para esquelas de pago
// TODO: Reemplazar con llamadas a API real

export interface BoletaConcept {
  id: string;
  concepto: string;
  monto: number;
  fechaVencimiento: string;
  estado?: 'Pendiente' | 'Pagado' | 'Vencido';
}

export interface GeneratedBoleta {
  id: string;
  estudianteId: string;
  estudianteNombre: string;
  estudianteCodigo: string;
  estudianteEmail: string;
  programa: string;
  fechaGeneracion: string;
  conceptos: BoletaConcept[];
  total: number;
  estado: 'Activa' | 'Pagada' | 'Vencida';
  generadoPor: string;
}

export interface Student {
  id: string;
  codigo: string;
  nombre: string;
  programa: string;
  email: string;
  telefono: string;
}

// Base de datos mock de estudiantes
export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    codigo: 'EST001',
    nombre: 'Ana García Pérez',
    programa: 'Maestría en Administración',
    email: 'ana.garcia@email.com',
    telefono: '987654321'
  },
  {
    id: '2',
    codigo: 'EST002',
    nombre: 'Carlos Mendoza Silva',
    programa: 'Maestría en Ingeniería de Sistemas',
    email: 'carlos.mendoza@email.com',
    telefono: '987654322'
  },
  {
    id: '3',
    codigo: 'EST003',
    nombre: 'María López Torres',
    programa: 'Doctorado en Educación',
    email: 'maria.lopez@email.com',
    telefono: '987654323'
  },
  {
    id: '4',
    codigo: 'EST004',
    nombre: 'Luis Rodríguez Vega',
    programa: 'Maestría en Gestión Pública',
    email: 'luis.rodriguez@email.com',
    telefono: '987654324'
  }
];

// Base de datos mock de esquelas generadas
export let MOCK_GENERATED_BOLETAS: GeneratedBoleta[] = [
  {
    id: 'BOL-2025-001',
    estudianteId: '1',
    estudianteNombre: 'Ana García Pérez',
    estudianteCodigo: 'EST001',
    estudianteEmail: 'ana.garcia@email.com',
    programa: 'Maestría en Administración',
    fechaGeneracion: '2025-08-10',
    conceptos: [
      {
        id: 'CONC-001',
        concepto: 'Matrícula 2025-II',
        monto: 450.00,
        fechaVencimiento: '2025-09-15',
        estado: 'Pendiente'
      },
      {
        id: 'CONC-002',
        concepto: 'Derecho de Laboratorio',
        monto: 120.00,
        fechaVencimiento: '2025-09-20',
        estado: 'Pendiente'
      }
    ],
    total: 570.00,
    estado: 'Activa',
    generadoPor: 'Admin Principal'
  },
  {
    id: 'BOL-2025-002',
    estudianteId: '1',
    estudianteNombre: 'Ana García Pérez',
    estudianteCodigo: 'EST001',
    estudianteEmail: 'ana.garcia@email.com',
    programa: 'Maestría en Administración',
    fechaGeneracion: '2025-07-15',
    conceptos: [
      {
        id: 'CONC-003',
        concepto: 'Biblioteca Digital',
        monto: 80.00,
        fechaVencimiento: '2025-08-15',
        estado: 'Pagado'
      }
    ],
    total: 80.00,
    estado: 'Pagada',
    generadoPor: 'Coordinador Académico'
  },
  {
    id: 'BOL-2025-003',
    estudianteId: '1',
    estudianteNombre: 'Ana García Pérez',
    estudianteCodigo: 'EST001',
    estudianteEmail: 'ana.garcia@email.com',
    programa: 'Maestría en Administración',
    fechaGeneracion: '2025-08-11',
    conceptos: [
      {
        id: 'CONC-004',
        concepto: 'Matrícula 2025-II',
        monto: 450.00,
        fechaVencimiento: '2025-09-15',
        estado: 'Pendiente'
      },
      {
        id: 'CONC-005',
        concepto: 'Pensión Agosto 2025',
        monto: 350.00,
        fechaVencimiento: '2025-08-31',
        estado: 'Pendiente'
      }
    ],
    total: 800.00,
    estado: 'Activa',
    generadoPor: 'Admin Principal'
  }
];

// Funciones para manipular los datos mock
export const addBoletaToMock = (boleta: GeneratedBoleta) => {
  MOCK_GENERATED_BOLETAS.push(boleta);
};

export const updateBoletaInMock = (boletaId: string, updatedBoleta: Partial<GeneratedBoleta>) => {
  const index = MOCK_GENERATED_BOLETAS.findIndex(b => b.id === boletaId);
  if (index !== -1) {
    MOCK_GENERATED_BOLETAS[index] = { ...MOCK_GENERATED_BOLETAS[index], ...updatedBoleta };
  }
};

export const removeBoletaFromMock = (boletaId: string) => {
  MOCK_GENERATED_BOLETAS = MOCK_GENERATED_BOLETAS.filter(b => b.id !== boletaId);
};

export const getBolteasByStudent = (studentEmail: string): GeneratedBoleta[] => {
  return MOCK_GENERATED_BOLETAS.filter(boleta => boleta.estudianteEmail === studentEmail);
};

export const getBolteasByStudentId = (studentId: string): GeneratedBoleta[] => {
  return MOCK_GENERATED_BOLETAS.filter(boleta => boleta.estudianteId === studentId);
};

// Función para generar un ID único de boleta
export const generateBoletaId = (): string => {
  const year = new Date().getFullYear();
  const existingIds = MOCK_GENERATED_BOLETAS.map(b => b.id);
  const currentYearBoletas = existingIds.filter(id => id.includes(`BOL-${year}`));
  const nextNumber = String(currentYearBoletas.length + 1).padStart(3, '0');
  return `BOL-${year}-${nextNumber}`;
};

// Función para generar un ID único de concepto
export const generateConceptId = (): string => {
  const timestamp = Date.now();
  return `CONC-${timestamp}`;
};
