import { 
Estudiante, 
FiltrosEstudiante, 
UploadResult, 
EstudianteEstadisticas
} from '@/types/estudiante';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class EstudiantesService {
// Datos de prueba temporales (simula la API)
private estudiantesPrueba: Estudiante[] = [
{
    id: 1,
    codigo: '2024001234',
    nombres: 'Juan Carlos',
    apellidos: 'Pérez García',
    email: 'juan.perez@example.com',
    telefono: '987654321',
    programa: {
        id: 1,
        nombre: 'Maestría en Ingeniería de Sistemas',
        codigo: 'MIS-001',
        facultad: {
            id: 1,
            nombre: 'Ingeniería'
        }
    },
    sede: {
        id: 1,
        nombre: 'Campus Central',
        codigo: 'CC-001',
        direccion: 'Av. Principal 123, Lima',
        activo: true,
        fechaCreacion: new Date('2020-01-01').toISOString(),
        fechaActualizacion: new Date('2024-01-01').toISOString()
    },
    estado: 'ACTIVO',
    fechaIngreso: new Date('2024-03-01'),
    fechaRegistro: new Date('2024-03-01').toISOString(),
    semestreActual: 3,
    creditosAprobados: 45,
    creditosTotales: 180,
    promedioGeneral: 15.2,
    estadoFinanciero: 'AL_DIA'
},
{
    id: 2,
    codigo: '2024001235',
    nombres: 'María Elena',
    apellidos: 'Rodríguez López',
    email: 'maria.rodriguez@example.com',
    telefono: '987654322',
    programa: {
        id: 2,
        nombre: 'Maestría en Administración',
        codigo: 'MAD-001',
        facultad: {
            id: 2,
            nombre: 'Ciencias Empresariales'
        }
    },
    sede: {
        id: 1,
        nombre: 'Campus Central',
        codigo: 'CC-001',
        direccion: 'Av. Principal 123, Lima',
        activo: true,
        fechaCreacion: new Date('2020-01-01').toISOString(),
        fechaActualizacion: new Date('2024-01-01').toISOString()
    },
    estado: 'INGRESANTE',
    fechaIngreso: new Date('2024-03-01'),
    fechaRegistro: new Date('2024-03-01').toISOString(),
    semestreActual: 2,
    creditosAprobados: 32,
    creditosTotales: 160,
    promedioGeneral: 13.8,
    estadoFinanciero: 'BECADO'
},
{
    id: 3,
    codigo: '2023001100',
    nombres: 'Carlos Alberto',
    apellidos: 'González Ruiz',
    email: 'carlos.gonzalez@example.com',
    telefono: '987654323',
    programa: {
        id: 1,
        nombre: 'Maestría en Ingeniería de Sistemas',
        codigo: 'MIS-001',
        facultad: {
            id: 1,
            nombre: 'Ingeniería'
        }
    },
    sede: {
        id: 2,
        nombre: 'Campus Norte',
        codigo: 'CN-001',
        direccion: 'Av. Universitaria 456, Lima Norte',
        activo: true,
        fechaCreacion: new Date('2020-01-01').toISOString(),
        fechaActualizacion: new Date('2024-01-01').toISOString()
    },
    estado: 'GRADUADO',
    fechaIngreso: new Date('2020-03-01'),
    fechaRegistro: new Date('2020-03-01').toISOString(),
    semestreActual: 10,
    creditosAprobados: 180,
    creditosTotales: 180,
    promedioGeneral: 16.5,
    estadoFinanciero: 'AL_DIA'
},
{
    id: 4,
    codigo: '2024001240',
    nombres: 'Ana Sofía',
    apellidos: 'Mendoza Torres',
    email: 'ana.mendoza@example.com',
    telefono: '987654324',
    programa: {
        id: 3,
        nombre: 'Doctorado en Educación',
        codigo: 'DOE-001',
        facultad: {
            id: 3,
            nombre: 'Educación'
        }
    },
    sede: {
        id: 1,
        nombre: 'Campus Central',
        codigo: 'CC-001',
        direccion: 'Av. Principal 123, Lima',
        activo: true,
        fechaCreacion: new Date('2020-01-01').toISOString(),
        fechaActualizacion: new Date('2024-01-01').toISOString()
    },
    estado: 'ACTIVO',
    fechaIngreso: new Date('2024-03-01'),
    fechaRegistro: new Date('2024-03-01').toISOString(),
    semestreActual: 1,
    creditosAprobados: 15,
    creditosTotales: 200,
    promedioGeneral: 14.5,
    estadoFinanciero: 'AL_DIA'
},
{
    id: 5,
    codigo: '2023001150',
    nombres: 'Luis Fernando',
    apellidos: 'Vásquez Morales',
    email: 'luis.vasquez@example.com',
    telefono: '987654325',
    programa: {
        id: 2,
        nombre: 'Maestría en Administración',
        codigo: 'MAD-001',
        facultad: {
            id: 2,
            nombre: 'Ciencias Empresariales'
        }
    },
    sede: {
        id: 2,
        nombre: 'Campus Norte',
        codigo: 'CN-001',
        direccion: 'Av. Universitaria 456, Lima Norte',
        activo: true,
        fechaCreacion: new Date('2020-01-01').toISOString(),
        fechaActualizacion: new Date('2024-01-01').toISOString()
    },
    estado: 'RETIRADO',
    fechaIngreso: new Date('2023-03-01'),
    fechaRegistro: new Date('2023-03-01').toISOString(),
    semestreActual: 2,
    creditosAprobados: 28,
    creditosTotales: 160,
    promedioGeneral: 10.5,
    estadoFinanciero: 'MORA'
}
];

private async simulateDelay(ms: number = 800): Promise<void> {
return new Promise(resolve => setTimeout(resolve, ms));
}

// Método principal para buscar estudiantes
async buscarEstudiantes(filtros: FiltrosEstudiante, page = 1, limit = 50) {
await this.simulateDelay(600);

let estudiantes = [...this.estudiantesPrueba];

// Búsqueda general (cambiar nombre del filtro por claridad)
if (filtros.busqueda || filtros.codigoMin) {
    const searchTerm = (filtros.busqueda || filtros.codigoMin || '').toLowerCase();
    estudiantes = estudiantes.filter(e => 
    e.codigo.toLowerCase().includes(searchTerm) ||
    e.nombres.toLowerCase().includes(searchTerm) ||
    e.apellidos.toLowerCase().includes(searchTerm) ||
    e.programa.nombre.toLowerCase().includes(searchTerm) ||
    e.email.toLowerCase().includes(searchTerm)
    );
}

// Filtro por estado
if (filtros.estado) {
    estudiantes = estudiantes.filter(e => e.estado === filtros.estado);
}

// Filtro por programa con validación
if (filtros.programa) {
    const programaId = parseInt(filtros.programa);
    if (!isNaN(programaId)) {
    estudiantes = estudiantes.filter(e => e.programa.id === programaId);
    }
}

// Filtros de rango de código
if (filtros.codigoMin && filtros.codigoMin !== filtros.busqueda) {
    estudiantes = estudiantes.filter(e => e.codigo >= filtros.codigoMin!);
}

if (filtros.codigoMax) {
    estudiantes = estudiantes.filter(e => e.codigo <= filtros.codigoMax!);
}

// Simular paginación
const total = estudiantes.length;
const offset = (page - 1) * limit;
const paginatedEstudiantes = estudiantes.slice(offset, offset + limit);

return {
    estudiantes: paginatedEstudiantes,
    pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
    }
};
}

