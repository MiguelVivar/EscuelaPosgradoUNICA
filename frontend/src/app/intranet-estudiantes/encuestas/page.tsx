"use client";

import { FaArrowLeft, FaClipboardList, FaUser, FaStar, FaClock, FaCheckCircle, FaExclamationCircle, FaChartBar, FaPlay, FaEye, FaTimes, FaCheck, FaInfoCircle, FaDownload, FaFilePdf, FaFileExcel, FaPrint, FaFilter, FaSearch, FaCalendarAlt, FaThumbsUp, FaComment, FaQuestionCircle, FaAward, FaBolt, FaGift } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Interfaces para el sistema de encuestas
interface EncuestaDisponible {
  id: string;
  titulo: string;
  tipo: 'Evaluacion Docente' | 'Servicios' | 'Infraestructura' | 'Procesos' | 'Satisfaccion';
  descripcion: string;
  fechaInicio: string;
  fechaCierre: string;
  duracion: string;
  progreso: number;
  estado: 'Disponible' | 'En Curso' | 'Vencida';
  docentes?: string[];
  servicios?: string[];
  obligatoria: boolean;
  puntos: number;
  preguntas: number;
  categoria: 'ACADEMICO' | 'ADMINISTRATIVO' | 'SERVICIOS';
}

interface EncuestaCompletada {
  id: string;
  titulo: string;
  tipo: string;
  fechaCompletada: string;
  calificacionPromedio: number;
  tiempoEmpleado: string;
  comentarios: string;
  puntos: number;
  respuestasDetalladas: any[];
  certificadoDisponible: boolean;
}

interface PreguntaEncuesta {
  id: number;
  texto: string;
  tipo: 'escala' | 'multiple' | 'texto' | 'si_no';
  obligatoria: boolean;
  opciones?: string[];
  categoria?: string;
}

