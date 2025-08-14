"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common";

interface FiltrosReporteMatricula {
  programaId?: string;
  mencionId?: string;
  sedeId?: string;
  periodoId?: string;
  estado?: "ACTIVO" | "INACTIVO" | "SUSPENDIDO" | "EGRESADO";
}

interface EstudianteReporte {
  id: string;
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  programa: string;
  mencion?: string;
  sede: string;
  fechaMatricula: string;
  estado: string;
  creditosAcumulados: number;
  semestre: number;
}

export default function ReporteEstudiantesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosReporteMatricula>({});
  const [estudiantes, setEstudiantes] = useState<EstudianteReporte[]>([]);
  const [mostrarReporte, setMostrarReporte] = useState(false);

  // Datos de ejemplo
  const estudiantesEjemplo: EstudianteReporte[] = [
    {
      id: "1",
      codigo: "2024001",
      nombres: "Juan Carlos",
      apellidos: "Pérez García",
      email: "juan.perez@unica.edu.pe",
      programa: "Doctorado en Ciencias Empresariales",
      mencion: "Gestión Estratégica",
      sede: "Ica",
      fechaMatricula: "2024-03-15",
      estado: "ACTIVO",
      creditosAcumulados: 45,
      semestre: 3,
    },
    {
      id: "2",
      codigo: "2024002",
      nombres: "María Elena",
      apellidos: "Rodríguez López",
      email: "maria.rodriguez@unica.edu.pe",
      programa: "Maestría en Gestión Pública",
      sede: "Lima",
      fechaMatricula: "2024-03-20",
      estado: "ACTIVO",
      creditosAcumulados: 30,
      semestre: 2,
    },
    {
      id: "3",
      codigo: "2023015",
      nombres: "Carlos Alberto",
      apellidos: "Sánchez Morales",
      email: "carlos.sanchez@unica.edu.pe",
      programa: "Doctorado en Educación",
      sede: "Chincha",
      fechaMatricula: "2023-08-10",
      estado: "EGRESADO",
      creditosAcumulados: 96,
      semestre: 6,
    },
  ];

  const handleGenerarReporte = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simular carga de datos
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Filtrar estudiantes según criterios
      let estudiantesFiltrados = estudiantesEjemplo;

      if (filtros.estado) {
        estudiantesFiltrados = estudiantesFiltrados.filter(
          (e) => e.estado === filtros.estado
        );
      }

      setEstudiantes(estudiantesFiltrados);
      setMostrarReporte(true);
    } catch (error) {
      setError("Error al generar el reporte");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportar = (formato: "excel" | "pdf") => {
    alert(`📊 Exportando reporte a ${formato.toUpperCase()}...`);
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "ACTIVO":
        return "bg-green-100 text-green-800";
      case "EGRESADO":
        return "bg-blue-100 text-blue-800";
      case "SUSPENDIDO":
        return "bg-red-100 text-red-800";
      case "INACTIVO":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
                <span className="text-4xl">📊</span>
                Reporte de Estudiantes Matriculados
              </h1>
              <p className="text-slate-600">
                Visualizar reportes por programa, mención y sede
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
              Filtros de Búsqueda
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Programa
                </label>
                <select
                  value={filtros.programaId || ""}
                  onChange={(e) =>
                    setFiltros((prev) => ({
                      ...prev,
                      programaId: e.target.value || undefined,
                    }))
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Todos los programas</option>
                  <option value="DOC001">
                    Doctorado en Ciencias Empresariales
                  </option>
                  <option value="DOC002">
                    Doctorado en Derecho y Ciencia Política
                  </option>
                  <option value="DOC003">Doctorado en Educación</option>
                  <option value="MAE001">
                    Maestría en Gestión Empresarial
                  </option>
                  <option value="MAE002">Maestría en Gestión Pública</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sede
                </label>
                <select
                  value={filtros.sedeId || ""}
                  onChange={(e) =>
                    setFiltros((prev) => ({
                      ...prev,
                      sedeId: e.target.value || undefined,
                    }))
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Todas las sedes</option>
                  <option value="SEDE001">Ica</option>
                  <option value="SEDE002">Lima</option>
                  <option value="SEDE003">Chincha</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={filtros.estado || ""}
                  onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    estado: e.target.value ? e.target.value as "ACTIVO" | "INACTIVO" | "SUSPENDIDO" | "EGRESADO" : undefined,
                  }))
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Todos los estados</option>
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                  <option value="SUSPENDIDO">Suspendido</option>
                  <option value="EGRESADO">Egresado</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={handleGenerarReporte}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generando...
                  </>
                ) : (
                  <>🔍 Generar Reporte</>
                )}
              </button>

              {mostrarReporte && estudiantes.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportar("excel")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    📊 Excel
                  </button>
                  <button
                    onClick={() => handleExportar("pdf")}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    📄 PDF
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Resumen del Reporte */}
          {mostrarReporte && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800">
                  Total Estudiantes
                </h4>
                <p className="text-2xl font-bold text-blue-600">
                  {estudiantes.length}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-green-800">
                  Activos
                </h4>
                <p className="text-2xl font-bold text-green-600">
                  {estudiantes.filter((e) => e.estado === "ACTIVO").length}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-yellow-800">
                  Egresados
                </h4>
                <p className="text-2xl font-bold text-yellow-600">
                  {estudiantes.filter((e) => e.estado === "EGRESADO").length}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-800">
                  Promedio Créditos
                </h4>
                <p className="text-2xl font-bold text-purple-600">
                  {estudiantes.length > 0
                    ? Math.round(
                        estudiantes.reduce(
                          (sum, e) => sum + e.creditosAcumulados,
                          0
                        ) / estudiantes.length
                      )
                    : 0}
                </p>
              </div>
            </div>
          )}

          {/* Tabla de Estudiantes */}
          {mostrarReporte && estudiantes.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-2 text-left">
                      Código
                    </th>
                    <th className="border border-slate-300 px-4 py-2 text-left">
                      Nombres
                    </th>
                    <th className="border border-slate-300 px-4 py-2 text-left">
                      Apellidos
                    </th>
                    <th className="border border-slate-300 px-4 py-2 text-left">
                      Programa
                    </th>
                    <th className="border border-slate-300 px-4 py-2 text-left">
                      Sede
                    </th>
                    <th className="border border-slate-300 px-4 py-2 text-left">
                      Estado
                    </th>
                    <th className="border border-slate-300 px-4 py-2 text-left">
                      Créditos
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map((estudiante) => (
                    <tr key={estudiante.id} className="hover:bg-slate-50">
                      <td className="border border-slate-300 px-4 py-2 font-mono">
                        {estudiante.codigo}
                      </td>
                      <td className="border border-slate-300 px-4 py-2">
                        {estudiante.nombres}
                      </td>
                      <td className="border border-slate-300 px-4 py-2">
                        {estudiante.apellidos}
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">
                        {estudiante.programa}
                      </td>
                      <td className="border border-slate-300 px-4 py-2">
                        {estudiante.sede}
                      </td>
                      <td className="border border-slate-300 px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            estudiante.estado
                          )}`}
                        >
                          {estudiante.estado}
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        {estudiante.creditosAcumulados}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mensaje si no hay datos */}
          {mostrarReporte && estudiantes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">
                No se encontraron estudiantes con los filtros seleccionados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
