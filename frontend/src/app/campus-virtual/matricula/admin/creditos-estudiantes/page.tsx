"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button, LoadingSpinner } from "@/components/common";

interface EstudianteCreditos {
  id: string;
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  programa: {
    id: string;
    nombre: string;
    creditosTotales: number;
  };
  sede: string;
  creditosAprobados: number;
  creditosPendientes: number;
  creditosEnCurso: number;
  porcentajeAvance: number;
  promedioGeneral: number;
  semestre: number;
  estado: "ACTIVO" | "INACTIVO" | "EGRESADO";
  cursosAprobados: CursoAprobado[];
  fechaUltimaMatricula: string;
}

interface CursoAprobado {
  id: string;
  codigo: string;
  nombre: string;
  creditos: number;
  nota: number;
  periodo: string;
  fechaAprobacion: string;
}

export default function CreditosEstudiantesPage() {
  const router = useRouter();;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estudiantes, setEstudiantes] = useState<EstudianteCreditos[]>([]);
  const [filtroPrograma, setFiltroPrograma] = useState<string>("");
  const [filtroSede, setFiltroSede] = useState<string>("");
  const [busqueda, setBusqueda] = useState("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] =
    useState<EstudianteCreditos | null>(null);

  // Datos de ejemplo - memorizados para evitar recreación en cada render
  const estudiantesEjemplo: EstudianteCreditos[] = useMemo(() => [
    {
      id: "1",
      codigo: "2024001",
      nombres: "Juan Carlos",
      apellidos: "Pérez García",
      email: "juan.perez@unica.edu.pe",
      programa: {
        id: "DOC001",
        nombre: "Doctorado en Ciencias Empresariales",
        creditosTotales: 96,
      },
      sede: "Ica",
      creditosAprobados: 45,
      creditosPendientes: 33,
      creditosEnCurso: 18,
      porcentajeAvance: 46.9,
      promedioGeneral: 16.8,
      semestre: 3,
      estado: "ACTIVO",
      fechaUltimaMatricula: "2024-08-01",
      cursosAprobados: [
        {
          id: "1",
          codigo: "DOC101",
          nombre: "Metodología de la Investigación",
          creditos: 6,
          nota: 17.5,
          periodo: "2024-I",
          fechaAprobacion: "2024-07-15",
        },
        {
          id: "2",
          codigo: "DOC102",
          nombre: "Estadística Avanzada",
          creditos: 6,
          nota: 16.2,
          periodo: "2024-I",
          fechaAprobacion: "2024-07-20",
        },
        {
          id: "3",
          codigo: "DOC201",
          nombre: "Gestión Estratégica",
          creditos: 9,
          nota: 18.0,
          periodo: "2024-II",
          fechaAprobacion: "2024-12-10",
        },
      ],
    },
    {
      id: "2",
      codigo: "2024002",
      nombres: "María Elena",
      apellidos: "Rodríguez López",
      email: "maria.rodriguez@unica.edu.pe",
      programa: {
        id: "MAE001",
        nombre: "Maestría en Gestión Pública",
        creditosTotales: 48,
      },
      sede: "Lima",
      creditosAprobados: 30,
      creditosPendientes: 6,
      creditosEnCurso: 12,
      porcentajeAvance: 62.5,
      promedioGeneral: 17.2,
      semestre: 3,
      estado: "ACTIVO",
      fechaUltimaMatricula: "2024-08-01",
      cursosAprobados: [
        {
          id: "4",
          codigo: "MAE101",
          nombre: "Administración Pública",
          creditos: 6,
          nota: 17.0,
          periodo: "2024-I",
          fechaAprobacion: "2024-07-12",
        },
        {
          id: "5",
          codigo: "MAE102",
          nombre: "Políticas Públicas",
          creditos: 6,
          nota: 18.5,
          periodo: "2024-I",
          fechaAprobacion: "2024-07-18",
        },
      ],
    },
    {
      id: "3",
      codigo: "2023015",
      nombres: "Carlos Alberto",
      apellidos: "Sánchez Morales",
      email: "carlos.sanchez@unica.edu.pe",
      programa: {
        id: "DOC003",
        nombre: "Doctorado en Educación",
        creditosTotales: 96,
      },
      sede: "Chincha",
      creditosAprobados: 96,
      creditosPendientes: 0,
      creditosEnCurso: 0,
      porcentajeAvance: 100,
      promedioGeneral: 17.8,
      semestre: 6,
      estado: "EGRESADO",
      fechaUltimaMatricula: "2023-08-15",
      cursosAprobados: [
        {
          id: "6",
          codigo: "EDU101",
          nombre: "Teorías del Aprendizaje",
          creditos: 6,
          nota: 18.2,
          periodo: "2023-I",
          fechaAprobacion: "2023-07-10",
        },
        {
          id: "7",
          codigo: "EDU201",
          nombre: "Investigación Educativa",
          creditos: 9,
          nota: 17.5,
          periodo: "2023-II",
          fechaAprobacion: "2023-12-05",
        },
      ],
    },
  ], []); // Array vacío como dependencias porque son datos estáticos

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        // Simular carga de datos
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setEstudiantes(estudiantesEjemplo);
      } catch (error) {
        setError("Error al cargar los créditos de estudiantes");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [estudiantesEjemplo]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "ACTIVO":
        return "bg-green-100 text-green-800";
      case "EGRESADO":
        return "bg-blue-100 text-blue-800";
      case "INACTIVO":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvanceColor = (porcentaje: number) => {
    if (porcentaje >= 80) return "from-green-500 to-green-600";
    if (porcentaje >= 60) return "from-blue-500 to-blue-600";
    if (porcentaje >= 40) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  const estudiantesFiltrados = estudiantes.filter((estudiante) => {
    const coincideBusqueda =
      estudiante.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
      estudiante.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      estudiante.codigo.includes(busqueda);

    const coincidePrograma =
      !filtroPrograma || estudiante.programa.id === filtroPrograma;
    const coincideSede = !filtroSede || estudiante.sede === filtroSede;

    return coincideBusqueda && coincidePrograma && coincideSede;
  });

  const promedioGeneralEstudiantes =
    estudiantes.length > 0
      ? estudiantes.reduce((sum, e) => sum + e.promedioGeneral, 0) /
        estudiantes.length
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <LoadingSpinner
          size="lg"
          message="Cargando créditos de estudiantes..."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
                <span className="text-4xl">🎓</span>
                Créditos Aprobados de Estudiantes
              </h1>
              <p className="text-slate-600">
                Visualizar los créditos aprobados al momento de matricularse
              </p>
            </div>
            <Button
              onClick={() => router.push("/campus-virtual/matricula")}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
            >
              ← Volver
            </Button>
          </div>

          {/* Filtros */}
          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
              Filtros
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Buscar Estudiante
                </label>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Nombre, apellido o código..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Programa
                </label>
                <select
                  value={filtroPrograma}
                  onChange={(e) => setFiltroPrograma(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  title="Seleccionar programa académico"
                >
                  <option value="">Todos los programas</option>
                  <option value="DOC001">
                    Doctorado en Ciencias Empresariales
                  </option>
                  <option value="DOC003">Doctorado en Educación</option>
                  <option value="MAE001">Maestría en Gestión Pública</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sede
                </label>
                <select
                  value={filtroSede}
                  onChange={(e) => setFiltroSede(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  title="Seleccionar sede"
                >
                  <option value="">Todas las sedes</option>
                  <option value="Ica">Ica</option>
                  <option value="Lima">Lima</option>
                  <option value="Chincha">Chincha</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-purple-800">
                Total Estudiantes
              </h4>
              <p className="text-2xl font-bold text-purple-600">
                {estudiantes.length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-green-800">
                Egresados
              </h4>
              <p className="text-2xl font-bold text-green-600">
                {estudiantes.filter((e) => e.estado === "EGRESADO").length}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-800">
                Promedio General
              </h4>
              <p className="text-2xl font-bold text-blue-600">
                {promedioGeneralEstudiantes.toFixed(1)}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-orange-800">
                Avance Promedio
              </h4>
              <p className="text-2xl font-bold text-orange-600">
                {estudiantes.length > 0
                  ? Math.round(
                      estudiantes.reduce(
                        (sum, e) => sum + e.porcentajeAvance,
                        0
                      ) / estudiantes.length
                    )
                  : 0}
                %
              </p>
            </div>
          </div>

          {/* Lista de Estudiantes */}
          <div className="space-y-6">
            {estudiantesFiltrados.map((estudiante) => (
              <div
                key={estudiante.id}
                className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Información del Estudiante */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {estudiante.nombres} {estudiante.apellidos}
                      </h3>
                      <span className="text-sm text-slate-500 font-mono">
                        {estudiante.codigo}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                          estudiante.estado
                        )}`}
                      >
                        {estudiante.estado}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">📧 {estudiante.email}</p>
                        <p className="text-slate-600">🏢 {estudiante.sede}</p>
                        <p className="text-slate-600">
                          📚 {estudiante.programa.nombre}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">
                          📊 Promedio:{" "}
                          <strong>
                            {estudiante.promedioGeneral.toFixed(1)}
                          </strong>
                        </p>
                        <p className="text-slate-600">
                          🗓️ Semestre: <strong>{estudiante.semestre}</strong>
                        </p>
                        <p className="text-slate-600">
                          📅 Última matrícula:{" "}
                          {new Date(
                            estudiante.fechaUltimaMatricula
                          ).toLocaleDateString("es-PE")}
                        </p>
                      </div>
                    </div>

                    {/* Botón para ver detalle */}
                    <div className="mt-4">
                      <Button
                        onClick={() => setEstudianteSeleccionado(estudiante)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        📋 Ver Cursos Aprobados
                      </Button>
                    </div>
                  </div>

                  {/* Estadísticas de Créditos */}
                  <div className="space-y-4">
                    {/* Progreso General */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          Progreso General
                        </span>
                        <span className="text-lg font-bold text-slate-800">
                          {estudiante.porcentajeAvance.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className={`bg-gradient-to-r ${getAvanceColor(
                            estudiante.porcentajeAvance
                          )} h-3 rounded-full transition-all duration-300`}
                          style={{ width: `${estudiante.porcentajeAvance}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Distribución de Créditos */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {estudiante.creditosAprobados}
                        </div>
                        <div className="text-xs text-green-700">Aprobados</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {estudiante.creditosEnCurso}
                        </div>
                        <div className="text-xs text-blue-700">En Curso</div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-yellow-600">
                          {estudiante.creditosPendientes}
                        </div>
                        <div className="text-xs text-yellow-700">
                          Pendientes
                        </div>
                      </div>
                    </div>

                    {/* Total de Créditos */}
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-sm text-slate-600">
                        Total del Programa
                      </div>
                      <div className="text-xl font-bold text-slate-800">
                        {estudiante.programa.creditosTotales} créditos
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje si no hay datos */}
          {estudiantesFiltrados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">
                {busqueda || filtroPrograma || filtroSede
                  ? "No se encontraron estudiantes con los filtros seleccionados"
                  : "No hay estudiantes registrados"}
              </p>
            </div>
          )}
        </div>

        {/* Modal de Cursos Aprobados */}
        {estudianteSeleccionado && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  📚 Cursos Aprobados - {estudianteSeleccionado.nombres}{" "}
                  {estudianteSeleccionado.apellidos}
                </h2>
                <Button
                  onClick={() => setEstudianteSeleccionado(null)}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded text-sm"
                >
                  ✕ Cerrar
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 px-4 py-2 text-left">
                        Código
                      </th>
                      <th className="border border-slate-300 px-4 py-2 text-left">
                        Curso
                      </th>
                      <th className="border border-slate-300 px-4 py-2 text-center">
                        Créditos
                      </th>
                      <th className="border border-slate-300 px-4 py-2 text-center">
                        Nota
                      </th>
                      <th className="border border-slate-300 px-4 py-2 text-center">
                        Período
                      </th>
                      <th className="border border-slate-300 px-4 py-2 text-center">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {estudianteSeleccionado.cursosAprobados.map((curso) => (
                      <tr key={curso.id} className="hover:bg-slate-50">
                        <td className="border border-slate-300 px-4 py-2 font-mono text-sm">
                          {curso.codigo}
                        </td>
                        <td className="border border-slate-300 px-4 py-2">
                          {curso.nombre}
                        </td>
                        <td className="border border-slate-300 px-4 py-2 text-center font-semibold">
                          {curso.creditos}
                        </td>
                        <td className="border border-slate-300 px-4 py-2 text-center">
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              curso.nota >= 17
                                ? "bg-green-100 text-green-800"
                                : curso.nota >= 14
                                ? "bg-blue-100 text-blue-800"
                                : curso.nota >= 11
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {curso.nota.toFixed(1)}
                          </span>
                        </td>
                        <td className="border border-slate-300 px-4 py-2 text-center">
                          {curso.periodo}
                        </td>
                        <td className="border border-slate-300 px-4 py-2 text-center text-sm">
                          {new Date(curso.fechaAprobacion).toLocaleDateString(
                            "es-PE"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-sm text-slate-600 text-center">
                Total de cursos aprobados:{" "}
                <strong>{estudianteSeleccionado.cursosAprobados.length}</strong>{" "}
                | Total de créditos:{" "}
                <strong>{estudianteSeleccionado.creditosAprobados}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