// Obtener información completa de un estudiante
async getInformacionEstudiante(id: number): Promise<Estudiante> {
await this.simulateDelay(400);

if (!id || id <= 0) {
    throw new Error('ID de estudiante inválido');
}

const estudiante = this.estudiantesPrueba.find(e => e.id === id);
if (!estudiante) {
    throw new Error(`Estudiante con ID ${id} no encontrado`);
}

return estudiante;
}

// Obtener historial académico
async getHistorialAcademico(estudianteId: number) {
await this.simulateDelay(700);
console.log('Obteniendo historial para estudiante:', estudianteId); // Usar parámetro

// Simular datos de historial académico
return {
    periodos: [
    {
        periodo: {
        id: 1,
        codigo: '2024-I',
        nombre: 'Primer Semestre 2024',
        anio: '2024',
        semestre: 'I'
        },
        materias: [
        {
            id: 1,
            codigo: 'SIS-701',
            nombre: 'Metodología de la Investigación',
            creditos: 3,
            nota: 16,
            estado: 'APROBADO',
            profesor: 'Dr. Juan Rodríguez'
        },
        {
            id: 2,
            codigo: 'SIS-702',
            nombre: 'Arquitectura de Software',
            creditos: 4,
            nota: 15,
            estado: 'APROBADO',
            profesor: 'Mg. Ana Martínez'
        }
        ],
        promedioSemestre: 15.43,
        creditosInscritos: 7,
        creditosAprobados: 7
    }
    ],
    resumen: {
    creditosTotalesAprobados: 45,
    creditosTotalesInscritos: 50,
    promedioAcumulado: 15.2,
    semestresCursados: 3,
    materiasAprobadas: 15,
    materiasReprobadas: 1
    }
};
}

