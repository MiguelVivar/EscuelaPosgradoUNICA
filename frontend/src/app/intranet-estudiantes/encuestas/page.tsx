"use client";

import { FaArrowLeft, FaClipboardList, FaUser, FaStar, FaClock, FaCheckCircle, FaExclamationCircle, FaChartBar, FaPlay, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Encuestas() {
  const router = useRouter();
  const [encuestaSeleccionada, setEncuestaSeleccionada] = useState<string | null>(null);

  const encuestasDisponibles = [
    {
      id: "ENC-2025-01",
      titulo: "Evaluación Docente - Semestre 2025-I",
      tipo: "Evaluación Docente",
      descripcion: "Evalúa el desempeño de tus docentes del semestre actual",
      fechaInicio: "2025-01-20",
      fechaCierre: "2025-02-15",
      duracion: "15-20 minutos",
      progreso: 0,
      estado: "Disponible",
      docentes: ["Dr. García López", "Mg. Rodríguez Silva", "Dr. Martínez Ruiz"],
      obligatoria: true,
      puntos: 50
    },
    {
      id: "ENC-2025-02", 
      titulo: "Satisfacción de Servicios Académicos",
      tipo: "Servicios",
      descripcion: "Tu opinión sobre biblioteca, laboratorios y servicios estudiantiles",
      fechaInicio: "2025-01-15",
      fechaCierre: "2025-03-01",
      duracion: "10-12 minutos",
      progreso: 0,
      estado: "Disponible",
      servicios: ["Biblioteca", "Laboratorios", "Registro Académico", "Bienestar Estudiantil"],
      obligatoria: false,
      puntos: 30
    }
  ];

  const encuestasCompletadas = [
    {
      id: "ENC-2024-08",
      titulo: "Evaluación Docente - Semestre 2024-II",
      tipo: "Evaluación Docente", 
      fechaCompletada: "2024-12-10",
      calificacionPromedio: 4.2,
      tiempoEmpleado: "18 minutos",
      comentarios: "Evaluación completada satisfactoriamente",
      puntos: 50
    },
    {
      id: "ENC-2024-06",
      titulo: "Calidad de Infraestructura",
      tipo: "Infraestructura",
      fechaCompletada: "2024-10-15",
      calificacionPromedio: 3.8,
      tiempoEmpleado: "12 minutos", 
      comentarios: "Sugerencias enviadas para mejoras",
      puntos: 40
    },
    {
      id: "ENC-2024-03",
      titulo: "Proceso de Matrícula 2024",
      tipo: "Procesos",
      fechaCompletada: "2024-03-20",
      calificacionPromedio: 4.5,
      tiempoEmpleado: "8 minutos",
      comentarios: "Proceso muy satisfactorio",
      puntos: 25
    }
  ];

  const estadisticasEncuestas = {
    encuestasCompletadas: 3,
    encuestasPendientes: 2,
    puntosAcumulados: 115,
    promedioCalificacion: 4.17,
    tiempoPromedioRespuesta: "13 minutos",
    participacionGeneral: "85%"
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Disponible": return "text-amber-400 bg-amber-900/20";
      case "Completada": return "text-zinc-400 bg-zinc-900/20";
      case "Vencida": return "text-red-400 bg-red-900/20";
      default: return "text-zinc-400 bg-zinc-900/20";
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Evaluación Docente": return <FaUser className="text-amber-400" />;
      case "Servicios": return <FaClipboardList className="text-zinc-400" />;
      case "Infraestructura": return <FaChartBar className="text-zinc-400" />;
      default: return <FaClipboardList className="text-zinc-400" />;
    }
  };

  const getDiasRestantes = (fechaCierre: string) => {
    const hoy = new Date();
    const cierre = new Date(fechaCierre);
    const diferencia = Math.ceil((cierre.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
    return diferencia;
  };

  const renderEstrellas = (calificacion: number) => {
    const estrellas = [];
    const calificacionRedondeada = Math.round(calificacion * 2) / 2;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= calificacionRedondeada) {
        estrellas.push(<FaStar key={i} className="text-amber-400" />);
      } else if (i - 0.5 <= calificacionRedondeada) {
        estrellas.push(<FaStar key={i} className="text-amber-200" />);
      } else {
        estrellas.push(<FaStar key={i} className="text-zinc-600" />);
      }
    }
    return estrellas;
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
            <FaClipboardList className="text-amber-400 text-3xl" />
            <h1 className="text-3xl md:text-4xl font-bold text-amber-400">Encuestas y Evaluaciones</h1>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-zinc-500 to-zinc-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <FaClipboardList className="text-2xl" />
              <h3 className="font-bold">Completadas</h3>
            </div>
            <p className="text-3xl font-bold">{estadisticasEncuestas.encuestasCompletadas}</p>
            <p className="text-zinc-100 text-sm">Encuestas respondidas</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaClock className="text-amber-400 text-xl" />
              <h3 className="text-amber-400 font-bold">Pendientes</h3>
            </div>
            <p className="text-3xl font-bold text-white">{estadisticasEncuestas.encuestasPendientes}</p>
            <p className="text-zinc-400 text-sm">Por completar</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaStar className="text-amber-400 text-xl" />
              <h3 className="text-amber-400 font-bold">Puntos</h3>
            </div>
            <p className="text-3xl font-bold text-white">{estadisticasEncuestas.puntosAcumulados}</p>
            <p className="text-zinc-400 text-sm">Puntos ganados</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaChartBar className="text-zinc-400 text-xl" />
              <h3 className="text-zinc-400 font-bold">Promedio</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{estadisticasEncuestas.promedioCalificacion}</span>
              <div className="flex">
                {renderEstrellas(estadisticasEncuestas.promedioCalificacion)}
              </div>
            </div>
            <p className="text-zinc-400 text-sm">Calificación general</p>
          </div>
        </div>

        {/* Encuestas Disponibles */}
        <div className="bg-zinc-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FaExclamationCircle className="text-amber-400" />
            Encuestas Disponibles para Completar
          </h2>
          
          <div className="space-y-6">
            {encuestasDisponibles.map((encuesta, index) => (
              <div key={index} className="bg-zinc-900 rounded-lg p-6 border border-zinc-700 hover:border-amber-400 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTipoIcon(encuesta.tipo)}
                      <h3 className="text-lg font-bold text-white">{encuesta.titulo}</h3>
                      {encuesta.obligatoria && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          OBLIGATORIA
                        </span>
                      )}
                    </div>
                    
                    <p className="text-zinc-300 mb-3">{encuesta.descripcion}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-zinc-400">Duración:</span>
                        <span className="text-white ml-2">{encuesta.duracion}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400">Cierre:</span>
                        <span className="text-amber-400 ml-2">{encuesta.fechaCierre}</span>
                        <div className="text-xs text-zinc-500">
                          {getDiasRestantes(encuesta.fechaCierre)} días restantes
                        </div>
                      </div>
                      <div>
                        <span className="text-zinc-400">Puntos:</span>
                        <span className="text-amber-400 ml-2 font-bold">+{encuesta.puntos}</span>
                      </div>
                    </div>
                    
                    {encuesta.docentes && (
                      <div className="mt-3">
                        <span className="text-zinc-400 text-sm">Docentes a evaluar:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {encuesta.docentes.map((docente, idx) => (
                            <span key={idx} className="bg-amber-900/20 text-amber-300 px-2 py-1 rounded text-xs">
                              {docente}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {encuesta.servicios && (
                      <div className="mt-3">
                        <span className="text-zinc-400 text-sm">Servicios a evaluar:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {encuesta.servicios.map((servicio, idx) => (
                            <span key={idx} className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded text-xs">
                              {servicio}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-center ${getEstadoColor(encuesta.estado)}`}>
                      {encuesta.estado}
                    </span>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium">
                      <FaPlay className="w-4 h-4" />
                      Iniciar Encuesta
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historial de Encuestas Completadas */}
        <div className="bg-zinc-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FaCheckCircle className="text-zinc-400" />
            Historial de Encuestas Completadas
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-white">
              <thead>
                <tr className="bg-zinc-500 text-white">
                  <th className="py-3 px-4 font-bold">Encuesta</th>
                  <th className="py-3 px-4 font-bold">Tipo</th>
                  <th className="py-3 px-4 font-bold text-center">Fecha</th>
                  <th className="py-3 px-4 font-bold text-center">Tiempo</th>
                  <th className="py-3 px-4 font-bold text-center">Calificación</th>
                  <th className="py-3 px-4 font-bold text-center">Puntos</th>
                  <th className="py-3 px-4 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {encuestasCompletadas.map((encuesta, index) => (
                  <tr key={index} className="border-b border-zinc-700 hover:bg-zinc-700/50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <span className="font-medium">{encuesta.titulo}</span>
                        <div className="text-zinc-400 text-xs mt-1">
                          ID: {encuesta.id}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded text-xs">
                        {encuesta.tipo}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col">
                        <span className="font-medium">{encuesta.fechaCompletada}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-zinc-300">
                      {encuesta.tiempoEmpleado}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-bold text-amber-400">{encuesta.calificacionPromedio}</span>
                        <div className="flex text-xs">
                          {renderEstrellas(encuesta.calificacionPromedio)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-amber-400 font-bold">+{encuesta.puntos}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button className="bg-zinc-600 hover:bg-zinc-700 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1 mx-auto">
                        <FaEye className="w-3 h-3" />
                        Ver Respuestas
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="mt-8 bg-zinc-800 rounded-xl p-6">
          <h3 className="text-zinc-300 font-bold text-lg mb-4">Sistema de Puntos y Beneficios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 rounded-lg p-4">
              <h4 className="text-white font-bold mb-2">Puntos por Encuesta</h4>
              <ul className="text-zinc-300 text-sm space-y-1">
                <li>• <span className="text-amber-400">Evaluación Docente:</span> 50 puntos</li>
                <li>• <span className="text-zinc-400">Servicios Académicos:</span> 30 puntos</li>
                <li>• <span className="text-red-400">Infraestructura:</span> 40 puntos</li>
                <li>• <span className="text-amber-400">Procesos Administrativos:</span> 25 puntos</li>
              </ul>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4">
              <h4 className="text-white font-bold mb-2">Beneficios Disponibles</h4>
              <ul className="text-zinc-300 text-sm space-y-1">
                <li>• <span className="text-amber-400">100 pts:</span> Descuento 5% en trámites</li>
                <li>• <span className="text-amber-400">200 pts:</span> Acceso prioritario biblioteca</li>
                <li>• <span className="text-amber-400">300 pts:</span> Certificado de participación</li>
                <li>• <span className="text-amber-400">500 pts:</span> Beca parcial siguiente semestre</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-zinc-900/50 rounded-lg border-l-4 border-zinc-400">
            <p className="text-zinc-200 text-sm">
              <strong>Importante:</strong> Las encuestas obligatorias deben completarse para mantener activa tu matrícula. 
              Tus respuestas son confidenciales y nos ayudan a mejorar la calidad educativa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
