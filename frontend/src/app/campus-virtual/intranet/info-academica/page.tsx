"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/common";
import Swal from "sweetalert2";
import { gsap } from "gsap";
import {
  FaGraduationCap,
  FaChartLine,
  FaCalendarAlt,
  FaBookOpen,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTrophy,
  FaDownload,
  FaEye,
} from "react-icons/fa";

import { InformacionAcademica } from "@/types/academic-info";
import { academicService } from "@/services/academicService";

export default function InfoAcademicaPage() {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [informacionAcademica, setInformacionAcademica] =
    useState<InformacionAcademica | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "resumen" | "historial" | "proyeccion"
  >("resumen");

  useEffect(() => {
    const cargarInformacionAcademica = async () => {
      try {
        setLoading(true);
        // En un caso real, obtendríamos el ID del estudiante del contexto de usuario
        const estudianteId = user?.id || 1;
        const data = await academicService.getInformacionAcademica(
          estudianteId
        );
        setInformacionAcademica(data);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la información académica",
          confirmButtonColor: "#f59e0b",
        });
      } finally {
        setLoading(false);
      }
    };

    cargarInformacionAcademica();
  }, [user]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  const getNotaBadge = (nota: number | null) => {
    if (!nota) return "bg-gray-100 text-gray-800";
    if (nota >= 16) return "bg-green-100 text-green-800";
    if (nota >= 14) return "bg-blue-100 text-blue-800";
    if (nota >= 11) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getEstadoMateria = (estado: string) => {
    const estados = {
      APROBADO: { color: "bg-green-100 text-green-800", icon: FaCheckCircle },
      REPROBADO: {
        color: "bg-red-100 text-red-800",
        icon: FaExclamationTriangle,
      },
      MATRICULADO: { color: "bg-blue-100 text-blue-800", icon: FaClock },
      RETIRADO: { color: "bg-gray-100 text-gray-800", icon: FaInfoCircle },
    };
    return estados[estado as keyof typeof estados] || estados["MATRICULADO"];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Cargando información académica...</p>
        </div>
      </div>
    );
  }

  if (!informacionAcademica) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaInfoCircle className="mx-auto text-5xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">
            No se encontró información académica
          </p>
        </div>
      </div>
    );
  }

  const { estudiante, historialAcademico, resumenAcademico, proyeccion } =
    informacionAcademica;

  return (
    <div ref={containerRef} className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaGraduationCap className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Mi Información Académica</h1>
              <p className="text-amber-100 text-lg">
                {estudiante.nombres} {estudiante.apellidos} -{" "}
                {estudiante.codigo}
              </p>
              <p className="text-amber-100">{estudiante.programa.nombre}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "resumen", label: "Resumen Académico", icon: FaChartLine },
              {
                id: "historial",
                label: "Historial Académico",
                icon: FaBookOpen,
              },
              { id: "proyeccion", label: "Proyección", icon: FaTrophy },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido de Tabs */}
      {activeTab === "resumen" && (
        <div className="space-y-6">
          {/* Estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-l-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Promedio Acumulado
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {resumenAcademico.promedioAcumulado.toFixed(2)}
                  </p>
                </div>
                <FaTrophy className="text-3xl text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progreso</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {resumenAcademico.porcentajeAvance.toFixed(1)}%
                  </p>
                </div>
                <FaChartLine className="text-3xl text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Créditos Aprobados
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {resumenAcademico.creditosTotalesAprobados}/
                    {resumenAcademico.creditosTotalesRequeridos}
                  </p>
                </div>
                <FaBookOpen className="text-3xl text-amber-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Semestre Actual
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {estudiante.semestreActual}°
                  </p>
                </div>
                <FaCalendarAlt className="text-3xl text-purple-500" />
              </div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaChartLine className="mr-2 text-amber-500" />
              Avance Académico
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Progreso General</span>
                  <span className="text-sm text-gray-600">
                    {resumenAcademico.porcentajeAvance.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${resumenAcademico.porcentajeAvance}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Materias Aprobadas:</span>
                  <span className="ml-2 font-semibold">
                    {resumenAcademico.materiasAprobadas}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Materias Reprobadas:</span>
                  <span className="ml-2 font-semibold">
                    {resumenAcademico.materiasReprobadas}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "historial" && (
        <div className="space-y-6">
          {historialAcademico.periodos.map((periodo) => (
            <div
              key={periodo.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {periodo.periodo.nombre}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {periodo.periodo.codigo}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Promedio del Semestre
                    </p>
                    <p className="text-2xl font-bold text-amber-600">
                      {periodo.promedioSemestre.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Materia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Créditos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Nota
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Profesor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {periodo.materias.map((materia) => {
                      const estadoConfig = getEstadoMateria(materia.estado);
                      const IconEstado = estadoConfig.icon;

                      return (
                        <tr key={materia.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {materia.codigo}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {materia.nombre}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {materia.creditos}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getNotaBadge(
                                materia.nota
                              )}`}
                            >
                              {materia.nota ? materia.nota.toFixed(1) : "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${estadoConfig.color}`}
                            >
                              <IconEstado className="mr-1" size={12} />
                              {materia.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {materia.profesor}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "proyeccion" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaCalendarAlt className="mr-2 text-amber-500" />
                Proyección de Graduación
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Fecha Estimada de Graduación
                  </p>
                  <p className="text-xl font-semibold text-amber-600">
                    {new Date(
                      proyeccion.fechaEstimadaGraduacion
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Semestres Pendientes</p>
                  <p className="text-xl font-semibold">
                    {proyeccion.semestresPendientes}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Créditos Pendientes</p>
                  <p className="text-xl font-semibold">
                    {proyeccion.creditosPendientes}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaBookOpen className="mr-2 text-amber-500" />
                Materias Requeridas
              </h3>
              <div className="space-y-2">
                {proyeccion.materiasRequeridas.map((materia, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-gray-50 rounded"
                  >
                    <FaBookOpen className="mr-2 text-gray-400" size={14} />
                    <span className="text-sm">{materia}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaInfoCircle className="mr-2 text-amber-500" />
              Recomendaciones Académicas
            </h3>
            <div className="space-y-3">
              {proyeccion.recomendaciones.map((recomendacion, index) => (
                <div
                  key={index}
                  className="flex items-start p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500"
                >
                  <FaInfoCircle
                    className="mr-3 text-amber-500 mt-0.5 flex-shrink-0"
                    size={16}
                  />
                  <p className="text-sm text-amber-800">{recomendacion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
