"use client";

import { FaArrowLeft, FaFileAlt, FaClock, FaCheckCircle, FaExclamationTriangle, FaEye, FaDownload, FaPlus, FaFilePdf, FaFileExcel, FaPrint, FaTimes, FaCheck, FaInfoCircle, FaSearch, FaFilter, FaCalendarAlt, FaMoneyBillWave, FaClipboardList, FaBuilding } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Interfaces para el sistema de trámites
interface Tramite {
  id: number;
  codigo: string;
  tipo: string;
  descripcion: string;
  fechaSolicitud: string;
  fechaEstimada: string;
  fechaCompletado?: string;
  estado: 'COMPLETADO' | 'EN_PROCESO' | 'OBSERVADO' | 'PENDIENTE' | 'CANCELADO';
  documentos: string[];
  documentosEntregados: string[];
  observaciones?: string;
  costo: number;
  responsable: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  numeroSeguimiento: string;
  archivosAdjuntos: string[];
  requierePago: boolean;
  estadoPago?: 'PAGADO' | 'PENDIENTE' | 'EXONERADO';
}

interface TipoTramite {
  id: number;
  nombre: string;
  descripcion: string;
  costo: number;
  tiempo: string;
  requisitos: string[];
  documentosGenera: string[];
  categoria: 'ACADEMICO' | 'ADMINISTRATIVO' | 'TITULO' | 'CONSTANCIA';
  activo: boolean;
}

