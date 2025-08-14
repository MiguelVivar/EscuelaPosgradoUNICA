"use client";

import { FaArrowLeft, FaBook, FaCheckCircle, FaClock, FaExclamationTriangle, FaGraduationCap, FaCalendarCheck, FaFileAlt, FaChartLine, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaIdCard, FaUniversity, FaChalkboardTeacher, FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Interfaces para las respuestas del backend
interface Materia {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  creditos: number;
  horasTeoricas: number;
  horasPracticas: number;
  ciclo: string;
  activa: boolean;
  docente?: {
    id: number;
    nombres: string;
    apellidos: string;
  };
}

interface Asistencia {
  id: number;
  fecha: string;
  estado: 'PRESENTE' | 'AUSENTE' | 'TARDANZA' | 'JUSTIFICADO';
  observaciones?: string;
}

interface Calificacion {
  id: number;
  nota: number;
  tipoEvaluacion: 'PARCIAL' | 'FINAL' | 'TAREA' | 'PROYECTO';
  fechaEvaluacion: string;
}

interface MateriasEstudiante {
  materia: Materia;
  asistencias: Asistencia[];
  calificaciones: Calificacion[];
  porcentajeAsistencia: number;
  notaFinal?: number;
  estado: 'MATRICULADO' | 'EN_CURSO' | 'APROBADO' | 'DESAPROBADO';
}

// Interface para los datos del modal
interface DatosEstudianteModal {
  // Datos básicos del estudiante
  nombre: string;
  codigo: string;
  email: string;
  telefono: string;
  estado: string;
  promedio: string;
  sede: string;
  ingreso: string;
  programa: string;
  facultad: string;
  semestre: string;
  // Datos específicos de materia (opcionales)
  especialInfo?: string;
  docente?: string;
  horario?: string;
  aula?: string;
  codigo_materia?: string;
  creditos?: number;
  horasTeoricas?: number;
  horasPracticas?: number;
  totalHoras?: number;
  nota?: number;
  asistencia?: number;
  estado_materia?: string;
  totalAsistencias?: number;
  asistenciasPresente?: number;
  evaluaciones?: number;
}

export default function PlanEstudios() {
  const router = useRouter();
  const { user } = useAuth();
  const [mostrarAsistencias, setMostrarAsistencias] = useState(false);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [modalJustificar, setModalJustificar] = useState(false);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<MateriasEstudiante | null>(null);
  const [materiasEstudiante, setMateriasEstudiante] = useState<MateriasEstudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del estudiante desde las APIs
  useEffect(() => {
    const cargarDatosEstudiante = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);

        // Por ahora, simulamos los datos hasta que confirmes las URLs de las APIs
        // Fallback con datos de ejemplo que simula la respuesta del backend
        const datosFallback: MateriasEstudiante[] = [
          {
            materia: { 
              id: 1, 
              codigo: "MIC-001", 
              nombre: "Metodología de la Investigación Científica", 
              descripcion: "Curso fundamental para el desarrollo de proyectos de investigación académica",
              creditos: 4, 
              horasTeoricas: 3, 
              horasPracticas: 1, 
              ciclo: "I", 
              activa: true,
              docente: { id: 1, nombres: "Roberto", apellidos: "Silva Mendoza" }
            },
            asistencias: [
              { id: 1, fecha: '2024-12-01', estado: 'PRESENTE', observaciones: '' },
              { id: 2, fecha: '2024-12-03', estado: 'PRESENTE', observaciones: '' },
              { id: 3, fecha: '2024-12-05', estado: 'AUSENTE', observaciones: 'Sin justificación' }
            ],
            calificaciones: [
              { id: 1, nota: 16, tipoEvaluacion: 'FINAL', fechaEvaluacion: '2024-12-15' }
            ],
            porcentajeAsistencia: 85,
            notaFinal: 16,
            estado: 'APROBADO'
          },
          {
            materia: { 
              id: 2, 
              codigo: "EAI-001", 
              nombre: "Estadística Aplicada a la Investigación", 
              descripcion: "Herramientas estadísticas para análisis de datos",
              creditos: 4, 
              horasTeoricas: 3, 
              horasPracticas: 1, 
              ciclo: "I", 
              activa: true,
              docente: { id: 2, nombres: "Ana María", apellidos: "Torres Vega" }
            },
            asistencias: [
              { id: 4, fecha: '2024-12-02', estado: 'PRESENTE', observaciones: '' },
              { id: 5, fecha: '2024-12-04', estado: 'PRESENTE', observaciones: '' }
            ],
            calificaciones: [
              { id: 2, nota: 15, tipoEvaluacion: 'FINAL', fechaEvaluacion: '2024-12-15' }
            ],
            porcentajeAsistencia: 88,
            notaFinal: 15,
            estado: 'APROBADO'
          },
          {
            materia: { 
              id: 3, 
              codigo: "EPI-001", 
              nombre: "Epistemología de la Ciencia", 
              descripcion: "Fundamentos filosóficos del conocimiento científico",
              creditos: 3, 
              horasTeoricas: 3, 
              horasPracticas: 0, 
              ciclo: "I", 
              activa: true,
              docente: { id: 3, nombres: "Luis Carlos", apellidos: "Herrera" }
            },
            asistencias: [
              { id: 6, fecha: '2024-12-06', estado: 'PRESENTE', observaciones: '' }
            ],
            calificaciones: [
              { id: 3, nota: 17, tipoEvaluacion: 'FINAL', fechaEvaluacion: '2024-12-15' }
            ],
            porcentajeAsistencia: 92,
            notaFinal: 17,
            estado: 'APROBADO'
          },
          {
            materia: { 
              id: 4, 
              codigo: "ST1-001", 
              nombre: "Seminario de Tesis I", 
              descripcion: "Desarrollo del proyecto de tesis",
              creditos: 5, 
              horasTeoricas: 4, 
              horasPracticas: 1, 
              ciclo: "II", 
              activa: true,
              docente: { id: 4, nombres: "Patricia", apellidos: "Gonzáles Ruiz" }
            },
            asistencias: [
              { id: 7, fecha: '2024-12-07', estado: 'PRESENTE', observaciones: '' },
              { id: 8, fecha: '2024-12-14', estado: 'AUSENTE', observaciones: 'Justificada por enfermedad' }
            ],
            calificaciones: [],
            porcentajeAsistencia: 83,
            estado: 'EN_CURSO'
          }
        ];
        
        setMateriasEstudiante(datosFallback);
        
      } catch (error) {
        console.error('Error al cargar datos del estudiante:', error);
        setError('No se pudieron cargar los datos del plan de estudios.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatosEstudiante();
  }, [user]);

  // Calcular promedio dinámicamente con datos reales
  const calcularPromedio = () => {
    const materiasConNota = materiasEstudiante.filter(m => m.notaFinal !== undefined);
    if (materiasConNota.length === 0) return "0.00";
    const suma = materiasConNota.reduce((acc, materia) => acc + (materia.notaFinal || 0), 0);
    return (suma / materiasConNota.length).toFixed(2);
  };

  // Datos dinámicos del estudiante usando información real
  const getDatosEstudiante = (materiaSeleccionada?: MateriasEstudiante): DatosEstudianteModal => {
    const baseData = {
      nombre: user ? `${user.nombres} ${user.apellidos}` : "Usuario",
      codigo: user?.codigoEstudiante || user?.id?.toString() || "N/A",
      email: user?.email || "no-disponible@unica.edu.pe",
      telefono: user?.telefono || "No registrado",
      estado: user ? "ACTIVO" : "INACTIVO",
      promedio: calcularPromedio(),
      sede: "Campus Central",
      ingreso: "29/2/2024"
    };

    // Información específica según la materia seleccionada
    if (materiaSeleccionada) {
      const materia = materiaSeleccionada.materia;
      const docenteNombre = materia.docente ? 
        `Dr. ${materia.docente.nombres} ${materia.docente.apellidos}` : 
        "Por asignar";

      return {
        ...baseData,
        programa: "Maestría en Administración",
        facultad: "Escuela de Posgrado",
        semestre: `${materia.ciclo}° Semestre`,
        especialInfo: materia.descripcion || `Curso de ${materia.creditos} créditos académicos`,
        docente: docenteNombre,
        horario: "Por confirmar (datos del backend)",
        aula: "Por asignar (datos del backend)",
        codigo_materia: materia.codigo,
        creditos: materia.creditos,
        horasTeoricas: materia.horasTeoricas,
        horasPracticas: materia.horasPracticas,
        totalHoras: materia.horasTeoricas + materia.horasPracticas,
        nota: materiaSeleccionada.notaFinal,
        asistencia: materiaSeleccionada.porcentajeAsistencia,
        estado_materia: materiaSeleccionada.estado,
        totalAsistencias: materiaSeleccionada.asistencias.length,
        asistenciasPresente: materiaSeleccionada.asistencias.filter(a => 
          a.estado === 'PRESENTE' || a.estado === 'TARDANZA'
        ).length,
        evaluaciones: materiaSeleccionada.calificaciones.length
      };
    }

    return {
      ...baseData,
      programa: "Maestría en Administración",
      facultad: "Escuela de Posgrado", 
      semestre: "Información general"
    };
  };

  // Resumen académico calculado con datos reales
  const resumenAcademico = {
    creditosAprobados: materiasEstudiante.filter(m => m.estado === 'APROBADO').reduce((total, m) => total + m.materia.creditos, 0),
    creditosTotal: materiasEstudiante.reduce((total, m) => total + m.materia.creditos, 0),
    promedioGeneral: parseFloat(calcularPromedio()),
    cicloActual: "II",
    materiasAprobadas: materiasEstudiante.filter(m => m.estado === 'APROBADO').length,
    materiasTotal: materiasEstudiante.length
  };

  // Datos de asistencias por materia usando datos reales
  const asistenciasData = materiasEstudiante.map(m => ({
    materia: m.materia.nombre,
    clasesTotales: Math.max(m.asistencias.length, 15), // Estimación mínima
    clasesAsistidas: m.asistencias.filter(a => a.estado === 'PRESENTE' || a.estado === 'TARDANZA').length,
    inasistencias: m.asistencias.filter(a => a.estado === 'AUSENTE').length,
    porcentaje: m.porcentajeAsistencia,
    estado: m.porcentajeAsistencia < 75 ? "Crítico" : m.porcentajeAsistencia < 85 ? "Regular" : "Excelente",
    justificadas: m.asistencias.filter(a => a.estado === 'JUSTIFICADO').length,
    injustificadas: m.asistencias.filter(a => a.estado === 'AUSENTE').length,
    proximaClase: "2025-01-15"
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando plan de estudios...</p>
        </div>
      </div>
    );
  }

  const openDetallesModal = (materia: MateriasEstudiante) => {
    setMateriaSeleccionada(materia);
    setModalDetalles(true);
  };

  const openJustificarModal = (materia: MateriasEstudiante) => {
    setMateriaSeleccionada(materia);
    setModalJustificar(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/intranet-estudiantes')}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100"
              >
                <FaArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Plan de Estudios</h1>
                <p className="text-gray-600">Gestión académica y seguimiento</p>
              </div>
            </div>
            {error && (
              <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm">
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navegación por tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setMostrarAsistencias(false)}
              className={`${
                !mostrarAsistencias
                  ? 'border-amber-500 text-amber-600 bg-amber-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm rounded-t-lg`}
            >
              <FaGraduationCap className="inline-block mr-2" />
              Plan de Estudios
            </button>
            <button
              onClick={() => setMostrarAsistencias(true)}
              className={`${
                mostrarAsistencias
                  ? 'border-amber-500 text-amber-600 bg-amber-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm rounded-t-lg`}
            >
              <FaCalendarCheck className="inline-block mr-2" />
              Control de Asistencias
            </button>
          </nav>
        </div>

        {!mostrarAsistencias ? (
          /* Plan de Estudios */
          <div className="space-y-6">
            {/* Resumen Académico */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaChartLine className="mr-2 text-amber-500" />
                Resumen Académico
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-lg">
                  <p className="text-sm opacity-90">Créditos Aprobados</p>
                  <p className="text-2xl font-bold">{resumenAcademico.creditosAprobados}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                  <p className="text-sm opacity-90">Créditos Total</p>
                  <p className="text-2xl font-bold">{resumenAcademico.creditosTotal}</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                  <p className="text-sm opacity-90">Promedio General</p>
                  <p className="text-2xl font-bold">{resumenAcademico.promedioGeneral.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
                  <p className="text-sm opacity-90">Ciclo Actual</p>
                  <p className="text-2xl font-bold">{resumenAcademico.cicloActual}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                  <p className="text-sm opacity-90">Materias Aprobadas</p>
                  <p className="text-2xl font-bold">{resumenAcademico.materiasAprobadas}</p>
                </div>
                <div className="bg-gradient-to-r from-zinc-600 to-zinc-700 text-white p-4 rounded-lg">
                  <p className="text-sm opacity-90">Total Materias</p>
                  <p className="text-2xl font-bold">{resumenAcademico.materiasTotal}</p>
                </div>
              </div>
            </div>

            {/* Tabla de Materias */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaBook className="mr-2 text-amber-500" />
                  Materias del Plan de Estudios
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-amber-500">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Materia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Créditos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Ciclo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Nota Final
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Asistencia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {materiasEstudiante.map((item) => (
                      <tr key={item.materia.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.materia.nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.materia.docente ? 
                              `Dr. ${item.materia.docente.nombres} ${item.materia.docente.apellidos}` : 
                              'Docente por asignar'
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.materia.codigo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.materia.creditos}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.materia.ciclo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.estado === 'APROBADO' ? 'bg-green-100 text-green-800' :
                            item.estado === 'EN_CURSO' ? 'bg-blue-100 text-blue-800' :
                            item.estado === 'DESAPROBADO' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.estado === 'APROBADO' && <FaCheckCircle className="mr-1" />}
                            {item.estado === 'EN_CURSO' && <FaClock className="mr-1" />}
                            {item.estado === 'DESAPROBADO' && <FaExclamationTriangle className="mr-1" />}
                            {item.estado.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.notaFinal ? (
                            <span className={`font-semibold ${
                              item.notaFinal >= 16 ? 'text-green-600' : 
                              item.notaFinal >= 11 ? 'text-blue-600' : 'text-red-600'
                            }`}>
                              {item.notaFinal.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-gray-400">Pendiente</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`font-semibold ${
                            item.porcentajeAsistencia >= 85 ? 'text-green-600' : 
                            item.porcentajeAsistencia >= 75 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {item.porcentajeAsistencia.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => openDetallesModal(item)}
                            className="text-amber-600 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded text-xs"
                          >
                            Ver Detalles
                          </button>
                          <button
                            onClick={() => openJustificarModal(item)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded text-xs"
                          >
                            Justificar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Control de Asistencias */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FaCalendarCheck className="mr-2 text-amber-500" />
                Control de Asistencias por Materia
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-amber-500">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Materia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Clases Totales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Asistidas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Inasistencias
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      % Asistencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Próxima Clase
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {asistenciasData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.materia}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.clasesTotales}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.clasesAsistidas}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="flex flex-col">
                          <span className="text-red-600">{item.injustificadas} injustificadas</span>
                          <span className="text-green-600">{item.justificadas} justificadas</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-semibold ${
                          item.porcentaje >= 85 ? 'text-green-600' : 
                          item.porcentaje >= 75 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {item.porcentaje.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.estado === 'Excelente' ? 'bg-green-100 text-green-800' :
                          item.estado === 'Regular' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.estado === 'Excelente' && <FaCheckCircle className="mr-1" />}
                          {item.estado === 'Regular' && <FaClock className="mr-1" />}
                          {item.estado === 'Crítico' && <FaExclamationTriangle className="mr-1" />}
                          {item.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.proximaClase}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Ver Detalles */}
      {modalDetalles && materiaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b bg-amber-500 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <FaInfoCircle className="mr-2" />
                Detalles de la Materia
              </h3>
            </div>
            <div className="p-6">
              {(() => {
                const datos = getDatosEstudiante(materiaSeleccionada);
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información del Estudiante */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        <FaUser className="inline-block mr-2 text-amber-500" />
                        Información del Estudiante
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <FaUser className="text-gray-400 mr-3 w-4" />
                          <span className="font-medium">Nombre:</span>
                          <span className="ml-2">{datos.nombre}</span>
                        </div>
                        <div className="flex items-center">
                          <FaIdCard className="text-gray-400 mr-3 w-4" />
                          <span className="font-medium">Código:</span>
                          <span className="ml-2">{datos.codigo}</span>
                        </div>
                        <div className="flex items-center">
                          <FaEnvelope className="text-gray-400 mr-3 w-4" />
                          <span className="font-medium">Email:</span>
                          <span className="ml-2">{datos.email}</span>
                        </div>
                        <div className="flex items-center">
                          <FaPhone className="text-gray-400 mr-3 w-4" />
                          <span className="font-medium">Teléfono:</span>
                          <span className="ml-2">{datos.telefono}</span>
                        </div>
                        <div className="flex items-center">
                          <FaGraduationCap className="text-gray-400 mr-3 w-4" />
                          <span className="font-medium">Programa:</span>
                          <span className="ml-2">{datos.programa}</span>
                        </div>
                        <div className="flex items-center">
                          <FaUniversity className="text-gray-400 mr-3 w-4" />
                          <span className="font-medium">Facultad:</span>
                          <span className="ml-2">{datos.facultad}</span>
                        </div>
                      </div>
                    </div>

                    {/* Información de la Materia */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        <FaBook className="inline-block mr-2 text-amber-500" />
                        Información de la Materia
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <FaBook className="text-gray-400 mr-3 w-4" />
                          <span className="font-medium">Materia:</span>
                          <span className="ml-2">{materiaSeleccionada.materia.nombre}</span>
                        </div>
                        <div className="flex items-center">
                          <FaIdCard className="text-gray-400 mr-3 w-4" />
                          <span className="font-medium">Código:</span>
                          <span className="ml-2">{datos.codigo_materia || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <FaChalkboardTeacher className="text-gray-400 mr-3 w-4" />
                          <span className="font-medium">Docente:</span>
                          <span className="ml-2">{datos.docente || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="text-gray-400 mr-3 w-4" />
                          <span className="font-medium">Horario:</span>
                          <span className="ml-2">{datos.horario || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="text-gray-400 mr-3 w-4" />
                          <span className="font-medium">Aula:</span>
                          <span className="ml-2">{datos.aula || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <FaGraduationCap className="text-gray-400 mr-3 w-4" />
                          <span className="font-medium">Créditos:</span>
                          <span className="ml-2">{datos.creditos || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="text-gray-400 mr-3 w-4" />
                          <span className="font-medium">Horas Totales:</span>
                          <span className="ml-2">{datos.totalHoras || 'N/A'} (T: {datos.horasTeoricas || 0}, P: {datos.horasPracticas || 0})</span>
                        </div>
                      </div>
                    </div>

                    {/* Rendimiento Académico */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        <FaChartLine className="inline-block mr-2 text-amber-500" />
                        Rendimiento Académico
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-600">Nota Final</p>
                          <p className="text-2xl font-bold text-blue-800">
                            {datos.nota ? datos.nota.toFixed(1) : 'Pendiente'}
                          </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-green-600">Asistencia</p>
                          <p className="text-2xl font-bold text-green-800">
                            {datos.asistencia ? datos.asistencia.toFixed(1) : 'N/A'}%
                          </p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg">
                          <p className="text-sm text-amber-600">Asistencias</p>
                          <p className="text-2xl font-bold text-amber-800">
                            {datos.asistenciasPresente || 0}/{datos.totalAsistencias || 0}
                          </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-purple-600">Evaluaciones</p>
                          <p className="text-2xl font-bold text-purple-800">
                            {datos.evaluaciones || 0}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Descripción:</p>
                        <p className="text-gray-800">{datos.especialInfo || 'No disponible'}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setModalDetalles(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Justificar */}
      {modalJustificar && materiaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="px-6 py-4 border-b bg-blue-500 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <FaFileAlt className="mr-2" />
                Justificar Inasistencia
              </h3>
            </div>
            <div className="p-6">
              {(() => {
                const datos = getDatosEstudiante(materiaSeleccionada);
                return (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Información de la Materia</h4>
                      <p><span className="font-medium">Materia:</span> {materiaSeleccionada.materia.nombre}</p>
                      <p><span className="font-medium">Estudiante:</span> {datos.nombre}</p>
                      <p><span className="font-medium">Código:</span> {datos.codigo}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Inasistencia
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Motivo de Justificación
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Seleccionar motivo...</option>
                        <option value="enfermedad">Enfermedad</option>
                        <option value="emergencia_familiar">Emergencia Familiar</option>
                        <option value="tramites_academicos">Trámites Académicos</option>
                        <option value="trabajo">Motivos de Trabajo</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción Detallada
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Proporciona una descripción detallada del motivo de tu inasistencia..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Documento de Soporte (opcional)
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Formatos permitidos: PDF, Word, imágenes (máx. 5MB)
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setModalJustificar(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Aquí irían las llamadas al backend para enviar la justificación
                  alert('Justificación enviada correctamente. Será revisada por el coordinador académico.');
                  setModalJustificar(false);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Enviar Justificación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
