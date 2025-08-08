"use client";

import { FaArrowLeft, FaBook, FaCheckCircle, FaClock, FaExclamationTriangle, FaGraduationCap, FaCalendarCheck, FaCalendarTimes, FaFileAlt, FaChartLine } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PlanEstudios() {
  const router = useRouter();
  const [mostrarAsistencias, setMostrarAsistencias] = useState(false);
  
  const materiasData = [
    { nombre: "Metodología de la Investigación Científica", creditos: 4, ciclo: "I", estado: "Aprobada", nota: 16, prereq: "Ninguno" },
    { nombre: "Estadística Aplicada a la Investigación", creditos: 4, ciclo: "I", estado: "Aprobada", nota: 15, prereq: "Ninguno" },
    { nombre: "Epistemología de la Ciencia", creditos: 3, ciclo: "I", estado: "Aprobada", nota: 17, prereq: "Ninguno" },
    { nombre: "Seminario de Tesis I", creditos: 5, ciclo: "II", estado: "En curso", nota: null, prereq: "Metodología" },
    { nombre: "Análisis Multivariado", creditos: 4, ciclo: "II", estado: "Matriculado", nota: null, prereq: "Estadística" },
    { nombre: "Redacción Científica", creditos: 3, ciclo: "II", estado: "Pendiente", nota: null, prereq: "Epistemología" },
  ];

  const resumenAcademico = {
    creditosAprobados: 18,
    creditosTotal: 48,
    promedioGeneral: 16.0,
    cicloActual: "II",
    materiasAprobadas: 6,
    materiasTotal: 16
  };

  // Datos de asistencias por materia
  const asistenciasData = [
    { 
      materia: "Seminario de Tesis I", 
      clasesTotales: 24, 
      clasesAsistidas: 20, 
      inasistencias: 4, 
      porcentaje: 83.3, 
      estado: "Crítico",
      justificadas: 1,
      injustificadas: 3,
      proximaClase: "2025-01-15"
    },
    { 
      materia: "Análisis Multivariado", 
      clasesTotales: 20, 
      clasesAsistidas: 19, 
      inasistencias: 1, 
      porcentaje: 95.0, 
      estado: "Excelente",
      justificadas: 1,
      injustificadas: 0,
      proximaClase: "2025-01-16"
    },
    { 
      materia: "Redacción Científica", 
      clasesTotales: 16, 
      clasesAsistidas: 14, 
      inasistencias: 2, 
      porcentaje: 87.5, 
      estado: "Bueno",
      justificadas: 0,
      injustificadas: 2,
      proximaClase: "2025-01-17"
    }
  ];

  const resumenAsistencias = {
    porcentajeGeneral: 88.6,
    totalClases: 60,
    totalAsistidas: 53,
    totalInasistencias: 7,
    materiasCriticas: 1,
    justificacionesPendientes: 2
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Aprobada": return <FaCheckCircle className="text-green-500" />;
      case "En curso": return <FaClock className="text-amber-500" />;
      case "Matriculado": return <FaBook className="text-blue-500" />;
      default: return <FaExclamationTriangle className="text-red-500" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Aprobada": return "text-green-400 font-semibold";
      case "En curso": return "text-amber-400 font-semibold";
      case "Matriculado": return "text-blue-400 font-semibold";
      default: return "text-red-400 font-semibold";
    }
  };

  const getEstadoAsistenciaColor = (estado: string) => {
    switch (estado) {
      case "Excelente": return "text-zinc-400 bg-zinc-900/20";
      case "Bueno": return "text-amber-400 bg-amber-900/20";
      case "Crítico": return "text-red-400 bg-red-900/20";
      default: return "text-zinc-400 bg-zinc-900/20";
    }
  };

  const getEstadoAsistenciaIcon = (estado: string) => {
    switch (estado) {
      case "Excelente": return <FaCheckCircle className="text-zinc-400" />;
      case "Bueno": return <FaCalendarCheck className="text-amber-400" />;
      case "Crítico": return <FaCalendarTimes className="text-red-400" />;
      default: return <FaClock className="text-zinc-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.push('/intranet-estudiantes')}
            className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-lg transition-colors"
          >
            <FaArrowLeft />
          </button>
          <div className="flex items-center gap-3">
            <FaGraduationCap className="text-amber-400 text-3xl" />
            <h1 className="text-3xl md:text-4xl font-bold text-amber-400">Plan de Estudios</h1>
          </div>
        </div>

        {/* Resumen Académico */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-800 rounded-xl p-6 text-center">
            <h3 className="text-amber-400 font-bold mb-2">Créditos</h3>
            <p className="text-3xl font-bold text-white">{resumenAcademico.creditosAprobados}</p>
            <p className="text-zinc-400 text-sm">de {resumenAcademico.creditosTotal} totales</p>
            <div className="w-full bg-zinc-700 rounded-full h-2 mt-3">
              <div 
                className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(resumenAcademico.creditosAprobados / resumenAcademico.creditosTotal) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6 text-center">
            <h3 className="text-green-400 font-bold mb-2">Promedio</h3>
            <p className="text-3xl font-bold text-white">{resumenAcademico.promedioGeneral}</p>
            <p className="text-zinc-400 text-sm">Escala vigesimal</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6 text-center">
            <h3 className="text-blue-400 font-bold mb-2">Ciclo Actual</h3>
            <p className="text-3xl font-bold text-white">{resumenAcademico.cicloActual}</p>
            <p className="text-zinc-400 text-sm">2025-I</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6 text-center">
            <h3 className="text-purple-400 font-bold mb-2">Materias</h3>
            <p className="text-3xl font-bold text-white">{resumenAcademico.materiasAprobadas}</p>
            <p className="text-zinc-400 text-sm">de {resumenAcademico.materiasTotal} totales</p>
          </div>
        </div>

        {/* Tabla de Materias */}
        <div className="bg-zinc-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FaBook className="text-amber-400" />
            Detalle del Plan Curricular
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-white">
              <thead>
                <tr className="bg-amber-500 text-zinc-900">
                  <th className="py-3 px-4 font-bold">Materia</th>
                  <th className="py-3 px-4 font-bold text-center">Ciclo</th>
                  <th className="py-3 px-4 font-bold text-center">Créditos</th>
                  <th className="py-3 px-4 font-bold text-center">Prerrequisito</th>
                  <th className="py-3 px-4 font-bold text-center">Estado</th>
                  <th className="py-3 px-4 font-bold text-center">Nota</th>
                </tr>
              </thead>
              <tbody>
                {materiasData.map((materia, index) => (
                  <tr key={index} className="border-b border-zinc-700 hover:bg-zinc-700/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getEstadoIcon(materia.estado)}
                        <span className="font-medium">{materia.nombre}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-amber-400">{materia.ciclo}</td>
                    <td className="py-4 px-4 text-center font-bold">{materia.creditos}</td>
                    <td className="py-4 px-4 text-center text-zinc-300">{materia.prereq}</td>
                    <td className={`py-4 px-4 text-center ${getEstadoColor(materia.estado)}`}>
                      {materia.estado}
                    </td>
                    <td className="py-4 px-4 text-center font-bold">
                      {materia.nota ? (
                        <span className={materia.nota >= 14 ? "text-green-400" : "text-red-400"}>
                          {materia.nota}
                        </span>
                      ) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sección de Reporte de Asistencias */}
        <div className="bg-zinc-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaCalendarCheck className="text-amber-400" />
              Reporte de Asistencias - Semestre Actual
            </h2>
            <div className="flex gap-3">
              <button 
                onClick={() => router.push('/intranet-estudiantes')}
                className="bg-zinc-500 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaArrowLeft />
                Volver al Panel
              </button>
              <button 
                onClick={() => setMostrarAsistencias(!mostrarAsistencias)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaChartLine />
                {mostrarAsistencias ? 'Ocultar' : 'Ver Detalle'}
              </button>
            </div>
          </div>

          {/* Resumen de Asistencias */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FaChartLine className="text-amber-400 text-xl" />
                <h3 className="text-amber-400 font-bold text-sm">Asistencia General</h3>
              </div>
              <p className="text-2xl font-bold text-white">{resumenAsistencias.porcentajeGeneral}%</p>
              <p className="text-zinc-400 text-xs">{resumenAsistencias.totalAsistidas}/{resumenAsistencias.totalClases} clases</p>
            </div>

            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FaCalendarTimes className="text-red-400 text-xl" />
                <h3 className="text-red-400 font-bold text-sm">Inasistencias</h3>
              </div>
              <p className="text-2xl font-bold text-white">{resumenAsistencias.totalInasistencias}</p>
              <p className="text-zinc-400 text-xs">Total faltas</p>
            </div>

            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FaExclamationTriangle className="text-amber-400 text-xl" />
                <h3 className="text-amber-400 font-bold text-sm">Materias Críticas</h3>
              </div>
              <p className="text-2xl font-bold text-white">{resumenAsistencias.materiasCriticas}</p>
              <p className="text-zinc-400 text-xs">Requieren atención</p>
            </div>

            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FaFileAlt className="text-zinc-400 text-xl" />
                <h3 className="text-zinc-400 font-bold text-sm">Justificaciones</h3>
              </div>
              <p className="text-2xl font-bold text-white">{resumenAsistencias.justificacionesPendientes}</p>
              <p className="text-zinc-400 text-xs">Pendientes</p>
            </div>
          </div>

          {/* Tabla detallada de asistencias */}
          {mostrarAsistencias && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-white">
                <thead>
                  <tr className="bg-amber-500 text-zinc-900">
                    <th className="py-3 px-4 font-bold">Materia</th>
                    <th className="py-3 px-4 font-bold text-center">Clases Totales</th>
                    <th className="py-3 px-4 font-bold text-center">Asistidas</th>
                    <th className="py-3 px-4 font-bold text-center">Inasistencias</th>
                    <th className="py-3 px-4 font-bold text-center">% Asistencia</th>
                    <th className="py-3 px-4 font-bold text-center">Estado</th>
                    <th className="py-3 px-4 font-bold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {asistenciasData.map((asistencia, index) => (
                    <tr key={index} className="border-b border-zinc-700 hover:bg-zinc-700/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getEstadoAsistenciaIcon(asistencia.estado)}
                          <span className="font-medium">{asistencia.materia}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-bold">{asistencia.clasesTotales}</td>
                      <td className="py-4 px-4 text-center text-zinc-400">{asistencia.clasesAsistidas}</td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col">
                          <span className="font-bold text-red-400">{asistencia.inasistencias}</span>
                          <div className="text-xs text-zinc-500">
                            J: {asistencia.justificadas} | I: {asistencia.injustificadas}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`font-bold text-lg ${
                            asistencia.porcentaje >= 90 ? 'text-zinc-400' : 
                            asistencia.porcentaje >= 75 ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {asistencia.porcentaje}%
                          </span>
                          <div className="w-full bg-zinc-700 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${
                                asistencia.porcentaje >= 90 ? 'bg-zinc-400' : 
                                asistencia.porcentaje >= 75 ? 'bg-amber-400' : 'bg-red-400'
                              }`}
                              style={{ width: `${asistencia.porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getEstadoAsistenciaColor(asistencia.estado)}`}>
                          {asistencia.estado}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col gap-1">
                          <button className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded text-xs transition-colors">
                            Justificar
                          </button>
                          <button className="bg-zinc-600 hover:bg-zinc-700 text-white px-2 py-1 rounded text-xs transition-colors">
                            Ver Detalles
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Información sobre límites de asistencia */}
          <div className="mt-4 p-4 bg-amber-900/20 rounded-lg border-l-4 border-amber-400">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-amber-400 mt-1" />
              <div>
                <h4 className="text-amber-200 font-bold text-sm mb-2">Política de Asistencias</h4>
                <ul className="text-amber-200 text-xs space-y-1">
                  <li>• <strong>Mínimo requerido:</strong> 75% de asistencia para aprobar la materia</li>
                  <li>• <strong>Estado Crítico:</strong> Asistencia entre 75% - 85% (requiere atención)</li>
                  <li>• <strong>Justificaciones:</strong> Máximo 3 faltas justificables por materia</li>
                  <li>• <strong>Plazo:</strong> Las justificaciones deben enviarse dentro de 72 horas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="mt-8 bg-zinc-800 rounded-xl p-6">
          <h3 className="text-amber-400 font-bold text-lg mb-4">Información del Programa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300">
            <div>
              <p><strong className="text-white">Programa:</strong> Maestría en Administración</p>
              <p><strong className="text-white">Duración:</strong> 4 semestres académicos</p>
              <p><strong className="text-white">Modalidad:</strong> Presencial</p>
            </div>
            <div>
              <p><strong className="text-white">Créditos Mínimos:</strong> 48 créditos</p>
              <p><strong className="text-white">Nota Mínima:</strong> 14 (Escala vigesimal)</p>
              <p><strong className="text-white">Año de Ingreso:</strong> 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