export default function Tramites() {
  const router = useRouter();
  const { user } = useAuth();
  const [mostrarNuevoTramite, setMostrarNuevoTramite] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modalDetalles, setModalDetalles] = useState(false);
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState<Tramite | null>(null);
  const [modalExportar, setModalExportar] = useState(false);
  const [modalVistaPrevia, setModalVistaPrevia] = useState(false);
  const [modalSolicitudTramite, setModalSolicitudTramite] = useState(false);
  const [tipoTramiteSeleccionado, setTipoTramiteSeleccionado] = useState<TipoTramite | null>(null);
  
  // Datos más realistas y completos de trámites
  const tramitesData: Tramite[] = [
    {
      id: 1,
      codigo: "TRA-2025-001",
      tipo: "Certificado de Estudios Oficial",
      descripcion: "Certificado oficial de estudios con notas y créditos para trámites externos y postulaciones",
      fechaSolicitud: "2025-01-15",
      fechaEstimada: "2025-01-25",
      estado: "EN_PROCESO",
      documentos: ["DNI", "Recibo de Pago", "Solicitud Firmada"],
      documentosEntregados: ["DNI", "Recibo de Pago"],
      observaciones: "Documento en revisión por Secretaría Académica. Falta validación de últimas calificaciones.",
      costo: 85.00,
      responsable: "Secretaría Académica",
      prioridad: "ALTA",
      numeroSeguimiento: "SEG-2025-001",
      archivosAdjuntos: ["solicitud_certificado.pdf", "comprobante_pago.pdf"],
      requierePago: true,
      estadoPago: "PAGADO"
    },
    {
      id: 2,
      codigo: "TRA-2025-002",
      tipo: "Constancia de Matrícula Vigente",
      descripcion: "Constancia que certifica la matrícula activa para el semestre académico 2025-I",
      fechaSolicitud: "2025-01-10",
      fechaEstimada: "2025-01-12",
      fechaCompletado: "2025-01-11",
      estado: "COMPLETADO",
      documentos: ["Solicitud Simple"],
      documentosEntregados: ["Solicitud Simple"],
      observaciones: "Documento emitido exitosamente. Disponible para descarga.",
      costo: 25.00,
      responsable: "Registro Académico",
      prioridad: "MEDIA",
      numeroSeguimiento: "SEG-2025-002",
      archivosAdjuntos: ["constancia_matricula.pdf"],
      requierePago: true,
      estadoPago: "PAGADO"
    },
    {
      id: 3,
      codigo: "TRA-2024-089",
      tipo: "Carta de Presentación Institucional",
      descripcion: "Carta oficial de presentación para prácticas profesionales en empresas e instituciones",
      fechaSolicitud: "2024-12-20",
      fechaEstimada: "2024-12-27",
      fechaCompletado: "2024-12-26",
      estado: "COMPLETADO",
      documentos: ["Carta de Aceptación de Empresa", "Plan de Prácticas", "Recibo de Pago"],
      documentosEntregados: ["Carta de Aceptación de Empresa", "Plan de Prácticas", "Recibo de Pago"],
      observaciones: "Carta emitida y entregada. Validez de 6 meses.",
      costo: 45.00,
      responsable: "Coordinación Académica",
      prioridad: "MEDIA",
      numeroSeguimiento: "SEG-2024-089",
      archivosAdjuntos: ["carta_presentacion.pdf", "plan_practicas.pdf"],
      requierePago: true,
      estadoPago: "PAGADO"
    },
    {
      id: 4,
      codigo: "TRA-2024-076",
      tipo: "Récord Académico Completo",
      descripcion: "Historial académico detallado con todas las asignaturas, calificaciones y créditos obtenidos",
      fechaSolicitud: "2024-11-15",
      fechaEstimada: "2024-12-01",
      estado: "OBSERVADO",
      documentos: ["DNI", "Recibo de Pago", "Solicitud Firmada"],
      documentosEntregados: ["DNI", "Solicitud Firmada"],
      observaciones: "Pendiente pago de derechos. Se requiere actualización de notas del último semestre antes de la emisión.",
      costo: 65.00,
      responsable: "Registro Académico",
      prioridad: "ALTA",
      numeroSeguimiento: "SEG-2024-076",
      archivosAdjuntos: ["solicitud_record.pdf"],
      requierePago: true,
      estadoPago: "PENDIENTE"
    },
    {
      id: 5,
      codigo: "TRA-2024-045",
      tipo: "Constancia de Egresado",
      descripcion: "Documento que certifica la culminación satisfactoria del programa de maestría",
      fechaSolicitud: "2024-10-20",
      fechaEstimada: "2024-11-05",
      fechaCompletado: "2024-11-03",
      estado: "COMPLETADO",
      documentos: ["DNI", "Constancia de No Adeudo", "Recibo de Pago"],
      documentosEntregados: ["DNI", "Constancia de No Adeudo", "Recibo de Pago"],
      observaciones: "Constancia emitida correctamente. Original disponible en Secretaría.",
      costo: 55.00,
      responsable: "Secretaría Académica",
      prioridad: "ALTA",
      numeroSeguimiento: "SEG-2024-045",
      archivosAdjuntos: ["constancia_egresado.pdf", "comprobante_pago.pdf"],
      requierePago: true,
      estadoPago: "PAGADO"
    },
    {
      id: 6,
      codigo: "TRA-2024-023",
      tipo: "Duplicado de Carnet Universitario",
      descripcion: "Reposición de carnet universitario por pérdida o deterioro",
      fechaSolicitud: "2024-09-10",
      fechaEstimada: "2024-09-20",
      fechaCompletado: "2024-09-18",
      estado: "COMPLETADO",
      documentos: ["DNI", "Denuncia Policial", "Foto", "Recibo de Pago"],
      documentosEntregados: ["DNI", "Denuncia Policial", "Foto", "Recibo de Pago"],
      observaciones: "Carnet entregado exitosamente. Válido hasta finalización de estudios.",
      costo: 35.00,
      responsable: "Servicios Académicos",
      prioridad: "BAJA",
      numeroSeguimiento: "SEG-2024-023",
      archivosAdjuntos: ["denuncia_policial.pdf", "foto_carnet.jpg"],
      requierePago: true,
      estadoPago: "PAGADO"
    },
    {
      id: 7,
      codigo: "TRA-2024-012",
      tipo: "Convalidación de Asignaturas",
      descripcion: "Proceso de convalidación de materias cursadas en otras instituciones educativas",
      fechaSolicitud: "2024-08-15",
      fechaEstimada: "2024-09-15",
      estado: "EN_PROCESO",
      documentos: ["Sílabos Originales", "Certificados de Estudios", "Recibo de Pago", "Solicitud Detallada"],
      documentosEntregados: ["Sílabos Originales", "Certificados de Estudios", "Solicitud Detallada"],
      observaciones: "En evaluación por Comisión Académica. Pendiente análisis de equivalencias curriculares.",
      costo: 120.00,
      responsable: "Comisión Académica",
      prioridad: "MEDIA",
      numeroSeguimiento: "SEG-2024-012",
      archivosAdjuntos: ["silabos_anteriores.pdf", "certificados_estudios.pdf"],
      requierePago: true,
      estadoPago: "PENDIENTE"
    },
    {
      id: 8,
      codigo: "TRA-2024-008",
      tipo: "Solicitud de Grado",
      descripcion: "Trámite para obtención del grado académico de Maestro en Administración",
      fechaSolicitud: "2024-07-20",
      fechaEstimada: "2024-10-20",
      estado: "EN_PROCESO",
      documentos: ["Tesis Aprobada", "Constancia de Inglés", "Recibo de Pago", "Fotos", "DNI"],
      documentosEntregados: ["Tesis Aprobada", "Constancia de Inglés", "Fotos", "DNI"],
      observaciones: "Expediente en revisión. Programación de sustentación pendiente.",
      costo: 850.00,
      responsable: "Escuela de Posgrado",
      prioridad: "ALTA",
      numeroSeguimiento: "SEG-2024-008",
      archivosAdjuntos: ["tesis_final.pdf", "constancia_ingles.pdf"],
      requierePago: true,
      estadoPago: "PENDIENTE"
    }
  ];

  // Tipos de trámites disponibles
  const tiposTramites: TipoTramite[] = [
    {
      id: 1,
      nombre: "Certificado de Estudios Oficial",
      descripcion: "Documento oficial que certifica los estudios realizados con notas y créditos",
      costo: 85.00,
      tiempo: "10-15 días hábiles",
      requisitos: ["DNI o CE", "Recibo de pago", "Solicitud firmada"],
      documentosGenera: ["Certificado sellado", "Copia digital"],
      categoria: "ACADEMICO",
      activo: true
    },
    {
      id: 2,
      nombre: "Constancia de Matrícula",
      descripcion: "Constancia que certifica la matrícula vigente del estudiante",
      costo: 25.00,
      tiempo: "2-3 días hábiles",
      requisitos: ["Solicitud simple"],
      documentosGenera: ["Constancia oficial"],
      categoria: "CONSTANCIA",
      activo: true
    },
    {
      id: 3,
      nombre: "Carta de Presentación",
      descripcion: "Carta institucional para prácticas o actividades profesionales",
      costo: 45.00,
      tiempo: "5-7 días hábiles",
      requisitos: ["Carta de aceptación", "Plan de actividades", "Recibo de pago"],
      documentosGenera: ["Carta membretada"],
      categoria: "ADMINISTRATIVO",
      activo: true
    },
    {
      id: 4,
      nombre: "Solicitud de Grado",
      descripcion: "Trámite completo para obtención del grado académico",
      costo: 850.00,
      tiempo: "60-90 días hábiles",
      requisitos: ["Tesis aprobada", "Constancia de idioma", "Fotos", "Recibo de pago"],
      documentosGenera: ["Diploma", "Certificados"],
      categoria: "TITULO",
      activo: true
    }
  ];

  // Funciones para manejo de datos
  const calcularResumenTramites = () => {
    const total = tramitesData.length;
    const completados = tramitesData.filter(t => t.estado === 'COMPLETADO').length;
    const enProceso = tramitesData.filter(t => t.estado === 'EN_PROCESO').length;
    const observados = tramitesData.filter(t => t.estado === 'OBSERVADO').length;
    const pendientes = tramitesData.filter(t => t.estado === 'PENDIENTE').length;
    const ultimoTramite = tramitesData.sort((a, b) => new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime())[0];
    const costoTotal = tramitesData.filter(t => t.estadoPago === 'PAGADO').reduce((sum, t) => sum + t.costo, 0);
    
    return {
      total,
      completados,
      enProceso,
      observados,
      pendientes,
      ultimoTramite: ultimoTramite?.fechaSolicitud || 'N/A',
      costoTotal
    };
  };

  const resumen = calcularResumenTramites();

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "COMPLETADO": return <FaCheckCircle className="text-amber-500" />;
      case "EN_PROCESO": return <FaClock className="text-zinc-500" />;
      case "OBSERVADO": return <FaExclamationTriangle className="text-red-500" />;
      case "PENDIENTE": return <FaClock className="text-amber-500" />;
      case "CANCELADO": return <FaTimes className="text-red-500" />;
      default: return <FaInfoCircle className="text-zinc-500" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "COMPLETADO": return "text-amber-800 bg-amber-100";
      case "EN_PROCESO": return "text-zinc-800 bg-zinc-100";
      case "OBSERVADO": return "text-red-800 bg-red-100";
      case "PENDIENTE": return "text-amber-800 bg-amber-100";
      case "CANCELADO": return "text-red-800 bg-red-100";
      default: return "text-zinc-800 bg-zinc-100";
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "ALTA": return "text-red-800 bg-red-100";
      case "MEDIA": return "text-amber-800 bg-amber-100";
      case "BAJA": return "text-zinc-800 bg-zinc-100";
      default: return "text-zinc-800 bg-zinc-100";
    }
  };

  const filtrarTramites = () => {
    let tramitesFiltrados = tramitesData;

    if (filtroEstado) {
      tramitesFiltrados = tramitesFiltrados.filter(t => t.estado === filtroEstado);
    }

    if (filtroTipo) {
      tramitesFiltrados = tramitesFiltrados.filter(t => 
        t.tipo.toLowerCase().includes(filtroTipo.toLowerCase())
      );
    }

    if (busqueda) {
      tramitesFiltrados = tramitesFiltrados.filter(t => 
        t.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.numeroSeguimiento.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    return tramitesFiltrados.sort((a, b) => new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime());
  };

  const calcularDiasTranscurridos = (fecha: string) => {
    const hoy = new Date();
    const fechaSolicitud = new Date(fecha);
    return Math.ceil((hoy.getTime() - fechaSolicitud.getTime()) / (1000 * 3600 * 24));
  };

  const abrirDetalles = (tramite: Tramite) => {
    setTramiteSeleccionado(tramite);
    setModalDetalles(true);
  };

  const verVistaPrevia = (tramite: Tramite) => {
    setTramiteSeleccionado(tramite);
    setModalVistaPrevia(true);
  };

  const generarDocumentoPDF = (tramite: Tramite) => {
    const contenidoPDF = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Documento - ${tramite.codigo}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #f59e0b; margin-bottom: 10px; }
          .university { font-size: 18px; margin-bottom: 5px; }
          .document-title { font-size: 20px; font-weight: bold; margin-top: 20px; }
          .content { margin: 30px 0; line-height: 1.6; }
          .info-section { margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🎓 ESCUELA DE POSGRADO</div>
          <div class="university">Universidad Nacional San Luis Gonzaga</div>
          <div class="document-title">${tramite.tipo.toUpperCase()}</div>
          <div>N° ${tramite.codigo}</div>
        </div>

        <div class="content">
          <div class="info-section">
            <h3>DATOS DEL TRÁMITE</h3>
            <p><strong>Código:</strong> ${tramite.codigo}</p>
            <p><strong>Tipo:</strong> ${tramite.tipo}</p>
            <p><strong>Fecha de Solicitud:</strong> ${new Date(tramite.fechaSolicitud).toLocaleDateString('es-PE')}</p>
            <p><strong>Estado:</strong> ${tramite.estado}</p>
            <p><strong>Responsable:</strong> ${tramite.responsable}</p>
          </div>

          <div class="info-section">
            <h3>DATOS DEL SOLICITANTE</h3>
            <p><strong>Nombre:</strong> ${user?.nombres || 'N/A'} ${user?.apellidos || ''}</p>
            <p><strong>Código:</strong> ${user?.codigoEstudiante || user?.id || 'N/A'}</p>
            <p><strong>Programa:</strong> Maestría en Administración</p>
          </div>

          <div class="info-section">
            <h3>DESCRIPCIÓN</h3>
            <p>${tramite.descripcion}</p>
            ${tramite.observaciones ? `<p><strong>Observaciones:</strong> ${tramite.observaciones}</p>` : ''}
          </div>
        </div>

        <div class="footer">
          <p><strong>ESCUELA DE POSGRADO - UNIVERSIDAD NACIONAL SAN LUIS GONZAGA</strong></p>
          <p>Este documento es generado automáticamente el ${new Date().toLocaleDateString('es-PE')}</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([contenidoPDF], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const nuevaVentana = window.open(url, '_blank');
    if (nuevaVentana) {
      nuevaVentana.onload = () => {
        setTimeout(() => {
          nuevaVentana.print();
        }, 500);
      };
    }
    
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const descargarDocumento = (tramite: Tramite) => {
    generarDocumentoPDF(tramite);
  };

  const exportarExcel = () => {
    const datosParaExcel = filtrarTramites().map(tramite => ({
      'Código': tramite.codigo,
      'Tipo': tramite.tipo,
      'Descripción': tramite.descripcion,
      'Fecha Solicitud': tramite.fechaSolicitud,
      'Fecha Estimada': tramite.fechaEstimada,
      'Estado': tramite.estado,
      'Costo': `S/ ${tramite.costo.toFixed(2)}`,
      'Responsable': tramite.responsable,
      'Prioridad': tramite.prioridad,
      'N° Seguimiento': tramite.numeroSeguimiento,
      'Estado Pago': tramite.estadoPago || 'N/A',
      'Observaciones': tramite.observaciones || 'N/A'
    }));

    const headers = Object.keys(datosParaExcel[0] || {});
    const csvContent = [
      headers.join(','),
      ...datosParaExcel.map(row => headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tramites-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportarPDF = () => {
    const tramitesFiltrados = filtrarTramites();
    
    const contenidoReporte = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Trámites</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; font-size: 12px; }
          .header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 10px; }
          th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
          th { background: #f59e0b; color: white; font-weight: bold; }
          tr:nth-child(even) { background: #f9fafb; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎓 ESCUELA DE POSGRADO</h1>
          <h2>REPORTE DE TRÁMITES ACADÉMICOS</h2>
          <p>Generado el: ${new Date().toLocaleDateString('es-PE')}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Costo</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
            ${tramitesFiltrados.map(tramite => `
              <tr>
                <td>${tramite.codigo}</td>
                <td>${tramite.tipo}</td>
                <td>${new Date(tramite.fechaSolicitud).toLocaleDateString('es-PE')}</td>
                <td>${tramite.estado}</td>
                <td>S/ ${tramite.costo.toFixed(2)}</td>
                <td>${tramite.responsable}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([contenidoReporte], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const nuevaVentana = window.open(url, '_blank');
    if (nuevaVentana) {
      nuevaVentana.onload = () => {
        setTimeout(() => {
          nuevaVentana.print();
        }, 500);
      };
    }
    
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const iniciarSolicitudTramite = (tipoTramite: TipoTramite) => {
    setTipoTramiteSeleccionado(tipoTramite);
    setModalSolicitudTramite(true);
    setMostrarNuevoTramite(false);
  };

  const confirmarSolicitudTramite = () => {
    if (tipoTramiteSeleccionado) {
      // Aquí podrías hacer una llamada al backend para crear el trámite
      // Por ahora mostramos un mensaje de éxito
      alert(`¡Solicitud de ${tipoTramiteSeleccionado.nombre} iniciada con éxito!\n\nSe ha generado un código de seguimiento. Diríjase a Mesa de Partes con los documentos requeridos para completar el proceso.`);
      
      setModalSolicitudTramite(false);
      setTipoTramiteSeleccionado(null);
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
              <FaFileAlt className="text-amber-500 text-4xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Trámites Académicos</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Sistema integral para la gestión y seguimiento de trámites académicos y administrativos. 
              Solicita documentos, realiza seguimiento en tiempo real y descarga tus documentos oficiales.
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg">
              <FaClipboardList className="text-sm" />
              <span className="text-sm font-medium">Gestión Documental Digital</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button 
              onClick={() => setMostrarNuevoTramite(!mostrarNuevoTramite)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <FaPlus className="w-4 h-4" />
              Nuevo Trámite
            </button>
          </div>
        </div>

        {/* Resumen de Trámites */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-amber-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaFileAlt className="text-3xl" />
              <h3 className="font-bold text-lg">Total Trámites</h3>
            </div>
            <p className="text-3xl font-bold mb-2">{resumen.total}</p>
            <p className="text-amber-100 text-sm">Historial completo</p>
          </div>

          <div className="bg-zinc-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaClock className="text-3xl" />
              <h3 className="font-bold text-lg">En Proceso</h3>
            </div>
            <p className="text-3xl font-bold mb-2">{resumen.enProceso}</p>
            <p className="text-zinc-200 text-sm">Pendientes</p>
          </div>

          <div className="bg-amber-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaCheckCircle className="text-3xl" />
              <h3 className="font-bold text-lg">Completados</h3>
            </div>
            <p className="text-3xl font-bold mb-2">{resumen.completados}</p>
            <p className="text-amber-100 text-sm">Finalizados</p>
          </div>

          <div className="bg-red-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaMoneyBillWave className="text-3xl" />
              <h3 className="font-bold text-lg">Costo Total</h3>
            </div>
            <p className="text-3xl font-bold mb-2">S/ {resumen.costoTotal.toFixed(2)}</p>
            <p className="text-red-100 text-sm">Pagos realizados</p>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaClipboardList className="text-amber-500" />
              Seguimiento de Trámites
            </h2>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={exportarPDF}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                title="Generar reporte completo en PDF"
              >
                <FaFilePdf /> Reporte PDF
              </button>
              <button 
                onClick={exportarExcel}
                className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                title="Exportar datos a Excel/CSV"
              >
                <FaFileExcel /> Excel
              </button>
              <button 
                onClick={() => setModalExportar(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                title="Más opciones de exportación"
              >
                <FaFilter /> Opciones
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar trámites..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
              />
            </div>
            <select 
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            >
              <option value="">Todos los estados</option>
              <option value="COMPLETADO">Completado</option>
              <option value="EN_PROCESO">En Proceso</option>
              <option value="OBSERVADO">Observado</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
            <select 
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            >
              <option value="">Todos los tipos</option>
              <option value="Certificado">Certificado</option>
              <option value="Constancia">Constancia</option>
              <option value="Carta">Carta</option>
              <option value="Grado">Grado</option>
              <option value="Duplicado">Duplicado</option>
            </select>
          </div>
        </div>
        
        {/* Tabla de Trámites */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-800">
              <thead>
                <tr className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                  <th className="py-4 px-4 font-bold">Código</th>
                  <th className="py-4 px-4 font-bold">Tipo de Trámite</th>
                  <th className="py-4 px-4 font-bold">Fecha Solicitud</th>
                  <th className="py-4 px-4 font-bold text-center">Estado</th>
                  <th className="py-4 px-4 font-bold text-center">Prioridad</th>
                  <th className="py-4 px-4 font-bold text-center">Costo</th>
                  <th className="py-4 px-4 font-bold text-center">Responsable</th>
                  <th className="py-4 px-4 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrarTramites().map((tramite) => (
                  <tr key={tramite.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FaFileAlt className="text-amber-500" />
                        <div>
                          <span className="font-medium block">{tramite.codigo}</span>
                          <span className="text-xs text-gray-500">{tramite.numeroSeguimiento}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-800">{tramite.tipo}</span>
                      <br />
                      <span className="text-xs text-gray-500 max-w-xs truncate block">
                        {tramite.descripcion}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-amber-500" />
                        <div>
                          <span className="font-medium block">{new Date(tramite.fechaSolicitud).toLocaleDateString('es-PE')}</span>
                          <span className="text-xs text-gray-500">
                            {calcularDiasTranscurridos(tramite.fechaSolicitud)} días
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getEstadoIcon(tramite.estado)}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getEstadoColor(tramite.estado)}`}>
                          {tramite.estado}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPrioridadColor(tramite.prioridad)}`}>
                        {tramite.prioridad}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-lg text-amber-600">
                          S/ {tramite.costo.toFixed(2)}
                        </span>
                        {tramite.estadoPago && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            tramite.estadoPago === 'PAGADO' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {tramite.estadoPago}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FaBuilding className="text-zinc-500" />
                        <span className="text-xs text-gray-600 max-w-20 truncate">
                          {tramite.responsable}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex gap-1 justify-center flex-wrap">
                        <button 
                          onClick={() => verVistaPrevia(tramite)}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded text-xs transition-colors flex items-center gap-1"
                          title="Vista previa del documento"
                        >
                          <FaEye className="w-3 h-3" />
                          Vista
                        </button>
                        <button 
                          onClick={() => descargarDocumento(tramite)}
                          className="bg-zinc-600 hover:bg-zinc-700 text-white px-2 py-1 rounded text-xs transition-colors flex items-center gap-1"
                          title="Descargar documento PDF"
                        >
                          <FaDownload className="w-3 h-3" />
                          PDF
                        </button>
                        <button 
                          onClick={() => abrirDetalles(tramite)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors flex items-center gap-1"
                          title="Ver detalles completos"
                        >
                          <FaInfoCircle className="w-3 h-3" />
                          Info
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filtrarTramites().length === 0 && (
              <div className="text-center py-8">
                <FaExclamationTriangle className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron trámites con los filtros aplicados</p>
              </div>
            )}
          </div>
        </div>

        {/* Información Adicional */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-amber-600 font-bold text-lg mb-4">Información de Trámites</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-gray-800 font-bold mb-2">Documentos Requeridos</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• <span className="text-amber-600">DNI o CE:</span> Documento de identidad vigente</li>
                <li>• <span className="text-amber-600">Recibo de Pago:</span> Comprobante de cancelación</li>
                <li>• <span className="text-amber-600">Solicitud:</span> Formato institucional firmado</li>
                <li>• <span className="text-amber-600">Fotos:</span> Tamaño carnet fondo blanco</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-gray-800 font-bold mb-2">Soporte y Consultas</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• <span className="text-amber-600">Mesa de Partes:</span> mesapartes@posgrado.unica.edu.pe</li>
                <li>• <span className="text-amber-600">Teléfono:</span> (056) 456-7890 Anexo 200</li>
                <li>• <span className="text-amber-600">WhatsApp:</span> +51 987-654-321</li>
                <li>• <span className="text-amber-600">Horario:</span> Lunes a Viernes 8:00-16:00</li>
                <li>• <span className="text-amber-600">Ubicación:</span> Mesa de Partes - Planta Baja</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-amber-600 mt-1" />
              <div>
                <p className="text-amber-700 text-sm">
                  <strong>Importante:</strong> Los tiempos de entrega pueden variar según la complejidad del trámite 
                  y la época del año académico. Para seguimiento detallado, utilice el número de seguimiento 
                  proporcionado o consulte en Mesa de Partes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Detalles del Trámite */}
        {modalDetalles && tramiteSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header del Modal */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <FaFileAlt className="text-amber-500" />
                      Detalles del Trámite
                    </h3>
                    <p className="text-gray-600">Información completa del trámite {tramiteSeleccionado.codigo}</p>
                  </div>
                  <button 
                    onClick={() => setModalDetalles(false)}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                {/* Contenido del Modal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Información General */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <FaInfoCircle className="text-amber-500" />
                      Información General
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Código:</span>
                        <span className="text-amber-600 font-bold">{tramiteSeleccionado.codigo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Tipo:</span>
                        <span>{tramiteSeleccionado.tipo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Estado:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getEstadoColor(tramiteSeleccionado.estado)}`}>
                          {tramiteSeleccionado.estado}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Prioridad:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPrioridadColor(tramiteSeleccionado.prioridad)}`}>
                          {tramiteSeleccionado.prioridad}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Responsable:</span>
                        <span>{tramiteSeleccionado.responsable}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">N° Seguimiento:</span>
                        <span className="text-amber-600 font-mono">{tramiteSeleccionado.numeroSeguimiento}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fechas y Costos */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <FaCalendarAlt className="text-amber-500" />
                      Fechas y Costos
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Fecha Solicitud:</span>
                        <span>{new Date(tramiteSeleccionado.fechaSolicitud).toLocaleDateString('es-PE')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Fecha Estimada:</span>
                        <span>{new Date(tramiteSeleccionado.fechaEstimada).toLocaleDateString('es-PE')}</span>
                      </div>
                      {tramiteSeleccionado.fechaCompletado && (
                        <div className="flex justify-between">
                          <span className="font-medium">Fecha Completado:</span>
                          <span className="text-amber-600 font-bold">
                            {new Date(tramiteSeleccionado.fechaCompletado).toLocaleDateString('es-PE')}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="font-medium">Costo:</span>
                        <span className="text-amber-600 font-bold text-lg">S/ {tramiteSeleccionado.costo.toFixed(2)}</span>
                      </div>
                      {tramiteSeleccionado.estadoPago && (
                        <div className="flex justify-between">
                          <span className="font-medium">Estado Pago:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            tramiteSeleccionado.estadoPago === 'PAGADO' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {tramiteSeleccionado.estadoPago}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3">Descripción</h4>
                    <p className="text-gray-700 text-sm">{tramiteSeleccionado.descripcion}</p>
                  </div>

                  {/* Documentos Requeridos */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <FaClipboardList className="text-amber-500" />
                      Documentos Requeridos
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {tramiteSeleccionado.documentos.map((doc, index) => (
                        <li key={index} className="flex items-center gap-2">
                          {tramiteSeleccionado.documentosEntregados.includes(doc) ? (
                            <FaCheck className="text-amber-500" />
                          ) : (
                            <FaTimes className="text-red-500" />
                          )}
                          <span className={tramiteSeleccionado.documentosEntregados.includes(doc) ? 'text-amber-700' : 'text-gray-700'}>
                            {doc}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Archivos Adjuntos */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <FaFileAlt className="text-amber-500" />
                      Archivos Adjuntos
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {tramiteSeleccionado.archivosAdjuntos.map((archivo, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <FaFilePdf className="text-red-500" />
                          <span className="text-gray-700">{archivo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Observaciones */}
                  {tramiteSeleccionado.observaciones && (
                    <div className="lg:col-span-2 bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4">
                      <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                        <FaExclamationTriangle className="text-amber-500" />
                        Observaciones
                      </h4>
                      <p className="text-amber-700 text-sm">{tramiteSeleccionado.observaciones}</p>
                    </div>
                  )}
                </div>

                {/* Acciones del Modal */}
                <div className="mt-6 flex gap-3 justify-end">
                  <button 
                    onClick={() => verVistaPrevia(tramiteSeleccionado)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaEye /> Vista Previa
                  </button>
                  <button 
                    onClick={() => descargarDocumento(tramiteSeleccionado)}
                    className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaDownload /> Descargar PDF
                  </button>
                  <button 
                    onClick={() => setModalDetalles(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Vista Previa */}
        {modalVistaPrevia && tramiteSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FaEye className="text-amber-500" />
                    Vista Previa - {tramiteSeleccionado.codigo}
                  </h3>
                  <button 
                    onClick={() => setModalVistaPrevia(false)}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                {/* Vista previa del documento */}
                <div className="bg-gray-50 rounded-lg p-8 min-h-96 border-2 border-dashed border-gray-300">
                  <div className="text-center mb-6">
                    <div className="text-amber-600 text-2xl font-bold mb-2">🎓 ESCUELA DE POSGRADO</div>
                    <div className="text-lg text-gray-700 mb-2">Universidad Nacional San Luis Gonzaga</div>
                    <div className="text-xl font-bold text-gray-800 mb-4">{tramiteSeleccionado.tipo.toUpperCase()}</div>
                    <div className="text-gray-600">N° {tramiteSeleccionado.codigo}</div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="font-bold text-gray-700">Código:</span>
                        <span className="ml-2">{tramiteSeleccionado.codigo}</span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-700">Fecha:</span>
                        <span className="ml-2">{new Date(tramiteSeleccionado.fechaSolicitud).toLocaleDateString('es-PE')}</span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-700">Estado:</span>
                        <span className="ml-2">{tramiteSeleccionado.estado}</span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-700">Responsable:</span>
                        <span className="ml-2">{tramiteSeleccionado.responsable}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="font-bold text-gray-700 mb-2">Solicitante:</div>
                      <div>{user?.nombres || 'N/A'} {user?.apellidos || ''}</div>
                      <div>Código: {user?.codigoEstudiante || user?.id || 'N/A'}</div>
                      <div>Programa: Maestría en Administración</div>
                    </div>

                    <div className="mb-4">
                      <div className="font-bold text-gray-700 mb-2">Descripción:</div>
                      <div className="text-gray-600">{tramiteSeleccionado.descripcion}</div>
                    </div>

                    {tramiteSeleccionado.observaciones && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="font-bold text-amber-800 mb-1">Observaciones:</div>
                        <div className="text-amber-700 text-sm">{tramiteSeleccionado.observaciones}</div>
                      </div>
                    )}
                  </div>

                  <div className="text-center mt-6 text-gray-500 text-sm">
                    <div className="font-bold">ESCUELA DE POSGRADO - UNIVERSIDAD NACIONAL SAN LUIS GONZAGA</div>
                    <div>Documento generado el {new Date().toLocaleDateString('es-PE')}</div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 justify-end">
                  <button 
                    onClick={() => descargarDocumento(tramiteSeleccionado)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaDownload /> Descargar PDF
                  </button>
                  <button 
                    onClick={() => setModalVistaPrevia(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Opciones de Exportación */}
        {modalExportar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FaFilter className="text-amber-500" />
                    Opciones de Exportación
                  </h3>
                  <button 
                    onClick={() => setModalExportar(false)}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      exportarPDF();
                      setModalExportar(false);
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <FaFilePdf className="text-xl" />
                    <div className="text-left">
                      <div className="font-bold">Reporte Completo PDF</div>
                      <div className="text-sm opacity-90">Generar reporte con todos los trámites</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      exportarExcel();
                      setModalExportar(false);
                    }}
                    className="w-full bg-zinc-600 hover:bg-zinc-700 text-white p-4 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <FaFileExcel className="text-xl" />
                    <div className="text-left">
                      <div className="font-bold">Exportar a Excel/CSV</div>
                      <div className="text-sm opacity-90">Datos en formato de hoja de cálculo</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      window.print();
                      setModalExportar(false);
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <FaPrint className="text-xl" />
                    <div className="text-left">
                      <div className="font-bold">Imprimir Página</div>
                      <div className="text-sm opacity-90">Imprimir vista actual</div>
                    </div>
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <button 
                    onClick={() => setModalExportar(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Nuevo Trámite */}
        {mostrarNuevoTramite && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FaPlus className="text-amber-500" />
                    Solicitar Nuevo Trámite
                  </h3>
                  <button 
                    onClick={() => setMostrarNuevoTramite(false)}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tiposTramites.filter(tipo => tipo.activo).map((tipo) => (
                    <div key={tipo.id} className="border border-gray-200 rounded-lg p-4 hover:border-amber-500 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="bg-amber-100 p-2 rounded-lg">
                          <FaFileAlt className="text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{tipo.nombre}</h4>
                          <p className="text-gray-600 text-sm mt-1">{tipo.descripcion}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Costo:</span>
                          <span className="font-bold text-amber-600">S/ {tipo.costo.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tiempo:</span>
                          <span className="font-medium">{tipo.tiempo}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="text-xs text-gray-500 mb-1">Requisitos:</div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {tipo.requisitos.slice(0, 3).map((req, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <FaCheck className="text-amber-500 w-2 h-2" />
                              {req}
                            </li>
                          ))}
                          {tipo.requisitos.length > 3 && (
                            <li className="text-amber-600">+{tipo.requisitos.length - 3} más...</li>
                          )}
                        </ul>
                      </div>

                      <button 
                        onClick={() => iniciarSolicitudTramite(tipo)}
                        className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        Solicitar Trámite
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-amber-600 mt-1" />
                    <div className="text-amber-700 text-sm">
                      <strong>Importante:</strong> Para iniciar un nuevo trámite, debe dirigirse a Mesa de Partes 
                      con todos los documentos requeridos. Los trámites en línea estarán disponibles próximamente.
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button 
                    onClick={() => setMostrarNuevoTramite(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmación de Solicitud */}
        {modalSolicitudTramite && tipoTramiteSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FaFileAlt className="text-amber-500" />
                    Confirmar Solicitud de Trámite
                  </h3>
                  <button 
                    onClick={() => setModalSolicitudTramite(false)}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <FaFileAlt className="text-amber-600 text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-lg mb-2">
                        {tipoTramiteSeleccionado.nombre}
                      </h4>
                      <p className="text-gray-700 mb-3">
                        {tipoTramiteSeleccionado.descripcion}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="font-bold text-amber-700">Costo:</span>
                          <span className="ml-2 text-amber-600 font-bold text-lg">
                            S/ {tipoTramiteSeleccionado.costo.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-amber-700">Tiempo:</span>
                          <span className="ml-2 text-gray-700">{tipoTramiteSeleccionado.tiempo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FaClipboardList className="text-amber-500" />
                    Documentos Requeridos
                  </h5>
                  <ul className="space-y-2">
                    {tipoTramiteSeleccionado.requisitos.map((req, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm">
                        <FaCheck className="text-amber-500" />
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h5 className="font-bold text-gray-800 mb-3">Documentos que Recibirá</h5>
                  <ul className="space-y-1">
                    {tipoTramiteSeleccionado.documentosGenera.map((doc, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <FaFilePdf className="text-red-500" />
                        <span className="text-gray-700">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-red-600 mt-1" />
                    <div className="text-red-700 text-sm">
                      <strong>Importante:</strong> Para completar este trámite deberá:
                      <ul className="mt-2 ml-4 space-y-1">
                        <li>• Dirigirse a Mesa de Partes con todos los documentos</li>
                        <li>• Realizar el pago correspondiente de S/ {tipoTramiteSeleccionado.costo.toFixed(2)}</li>
                        <li>• Tiempo estimado de entrega: {tipoTramiteSeleccionado.tiempo}</li>
                        <li>• Se generará un código de seguimiento para consultas</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => setModalSolicitudTramite(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={confirmarSolicitudTramite}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
                  >
                    <FaPlus /> Confirmar Solicitud
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
