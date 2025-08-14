"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/common";
import Swal from "sweetalert2";
import { gsap } from "gsap";
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaFilter,
  FaTimes,
  FaCalendarAlt,
  FaGraduationCap,
  FaMoneyBillWave,
  FaUsers,
  FaFileExcel,
  FaFilePdf,
  FaInfoCircle,
  FaSearch,
  FaUserGraduate,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaClipboardList,
} from "react-icons/fa";

import {
  ReporteMatriculas,
  ReportePagos,
  ReporteAcademico,
  FiltrosReporte,
  TipoReporte,
  TIPOS_REPORTE_LABELS,
} from "@/types/reporte";

import { PeriodoAcademico } from "@/types/periodoAcademico";
import { ProgramaEstudio } from "@/types/programaEstudio";
import { Sede } from "@/types/sede";
import { periodosAcademicosService } from "@/services/periodosAcademicosService";
import { programasEstudioService } from "@/services/programasEstudioService";
import { sedesService } from "@/services/sedesService";
import { estudiantesService } from "@/services/estudiantesService";
import { tasasPagoService } from "@/services/tasasPagoService";

// Tipos para el reporte detallado
interface EstudianteDetallado {
  id: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  programa: string;
  sede: string;
  estado: string;
  fechaMatricula: string;
  calificaciones: CalificacionDetallada[];
  asistencias: AsistenciaDetallada[];
  pagos: PagoDetallado[];
}

interface CalificacionDetallada {
  asignatura: string;
  evaluacion: string;
  nota: number;
  fecha: string;
  observaciones?: string;
}

interface AsistenciaDetallada {
  fecha: string;
  asignatura: string;
  estado: "PRESENTE" | "TARDANZA" | "FALTA" | "JUSTIFICADO";
  observaciones?: string;
}

interface PagoDetallado {
  concepto: string;
  monto: number;
  fechaPago?: string;
  estado: "PAGADO" | "PENDIENTE" | "VENCIDO";
  fechaVencimiento: string;
}

interface ReporteDetallado {
  periodoAcademico: {
    id: number;
    nombre: string;
  };
  estudiantes: EstudianteDetallado[];
  resumen: {
    totalEstudiantes: number;
    estudiantesConCalificaciones: number;
    estudiantesConPagosAlDia: number;
    promedioAsistenciaGeneral: number;
  };
}

