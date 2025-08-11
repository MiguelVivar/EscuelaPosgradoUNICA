"use client";

import { FaArrowLeft, FaFileAlt, FaClock, FaCheckCircle, FaExclamationTriangle, FaEye, FaDownload, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Tramites() {
  const router = useRouter();
  const [mostrarNuevoTramite, setMostrarNuevoTramite] = useState(false);

  const tramitesData = [
    {
      codigo: "TRA-2025-001",
      tipo: "Certificado de Estudios",
      descripcion: "Certificado oficial de estudios para trámites externos",
      fechaSolicitud: "2025-01-15",
      fechaEstimada: "2025-01-25",
      estado: "En Proceso",
      documentos: ["DNI", "Recibo de Pago"],
      observaciones: "Documento en revisión por Secretaría Académica",
      costo: 45.00,
      responsable: "Secretaría Académica"
    },
    {
      codigo: "TRA-2024-089",
      tipo: "Constancia de Matrícula",
      descripcion: "Constancia de matrícula vigente semestre 2025-I",
      fechaSolicitud: "2024-12-20",
      fechaEstimada: "2024-12-22",
      estado: "Completado",
      documentos: ["Solicitud Firmada"],
      observaciones: "Documento listo para recojo",
      costo: 15.00,
      responsable: "Registro Académico"
    },
    {
      codigo: "TRA-2024-076",
      tipo: "Carta de Presentación",
      descripcion: "Carta institucional para prácticas profesionales",
      fechaSolicitud: "2024-11-10",
      fechaEstimada: "2024-11-15",
      estado: "Completado",
      documentos: ["Carta de Empresa", "Plan de Prácticas"],
      observaciones: "Entregado exitosamente",
      costo: 25.00,
      responsable: "Coordinación Académica"
    },
    {
      codigo: "TRA-2024-045",
      tipo: "Récord Académico",
      descripcion: "Historial completo de calificaciones y cursos",
      fechaSolicitud: "2024-08-15",
      fechaEstimada: "2024-08-30",
      estado: "Observado",
      documentos: ["DNI", "Recibo de Pago"],
      observaciones: "Falta actualización de notas del último semestre",
      costo: 35.00,
      responsable: "Registro Académico"
    }
  ];

  const tiposTramites = [
    { nombre: "Certificado de Estudios", costo: 45.00, tiempo: "10 días hábiles", requisitos: ["DNI", "Recibo de pago"] },
    { nombre: "Constancia de Matrícula", costo: 15.00, tiempo: "2 días hábiles", requisitos: ["Solicitud"] },
    { nombre: "Carta de Presentación", costo: 25.00, tiempo: "5 días hábiles", requisitos: ["Carta de empresa", "Plan de prácticas"] },
    { nombre: "Récord Académico", costo: 35.00, tiempo: "15 días hábiles", requisitos: ["DNI", "Recibo de pago"] },
    { nombre: "Duplicado de Diploma", costo: 150.00, tiempo: "30 días hábiles", requisitos: ["Denuncia policial", "Publicación", "Recibo de pago"] },
    { nombre: "Convalidación de Cursos", costo: 80.00, tiempo: "20 días hábiles", requisitos: ["Sílabos", "Certificados", "Recibo de pago"] }
  ];

  const resumenTramites = {
    totalTramites: 4,
    enProceso: 1,
    completados: 2,
    observados: 1,
    tiempoPromedio: "12 días",
    ultimoTramite: "2025-01-15"
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Completado": return <FaCheckCircle className="text-amber-500" />;
      case "En Proceso": return <FaClock className="text-amber-500" />;
      case "Observado": return <FaExclamationTriangle className="text-red-500" />;
      default: return <FaClock className="text-zinc-500" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Completado": return "text-amber-400 bg-amber-900/20";
      case "En Proceso": return "text-amber-400 bg-amber-900/20";
      case "Observado": return "text-red-400 bg-red-900/20";
      default: return "text-zinc-400 bg-zinc-900/20";
    }
  };

  const getDiasTranscurridos = (fecha: string) => {
    const hoy = new Date();
    const fechaSolicitud = new Date(fecha);
    const diferencia = Math.ceil((hoy.getTime() - fechaSolicitud.getTime()) / (1000 * 3600 * 24));
    return diferencia;
  };

  return (
    <div className="min-h-screen bg-zinc-900 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/intranet-estudiantes')}
              className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-lg transition-colors"
            >
              <FaArrowLeft />
            </button>
            <div className="flex items-center gap-3">
              <FaFileAlt className="text-amber-400 text-3xl" />
              <h1 className="text-3xl md:text-4xl font-bold text-amber-400">Trámites Académicos</h1>
            </div>
          </div>
          
          <button 
            onClick={() => setMostrarNuevoTramite(!mostrarNuevoTramite)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <FaPlus className="w-4 h-4" />
            Nuevo Trámite
          </button>
        </div>

        {/* Resumen de Trámites */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <FaFileAlt className="text-2xl" />
              <h3 className="font-bold">Total Trámites</h3>
            </div>
            <p className="text-3xl font-bold">{resumenTramites.totalTramites}</p>
            <p className="text-red-100 text-sm">Historial completo</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaClock className="text-amber-400 text-xl" />
              <h3 className="text-amber-400 font-bold">En Proceso</h3>
            </div>
            <p className="text-3xl font-bold text-white">{resumenTramites.enProceso}</p>
            <p className="text-zinc-400 text-sm">Pendientes de entrega</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaCheckCircle className="text-amber-400 text-xl" />
              <h3 className="text-amber-400 font-bold">Completados</h3>
            </div>
            <p className="text-3xl font-bold text-white">{resumenTramites.completados}</p>
            <p className="text-zinc-400 text-sm">Listos para recojo</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaExclamationTriangle className="text-red-400 text-xl" />
              <h3 className="text-red-400 font-bold">Observados</h3>
            </div>
            <p className="text-3xl font-bold text-white">{resumenTramites.observados}</p>
            <p className="text-zinc-400 text-sm">Requieren atención</p>
          </div>
        </div>

        {/* Formulario Nuevo Trámite */}
        {mostrarNuevoTramite && (
          <div className="bg-zinc-800 rounded-xl p-6 mb-8">
            <h3 className="text-red-400 font-bold text-lg mb-4">Solicitar Nuevo Trámite</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tiposTramites.map((tramite, index) => (
                <div key={index} className="bg-zinc-900 rounded-lg p-4 hover:bg-zinc-700 transition-colors cursor-pointer border border-zinc-700 hover:border-red-400">
                  <h4 className="text-white font-bold mb-2">{tramite.nombre}</h4>
                  <div className="text-zinc-300 text-sm space-y-1">
                    <p><strong className="text-red-400">Costo:</strong> S/ {tramite.costo.toFixed(2)}</p>
                    <p><strong className="text-amber-400">Tiempo:</strong> {tramite.tiempo}</p>
                    <div>
                      <strong className="text-zinc-400">Requisitos:</strong>
                      <ul className="list-disc list-inside ml-2 mt-1">
                        {tramite.requisitos.map((req, idx) => (
                          <li key={idx} className="text-xs">{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white py-2 rounded transition-colors text-sm font-medium">
                    Solicitar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabla de Trámites */}
        <div className="bg-zinc-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FaFileAlt className="text-red-400" />
            Seguimiento de Trámites Solicitados
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-white">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="py-3 px-4 font-bold">Código</th>
                  <th className="py-3 px-4 font-bold">Tipo de Trámite</th>
                  <th className="py-3 px-4 font-bold">Descripción</th>
                  <th className="py-3 px-4 font-bold text-center">Solicitud</th>
                  <th className="py-3 px-4 font-bold text-center">Estado</th>
                  <th className="py-3 px-4 font-bold text-center">Responsable</th>
                  <th className="py-3 px-4 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tramitesData.map((tramite, index) => (
                  <tr key={index} className="border-b border-zinc-700 hover:bg-zinc-700/50 transition-colors">
                    <td className="py-4 px-4 font-mono text-sm text-amber-400">
                      {tramite.codigo}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getEstadoIcon(tramite.estado)}
                        <span className="font-medium">{tramite.tipo}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-zinc-300 text-sm max-w-xs">
                      <div className="truncate" title={tramite.descripcion}>
                        {tramite.descripcion}
                      </div>
                      {tramite.observaciones && (
                        <div className="text-amber-300 text-xs mt-1" title={tramite.observaciones}>
                          📝 {tramite.observaciones}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col">
                        <span className="font-medium">{tramite.fechaSolicitud}</span>
                        <span className="text-zinc-400 text-xs">
                          {getDiasTranscurridos(tramite.fechaSolicitud)} días atrás
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getEstadoColor(tramite.estado)}`}>
                        {tramite.estado}
                      </span>
                      {tramite.fechaEstimada && (
                        <div className="text-zinc-400 text-xs mt-1">
                          Estimado: {tramite.fechaEstimada}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-zinc-300 text-sm">
                      {tramite.responsable}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex gap-1 justify-center">
                        <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1">
                          <FaEye className="w-3 h-3" />
                          Ver
                        </button>
                        {tramite.estado === "Completado" && (
                          <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1">
                            <FaDownload className="w-3 h-3" />
                            Descargar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Información de Trámites */}
        <div className="bg-zinc-800 rounded-xl p-6">
          <h3 className="text-red-400 font-bold text-lg mb-4">Información Importante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 rounded-lg p-4">
              <h4 className="text-white font-bold mb-2">Proceso de Trámites</h4>
              <ul className="text-zinc-300 text-sm space-y-1">
                <li>• Revisa los requisitos antes de solicitar</li>
                <li>• Realiza el pago correspondiente</li>
                <li>• Presenta la documentación completa</li>
                <li>• Recibe notificación por correo electrónico</li>
                <li>• Recoge tu documento en la fecha indicada</li>
              </ul>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4">
              <h4 className="text-white font-bold mb-2">Horarios de Atención</h4>
              <ul className="text-zinc-300 text-sm space-y-1">
                <li>• <strong className="text-red-400">Lunes a Viernes:</strong> 8:00 AM - 4:00 PM</li>
                <li>• <strong className="text-amber-400">Sábados:</strong> 8:00 AM - 12:00 PM</li>
                <li>• <strong className="text-zinc-400">Recojo de documentos:</strong> Ventanilla única</li>
                <li>• <strong className="text-red-400">Urgencias:</strong> Solo con autorización</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-red-900/20 rounded-lg border-l-4 border-red-400">
            <p className="text-red-200 text-sm">
              <strong>Atención al Estudiante:</strong> Para consultas sobre el estado de tus trámites: 
              tramites@unica.edu.pe | Tel: (056) 522-415 Ext. 150 | WhatsApp: +51 956 123 456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
