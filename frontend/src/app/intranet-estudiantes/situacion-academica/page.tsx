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
      case "Aprobado": return "text-green-400";
      case "En curso": return "text-amber-400";
      case "Regular": return "text-green-400";
      default: return "text-red-400";
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
            <FaTrophy className="text-amber-400 text-3xl" />
            <h1 className="text-3xl md:text-4xl font-bold text-amber-400">Situación Académica</h1>
          </div>
        </div>

        {/* Resumen General */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <FaChartLine className="text-2xl" />
              <h3 className="font-bold">Promedio General</h3>
            </div>
            <p className="text-4xl font-bold">{situacionAcademica.promedioGeneral}</p>
            <p className="text-amber-100 text-sm">Escala vigesimal</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaAward className="text-amber-400 text-xl" />
              <h3 className="text-amber-400 font-bold">Ranking</h3>
            </div>
            <p className="text-3xl font-bold text-white">{situacionAcademica.ranking}</p>
            <p className="text-zinc-400 text-sm">de {situacionAcademica.totalEstudiantes} estudiantes</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaCalendarAlt className="text-blue-400 text-xl" />
              <h3 className="text-blue-400 font-bold">Semestre</h3>
            </div>
            <p className="text-2xl font-bold text-white">{situacionAcademica.semestreActual}</p>
            <p className="text-zinc-400 text-sm">Promedio: {situacionAcademica.promedioSemestre}</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaExclamationCircle className="text-green-400 text-xl" />
              <h3 className="text-green-400 font-bold">Estado</h3>
            </div>
            <p className={`text-2xl font-bold ${getEstadoColor(situacionAcademica.estadoAcademico)}`}>
              {situacionAcademica.estadoAcademico}
            </p>
            <p className="text-zinc-400 text-sm">Habilitado</p>
          </div>
        </div>

        {/* Historial por Semestre */}
        <div className="bg-zinc-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FaChartLine className="text-amber-400" />
            Historial Académico por Semestre
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-white">
              <thead>
                <tr className="bg-amber-500 text-zinc-900">
                  <th className="py-3 px-4 font-bold">Semestre</th>
                  <th className="py-3 px-4 font-bold text-center">Promedio</th>
                  <th className="py-3 px-4 font-bold text-center">Créditos</th>
                  <th className="py-3 px-4 font-bold text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {notasPorSemestre.map((sem, index) => (
                  <tr key={index} className="border-b border-zinc-700 hover:bg-zinc-700/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-amber-400">{sem.semestre}</td>
                    <td className="py-4 px-4 text-center font-bold text-2xl">
                      <span className={sem.promedio >= 14 ? "text-green-400" : "text-red-400"}>
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
        <div className="bg-zinc-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-400" />
            Materias del Semestre Actual ({situacionAcademica.semestreActual})
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-white">
              <thead>
                <tr className="bg-blue-500 text-zinc-900">
                  <th className="py-3 px-4 font-bold">Materia</th>
                  <th className="py-3 px-4 font-bold">Docente</th>
                  <th className="py-3 px-4 font-bold text-center">1ra Evaluación</th>
                  <th className="py-3 px-4 font-bold text-center">2da Evaluación</th>
                  <th className="py-3 px-4 font-bold text-center">Nota Final</th>
                </tr>
              </thead>
              <tbody>
                {materiasActuales.map((materia, index) => (
                  <tr key={index} className="border-b border-zinc-700 hover:bg-zinc-700/50 transition-colors">
                    <td className="py-4 px-4 font-medium">{materia.materia}</td>
                    <td className="py-4 px-4 text-zinc-300">{materia.docente}</td>
                    <td className="py-4 px-4 text-center font-bold">
                      <span className={materia.nota1 >= 14 ? "text-green-400" : "text-red-400"}>
                        {materia.nota1}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-bold">
                      <span className={materia.nota2 >= 14 ? "text-green-400" : "text-red-400"}>
                        {materia.nota2}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-bold">
                      {materia.notaFinal ? (
                        <span className={materia.notaFinal >= 14 ? "text-green-400" : "text-red-400"}>
                          {materia.notaFinal}
                        </span>
                      ) : (
                        <span className="text-zinc-500">Pendiente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-zinc-900 rounded-lg">
            <p className="text-zinc-300 text-sm">
              <strong className="text-amber-400">Nota:</strong> Las calificaciones se actualizan automáticamente cuando los docentes registran las notas. 
              El promedio final se calcula considerando todas las evaluaciones del semestre.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