export default function Encuestas() {
  const router = useRouter();
  const { user } = useAuth();
  const [encuestaEnCurso, setEncuestaEnCurso] = useState<EncuestaDisponible | null>(null);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<{[key: number]: any}>({});
  const [modalRespuestas, setModalRespuestas] = useState(false);
  const [encuestaSeleccionada, setEncuestaSeleccionada] = useState<EncuestaCompletada | null>(null);
  const [modalExportar, setModalExportar] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [modalEncuestaCompleta, setModalEncuestaCompleta] = useState(false);
  const [puntosPorCompletar, setPuntosPorCompletar] = useState(0);

  // Datos más realistas y completos de encuestas disponibles
  const encuestasDisponibles: EncuestaDisponible[] = [
    {
      id: "ENC-2025-01",
      titulo: "Evaluación Docente - Semestre 2025-I",
      tipo: "Evaluacion Docente",
      descripcion: "Evalúa el desempeño académico, metodología de enseñanza y calidad pedagógica de tus docentes del semestre actual",
      fechaInicio: "2025-01-20",
      fechaCierre: "2025-02-15", 
      duracion: "15-20 minutos",
      progreso: 0,
      estado: "Disponible",
      docentes: ["Dr. García López - Metodología de Investigación", "Mg. Rodríguez Silva - Estadística Aplicada", "Dr. Martínez Ruiz - Gestión Empresarial"],
      obligatoria: true,
      puntos: 50,
      preguntas: 25,
      categoria: "ACADEMICO"
    },
    {
      id: "ENC-2025-02",
      titulo: "Satisfacción de Servicios Académicos",
      tipo: "Servicios",
      descripcion: "Evalúa la calidad de biblioteca, laboratorios, servicios estudiantiles y recursos tecnológicos disponibles",
      fechaInicio: "2025-01-15",
      fechaCierre: "2025-03-01",
      duracion: "10-12 minutos", 
      progreso: 0,
      estado: "Disponible",
      servicios: ["Biblioteca Central", "Laboratorio de Cómputo", "Registro Académico", "Bienestar Estudiantil", "Mesa de Partes"],
      obligatoria: false,
      puntos: 30,
      preguntas: 18,
      categoria: "SERVICIOS"
    },
    {
      id: "ENC-2025-03",
      titulo: "Evaluación de Infraestructura y Equipamiento",
      tipo: "Infraestructura",
      descripcion: "Opina sobre las condiciones de aulas, equipos audiovisuales, conectividad y espacios de estudio",
      fechaInicio: "2025-01-10",
      fechaCierre: "2025-02-28",
      duracion: "8-10 minutos",
      progreso: 0,
      estado: "Disponible", 
      obligatoria: false,
      puntos: 40,
      preguntas: 15,
      categoria: "SERVICIOS"
    },
    {
      id: "ENC-2025-04",
      titulo: "Proceso de Matrícula 2025-I",
      tipo: "Procesos",
      descripcion: "Evalúa la eficiencia, claridad y satisfacción general del proceso de matrícula del semestre actual",
      fechaInicio: "2025-01-05",
      fechaCierre: "2025-01-30",
      duracion: "5-8 minutos",
      progreso: 0,
      estado: "Disponible",
      obligatoria: true,
      puntos: 25,
      preguntas: 12,
      categoria: "ADMINISTRATIVO"
    }
  ];

  // Historial de encuestas completadas
  const encuestasCompletadas: EncuestaCompletada[] = [
    {
      id: "ENC-2024-08",
      titulo: "Evaluación Docente - Semestre 2024-II",
      tipo: "Evaluación Docente",
      fechaCompletada: "2024-12-10",
      calificacionPromedio: 4.2,
      tiempoEmpleado: "18 minutos",
      comentarios: "Excelente calidad docente en general. Sugerencias implementadas para metodología práctica.",
      puntos: 50,
      respuestasDetalladas: [],
      certificadoDisponible: true
    },
    {
      id: "ENC-2024-06", 
      titulo: "Calidad de Infraestructura Académica",
      tipo: "Infraestructura",
      fechaCompletada: "2024-10-15",
      calificacionPromedio: 3.8,
      tiempoEmpleado: "12 minutos",
      comentarios: "Infraestructura adecuada pero requiere mejoras en conectividad y equipos audiovisuales.",
      puntos: 40,
      respuestasDetalladas: [],
      certificadoDisponible: true
    },
    {
      id: "ENC-2024-03",
      titulo: "Proceso de Matrícula 2024-II",
      tipo: "Procesos",
      fechaCompletada: "2024-08-20",
      calificacionPromedio: 4.5,
      tiempoEmpleado: "8 minutos",
      comentarios: "Proceso digital muy eficiente. Plataforma intuitiva y soporte técnico excelente.",
      puntos: 25,
      respuestasDetalladas: [],
      certificadoDisponible: true
    },
    {
      id: "ENC-2024-01",
      titulo: "Satisfacción General Servicios Estudiantiles",
      tipo: "Servicios",
      fechaCompletada: "2024-06-18",
      calificacionPromedio: 4.0,
      tiempoEmpleado: "15 minutos",
      comentarios: "Servicios bien organizados. Biblioteca y laboratorios con horarios convenientes.",
      puntos: 30,
      respuestasDetalladas: [],
      certificadoDisponible: false
    }
  ];

  // Estadísticas del usuario
  const estadisticasEncuestas = {
    encuestasCompletadas: encuestasCompletadas.length,
    encuestasPendientes: encuestasDisponibles.filter(e => e.obligatoria).length,
    puntosAcumulados: encuestasCompletadas.reduce((sum, e) => sum + e.puntos, 0),
    promedioCalificacion: encuestasCompletadas.reduce((sum, e) => sum + e.calificacionPromedio, 0) / encuestasCompletadas.length,
    tiempoPromedioRespuesta: "13 minutos",
    participacionGeneral: "92%",
    certificadosDisponibles: encuestasCompletadas.filter(e => e.certificadoDisponible).length
  };

  // Preguntas de ejemplo para encuestas
  const preguntasEvaluacionDocente: PreguntaEncuesta[] = [
    {
      id: 1,
      texto: "¿Cómo califica la claridad en la explicación de los contenidos del docente?",
      tipo: "escala",
      obligatoria: true,
      categoria: "Metodología"
    },
    {
      id: 2,
      texto: "¿El docente fomenta la participación activa de los estudiantes?",
      tipo: "escala", 
      obligatoria: true,
      categoria: "Participación"
    },
    {
      id: 3,
      texto: "¿Los recursos didácticos utilizados son apropiados para el aprendizaje?",
      tipo: "escala",
      obligatoria: true,
      categoria: "Recursos"
    },
    {
      id: 4,
      texto: "¿Qué aspectos considera que el docente debería mejorar?",
      tipo: "texto",
      obligatoria: false,
      categoria: "Mejoras"
    }
  ];

  const preguntasServicios: PreguntaEncuesta[] = [
    {
      id: 1,
      texto: "¿Cómo califica la atención recibida en la biblioteca?",
      tipo: "escala",
      obligatoria: true,
      categoria: "Biblioteca"
    },
    {
      id: 2,
      texto: "¿Los horarios de atención de los servicios son convenientes?",
      tipo: "si_no",
      obligatoria: true,
      categoria: "Horarios"
    },
    {
      id: 3,
      texto: "¿Qué servicio considera que necesita mayor atención?",
      tipo: "multiple",
      obligatoria: true,
      opciones: ["Biblioteca", "Laboratorios", "Registro", "Bienestar", "Mesa de Partes"],
      categoria: "Prioridades"
    }
  ];

  // Funciones auxiliares
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Disponible": return "text-amber-800 bg-amber-100";
      case "En Curso": return "text-zinc-800 bg-zinc-100";  
      case "Vencida": return "text-red-800 bg-red-100";
      default: return "text-gray-800 bg-gray-100";
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Evaluacion Docente": return <FaUser className="text-amber-500" />;
      case "Servicios": return <FaClipboardList className="text-zinc-600" />;
      case "Infraestructura": return <FaChartBar className="text-zinc-600" />;
      case "Procesos": return <FaClock className="text-red-500" />;
      default: return <FaClipboardList className="text-zinc-600" />;
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
        estrellas.push(<FaStar key={i} className="text-amber-500" />);
      } else if (i - 0.5 <= calificacionRedondeada) {
        estrellas.push(<FaStar key={i} className="text-amber-300" />);
      } else {
        estrellas.push(<FaStar key={i} className="text-gray-300" />);
      }
    }
    return estrellas;
  };

  const filtrarEncuestasCompletadas = () => {
    let filtradas = encuestasCompletadas;

    if (busqueda) {
      filtradas = filtradas.filter(e => 
        e.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.id.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (filtroTipo) {
      filtradas = filtradas.filter(e => e.tipo.toLowerCase().includes(filtroTipo.toLowerCase()));
    }

    return filtradas.sort((a, b) => new Date(b.fechaCompletada).getTime() - new Date(a.fechaCompletada).getTime());
  };

  // Funciones de acciones
  const iniciarEncuesta = (encuesta: EncuestaDisponible) => {
    setEncuestaEnCurso(encuesta);
    setPreguntaActual(0);
    setRespuestas({});
  };

  const responderPregunta = (respuesta: any) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaActual]: respuesta
    }));
  };

  const siguientePregunta = () => {
    if (encuestaEnCurso) {
      const totalPreguntas = encuestaEnCurso.preguntas || 4;
      if (preguntaActual < totalPreguntas - 1) {
        setPreguntaActual(prev => prev + 1);
      } else {
        // Encuesta completada
        completarEncuesta();
      }
    }
  };

  const preguntaAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(prev => prev - 1);
    }
  };

  const completarEncuesta = () => {
    if (encuestaEnCurso) {
      setPuntosPorCompletar(encuestaEnCurso.puntos);
      setModalEncuestaCompleta(true);
      setEncuestaEnCurso(null);
      setPreguntaActual(0);
      setRespuestas({});
    }
  };

  const verRespuestas = (encuesta: EncuestaCompletada) => {
    setEncuestaSeleccionada(encuesta);
    setModalRespuestas(true);
  };

  const generarCertificadoPDF = (encuesta: EncuestaCompletada) => {
    const contenidoCertificado = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificado de Participación - ${encuesta.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; text-align: center; }
          .certificado { border: 8px solid #f59e0b; padding: 40px; margin: 20px auto; max-width: 600px; }
          .header { font-size: 28px; font-weight: bold; color: #f59e0b; margin-bottom: 20px; }
          .titulo { font-size: 24px; font-weight: bold; margin: 20px 0; color: #1f2937; }
          .contenido { font-size: 16px; line-height: 1.8; margin: 30px 0; }
          .firma { margin-top: 60px; font-size: 14px; }
          .sello { margin: 20px 0; font-size: 18px; color: #f59e0b; }
        </style>
      </head>
      <body>
        <div class="certificado">
          <div class="header">🎓 ESCUELA DE POSGRADO</div>
          <div style="font-size: 18px; margin-bottom: 30px;">Universidad Nacional San Luis Gonzaga</div>
          
          <div class="titulo">CERTIFICADO DE PARTICIPACIÓN</div>
          
          <div class="contenido">
            <p>Se otorga el presente certificado a:</p>
            <p style="font-size: 20px; font-weight: bold; color: #f59e0b;">${user?.nombres || 'ESTUDIANTE'} ${user?.apellidos || ''}</p>
            <p>Por su participación en la encuesta:</p>
            <p style="font-size: 18px; font-weight: bold;">"${encuesta.titulo}"</p>
            <p>Completada el ${new Date(encuesta.fechaCompletada).toLocaleDateString('es-PE')}</p>
            <p>Tiempo empleado: ${encuesta.tiempoEmpleado}</p>
            <p>Puntos obtenidos: <strong>${encuesta.puntos}</strong></p>
          </div>

          <div class="sello">⭐ EXCELENCIA ACADÉMICA ⭐</div>
          
          <div class="firma">
            <p>______________________</p>
            <p><strong>Dr. Director de Escuela</strong></p>
            <p>Escuela de Posgrado</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([contenidoCertificado], { type: 'text/html' });
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

  const exportarRespuestasExcel = () => {
    const datosParaExcel = filtrarEncuestasCompletadas().map(encuesta => ({
      'ID': encuesta.id,
      'Título': encuesta.titulo,
      'Tipo': encuesta.tipo,
      'Fecha Completada': encuesta.fechaCompletada,
      'Calificación': encuesta.calificacionPromedio.toFixed(1),
      'Tiempo Empleado': encuesta.tiempoEmpleado,
      'Puntos Obtenidos': encuesta.puntos,
      'Comentarios': encuesta.comentarios || 'Sin comentarios',
      'Certificado': encuesta.certificadoDisponible ? 'Disponible' : 'No disponible'
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
    link.setAttribute('download', `encuestas-completadas-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportarReportePDF = () => {
    const encuestasFiltradas = filtrarEncuestasCompletadas();
    
    const contenidoReporte = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Encuestas</title>
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
          <h2>REPORTE DE ENCUESTAS COMPLETADAS</h2>
          <p>Estudiante: ${user?.nombres || 'N/A'} ${user?.apellidos || ''}</p>
          <p>Generado el: ${new Date().toLocaleDateString('es-PE')}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Encuesta</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Calificación</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            ${encuestasFiltradas.map(encuesta => `
              <tr>
                <td>${encuesta.id}</td>
                <td>${encuesta.titulo}</td>
                <td>${encuesta.tipo}</td>
                <td>${new Date(encuesta.fechaCompletada).toLocaleDateString('es-PE')}</td>
                <td>${encuesta.calificacionPromedio.toFixed(1)}/5.0</td>
                <td>+${encuesta.puntos}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <h3>Resumen Estadístico</h3>
          <p><strong>Total Encuestas:</strong> ${estadisticasEncuestas.encuestasCompletadas}</p>
          <p><strong>Puntos Acumulados:</strong> ${estadisticasEncuestas.puntosAcumulados}</p>
          <p><strong>Promedio Calificación:</strong> ${estadisticasEncuestas.promedioCalificacion.toFixed(1)}/5.0</p>
          <p><strong>Participación:</strong> ${estadisticasEncuestas.participacionGeneral}</p>
        </div>
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
              <FaClipboardList className="text-amber-500 text-4xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Encuestas y Evaluaciones</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Sistema integral para la gestión de encuestas académicas y evaluación de servicios. 
              Participa en las evaluaciones docentes, servicios estudiantiles y contribuye a la mejora continua 
              de la calidad educativa de nuestra institución.
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg">
              <FaAward className="text-sm" />
              <span className="text-sm font-medium">Sistema de Evaluación Continua</span>
            </div>
          </div>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-amber-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaClipboardList className="text-3xl" />
              <h3 className="font-bold text-lg">Completadas</h3>
            </div>
            <p className="text-3xl font-bold mb-2">{estadisticasEncuestas.encuestasCompletadas}</p>
            <p className="text-amber-100 text-sm">Encuestas finalizadas</p>
          </div>

          <div className="bg-zinc-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationCircle className="text-3xl" />
              <h3 className="font-bold text-lg">Pendientes</h3>
            </div>
            <p className="text-3xl font-bold mb-2">{estadisticasEncuestas.encuestasPendientes}</p>
            <p className="text-zinc-200 text-sm">Obligatorias restantes</p>
          </div>

          <div className="bg-amber-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaBolt className="text-3xl" />
              <h3 className="font-bold text-lg">Puntos</h3>
            </div>
            <p className="text-3xl font-bold mb-2">{estadisticasEncuestas.puntosAcumulados}</p>
            <p className="text-amber-100 text-sm">Total acumulado</p>
          </div>

          <div className="bg-red-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaStar className="text-3xl" />
              <h3 className="font-bold text-lg">Promedio</h3>
            </div>
            <p className="text-3xl font-bold mb-2">{estadisticasEncuestas.promedioCalificacion.toFixed(1)}</p>
            <p className="text-red-100 text-sm">Calificación general</p>
          </div>
        </div>

        {/* Encuestas Disponibles */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaExclamationCircle className="text-amber-500" />
            Encuestas Disponibles para Completar
          </h2>
          
          <div className="space-y-6">
            {encuestasDisponibles.map((encuesta) => (
              <div key={encuesta.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-amber-400 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTipoIcon(encuesta.tipo)}
                      <h3 className="text-lg font-bold text-gray-800">{encuesta.titulo}</h3>
                      {encuesta.obligatoria && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          OBLIGATORIA
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${encuesta.categoria === 'ACADEMICO' ? 'bg-amber-100 text-amber-800' : encuesta.categoria === 'SERVICIOS' ? 'bg-zinc-100 text-zinc-800' : 'bg-red-100 text-red-800'}`}>
                        {encuesta.categoria}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{encuesta.descripcion}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Duración:</span>
                        <span className="text-gray-800 ml-2 font-medium">{encuesta.duracion}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Cierre:</span>
                        <span className="text-amber-600 ml-2 font-medium">{encuesta.fechaCierre}</span>
                        <div className="text-xs text-gray-500">
                          {getDiasRestantes(encuesta.fechaCierre)} días restantes
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Preguntas:</span>
                        <span className="text-zinc-600 ml-2 font-medium">{encuesta.preguntas}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Puntos:</span>
                        <span className="text-amber-600 ml-2 font-bold">+{encuesta.puntos}</span>
                      </div>
                    </div>
                    
                    {encuesta.docentes && (
                      <div className="mt-3">
                        <span className="text-gray-600 text-sm">Docentes a evaluar:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {encuesta.docentes.map((docente, idx) => (
                            <span key={idx} className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs">
                              {docente}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {encuesta.servicios && (
                      <div className="mt-3">
                        <span className="text-gray-600 text-sm">Servicios a evaluar:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {encuesta.servicios.map((servicio, idx) => (
                            <span key={idx} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
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
                    <button 
                      onClick={() => iniciarEncuesta(encuesta)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
                    >
                      <FaPlay className="w-4 h-4" />
                      Iniciar Encuesta
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filtros para Historial */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaCheckCircle className="text-zinc-600" />
              Historial de Encuestas Completadas
            </h2>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={exportarReportePDF}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                title="Generar reporte completo en PDF"
              >
                <FaFilePdf /> Reporte PDF
              </button>
              <button 
                onClick={exportarRespuestasExcel}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar encuestas completadas..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
              />
            </div>
            <select 
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            >
              <option value="">Todos los tipos</option>
              <option value="Evaluacion">Evaluación Docente</option>
              <option value="Servicios">Servicios</option>
              <option value="Infraestructura">Infraestructura</option>
              <option value="Procesos">Procesos</option>
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-800">
              <thead>
                <tr className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                  <th className="py-4 px-4 font-bold">Encuesta</th>
                  <th className="py-4 px-4 font-bold">Tipo</th>
                  <th className="py-4 px-4 font-bold text-center">Fecha</th>
                  <th className="py-4 px-4 font-bold text-center">Tiempo</th>
                  <th className="py-4 px-4 font-bold text-center">Calificación</th>
                  <th className="py-4 px-4 font-bold text-center">Puntos</th>
                  <th className="py-4 px-4 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrarEncuestasCompletadas().map((encuesta) => (
                  <tr key={encuesta.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FaClipboardList className="text-amber-500" />
                        <div>
                          <span className="font-medium block">{encuesta.titulo}</span>
                          <span className="text-xs text-gray-500">ID: {encuesta.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                        {encuesta.tipo}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <FaCalendarAlt className="text-amber-500" />
                        <div>
                          <span className="font-medium block">{new Date(encuesta.fechaCompletada).toLocaleDateString('es-PE')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FaClock className="text-zinc-500" />
                        <span className="text-gray-600">{encuesta.tiempoEmpleado}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-bold text-amber-600 text-lg">{encuesta.calificacionPromedio.toFixed(1)}</span>
                        <div className="flex text-xs">
                          {renderEstrellas(encuesta.calificacionPromedio)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-amber-600 font-bold text-lg">+{encuesta.puntos}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex gap-1 justify-center flex-wrap">
                        <button 
                          onClick={() => verRespuestas(encuesta)}
                          className="bg-zinc-600 hover:bg-zinc-700 text-white px-2 py-1 rounded text-xs transition-colors flex items-center gap-1"
                          title="Ver respuestas detalladas"
                        >
                          <FaEye className="w-3 h-3" />
                          Ver
                        </button>
                        {encuesta.certificadoDisponible && (
                          <button 
                            onClick={() => generarCertificadoPDF(encuesta)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded text-xs transition-colors flex items-center gap-1"
                            title="Descargar certificado"
                          >
                            <FaDownload className="w-3 h-3" />
                            Cert.
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filtrarEncuestasCompletadas().length === 0 && (
              <div className="text-center py-8">
                <FaExclamationCircle className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron encuestas con los filtros aplicados</p>
              </div>
            )}
          </div>
        </div>

        {/* Sistema de Puntos y Beneficios */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
            <FaGift className="text-amber-500" />
            Sistema de Puntos y Beneficios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-gray-800 font-bold mb-2">Puntos por Encuesta</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• <span className="text-amber-600">Evaluación Docente:</span> 50 puntos</li>
                <li>• <span className="text-zinc-600">Servicios Académicos:</span> 30 puntos</li>
                <li>• <span className="text-red-600">Infraestructura:</span> 40 puntos</li>
                <li>• <span className="text-amber-600">Procesos Administrativos:</span> 25 puntos</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-gray-800 font-bold mb-2">Beneficios Disponibles</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• <span className="text-amber-600">100 pts:</span> Descuento 5% en trámites</li>
                <li>• <span className="text-amber-600">200 pts:</span> Acceso prioritario biblioteca</li>
                <li>• <span className="text-amber-600">300 pts:</span> Certificado de participación</li>
                <li>• <span className="text-amber-600">500 pts:</span> Beca parcial siguiente semestre</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-amber-600 mt-1" />
              <div>
                <p className="text-amber-700 text-sm">
                  <strong>Importante:</strong> Las encuestas obligatorias deben completarse para mantener activa tu matrícula. 
                  Tus respuestas son confidenciales y nos ayudan a mejorar la calidad educativa. Los puntos acumulados 
                  pueden canjearse por beneficios académicos al final de cada semestre.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Encuesta en Curso */}
        {encuestaEnCurso && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <FaClipboardList className="text-amber-500" />
                      {encuestaEnCurso.titulo}
                    </h3>
                    <p className="text-gray-600">Pregunta {preguntaActual + 1} de {encuestaEnCurso.preguntas}</p>
                  </div>
                  <button 
                    onClick={() => setEncuestaEnCurso(null)}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                {/* Barra de Progreso */}
                <div className="mb-6">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((preguntaActual + 1) / encuestaEnCurso.preguntas) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Progreso</span>
                    <span>{Math.round(((preguntaActual + 1) / encuestaEnCurso.preguntas) * 100)}%</span>
                  </div>
                </div>

                {/* Contenido de la Pregunta */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  {encuestaEnCurso.tipo === 'Evaluacion Docente' ? (
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-4">
                        {preguntasEvaluacionDocente[preguntaActual]?.texto || `Pregunta ${preguntaActual + 1} sobre evaluación docente`}
                      </h4>
                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((valor) => (
                          <label key={valor} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-amber-50 cursor-pointer">
                            <input 
                              type="radio" 
                              name={`pregunta_${preguntaActual}`}
                              value={valor}
                              onChange={() => responderPregunta(valor)}
                              className="text-amber-500"
                            />
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(valor)].map((_, i) => (
                                  <FaStar key={i} className="text-amber-500 w-4 h-4" />
                                ))}
                                {[...Array(5-valor)].map((_, i) => (
                                  <FaStar key={i} className="text-gray-300 w-4 h-4" />
                                ))}
                              </div>
                              <span className="text-gray-700 font-medium">
                                {valor === 5 ? 'Excelente' : valor === 4 ? 'Muy Bueno' : valor === 3 ? 'Bueno' : valor === 2 ? 'Regular' : 'Necesita Mejorar'}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : encuestaEnCurso.tipo === 'Servicios' ? (
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-4">
                        {preguntasServicios[preguntaActual]?.texto || `Pregunta ${preguntaActual + 1} sobre servicios`}
                      </h4>
                      {preguntasServicios[preguntaActual]?.tipo === 'escala' ? (
                        <div className="space-y-3">
                          {[5, 4, 3, 2, 1].map((valor) => (
                            <label key={valor} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-zinc-50 cursor-pointer">
                              <input 
                                type="radio" 
                                name={`pregunta_${preguntaActual}`}
                                value={valor}
                                onChange={() => responderPregunta(valor)}
                                className="text-zinc-500"
                              />
                              <span className="text-gray-700">
                                {valor === 5 ? 'Muy Satisfecho' : valor === 4 ? 'Satisfecho' : valor === 3 ? 'Neutral' : valor === 2 ? 'Insatisfecho' : 'Muy Insatisfecho'}
                              </span>
                            </label>
                          ))}
                        </div>
                      ) : preguntasServicios[preguntaActual]?.tipo === 'si_no' ? (
                        <div className="space-y-3">
                          {['Sí', 'No'].map((opcion) => (
                            <label key={opcion} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-zinc-50 cursor-pointer">
                              <input 
                                type="radio" 
                                name={`pregunta_${preguntaActual}`}
                                value={opcion}
                                onChange={() => responderPregunta(opcion)}
                                className="text-zinc-500"
                              />
                              <span className="text-gray-700">{opcion}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {preguntasServicios[preguntaActual]?.opciones?.map((opcion) => (
                            <label key={opcion} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-zinc-50 cursor-pointer">
                              <input 
                                type="radio" 
                                name={`pregunta_${preguntaActual}`}
                                value={opcion}
                                onChange={() => responderPregunta(opcion)}
                                className="text-zinc-500"
                              />
                              <span className="text-gray-700">{opcion}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-4">
                        Pregunta {preguntaActual + 1}: ¿Cómo calificarías este aspecto?
                      </h4>
                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((valor) => (
                          <label key={valor} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-red-50 cursor-pointer">
                            <input 
                              type="radio" 
                              name={`pregunta_${preguntaActual}`}
                              value={valor}
                              onChange={() => responderPregunta(valor)}
                              className="text-red-500"
                            />
                            <span className="text-gray-700">
                              {valor === 5 ? 'Excelente' : valor === 4 ? 'Muy Bueno' : valor === 3 ? 'Bueno' : valor === 2 ? 'Regular' : 'Deficiente'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Botones de Navegación */}
                <div className="flex justify-between">
                  <button 
                    onClick={preguntaAnterior}
                    disabled={preguntaActual === 0}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <div className="text-center">
                    <span className="text-gray-600 text-sm">
                      {respuestas[preguntaActual] ? '✓ Respondida' : 'Sin responder'}
                    </span>
                  </div>
                  <button 
                    onClick={siguientePregunta}
                    disabled={!respuestas[preguntaActual]}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {preguntaActual === encuestaEnCurso.preguntas - 1 ? (
                      <>
                        <FaCheck /> Finalizar
                      </>
                    ) : (
                      <>
                        Siguiente <FaArrowLeft className="rotate-180" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Encuesta Completada */}
        {modalEncuestaCompleta && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6 text-center">
                <div className="mb-4">
                  <div className="mx-auto w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4">
                    <FaCheck className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">¡Encuesta Completada!</h3>
                  <p className="text-gray-600">Gracias por tu participación</p>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FaBolt className="text-amber-500" />
                    <span className="font-bold text-amber-800">Puntos Ganados</span>
                  </div>
                  <div className="text-3xl font-bold text-amber-600">+{puntosPorCompletar}</div>
                  <div className="text-sm text-amber-700 mt-1">
                    Total acumulado: {estadisticasEncuestas.puntosAcumulados + puntosPorCompletar}
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-6">
                  <p>Tu retroalimentación es muy valiosa para nosotros.</p>
                  <p>Los puntos se reflejarán en tu cuenta en las próximas 24 horas.</p>
                </div>

                <button 
                  onClick={() => setModalEncuestaCompleta(false)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Ver Respuestas */}
        {modalRespuestas && encuestaSeleccionada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <FaEye className="text-amber-500" />
                      Detalle de Respuestas
                    </h3>
                    <p className="text-gray-600">{encuestaSeleccionada.titulo}</p>
                  </div>
                  <button 
                    onClick={() => setModalRespuestas(false)}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                {/* Información General */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3">Información de la Encuesta</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">ID:</span>
                        <span className="text-amber-600">{encuestaSeleccionada.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Fecha:</span>
                        <span>{new Date(encuestaSeleccionada.fechaCompletada).toLocaleDateString('es-PE')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Tiempo:</span>
                        <span>{encuestaSeleccionada.tiempoEmpleado}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Tipo:</span>
                        <span>{encuestaSeleccionada.tipo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3">Resultados</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Calificación:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-600">{encuestaSeleccionada.calificacionPromedio.toFixed(1)}</span>
                          <div className="flex text-xs">
                            {renderEstrellas(encuestaSeleccionada.calificacionPromedio)}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Puntos:</span>
                        <span className="text-amber-600 font-bold">+{encuestaSeleccionada.puntos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Certificado:</span>
                        <span className={encuestaSeleccionada.certificadoDisponible ? 'text-amber-600' : 'text-gray-500'}>
                          {encuestaSeleccionada.certificadoDisponible ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comentarios */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FaComment className="text-amber-500" />
                    Comentarios y Observaciones
                  </h4>
                  <p className="text-gray-700">{encuestaSeleccionada.comentarios}</p>
                </div>

                {/* Respuestas Detalladas (Simuladas) */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-bold text-gray-800 mb-3">Respuestas por Categoría</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">Metodología de Enseñanza</div>
                      <div className="flex items-center gap-2">
                        {renderEstrellas(4.5)}
                        <span className="text-sm text-gray-600">4.5/5.0</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">Claridad en Explicaciones</div>
                      <div className="flex items-center gap-2">
                        {renderEstrellas(4.2)}
                        <span className="text-sm text-gray-600">4.2/5.0</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">Recursos Didácticos</div>
                      <div className="flex items-center gap-2">
                        {renderEstrellas(3.8)}
                        <span className="text-sm text-gray-600">3.8/5.0</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">Participación Estudiantil</div>
                      <div className="flex items-center gap-2">
                        {renderEstrellas(4.3)}
                        <span className="text-sm text-gray-600">4.3/5.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  {encuestaSeleccionada.certificadoDisponible && (
                    <button 
                      onClick={() => generarCertificadoPDF(encuestaSeleccionada)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FaDownload /> Certificado
                    </button>
                  )}
                  <button 
                    onClick={() => setModalRespuestas(false)}
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
                      exportarReportePDF();
                      setModalExportar(false);
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <FaFilePdf className="text-xl" />
                    <div className="text-left">
                      <div className="font-bold">Reporte Completo PDF</div>
                      <div className="text-sm opacity-90">Todas las encuestas con estadísticas</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      exportarRespuestasExcel();
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
                      <div className="text-sm opacity-90">Vista actual del historial</div>
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
      </div>
    </div>
  );
}
