"use client";

import { FaArrowLeft, FaTrophy, FaChartLine, FaCalendarAlt, FaAward, FaExclamationCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function SituacionAcademica() {
  const router = useRouter();
  
  const situacionAcademica = {
    promedioGeneral: 15.8,
    promedioSemestre: 16.2,
    ranking: 12,
    totalEstudiantes: 85,
    creditosAprobados: 32,
    creditosMatriculados: 16,
    semestreActual: "2025-I",
    estadoAcademico: "Regular"
  };

  const notasPorSemestre = [
    { semestre: "2024-I", promedio: 15.2, creditos: 16, estado: "Aprobado" },
    { semestre: "2024-II", promedio: 16.4, creditos: 16, estado: "Aprobado" },
    { semestre: "2025-I", promedio: 16.2, creditos: 16, estado: "En curso" }
  ];

  const materiasActuales = [
    { materia: "Seminario de Tesis I", docente: "Dr. García López", nota1: 16, nota2: 15, notaFinal: null },
    { materia: "Análisis Multivariado", docente: "Mg. Rodríguez Silva", nota1: 17, nota2: 16, notaFinal: null },
    { materia: "Gestión de Proyectos", docente: "Dr. Martínez Ruiz", nota1: 15, nota2: 17, notaFinal: null },
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Aprobado": return "text-green-600";
      case "En curso": return "text-amber-600";
      case "Regular": return "text-green-600";
      default: return "text-red-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => router.push('/intranet-estudiantes')}
              className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-lg transition-colors"
            >
              <FaArrowLeft />
            </button>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaTrophy className="text-amber-500 text-4xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Situación Académica</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Sistema integral para el seguimiento del rendimiento académico estudiantil. 
              Consulta tu promedio general, ranking, historial de calificaciones por semestre y 
              el progreso actual de tus materias en curso.
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg">
              <FaTrophy className="text-sm" />
              <span className="text-sm font-medium">Acceso exclusivo para Estudiantes</span>
            </div>
          </div>
        </div>

        {/* Resumen General */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaChartLine className="text-3xl" />
              <h3 className="font-bold text-lg">Promedio General</h3>
            </div>
            <p className="text-4xl font-bold mb-2">{situacionAcademica.promedioGeneral}</p>
            <p className="text-blue-100 text-sm">Escala vigesimal</p>
          </div>

          <div className="bg-amber-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaAward className="text-3xl" />
              <h3 className="font-bold text-lg">Ranking</h3>
            </div>
            <p className="text-3xl font-bold mb-2">{situacionAcademica.ranking}</p>
            <p className="text-amber-100 text-sm">de {situacionAcademica.totalEstudiantes} estudiantes</p>
          </div>

          <div className="bg-zinc-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaCalendarAlt className="text-3xl" />
              <h3 className="font-bold text-lg">Semestre</h3>
            </div>
            <p className="text-2xl font-bold mb-2">{situacionAcademica.semestreActual}</p>
            <p className="text-zinc-200 text-sm">Promedio: {situacionAcademica.promedioSemestre}</p>
          </div>

          <div className="bg-red-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationCircle className="text-3xl" />
              <h3 className="font-bold text-lg">Estado</h3>
            </div>
            <p className="text-2xl font-bold mb-2">{situacionAcademica.estadoAcademico}</p>
            <p className="text-red-100 text-sm">Habilitado</p>
          </div>
        </div>

        {/* Historial por Semestre */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaChartLine className="text-amber-500" />
            Historial Académico por Semestre
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-800">
              <thead>
                <tr className="bg-amber-500 text-white">
                  <th className="py-3 px-4 font-bold">Semestre</th>
                  <th className="py-3 px-4 font-bold text-center">Promedio</th>
                  <th className="py-3 px-4 font-bold text-center">Créditos</th>
                  <th className="py-3 px-4 font-bold text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {notasPorSemestre.map((sem, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-amber-600">{sem.semestre}</td>
                    <td className="py-4 px-4 text-center font-bold text-2xl">
                      <span className={sem.promedio >= 14 ? "text-green-600" : "text-red-600"}>
                        {sem.promedio}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">{sem.creditos}</td>
                    <td className={`py-4 px-4 text-center font-semibold ${getEstadoColor(sem.estado)}`}>
                      {sem.estado}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Materias Actuales */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaCalendarAlt className="text-zinc-600" />
            Materias del Semestre Actual ({situacionAcademica.semestreActual})
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-800">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="py-3 px-4 font-bold">Materia</th>
                  <th className="py-3 px-4 font-bold">Docente</th>
                  <th className="py-3 px-4 font-bold text-center">1ra Evaluación</th>
                  <th className="py-3 px-4 font-bold text-center">2da Evaluación</th>
                  <th className="py-3 px-4 font-bold text-center">Nota Final</th>
                </tr>
              </thead>
              <tbody>
                {materiasActuales.map((materia, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium">{materia.materia}</td>
                    <td className="py-4 px-4 text-gray-600">{materia.docente}</td>
                    <td className="py-4 px-4 text-center font-bold">
                      <span className={materia.nota1 >= 14 ? "text-green-600" : "text-red-600"}>
                        {materia.nota1}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-bold">
                      <span className={materia.nota2 >= 14 ? "text-green-600" : "text-red-600"}>
                        {materia.nota2}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-bold">
                      {materia.notaFinal ? (
                        <span className={materia.notaFinal >= 14 ? "text-green-600" : "text-red-600"}>
                          {materia.notaFinal}
                        </span>
                      ) : (
                        <span className="text-gray-400">Pendiente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
            <p className="text-amber-700 text-sm">
              <strong>Nota:</strong> Las calificaciones se actualizan automáticamente cuando los docentes registran las notas. 
              El promedio final se calcula considerando todas las evaluaciones del semestre.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