// Subir archivo Excel con estudiantes
async uploadExcel(file: File, onProgress?: (progress: number) => void): Promise<UploadResult> {
// Simular progreso de carga
for (let i = 0; i <= 100; i += 20) {
    await this.simulateDelay(300);
    if (onProgress) onProgress(i);
}

// Simular resultado de procesamiento
return {
    procesados: 25,
    errores: 3,
    detalles: [
    'Fila 1: Estudiante 2024001236 creado exitosamente',
    'Fila 2: Estudiante 2024001237 creado exitosamente',
    'Fila 3: Estudiante 2024001238 creado exitosamente',
    'Fila 15: Error - Email inválido: correo@malformato',
    'Fila 23: Error - Código duplicado: 2024001234',
    'Fila 28: Error - Programa no existe: ID 999'
    ]
};
}

// Método para obtener datos de la plantilla
private getTemplateData(): { content: string; filename: string } {
    // Definir las columnas de la plantilla
    const headers = [
        'codigo',
        'nombres', 
        'apellidos',
        'email',
        'telefono',
        'programa_id',
        'sede_id',
        'estado',
        'semestre_actual',
        'fecha_ingreso'
    ];

    // Datos de ejemplo para la plantilla
    const ejemplos = [
        '2024001001,Juan Carlos,Pérez García,juan.perez@email.com,987654321,1,1,ACTIVO,1,2024-03-01',
        '2024001002,María Elena,Rodríguez López,maria.rodriguez@email.com,987654322,2,1,INGRESANTE,1,2024-03-01',
        '2024001003,Carlos Alberto,González Ruiz,carlos.gonzalez@email.com,987654323,1,2,ACTIVO,2,2024-03-01'
    ];

    // Crear contenido CSV
    const content = [
        headers.join(','),
        '# Ejemplos:',
        ...ejemplos,
        '',
        '# Instrucciones:',
        '# - No modifiques los nombres de las columnas',
        '# - Los códigos deben ser únicos',
        '# - programa_id: 1=Ing.Sistemas, 2=Administración, 3=Educación',
        '# - sede_id: 1=Campus Central, 2=Campus Norte',
        '# - estado: ACTIVO, INGRESANTE, GRADUADO, RETIRADO, SUSPENDIDO',
        '# - fecha_ingreso: formato YYYY-MM-DD'
    ].join('\n');

    return {
        content,
        filename: 'plantilla_estudiantes.csv'
    };
}

// Descargar plantilla Excel
async downloadTemplate(): Promise<void> {
    const { content, filename } = this.getTemplateData();
    
    // Crear blob y descargar
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Obtener estadísticas generales
async getEstadisticas(): Promise<EstudianteEstadisticas> {
await this.simulateDelay(300);

return {
    totalEstudiantes: this.estudiantesPrueba.length,
    activos: this.estudiantesPrueba.filter(e => e.estado === 'ACTIVO').length,
    graduados: this.estudiantesPrueba.filter(e => e.estado === 'GRADUADO').length,
    retirados: this.estudiantesPrueba.filter(e => e.estado === 'RETIRADO').length,
    promedioGeneral: this.estudiantesPrueba.reduce((acc, e) => acc + e.promedioGeneral, 0) / this.estudiantesPrueba.length
};
}

// Obtener programas únicos (para filtros)
async getProgramasUnicos() {
await this.simulateDelay(200);

const programas = this.estudiantesPrueba.map(e => e.programa);
const programasUnicos = programas.filter((programa, index, self) => 
    index === self.findIndex(p => p.id === programa.id)
);

return programasUnicos;
}
}

// Exportar instancia del servicio
export const estudiantesService = new EstudiantesService();
export default estudiantesService;