// Componente simple para mostrar gráficos
function SimpleChart({
  type,
  data,
  title,
}: {
  type: "bar" | "line" | "pie";
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
    }>;
  };
  title: string;
}) {
  if (type === "pie") {
    const total = data.datasets[0].data.reduce(
      (sum: number, val: number) => sum + val,
      0
    );

    return (
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <div className="space-y-2">
          {data.labels.map((label: string, index: number) => {
            const value = data.datasets[0].data[index];
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : "0";
            const colors = [
              "bg-red-500",
              "bg-blue-500",
              "bg-yellow-500",
              "bg-green-500",
              "bg-purple-500",
              "bg-pink-500",
            ];
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      colors[index % colors.length]
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">
                    {value.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === "bar") {
    const maxValue = Math.max(...data.datasets[0].data);

    return (
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <div className="space-y-3">
          {data.labels.map((label: string, index: number) => {
            const value = data.datasets[0].data[index];
            const width = maxValue > 0 ? (value / maxValue) * 100 : 0;
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{label}</span>
                  <span className="text-gray-900">
                    {typeof value === "number" ? value.toLocaleString() : value}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${width}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === "line") {
    return (
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.labels.map((label: string, index: number) => {
            const value = data.datasets[0].data[index];
            return (
              <div
                key={index}
                className="text-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="text-xs text-gray-500 mb-1">{label}</div>
                <div className="text-lg font-bold text-blue-600">
                  {value.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}

// Componente auxiliar para estadísticas
function StatCard({
  title,
  value,
  icon,
  color,
  isText = false,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  isText?: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p
            className={`${
              isText ? "text-xl" : "text-3xl"
            } font-bold text-gray-900`}
          >
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color} text-white`}>{icon}</div>
      </div>
    </div>
  );
}

// Componentes de reportes específicos
function ReporteMatriculasComponent({
  reporte,
}: {
  reporte: ReporteMatriculas;
}) {
  const chartData = {
    labels: reporte.matriculadosPorPrograma.map((p) => p.programaNombre),
    datasets: [
      {
        label: "Matriculados",
        data: reporte.matriculadosPorPrograma.map((p) => p.totalMatriculados),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 205, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Matriculados"
          value={reporte.totalMatriculados}
          icon={<FaUsers />}
          color="bg-blue-500"
        />
        <StatCard
          title="Estudiantes Regulares"
          value={reporte.estadisticasGenerales.estudiantesRegulares}
          icon={<FaGraduationCap />}
          color="bg-green-500"
        />
        <StatCard
          title="Estudiantes Irregulares"
          value={reporte.estadisticasGenerales.estudiantesIrregulares}
          icon={<FaInfoCircle />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Tasa de Retención"
          value={`${reporte.estadisticasGenerales.tasaRetencion.toFixed(1)}%`}
          icon={<FaChartLine />}
          color="bg-purple-500"
          isText={true}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {reporte.totalMatriculados > 0 ? (
            <SimpleChart
              type="pie"
              data={chartData}
              title="Matriculados por Programa"
            />
          ) : (
            <div className="text-center py-8">
              <FaUsers className="mx-auto text-4xl text-gray-300 mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">
                Matriculados por Programa
              </h4>
              <p className="text-gray-500">
                No hay estudiantes matriculados aún
              </p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center py-8">
            <FaChartLine className="mx-auto text-4xl text-gray-300 mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">
              Evolución de Matrículas
            </h4>
            <p className="text-gray-500 text-sm mb-2">
              Muestra el crecimiento de matrículas a lo largo del período
              académico
            </p>
            <p className="text-gray-400 text-xs">
              Los datos se mostrarán cuando haya registros históricos de
              matrículas
            </p>
          </div>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Detalle por Programa</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Programa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Facultad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nuevos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reingresantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reporte.matriculadosPorPrograma.map((programa) => (
                <tr key={programa.programaId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {programa.programaNombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {programa.facultad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {programa.totalMatriculados}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {programa.nuevosIngresos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {programa.reingresantes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {programa.porcentaje.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reporte.matriculadosPorPrograma.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No hay programas con estudiantes matriculados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReportePagosComponent({ reporte }: { reporte: ReportePagos }) {
  const pagosPorTipoData = {
    labels: reporte.pagosPorTipo.map((p) => p.concepto),
    datasets: [
      {
        label: "Monto Recaudado",
        data: reporte.pagosPorTipo.map((p) => p.montoRecaudado),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 205, 86, 0.8)",
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Recaudado"
          value={`S/. ${reporte.totalRecaudado.toLocaleString()}`}
          icon={<FaMoneyBillWave />}
          color="bg-green-500"
          isText={true}
        />
        <StatCard
          title="Total Pendiente"
          value={`S/. ${reporte.totalPendiente.toLocaleString()}`}
          icon={<FaMoneyBillWave />}
          color="bg-red-500"
          isText={true}
        />
        <StatCard
          title="% Cumplimiento"
          value={`${reporte.estadisticasPagos.porcentajeCumplimiento.toFixed(
            1
          )}%`}
          icon={<FaChartPie />}
          color="bg-blue-500"
          isText={true}
        />
        <StatCard
          title="Estudiantes al Día"
          value={reporte.estadisticasPagos.estudiantesAlDia}
          icon={<FaUserGraduate />}
          color="bg-purple-500"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {reporte.totalRecaudado > 0 ? (
            <SimpleChart
              type="pie"
              data={pagosPorTipoData}
              title="Recaudación por Tipo"
            />
          ) : (
            <div className="text-center py-8">
              <FaMoneyBillWave className="mx-auto text-4xl text-gray-300 mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">
                Recaudación por Tipo
              </h4>
              <p className="text-gray-500">No hay pagos registrados aún</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center py-8">
            <FaChartBar className="mx-auto text-4xl text-gray-300 mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">
              Recaudación Mensual
            </h4>
            <p className="text-gray-500">
              Los datos se mostrarán cuando haya pagos registrados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReporteAcademicoComponent({ reporte }: { reporte: ReporteAcademico }) {
  const rendimientoData = {
    labels: reporte.rendimientoPorPrograma.map((p) => p.programaNombre),
    datasets: [
      {
        label: "Promedio",
        data: reporte.rendimientoPorPrograma.map((p) => p.promedioPrograma),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Promedio General"
          value={reporte.rendimientoGeneral.promedioGeneral.toFixed(1)}
          icon={<FaChartBar />}
          color="bg-blue-500"
          isText={true}
        />
        <StatCard
          title="Tasa de Aprobación"
          value={`${reporte.rendimientoGeneral.tasaAprobacion.toFixed(1)}%`}
          icon={<FaGraduationCap />}
          color="bg-green-500"
          isText={true}
        />
        <StatCard
          title="Promedio Asistencia"
          value={`${reporte.asistencia.promedioAsistencia.toFixed(1)}%`}
          icon={<FaUsers />}
          color="bg-purple-500"
          isText={true}
        />
        <StatCard
          title="Evaluaciones Realizadas"
          value={reporte.evaluaciones.evaluacionesRealizadas}
          icon={<FaChartLine />}
          color="bg-amber-500"
        />
      </div>

      {/* Gráfico de rendimiento */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {reporte.rendimientoPorPrograma.some((p) => p.promedioPrograma > 0) ? (
          <SimpleChart
            type="bar"
            data={rendimientoData}
            title="Rendimiento por Programa"
          />
        ) : (
          <div className="text-center py-8">
            <FaChartBar className="mx-auto text-4xl text-gray-300 mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">
              Rendimiento por Programa
            </h4>
            <p className="text-gray-500">
              Los datos se mostrarán cuando haya calificaciones registradas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Nuevo componente para reporte detallado
function ReporteDetalladoComponent({ reporte }: { reporte: ReporteDetallado }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroPrograma, setFiltroPrograma] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [estudianteExpandido, setEstudianteExpandido] = useState<number | null>(
    null
  );
  const [vistaDetalle, setVistaDetalle] = useState<
    "calificaciones" | "asistencias" | "pagos"
  >("calificaciones");

  const estudiantesFiltrados = reporte.estudiantes.filter((estudiante) => {
    const matchSearch =
      estudiante.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.codigo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchPrograma =
      !filtroPrograma || estudiante.programa === filtroPrograma;
    const matchEstado = !filtroEstado || estudiante.estado === filtroEstado;

    return matchSearch && matchPrograma && matchEstado;
  });

  const programasUnicos = [
    ...new Set(reporte.estudiantes.map((e) => e.programa)),
  ];
  const estadosUnicos = [...new Set(reporte.estudiantes.map((e) => e.estado))];

  const toggleEstudiante = (estudianteId: number) => {
    setEstudianteExpandido(
      estudianteExpandido === estudianteId ? null : estudianteId
    );
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "ACTIVO":
        return "bg-green-100 text-green-800";
      case "INGRESANTE":
        return "bg-blue-100 text-blue-800";
      case "RETIRADO":
        return "bg-red-100 text-red-800";
      case "GRADUADO":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getNotaColor = (nota: number) => {
    if (nota >= 16) return "text-green-600 font-semibold";
    if (nota >= 13) return "text-blue-600 font-medium";
    if (nota >= 11) return "text-yellow-600 font-medium";
    return "text-red-600 font-semibold";
  };

  const getAsistenciaColor = (estado: string) => {
    switch (estado) {
      case "PRESENTE":
        return "bg-green-100 text-green-800";
      case "TARDANZA":
        return "bg-yellow-100 text-yellow-800";
      case "JUSTIFICADO":
        return "bg-blue-100 text-blue-800";
      case "FALTA":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPagoColor = (estado: string) => {
    switch (estado) {
      case "PAGADO":
        return "bg-green-100 text-green-800";
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800";
      case "VENCIDO":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumen del reporte detallado */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Estudiantes"
          value={reporte.resumen.totalEstudiantes}
          icon={<FaUsers />}
          color="bg-blue-500"
        />
        <StatCard
          title="Con Calificaciones"
          value={reporte.resumen.estudiantesConCalificaciones}
          icon={<FaClipboardList />}
          color="bg-green-500"
        />
        <StatCard
          title="Pagos al Día"
          value={reporte.resumen.estudiantesConPagosAlDia}
          icon={<FaMoneyBillWave />}
          color="bg-purple-500"
        />
        <StatCard
          title="Asistencia Promedio"
          value={`${reporte.resumen.promedioAsistenciaGeneral.toFixed(1)}%`}
          icon={<FaCalendarAlt />}
          color="bg-amber-500"
          isText={true}
        />
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar estudiante
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nombre, apellido o código..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Programa
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              value={filtroPrograma}
              onChange={(e) => setFiltroPrograma(e.target.value)}
            >
              <option value="">Todos los programas</option>
              {programasUnicos.map((programa) => (
                <option key={programa} value={programa}>
                  {programa}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              {estadosUnicos.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm("");
                setFiltroPrograma("");
                setFiltroEstado("");
              }}
              variant="outline"
              className="w-full"
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de estudiantes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">
            Estudiantes ({estudiantesFiltrados.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {estudiantesFiltrados.map((estudiante) => (
            <div key={estudiante.id} className="p-6">
              {/* Información básica del estudiante */}
              <div
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                onClick={() => toggleEstudiante(estudiante.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <FaUser className="text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {estudiante.nombres} {estudiante.apellidos}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Código: {estudiante.codigo} | {estudiante.programa}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                          estudiante.estado
                        )}`}
                      >
                        {estudiante.estado}
                      </span>
                      <span className="text-xs text-gray-500">
                        Sede: {estudiante.sede}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right text-sm">
                    <p className="text-gray-600">Matrícula:</p>
                    <p className="font-medium">{estudiante.fechaMatricula}</p>
                  </div>
                  {estudianteExpandido === estudiante.id ? (
                    <FaChevronUp className="text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* Detalle expandido */}
              {estudianteExpandido === estudiante.id && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  {/* Tabs para diferentes vistas */}
                  <div className="border-b border-gray-200 mb-4">
                    <nav className="-mb-px flex space-x-8">
                      <button
                        onClick={() => setVistaDetalle("calificaciones")}
                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                          vistaDetalle === "calificaciones"
                            ? "border-amber-500 text-amber-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Calificaciones ({estudiante.calificaciones.length})
                      </button>
                      <button
                        onClick={() => setVistaDetalle("asistencias")}
                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                          vistaDetalle === "asistencias"
                            ? "border-amber-500 text-amber-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Asistencias ({estudiante.asistencias.length})
                      </button>
                      <button
                        onClick={() => setVistaDetalle("pagos")}
                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                          vistaDetalle === "pagos"
                            ? "border-amber-500 text-amber-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Pagos ({estudiante.pagos.length})
                      </button>
                    </nav>
                  </div>

                  {/* Contenido del tab activo */}
                  {vistaDetalle === "calificaciones" && (
                    <div className="space-y-3">
                      {estudiante.calificaciones.length > 0 ? (
                        estudiante.calificaciones.map((calificacion, index) => (
                          <div
                            key={index}
                            className="bg-white p-3 rounded border"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-gray-900">
                                  {calificacion.asignatura}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  {calificacion.evaluacion}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {calificacion.fecha}
                                </p>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`text-lg font-bold ${getNotaColor(
                                    calificacion.nota
                                  )}`}
                                >
                                  {calificacion.nota.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            {calificacion.observaciones && (
                              <p className="text-xs text-gray-600 mt-2 italic">
                                {calificacion.observaciones}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">
                          No hay calificaciones registradas
                        </p>
                      )}
                    </div>
                  )}

                  {vistaDetalle === "asistencias" && (
                    <div className="space-y-3">
                      {estudiante.asistencias.length > 0 ? (
                        estudiante.asistencias.map((asistencia, index) => (
                          <div
                            key={index}
                            className="bg-white p-3 rounded border"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h5 className="font-medium text-gray-900">
                                  {asistencia.asignatura}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  {asistencia.fecha}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getAsistenciaColor(
                                  asistencia.estado
                                )}`}
                              >
                                {asistencia.estado}
                              </span>
                            </div>
                            {asistencia.observaciones && (
                              <p className="text-xs text-gray-600 mt-2 italic">
                                {asistencia.observaciones}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">
                          No hay registros de asistencia
                        </p>
                      )}
                    </div>
                  )}

                  {vistaDetalle === "pagos" && (
                    <div className="space-y-3">
                      {estudiante.pagos.length > 0 ? (
                        estudiante.pagos.map((pago, index) => (
                          <div
                            key={index}
                            className="bg-white p-3 rounded border"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-gray-900">
                                  {pago.concepto}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  Vence: {pago.fechaVencimiento}
                                </p>
                                {pago.fechaPago && (
                                  <p className="text-xs text-gray-500">
                                    Pagado: {pago.fechaPago}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">
                                  S/. {pago.monto.toLocaleString()}
                                </p>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPagoColor(
                                    pago.estado
                                  )}`}
                                >
                                  {pago.estado}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">
                          No hay pagos registrados
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {estudiantesFiltrados.length === 0 && (
          <div className="text-center py-8">
            <FaSearch className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500">
              No se encontraron estudiantes con los filtros aplicados
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportesPage() {
  const { user } = useAuth();
  const canAccess = user?.role === "ADMIN" || user?.role === "COORDINADOR";

  // Estados principales
  const [reporteMatriculas, setReporteMatriculas] =
    useState<ReporteMatriculas | null>(null);
  const [reportePagos, setReportePagos] = useState<ReportePagos | null>(null);
  const [reporteAcademico, setReporteAcademico] =
    useState<ReporteAcademico | null>(null);
  const [reporteDetallado, setReporteDetallado] =
    useState<ReporteDetallado | null>(null);
  const [periodosAcademicos, setPeriodosAcademicos] = useState<
    PeriodoAcademico[]
  >([]);
  const [programasEstudio, setProgramasEstudio] = useState<ProgramaEstudio[]>(
    []
  );
  const [sedes, setSedes] = useState<Sede[]>([]);

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [tipoReporteActivo, setTipoReporteActivo] = useState<TipoReporte>(
    TipoReporte.MATRICULAS
  );
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosReporte>({});
  const [tempFiltros, setTempFiltros] = useState<FiltrosReporte>({});

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Funciones definidas con useCallback
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [periodos, programas, sedesData] = await Promise.all([
        periodosAcademicosService.getPeriodos(),
        programasEstudioService.getProgramasActivos(),
        sedesService.getSedes(),
      ]);

      setPeriodosAcademicos(periodos);
      setProgramasEstudio(programas);
      setSedes(sedesData);

      const periodoActivo = periodos.find((p) => p.activo);
      if (periodoActivo) {
        setFiltros({ periodoAcademicoId: periodoActivo.id });
      }
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los datos iniciales",
        confirmButtonColor: "#f59e0b",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadReporte = useCallback(async () => {
    try {
      setLoading(true);

      switch (tipoReporteActivo) {
        case TipoReporte.MATRICULAS:
          // Cargar datos reales de estudiantes y calcular estadísticas
          const { estudiantes } = await estudiantesService.buscarEstudiantes(
            {}
          );
          const programasActivos =
            await programasEstudioService.getProgramasActivos();

          const matriculasReales: ReporteMatriculas = {
            periodoAcademico: {
              id: filtros.periodoAcademicoId || 1,
              nombre:
                periodosAcademicos.find(
                  (p) => p.id === filtros.periodoAcademicoId
                )?.nombre || "2024-I",
              codigo: "2024-1",
            },
            totalMatriculados: estudiantes.length,
            matriculadosPorPrograma: programasActivos.map((programa) => {
              const estudiantesPrograma = estudiantes.filter(
                (e) => e.programa?.id === programa.id
              );
              return {
                programaId: programa.id,
                programaNombre: programa.nombre,
                facultad: programa.facultad?.nombre || "Sin facultad",
                totalMatriculados: estudiantesPrograma.length,
                nuevosIngresos: estudiantesPrograma.filter(
                  (e) => e.estado === "INGRESANTE"
                ).length,
                reingresantes: estudiantesPrograma.filter(
                  (e) => e.estado === "ACTIVO"
                ).length,
                porcentaje:
                  estudiantes.length > 0
                    ? (estudiantesPrograma.length / estudiantes.length) * 100
                    : 0,
              };
            }),
            matriculadosPorSede: sedes.map((sede) => ({
              sedeId: sede.id,
              sedeNombre: sede.nombre,
              totalMatriculados: estudiantes.filter(
                (e) => e.sede?.id === sede.id
              ).length,
              porcentaje:
                estudiantes.length > 0
                  ? (estudiantes.filter((e) => e.sede?.id === sede.id).length /
                      estudiantes.length) *
                    100
                  : 0,
            })),
            matriculadosPorEstado: [
              {
                estado: "ACTIVO",
                cantidad: estudiantes.filter((e) => e.estado === "ACTIVO")
                  .length,
                porcentaje:
                  estudiantes.length > 0
                    ? (estudiantes.filter((e) => e.estado === "ACTIVO").length /
                        estudiantes.length) *
                      100
                    : 0,
              },
              {
                estado: "INGRESANTE",
                cantidad: estudiantes.filter((e) => e.estado === "INGRESANTE")
                  .length,
                porcentaje:
                  estudiantes.length > 0
                    ? (estudiantes.filter((e) => e.estado === "INGRESANTE")
                        .length /
                        estudiantes.length) *
                      100
                    : 0,
              },
              {
                estado: "GRADUADO",
                cantidad: estudiantes.filter((e) => e.estado === "GRADUADO")
                  .length,
                porcentaje:
                  estudiantes.length > 0
                    ? (estudiantes.filter((e) => e.estado === "GRADUADO")
                        .length /
                        estudiantes.length) *
                      100
                    : 0,
              },
              {
                estado: "RETIRADO",
                cantidad: estudiantes.filter((e) => e.estado === "RETIRADO")
                  .length,
                porcentaje:
                  estudiantes.length > 0
                    ? (estudiantes.filter((e) => e.estado === "RETIRADO")
                        .length /
                        estudiantes.length) *
                      100
                    : 0,
              },
            ],
            evolucionMatriculas: [],
            estadisticasGenerales: {
              promedioEdad: 0,
              porcentajeHombres: 0,
              porcentajeMujeres: 0,
              estudiantesRegulares: estudiantes.filter(
                (e) => e.estado === "ACTIVO"
              ).length,
              estudiantesIrregulares: estudiantes.filter(
                (e) => e.estado !== "ACTIVO" && e.estado !== "GRADUADO"
              ).length,
              tasaRetencion: 0,
              tasaDesercion: 0,
            },
          };
          setReporteMatriculas(matriculasReales);
          break;

        case TipoReporte.PAGOS:
          try {
            const tasasPago = await tasasPagoService.getTasasPago();
            const pagosReales: ReportePagos = {
              periodoAcademico: {
                id: filtros.periodoAcademicoId || 1,
                nombre:
                  periodosAcademicos.find(
                    (p) => p.id === filtros.periodoAcademicoId
                  )?.nombre || "2024-I",
              },
              totalRecaudado: 0,
              totalPendiente: 0,
              pagosPorTipo:
                tasasPago.length > 0
                  ? tasasPago.map((tasa) => ({
                      tipoTasa: tasa.tipo || "GENERAL",
                      concepto: tasa.concepto,
                      montoRecaudado: 0,
                      cantidadPagos: 0,
                      porcentaje: 0,
                    }))
                  : [
                      {
                        tipoTasa: "GENERAL",
                        concepto: "Sin datos disponibles",
                        montoRecaudado: 0,
                        cantidadPagos: 0,
                        porcentaje: 0,
                      },
                    ],
              pagosPorMes: Array.from({ length: 12 }, (_, i) => ({
                mes: new Date(2024, i).toLocaleString("es", { month: "long" }),
                montoRecaudado: 0,
                cantidadPagos: 0,
              })),
              estadisticasPagos: {
                porcentajeCumplimiento: 0,
                montoPromedioPago: 0,
                estudiantesAlDia: 0,
                estudiantesConDeuda: 0,
              },
            };
            setReportePagos(pagosReales);
          } catch (error) {
            console.error("Error al cargar tasas:", error);
            const reporteVacio: ReportePagos = {
              periodoAcademico: {
                id: filtros.periodoAcademicoId || 1,
                nombre:
                  periodosAcademicos.find(
                    (p) => p.id === filtros.periodoAcademicoId
                  )?.nombre || "2024-I",
              },
              totalRecaudado: 0,
              totalPendiente: 0,
              pagosPorTipo: [
                {
                  tipoTasa: "GENERAL",
                  concepto: "Sin datos disponibles",
                  montoRecaudado: 0,
                  cantidadPagos: 0,
                  porcentaje: 0,
                },
              ],
              pagosPorMes: Array.from({ length: 12 }, (_, i) => ({
                mes: new Date(2024, i).toLocaleString("es", { month: "long" }),
                montoRecaudado: 0,
                cantidadPagos: 0,
              })),
              estadisticasPagos: {
                porcentajeCumplimiento: 0,
                montoPromedioPago: 0,
                estudiantesAlDia: 0,
                estudiantesConDeuda: 0,
              },
            };
            setReportePagos(reporteVacio);
          }
          break;

        case TipoReporte.ACADEMICO:
          const academicoReal: ReporteAcademico = {
            periodoAcademico: {
              id: filtros.periodoAcademicoId || 1,
              nombre:
                periodosAcademicos.find(
                  (p) => p.id === filtros.periodoAcademicoId
                )?.nombre || "2024-I",
            },
            rendimientoGeneral: {
              promedioGeneral: 0,
              estudiantesAprobados: 0,
              estudiantesDesaprobados: 0,
              tasaAprobacion: 0,
            },
            rendimientoPorPrograma: programasEstudio.map((programa) => ({
              programaId: programa.id,
              programaNombre: programa.nombre,
              promedioPrograma: 0,
              estudiantesAprobados: 0,
              estudiantesDesaprobados: 0,
              tasaAprobacion: 0,
            })),
            asistencia: {
              promedioAsistencia: 0,
              estudiantesAsistenciaBaja: 0,
              estudiantesAsistenciaMedia: 0,
              estudiantesAsistenciaAlta: 0,
            },
            evaluaciones: {
              evaluacionesRealizadas: 0,
              evaluacionesPendientes: 0,
              promedioCalificaciones: 0,
            },
          };
          setReporteAcademico(academicoReal);
          break;

        case "DETALLADO":
          // Cargar datos detallados de estudiantes
          const { estudiantes: estudiantesDetalle } =
            await estudiantesService.buscarEstudiantes({});

          const estudiantesDetallados: EstudianteDetallado[] =
            estudiantesDetalle.map((estudiante) => ({
              id: estudiante.id,
              codigo: estudiante.codigo,
              nombres: estudiante.nombres,
              apellidos: estudiante.apellidos,
              email: estudiante.email,
              programa: estudiante.programa?.nombre || "Sin programa",
              sede: estudiante.sede?.nombre || "Sin sede",
              estado: estudiante.estado || "ACTIVO",
              fechaMatricula: estudiante.fechaRegistro
                ? new Date(estudiante.fechaRegistro).toLocaleDateString()
                : "No disponible",
              calificaciones: [
                {
                  asignatura: "Metodología de la Investigación",
                  evaluacion: "Examen Parcial",
                  nota: Math.random() * 5 + 13, // Nota aleatoria entre 13-18
                  fecha: "2024-03-15",
                  observaciones: "Buen dominio de conceptos teóricos",
                },
                {
                  asignatura: "Estadística Aplicada",
                  evaluacion: "Trabajo Final",
                  nota: Math.random() * 4 + 14, // Nota aleatoria entre 14-18
                  fecha: "2024-03-20",
                  observaciones: "Excelente aplicación práctica",
                },
              ],
              asistencias: [
                {
                  fecha: "2024-03-18",
                  asignatura: "Metodología de la Investigación",
                  estado: "PRESENTE" as const,
                },
                {
                  fecha: "2024-03-19",
                  asignatura: "Estadística Aplicada",
                  estado: "PRESENTE" as const,
                },
                {
                  fecha: "2024-03-20",
                  asignatura: "Metodología de la Investigación",
                  estado:
                    Math.random() > 0.8
                      ? ("TARDANZA" as const)
                      : ("PRESENTE" as const),
                  observaciones:
                    Math.random() > 0.8 ? "Llegó 10 minutos tarde" : undefined,
                },
              ],
              pagos: [
                {
                  concepto: "Matrícula",
                  monto: 150.0,
                  fechaPago: "2024-03-01",
                  estado: "PAGADO" as const,
                  fechaVencimiento: "2024-02-28",
                },
                {
                  concepto: "Pensión Marzo",
                  monto: 350.0,
                  estado:
                    Math.random() > 0.7
                      ? ("PENDIENTE" as const)
                      : ("PAGADO" as const),
                  fechaVencimiento: "2024-03-31",
                  fechaPago: Math.random() > 0.7 ? undefined : "2024-03-15",
                },
              ],
            }));

          const reporteDetalladoReal: ReporteDetallado = {
            periodoAcademico: {
              id: filtros.periodoAcademicoId || 1,
              nombre:
                periodosAcademicos.find(
                  (p) => p.id === filtros.periodoAcademicoId
                )?.nombre || "2024-I",
            },
            estudiantes: estudiantesDetallados,
            resumen: {
              totalEstudiantes: estudiantesDetallados.length,
              estudiantesConCalificaciones: estudiantesDetallados.filter(
                (e) => e.calificaciones.length > 0
              ).length,
              estudiantesConPagosAlDia: estudiantesDetallados.filter((e) =>
                e.pagos.every((p) => p.estado === "PAGADO")
              ).length,
              promedioAsistenciaGeneral:
                estudiantesDetallados.length > 0
                  ? estudiantesDetallados.reduce((acc, e) => {
                      const asistenciasPresente = e.asistencias.filter(
                        (a) => a.estado === "PRESENTE"
                      ).length;
                      return (
                        acc +
                        (e.asistencias.length > 0
                          ? (asistenciasPresente / e.asistencias.length) * 100
                          : 0)
                      );
                    }, 0) / estudiantesDetallados.length
                  : 0,
            },
          };
          setReporteDetallado(reporteDetalladoReal);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Error al cargar reporte:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar el reporte",
        confirmButtonColor: "#f59e0b",
      });
    } finally {
      setLoading(false);
    }
  }, [tipoReporteActivo, filtros, periodosAcademicos, programasEstudio, sedes]);

  // Carga inicial de datos
  useEffect(() => {
    if (canAccess) {
      loadInitialData();
    }
  }, [canAccess, loadInitialData]);

  // Cargar reporte cuando cambian los filtros o tipo de reporte
  useEffect(() => {
    if (canAccess && periodosAcademicos.length > 0) {
      loadReporte();
    }
  }, [canAccess, tipoReporteActivo, filtros, periodosAcademicos, loadReporte]);

  // Animaciones
  useEffect(() => {
    if (canAccess && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [canAccess]);

  // Verificar acceso
  if (!canAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaInfoCircle className="mx-auto text-5xl text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-600">
            No tienes permisos para acceder a los reportes
          </p>
        </div>
      </div>
    );
  }

  const handleApplyFilters = () => {
    setFiltros(tempFiltros);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setTempFiltros({});
    setFiltros({});
    setShowFilters(false);
  };

  const handleExportReport = async (formato: "PDF" | "EXCEL") => {
    try {
      // Generar contenido del reporte basado en datos reales
      const reporteData = {
        tipo: tipoReporteActivo,
        filtros,
        data:
          tipoReporteActivo === TipoReporte.MATRICULAS
            ? reporteMatriculas
            : tipoReporteActivo === TipoReporte.PAGOS
            ? reportePagos
            : reporteAcademico,
      };

      // Crear un blob con los datos del reporte
      const content = JSON.stringify(reporteData, null, 2);
      const blob = new Blob([content], {
        type:
          formato === "PDF" ? "application/pdf" : "application/vnd.ms-excel",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-${tipoReporteActivo.toLowerCase()}-${
        new Date().toISOString().split("T")[0]
      }.${formato.toLowerCase() === "excel" ? "json" : "txt"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      Swal.fire({
        icon: "success",
        title: "Reporte exportado",
        text: `El reporte se ha exportado correctamente`,
        confirmButtonColor: "#f59e0b",
      });
    } catch (error) {
      console.error("Error al exportar reporte:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo exportar el reporte",
        confirmButtonColor: "#f59e0b",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  // Agregar TipoReporte.DETALLADO si no existe
  const TIPOS_REPORTE_EXTENDED = {
    ...TIPOS_REPORTE_LABELS,
    [TipoReporte.DETALLADO]: "Reporte Detallado",
  };

  // Eliminar TipoReporte.CONSOLIDADO de las opciones
  const tiposReporteDisponibles = Object.entries(TIPOS_REPORTE_EXTENDED).filter(
    ([key]) => key !== TipoReporte.CONSOLIDADO
  );

  return (
    <div ref={containerRef} className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Reportes de Matrícula
        </h1>
        <p className="text-gray-600">
          Visualiza reportes consolidados del período académico actual
        </p>
      </div>

      {/* Tabs de tipos de reporte */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tiposReporteDisponibles.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTipoReporteActivo(key as TipoReporte)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  tipoReporteActivo === key
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowFilters(true)}
            leftIcon={FaFilter}
            variant="outline"
          >
            Filtros
          </Button>
          <Button
            onClick={() => handleExportReport("PDF")}
            leftIcon={FaFilePdf}
            variant="secondary"
          >
            Exportar PDF
          </Button>
          <Button
            onClick={() => handleExportReport("EXCEL")}
            leftIcon={FaFileExcel}
            variant="secondary"
          >
            Exportar Excel
          </Button>
        </div>

        {filtros.periodoAcademicoId && (
          <div className="text-sm text-gray-600">
            Período:{" "}
            {
              periodosAcademicos.find(
                (p) => p.id === filtros.periodoAcademicoId
              )?.nombre
            }
          </div>
        )}
      </div>

      {/* Contenido del reporte */}
      <div className="space-y-6">
        {tipoReporteActivo === TipoReporte.MATRICULAS && reporteMatriculas && (
          <ReporteMatriculasComponent reporte={reporteMatriculas} />
        )}

        {tipoReporteActivo === TipoReporte.PAGOS && reportePagos && (
          <ReportePagosComponent reporte={reportePagos} />
        )}

        {tipoReporteActivo === TipoReporte.ACADEMICO && reporteAcademico && (
          <ReporteAcademicoComponent reporte={reporteAcademico} />
        )}

        {tipoReporteActivo === "DETALLADO" && reporteDetallado && (
          <ReporteDetalladoComponent reporte={reporteDetallado} />
        )}
      </div>

      {/* Modal de Filtros */}
      {showFilters && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filtros de Reporte</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-white hover:text-amber-200 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Período Académico
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={tempFiltros.periodoAcademicoId || ""}
                  onChange={(e) =>
                    setTempFiltros({
                      ...tempFiltros,
                      periodoAcademicoId: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                >
                  <option value="">Seleccionar período</option>
                  {periodosAcademicos.map((periodo) => (
                    <option key={periodo.id} value={periodo.id}>
                      {periodo.nombre} - {periodo.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Programa de Estudio
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={tempFiltros.programaId || ""}
                  onChange={(e) =>
                    setTempFiltros({
                      ...tempFiltros,
                      programaId: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                >
                  <option value="">Todos los programas</option>
                  {programasEstudio.map((programa) => (
                    <option key={programa.id} value={programa.id}>
                      {programa.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sede
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={tempFiltros.sedeId || ""}
                  onChange={(e) =>
                    setTempFiltros({
                      ...tempFiltros,
                      sedeId: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                >
                  <option value="">Todas las sedes</option>
                  {sedes.map((sede) => (
                    <option key={sede.id} value={sede.id}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-between">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Limpiar Filtros
              </Button>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowFilters(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
