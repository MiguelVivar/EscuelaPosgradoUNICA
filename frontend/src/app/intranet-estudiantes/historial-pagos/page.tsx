"use client";

import { FaArrowLeft, FaHistory, FaDownload, FaEye, FaCalendarAlt, FaMoneyBillWave, FaCreditCard, FaFileInvoice, FaFilePdf, FaFileExcel, FaPrint, FaTimes, FaCheck, FaClock, FaExclamationTriangle, FaSearch, FaFilter, FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Interfaces para el sistema de pagos
interface Pago {
  id: number;
  fecha: string;
  concepto: string;
  descripcion: string;
  monto: number;
  metodoPago: string;
  referencia: string;
  estado: 'CONFIRMADO' | 'PENDIENTE' | 'RECHAZADO' | 'PROCESANDO';
  comprobante: string;
  numeroBoleta?: string;
  bancoOrigen?: string;
  cuentaDestino?: string;
  observaciones?: string;
  fechaVencimiento?: string;
  moneda: 'PEN' | 'USD';
  tipoDocumento: 'BOLETA' | 'FACTURA' | 'RECIBO';
}

export default function HistorialPagos() {
  const router = useRouter();
  const { user } = useAuth();
  const [filtroAno, setFiltroAno] = useState("2025");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroConcepto, setFiltroConcepto] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modalDetalles, setModalDetalles] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<Pago | null>(null);
  const [modalExportar, setModalExportar] = useState(false);
  const [modalVistaPrevia, setModalVistaPrevia] = useState(false);
  const [cargandoPDF, setCargandoPDF] = useState(false);
  
  // Datos más realistas y completos del historial de pagos
  const pagosData: Pago[] = [
    {
      id: 1,
      fecha: "2025-01-15",
      concepto: "Matrícula Semestre 2025-I",
      descripcion: "Pago de matrícula, derechos académicos y seguro estudiantil para el primer semestre del año académico 2025",
      monto: 2850.00,
      metodoPago: "Transferencia Bancaria",
      referencia: "TXN-MAT-2025-001",
      estado: "CONFIRMADO",
      comprobante: "BOL-2025-001234.pdf",
      numeroBoleta: "BOL-2025-001234",
      bancoOrigen: "Banco de Crédito del Perú",
      cuentaDestino: "191-3456789-0-12",
      observaciones: "Pago realizado dentro del plazo establecido",
      moneda: "PEN",
      tipoDocumento: "BOLETA"
    },
    {
      id: 2,
      fecha: "2025-01-10",
      concepto: "Derecho de Laboratorio - Investigación",
      descripcion: "Acceso a laboratorios especializados para proyectos de investigación de maestría",
      monto: 450.00,
      metodoPago: "Tarjeta de Crédito",
      referencia: "TXN-LAB-2025-002",
      estado: "CONFIRMADO",
      comprobante: "REC-2025-000567.pdf",
      numeroBoleta: "REC-2025-000567",
      observaciones: "Acceso autorizado por 6 meses",
      moneda: "PEN",
      tipoDocumento: "RECIBO"
    },
    {
      id: 3,
      fecha: "2024-12-20",
      concepto: "Biblioteca Digital Premium",
      descripcion: "Suscripción anual a base de datos académicas internacionales (IEEE, Scopus, ScienceDirect)",
      monto: 320.00,
      metodoPago: "Banca Online BCP",
      referencia: "TXN-BIB-2024-089",
      estado: "CONFIRMADO",
      comprobante: "BOL-2024-008945.pdf",
      numeroBoleta: "BOL-2024-008945",
      bancoOrigen: "Banco de Crédito del Perú",
      observaciones: "Vigencia hasta diciembre 2025",
      moneda: "PEN",
      tipoDocumento: "BOLETA"
    },
    {
      id: 4,
      fecha: "2024-12-15",
      concepto: "Certificado de Notas Oficial",
      descripcion: "Emisión de certificado oficial de notas sellado y firmado para trámites externos",
      monto: 85.00,
      metodoPago: "PagoEfectivo",
      referencia: "TXN-CERT-2024-067",
      estado: "CONFIRMADO",
      comprobante: "REC-2024-001123.pdf",
      numeroBoleta: "REC-2024-001123",
      observaciones: "Documento listo para recojo",
      moneda: "PEN",
      tipoDocumento: "RECIBO"
    },
    {
      id: 5,
      fecha: "2024-11-30",
      concepto: "Seguro Estudiantil Complementario",
      descripcion: "Cobertura médica adicional y seguro contra accidentes para actividades académicas",
      monto: 150.00,
      metodoPago: "Yape",
      referencia: "TXN-SEG-2024-045",
      estado: "CONFIRMADO",
      comprobante: "BOL-2024-007823.pdf",
      numeroBoleta: "BOL-2024-007823",
      observaciones: "Cobertura vigente hasta noviembre 2025",
      moneda: "PEN",
      tipoDocumento: "BOLETA"
    },
    {
      id: 6,
      fecha: "2024-08-20",
      concepto: "Matrícula Semestre 2024-II",
      descripcion: "Pago de matrícula para el segundo semestre del año académico 2024",
      monto: 2850.00,
      metodoPago: "Transferencia Bancaria",
      referencia: "TXN-MAT-2024-023",
      estado: "CONFIRMADO",
      comprobante: "BOL-2024-005467.pdf",
      numeroBoleta: "BOL-2024-005467",
      bancoOrigen: "BBVA Continental",
      cuentaDestino: "191-3456789-0-12",
      moneda: "PEN",
      tipoDocumento: "BOLETA"
    },
    {
      id: 7,
      fecha: "2024-07-15",
      concepto: "Taller de Metodología Avanzada",
      descripcion: "Participación en taller especializado de metodología de investigación cuantitativa",
      monto: 380.00,
      metodoPago: "Tarjeta de Débito",
      referencia: "TXN-TALL-2024-019",
      estado: "CONFIRMADO",
      comprobante: "REC-2024-000891.pdf",
      numeroBoleta: "REC-2024-000891",
      observaciones: "Certificado de participación incluido",
      moneda: "PEN",
      tipoDocumento: "RECIBO"
    },
    {
      id: 8,
      fecha: "2024-06-10",
      concepto: "Examen de Suficiencia - Inglés",
      descripcion: "Evaluación de competencias en idioma inglés para requisitos de grado",
      monto: 120.00,
      metodoPago: "Efectivo",
      referencia: "TXN-EXAM-2024-015",
      estado: "CONFIRMADO",
      comprobante: "REC-2024-000678.pdf",
      numeroBoleta: "REC-2024-000678",
      observaciones: "Resultado: Aprobado - Nivel B2",
      moneda: "PEN",
      tipoDocumento: "RECIBO"
    },
    {
      id: 9,
      fecha: "2024-05-25",
      concepto: "Derecho de Graduación",
      descripcion: "Pago por trámites administrativos para proceso de graduación de maestría",
      monto: 950.00,
      metodoPago: "Transferencia Interbancaria",
      referencia: "TXN-GRAD-2024-008",
      estado: "PROCESANDO",
      comprobante: "PEND-2024-000234.pdf",
      numeroBoleta: "PEND-2024-000234",
      observaciones: "En proceso de validación académica",
      fechaVencimiento: "2024-06-25",
      moneda: "PEN",
      tipoDocumento: "RECIBO"
    },
    {
      id: 10,
      fecha: "2024-03-15",
      concepto: "Matrícula Semestre 2024-I",
      descripcion: "Pago de matrícula para el primer semestre del año académico 2024",
      monto: 2750.00,
      metodoPago: "Transferencia Bancaria",
      referencia: "TXN-MAT-2024-001",
      estado: "CONFIRMADO",
      comprobante: "BOL-2024-001234.pdf",
      numeroBoleta: "BOL-2024-001234",
      bancoOrigen: "Banco de Crédito del Perú",
      moneda: "PEN",
      tipoDocumento: "BOLETA"
    }
  ];

  // Funciones para manejo de datos
  const calcularResumenPagos = () => {
    const pagosConfirmados = pagosData.filter(p => p.estado === 'CONFIRMADO');
    const totalGeneral = pagosConfirmados.reduce((sum, p) => sum + p.monto, 0);
    const total2025 = pagosConfirmados.filter(p => p.fecha.startsWith('2025')).reduce((sum, p) => sum + p.monto, 0);
    const total2024 = pagosConfirmados.filter(p => p.fecha.startsWith('2024')).reduce((sum, p) => sum + p.monto, 0);
    const ultimoPago = pagosConfirmados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
    
    return {
      totalGeneral,
      total2025,
      total2024,
      pagosProcesados: pagosConfirmados.length,
      ultimoPago: ultimoPago?.fecha || 'N/A',
      ultimoMonto: ultimoPago?.monto || 0,
      pagosPendientes: pagosData.filter(p => p.estado === 'PROCESANDO').length,
      montoPendiente: pagosData.filter(p => p.estado === 'PROCESANDO').reduce((sum, p) => sum + p.monto, 0)
    };
  };

  const resumenPagos = calcularResumenPagos();

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "CONFIRMADO": return <FaCheck className="text-green-500" />;
      case "PROCESANDO": return <FaClock className="text-amber-500" />;
      case "PENDIENTE": return <FaExclamationTriangle className="text-orange-500" />;
      case "RECHAZADO": return <FaTimes className="text-red-500" />;
      default: return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "CONFIRMADO": return "text-green-600 bg-green-100";
      case "PROCESANDO": return "text-amber-600 bg-amber-100";
      case "PENDIENTE": return "text-orange-600 bg-orange-100";
      case "RECHAZADO": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getMetodoIcon = (metodo: string) => {
    switch (metodo) {
      case "Tarjeta de Crédito": 
      case "Tarjeta de Débito": 
        return <FaCreditCard className="text-blue-500" />;
      case "Transferencia Bancaria": 
      case "Transferencia Interbancaria":
      case "Banca Online BCP": 
        return <FaMoneyBillWave className="text-green-500" />;
      case "PagoEfectivo": 
      case "Yape": 
        return <FaFileInvoice className="text-purple-500" />;
      case "Efectivo": 
        return <FaMoneyBillWave className="text-amber-500" />;
      default: return <FaFileInvoice className="text-gray-500" />;
    }
  };

  const filtrarPagos = () => {
    let pagosFiltrados = pagosData;

    if (filtroAno) {
      pagosFiltrados = pagosFiltrados.filter(pago => pago.fecha.startsWith(filtroAno));
    }

    if (filtroEstado) {
      pagosFiltrados = pagosFiltrados.filter(pago => pago.estado === filtroEstado);
    }

    if (filtroConcepto) {
      pagosFiltrados = pagosFiltrados.filter(pago => 
        pago.concepto.toLowerCase().includes(filtroConcepto.toLowerCase())
      );
    }

    if (busqueda) {
      pagosFiltrados = pagosFiltrados.filter(pago => 
        pago.concepto.toLowerCase().includes(busqueda.toLowerCase()) ||
        pago.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        pago.referencia.toLowerCase().includes(busqueda.toLowerCase()) ||
        pago.numeroBoleta?.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    return pagosFiltrados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  };

  const abrirDetalles = (pago: Pago) => {
    setPagoSeleccionado(pago);
    setModalDetalles(true);
  };

  const generarComprobantePDF = (pago: Pago) => {
    // Crear el contenido HTML para el PDF
    const contenidoPDF = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Comprobante de Pago - ${pago.numeroBoleta}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #f59e0b; margin-bottom: 10px; }
          .university { font-size: 18px; margin-bottom: 5px; }
          .document-title { font-size: 20px; font-weight: bold; margin-top: 20px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .info-section { border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; }
          .info-title { font-weight: bold; color: #374151; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
          .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
          .label { font-weight: 600; }
          .value { color: #6b7280; }
          .amount { font-size: 24px; font-weight: bold; color: #f59e0b; text-align: center; margin: 20px 0; padding: 15px; background: #fef3c7; border-radius: 8px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280; }
          .qr-placeholder { width: 100px; height: 100px; border: 2px dashed #d1d5db; margin: 20px auto; display: flex; align-items: center; justify-content: center; color: #9ca3af; }
          .status-confirmed { color: #059669; font-weight: bold; }
          .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 72px; color: rgba(245, 158, 11, 0.1); z-index: -1; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="watermark">ESCUELA DE POSGRADO UNICA</div>
        
        <div class="header">
          <div class="logo">🎓 ESCUELA DE POSGRADO</div>
          <div class="university">Universidad Nacional San Luis Gonzaga</div>
          <div style="font-size: 14px; color: #6b7280;">RUC: 20148092282 - Ica, Perú</div>
          <div class="document-title">${pago.tipoDocumento} ELECTRÓNICA</div>
          <div style="font-size: 16px; margin-top: 10px;">N° ${pago.numeroBoleta}</div>
        </div>

        <div class="info-grid">
          <div class="info-section">
            <div class="info-title">📋 DATOS DEL ESTUDIANTE</div>
            <div class="info-row">
              <span class="label">Nombre:</span>
              <span class="value">${user?.nombres || 'N/A'} ${user?.apellidos || ''}</span>
            </div>
            <div class="info-row">
              <span class="label">Código:</span>
              <span class="value">${user?.codigoEstudiante || user?.id || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">${user?.email || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="label">Programa:</span>
              <span class="value">Maestría en Administración</span>
            </div>
          </div>

          <div class="info-section">
            <div class="info-title">💳 DATOS DEL PAGO</div>
            <div class="info-row">
              <span class="label">Fecha:</span>
              <span class="value">${new Date(pago.fecha).toLocaleDateString('es-PE')}</span>
            </div>
            <div class="info-row">
              <span class="label">Método:</span>
              <span class="value">${pago.metodoPago}</span>
            </div>
            <div class="info-row">
              <span class="label">Referencia:</span>
              <span class="value">${pago.referencia}</span>
            </div>
            <div class="info-row">
              <span class="label">Estado:</span>
              <span class="value status-confirmed">${pago.estado}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <div class="info-title">📄 DETALLE DEL SERVICIO</div>
          <div class="info-row">
            <span class="label">Concepto:</span>
            <span class="value">${pago.concepto}</span>
          </div>
          <div class="info-row" style="margin-top: 10px;">
            <span class="label">Descripción:</span>
          </div>
          <div style="margin-top: 5px; color: #6b7280; font-size: 14px; line-height: 1.5;">
            ${pago.descripcion}
          </div>
          ${pago.observaciones ? `
          <div class="info-row" style="margin-top: 15px;">
            <span class="label">Observaciones:</span>
          </div>
          <div style="margin-top: 5px; color: #6b7280; font-size: 14px;">
            ${pago.observaciones}
          </div>
          ` : ''}
        </div>

        <div class="amount">
          TOTAL PAGADO: ${pago.moneda} ${pago.monto.toFixed(2)}
        </div>

        ${pago.bancoOrigen ? `
        <div class="info-section">
          <div class="info-title">🏦 INFORMACIÓN BANCARIA</div>
          <div class="info-row">
            <span class="label">Banco Origen:</span>
            <span class="value">${pago.bancoOrigen}</span>
          </div>
          ${pago.cuentaDestino ? `
          <div class="info-row">
            <span class="label">Cuenta Destino:</span>
            <span class="value">${pago.cuentaDestino}</span>
          </div>
          ` : ''}
        </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; align-items: center; margin: 30px 0;">
          <div class="qr-placeholder">
            <span style="font-size: 12px;">QR Code</span>
          </div>
          <div style="text-align: right; font-size: 12px; color: #6b7280;">
            <div>Documento generado electrónicamente</div>
            <div>Fecha de emisión: ${new Date().toLocaleDateString('es-PE')} ${new Date().toLocaleTimeString('es-PE')}</div>
            <div>Hash: ${Math.random().toString(36).substring(2, 15).toUpperCase()}</div>
          </div>
        </div>

        <div class="footer">
          <p><strong>ESCUELA DE POSGRADO - UNIVERSIDAD NACIONAL SAN LUIS GONZAGA</strong></p>
          <p>📍 Ciudad Universitaria - Ica, Perú | ☎ (056) 456-7890 | 📧 posgrado@unica.edu.pe</p>
          <p>🌐 www.posgrado.unica.edu.pe | WhatsApp: +51 987-654-321</p>
          <p style="margin-top: 15px; font-style: italic;">
            Este documento es válido como comprobante de pago. Conserve este documento para sus registros.
            Para verificar la autenticidad, visite nuestro portal web con el código: ${pago.referencia}
          </p>
        </div>
      </body>
      </html>
    `;

    // Crear un Blob con el contenido HTML
    const blob = new Blob([contenidoPDF], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Abrir en nueva ventana para imprimir/guardar como PDF
    const nuevaVentana = window.open(url, '_blank');
    if (nuevaVentana) {
      nuevaVentana.onload = () => {
        setTimeout(() => {
          nuevaVentana.print();
        }, 500);
      };
    }
    
    // Limpiar URL después de un tiempo
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const descargarComprobante = (pago: Pago) => {
    generarComprobantePDF(pago);
  };

  const imprimirComprobante = (pago: Pago) => {
    generarComprobantePDF(pago);
  };

  const exportarExcel = () => {
    const datosParaExcel = filtrarPagos().map(pago => ({
      'Fecha': pago.fecha,
      'Concepto': pago.concepto,
      'Descripción': pago.descripcion,
      'Monto': `${pago.moneda} ${pago.monto.toFixed(2)}`,
      'Método de Pago': pago.metodoPago,
      'Referencia': pago.referencia,
      'N° Comprobante': pago.numeroBoleta,
      'Estado': pago.estado,
      'Tipo Documento': pago.tipoDocumento,
      'Banco Origen': pago.bancoOrigen || 'N/A',
      'Observaciones': pago.observaciones || 'N/A'
    }));

    // Crear contenido CSV
    const headers = Object.keys(datosParaExcel[0] || {});
    const csvContent = [
      headers.join(','),
      ...datosParaExcel.map(row => headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(','))
    ].join('\n');

    // Crear y descargar archivo
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historial-pagos-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportarPDF = () => {
    const pagosFiltrados = filtrarPagos();
    const totalFiltrado = pagosFiltrados.reduce((sum, p) => sum + p.monto, 0);
    
    const contenidoReporte = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Historial de Pagos</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; font-size: 12px; }
          .header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 20px; font-weight: bold; color: #f59e0b; margin-bottom: 10px; }
          .university { font-size: 16px; margin-bottom: 5px; }
          .report-title { font-size: 18px; font-weight: bold; margin-top: 20px; }
          .student-info { background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
          .summary-card { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 15px; border-radius: 8px; text-align: center; }
          .summary-value { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .summary-label { font-size: 12px; opacity: 0.9; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 10px; }
          th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
          th { background: #f59e0b; color: white; font-weight: bold; }
          tr:nth-child(even) { background: #f9fafb; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #6b7280; }
          .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 72px; color: rgba(245, 158, 11, 0.05); z-index: -1; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="watermark">ESCUELA DE POSGRADO UNICA</div>
        
        <div class="header">
          <div class="logo">🎓 ESCUELA DE POSGRADO</div>
          <div class="university">Universidad Nacional San Luis Gonzaga</div>
          <div style="font-size: 12px; color: #6b7280;">RUC: 20148092282 - Ica, Perú</div>
          <div class="report-title">REPORTE DE HISTORIAL DE PAGOS</div>
          <div style="font-size: 14px; margin-top: 10px;">Generado el: ${new Date().toLocaleDateString('es-PE')} a las ${new Date().toLocaleTimeString('es-PE')}</div>
        </div>

        <div class="student-info">
          <h3 style="margin-top: 0; color: #374151;">👤 Información del Estudiante</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            <div><strong>Nombre:</strong> ${user?.nombres || 'N/A'} ${user?.apellidos || ''}</div>
            <div><strong>Código:</strong> ${user?.codigoEstudiante || user?.id || 'N/A'}</div>
            <div><strong>Email:</strong> ${user?.email || 'N/A'}</div>
            <div><strong>Programa:</strong> Maestría en Administración</div>
          </div>
        </div>

        <div class="summary">
          <div class="summary-card">
            <div class="summary-value">${pagosFiltrados.length}</div>
            <div class="summary-label">Total de Pagos</div>
          </div>
          <div class="summary-card">
            <div class="summary-value">S/ ${totalFiltrado.toFixed(2)}</div>
            <div class="summary-label">Monto Total</div>
          </div>
          <div class="summary-card">
            <div class="summary-value">${pagosFiltrados.filter(p => p.estado === 'CONFIRMADO').length}</div>
            <div class="summary-label">Pagos Confirmados</div>
          </div>
          <div class="summary-card">
            <div class="summary-value">${pagosFiltrados.filter(p => p.estado === 'PROCESANDO').length}</div>
            <div class="summary-label">En Proceso</div>
          </div>
        </div>

        <h3>📊 Detalle de Transacciones</h3>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Método</th>
              <th>Referencia</th>
              <th>Estado</th>
              <th>Comprobante</th>
            </tr>
          </thead>
          <tbody>
            ${pagosFiltrados.map(pago => `
              <tr>
                <td>${new Date(pago.fecha).toLocaleDateString('es-PE')}</td>
                <td>${pago.concepto}</td>
                <td style="text-align: right; font-weight: bold;">${pago.moneda} ${pago.monto.toFixed(2)}</td>
                <td>${pago.metodoPago}</td>
                <td style="font-family: monospace;">${pago.referencia}</td>
                <td><span style="color: ${pago.estado === 'CONFIRMADO' ? '#059669' : '#d97706'};">${pago.estado}</span></td>
                <td style="font-family: monospace;">${pago.numeroBoleta}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background: #fef3c7; font-weight: bold;">
              <td colspan="2" style="text-align: center;">TOTAL GENERAL</td>
              <td style="text-align: right; font-size: 14px; color: #d97706;">PEN ${totalFiltrado.toFixed(2)}</td>
              <td colspan="4"></td>
            </tr>
          </tfoot>
        </table>

        <div class="footer">
          <p><strong>ESCUELA DE POSGRADO - UNIVERSIDAD NACIONAL SAN LUIS GONZAGA</strong></p>
          <p>📍 Ciudad Universitaria - Ica, Perú | ☎ (056) 456-7890 | 📧 posgrado@unica.edu.pe</p>
          <p>🌐 www.posgrado.unica.edu.pe | WhatsApp: +51 987-654-321</p>
          <p style="margin-top: 15px; font-style: italic;">
            Este reporte es generado automáticamente desde el sistema de gestión académica.
            Para consultas o verificaciones, contacte con el Departamento de Tesorería.
          </p>
          <p style="margin-top: 10px;">
            <strong>Filtros aplicados:</strong> 
            ${filtroAno ? `Año: ${filtroAno} ` : ''}
            ${filtroEstado ? `Estado: ${filtroEstado} ` : ''}
            ${filtroConcepto ? `Concepto: ${filtroConcepto} ` : ''}
            ${busqueda ? `Búsqueda: "${busqueda}" ` : ''}
          </p>
        </div>
      </body>
      </html>
    `;

    // Crear y descargar el reporte
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

  const verVistaPrevia = (pago: Pago) => {
    setPagoSeleccionado(pago);
    setModalVistaPrevia(true);
  };

  const enviarPorEmail = async () => {
    setCargandoPDF(true);
    try {
      // Simular envío por email
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`✅ Historial de pagos enviado exitosamente a: ${user?.email || 'su correo registrado'}`);
    } catch (error) {
      alert('❌ Error al enviar el correo. Intente nuevamente.');
    } finally {
      setCargandoPDF(false);
    }
  };

  const descargarTodos = () => {
    const pagosFiltrados = filtrarPagos();
    pagosFiltrados.forEach((pago, index) => {
      setTimeout(() => {
        generarComprobantePDF(pago);
      }, index * 1000); // Delay para evitar que se bloqueen las ventanas
    });
    alert(`📄 Iniciando descarga de ${pagosFiltrados.length} comprobantes...`);
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
              <FaHistory className="text-amber-500 text-4xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Historial de Pagos</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Sistema integral para la consulta del historial completo de pagos realizados. 
              Consulta todas tus transacciones, descarga comprobantes y mantén un registro detallado 
              de tus obligaciones financieras con la institución.
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg">
              <FaFileInvoice className="text-sm" />
              <span className="text-sm font-medium">Acceso exclusivo para Estudiantes</span>
            </div>
          </div>
        </div>

        {/* Resumen de Pagos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaMoneyBillWave className="text-3xl" />
              <h3 className="font-bold text-lg">Total Pagado 2025</h3>
            </div>
            <p className="text-3xl font-bold mb-2">S/ {resumenPagos.total2025.toFixed(2)}</p>
            <p className="text-blue-100 text-sm">Año actual</p>
          </div>

          <div className="bg-amber-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaCalendarAlt className="text-3xl" />
              <h3 className="font-bold text-lg">Último Pago</h3>
            </div>
            <p className="text-xl font-bold mb-2">{resumenPagos.ultimoPago}</p>
            <p className="text-amber-100 text-sm">S/ {resumenPagos.ultimoMonto.toFixed(2)}</p>
          </div>

          <div className="bg-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaFileInvoice className="text-3xl" />
              <h3 className="font-bold text-lg">Pagos Confirmados</h3>
            </div>
            <p className="text-3xl font-bold mb-2">{resumenPagos.pagosProcesados}</p>
            <p className="text-green-100 text-sm">Transacciones</p>
          </div>

          <div className="bg-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaClock className="text-3xl" />
              <h3 className="font-bold text-lg">En Proceso</h3>
            </div>
            <p className="text-3xl font-bold mb-2">{resumenPagos.pagosPendientes}</p>
            <p className="text-purple-100 text-sm">S/ {resumenPagos.montoPendiente.toFixed(2)}</p>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaHistory className="text-amber-500" />
              Detalle de Transacciones
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
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                title="Exportar datos a Excel/CSV"
              >
                <FaFileExcel /> Excel
              </button>
              <button 
                onClick={descargarTodos}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                title="Descargar todos los comprobantes individuales"
              >
                <FaDownload /> Todos los PDFs
              </button>
              <button 
                onClick={() => setModalExportar(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                title="Más opciones de exportación"
              >
                <FaFilter /> Más Opciones
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pagos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
              />
            </div>
            <select 
              value={filtroAno}
              onChange={(e) => setFiltroAno(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            >
              <option value="">Todos los años</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <select 
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            >
              <option value="">Todos los estados</option>
              <option value="CONFIRMADO">Confirmado</option>
              <option value="PROCESANDO">Procesando</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="RECHAZADO">Rechazado</option>
            </select>
            <select 
              value={filtroConcepto}
              onChange={(e) => setFiltroConcepto(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            >
              <option value="">Todos los conceptos</option>
              <option value="Matrícula">Matrícula</option>
              <option value="Laboratorio">Laboratorio</option>
              <option value="Biblioteca">Biblioteca</option>
              <option value="Certificado">Certificado</option>
              <option value="Seguro">Seguro</option>
            </select>
          </div>
        </div>
        
        {/* Tabla de Historial */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-800">
              <thead>
                <tr className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                  <th className="py-4 px-4 font-bold">Fecha</th>
                  <th className="py-4 px-4 font-bold">Concepto</th>
                  <th className="py-4 px-4 font-bold">Descripción</th>
                  <th className="py-4 px-4 font-bold text-center">Monto</th>
                  <th className="py-4 px-4 font-bold text-center">Método</th>
                  <th className="py-4 px-4 font-bold text-center">Referencia</th>
                  <th className="py-4 px-4 font-bold text-center">Estado</th>
                  <th className="py-4 px-4 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrarPagos().map((pago, index) => (
                  <tr key={pago.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-amber-500" />
                        <div>
                          <span className="font-medium block">{pago.fecha}</span>
                          <span className="text-xs text-gray-500">{pago.tipoDocumento}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-800">{pago.concepto}</span>
                      <br />
                      <span className="text-xs text-gray-500">{pago.numeroBoleta}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm max-w-xs">
                      <div className="truncate" title={pago.descripcion}>
                        {pago.descripcion}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-lg text-amber-600">
                          {pago.moneda} {pago.monto.toFixed(2)}
                        </span>
                        {pago.fechaVencimiento && (
                          <span className="text-xs text-red-500">
                            Vence: {pago.fechaVencimiento}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {getMetodoIcon(pago.metodoPago)}
                        <span className="text-xs text-gray-600 max-w-20 truncate">
                          {pago.metodoPago}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-500 text-sm">
                      <div className="font-mono">
                        {pago.referencia}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getEstadoIcon(pago.estado)}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getEstadoColor(pago.estado)}`}>
                          {pago.estado}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex gap-1 justify-center flex-wrap">
                        <button 
                          onClick={() => verVistaPrevia(pago)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors flex items-center gap-1"
                          title="Vista previa del comprobante"
                        >
                          <FaEye className="w-3 h-3" />
                          Vista
                        </button>
                        <button 
                          onClick={() => descargarComprobante(pago)}
                          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors flex items-center gap-1"
                          title="Descargar comprobante PDF"
                        >
                          <FaDownload className="w-3 h-3" />
                          PDF
                        </button>
                        <button 
                          onClick={() => abrirDetalles(pago)}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded text-xs transition-colors flex items-center gap-1"
                          title="Ver detalles completos"
                        >
                          <FaInfoCircle className="w-3 h-3" />
                          Info
                        </button>
                        <button 
                          onClick={() => imprimirComprobante(pago)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs transition-colors flex items-center gap-1"
                          title="Imprimir comprobante"
                        >
                          <FaPrint className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filtrarPagos().length === 0 && (
              <div className="text-center py-8">
                <FaExclamationTriangle className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron pagos con los filtros aplicados</p>
              </div>
            )}
          </div>
        </div>

        {/* Información Adicional */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-amber-600 font-bold text-lg mb-4">Información de Pagos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-gray-800 font-bold mb-2">Métodos de Pago Aceptados</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• <span className="text-amber-600">Transferencia Bancaria:</span> BCP, BBVA, Interbank, Scotiabank</li>
                <li>• <span className="text-amber-600">Tarjetas:</span> Visa, Mastercard, Diners Club, American Express</li>
                <li>• <span className="text-amber-600">Digital:</span> PagoEfectivo, Tunki, Yape, Plin</li>
                <li>• <span className="text-amber-600">Presencial:</span> Caja universitaria y bancos afiliados</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-gray-800 font-bold mb-2">Soporte y Consultas</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• <span className="text-amber-600">Tesorería:</span> tesoreria@posgrado.unica.edu.pe</li>
                <li>• <span className="text-amber-600">Teléfono:</span> (056) 456-7890 Anexo 123</li>
                <li>• <span className="text-amber-600">WhatsApp:</span> +51 987-654-321</li>
                <li>• <span className="text-amber-600">Horario:</span> Lunes a Viernes 8:00-17:00</li>
                <li>• <span className="text-amber-600">Ubicación:</span> Oficina 205 - Edificio Administrativo</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-amber-600 mt-1" />
              <div>
                <p className="text-amber-700 text-sm">
                  <strong>Importante:</strong> Conserve todos sus comprobantes de pago. Los documentos están disponibles 
                  para descarga durante 3 años desde la fecha de emisión. Para consultas sobre pagos anteriores o 
                  solicitar duplicados, contacte con Tesorería presentando su DNI.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Vista Previa */}
        {modalVistaPrevia && pagoSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">📄 Vista Previa del Comprobante</h3>
                  <button 
                    onClick={() => setModalVistaPrevia(false)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
                <p className="text-blue-100 mt-2">Comprobante: {pagoSeleccionado.numeroBoleta}</p>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
                {/* Vista previa simulada del comprobante */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                  <div className="max-w-2xl mx-auto bg-white border shadow-lg rounded-lg p-6">
                    
                    {/* Header del comprobante */}
                    <div className="text-center border-b-2 border-amber-500 pb-4 mb-6">
                      <div className="text-2xl font-bold text-amber-600 mb-2">🎓 ESCUELA DE POSGRADO</div>
                      <div className="text-lg font-semibold text-gray-700">Universidad Nacional San Luis Gonzaga</div>
                      <div className="text-sm text-gray-500">RUC: 20148092282 - Ica, Perú</div>
                      <div className="text-xl font-bold text-gray-800 mt-4">{pagoSeleccionado.tipoDocumento} ELECTRÓNICA</div>
                      <div className="text-lg text-amber-600 font-bold">{pagoSeleccionado.numeroBoleta}</div>
                    </div>

                    {/* Información del estudiante y pago */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1">👤 DATOS DEL ESTUDIANTE</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Nombre:</span>
                            <span>{user?.nombres || 'N/A'} {user?.apellidos || ''}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Código:</span>
                            <span>{user?.codigoEstudiante || user?.id || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Email:</span>
                            <span className="text-xs">{user?.email || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Programa:</span>
                            <span className="text-xs">Maestría en Administración</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-bold text-green-800 mb-3 border-b border-green-200 pb-1">💳 DATOS DEL PAGO</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Fecha:</span>
                            <span>{new Date(pagoSeleccionado.fecha).toLocaleDateString('es-PE')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Método:</span>
                            <span className="text-xs">{pagoSeleccionado.metodoPago}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Referencia:</span>
                            <span className="font-mono text-xs">{pagoSeleccionado.referencia}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Estado:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getEstadoColor(pagoSeleccionado.estado)}`}>
                              {pagoSeleccionado.estado}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detalle del servicio */}
                    <div className="bg-amber-50 p-4 rounded-lg mb-6">
                      <h4 className="font-bold text-amber-800 mb-3 border-b border-amber-200 pb-1">📋 DETALLE DEL SERVICIO</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-700">Concepto:</span>
                          <div className="text-gray-800 font-semibold">{pagoSeleccionado.concepto}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Descripción:</span>
                          <div className="text-sm text-gray-600 mt-1">{pagoSeleccionado.descripcion}</div>
                        </div>
                        {pagoSeleccionado.observaciones && (
                          <div>
                            <span className="font-medium text-gray-700">Observaciones:</span>
                            <div className="text-sm text-gray-600 mt-1">{pagoSeleccionado.observaciones}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Monto total */}
                    <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white p-6 rounded-lg text-center mb-6">
                      <div className="text-lg font-semibold mb-2">TOTAL PAGADO</div>
                      <div className="text-3xl font-bold">{pagoSeleccionado.moneda} {pagoSeleccionado.monto.toFixed(2)}</div>
                    </div>

                    {/* Información bancaria */}
                    {pagoSeleccionado.bancoOrigen && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h4 className="font-bold text-gray-800 mb-3">🏦 INFORMACIÓN BANCARIA</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {pagoSeleccionado.bancoOrigen && (
                            <div>
                              <span className="font-medium">Banco Origen:</span>
                              <div className="text-gray-600">{pagoSeleccionado.bancoOrigen}</div>
                            </div>
                          )}
                          {pagoSeleccionado.cuentaDestino && (
                            <div>
                              <span className="font-medium">Cuenta Destino:</span>
                              <div className="font-mono text-gray-600">{pagoSeleccionado.cuentaDestino}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer del comprobante */}
                    <div className="border-t pt-4 text-center text-xs text-gray-500">
                      <div className="flex justify-between items-center mb-2">
                        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                          <span className="text-xs">QR</span>
                        </div>
                        <div className="text-right">
                          <div>Documento generado electrónicamente</div>
                          <div>Fecha: {new Date().toLocaleDateString('es-PE')} {new Date().toLocaleTimeString('es-PE')}</div>
                          <div>Hash: {Math.random().toString(36).substring(2, 15).toUpperCase()}</div>
                        </div>
                      </div>
                      <div className="text-center mt-4">
                        <div className="font-semibold">ESCUELA DE POSGRADO - UNIVERSIDAD NACIONAL SAN LUIS GONZAGA</div>
                        <div>📍 Ciudad Universitaria - Ica, Perú | ☎ (056) 456-7890</div>
                        <div>📧 posgrado@unica.edu.pe | 🌐 www.posgrado.unica.edu.pe</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones de la vista previa */}
                <div className="flex flex-wrap gap-3 justify-center mt-6 pt-4 border-t">
                  <button 
                    onClick={() => {
                      descargarComprobante(pagoSeleccionado);
                      setModalVistaPrevia(false);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaDownload /> Descargar PDF
                  </button>
                  <button 
                    onClick={() => {
                      imprimirComprobante(pagoSeleccionado);
                      setModalVistaPrevia(false);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaPrint /> Imprimir
                  </button>
                  <button 
                    onClick={() => {
                      abrirDetalles(pagoSeleccionado);
                      setModalVistaPrevia(false);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaInfoCircle /> Ver Detalles
                  </button>
                  <button 
                    onClick={() => setModalVistaPrevia(false)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Cerrar Vista
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Detalles */}
        {modalDetalles && pagoSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Detalles del Pago</h3>
                  <button 
                    onClick={() => setModalDetalles(false)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Información del Pago</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Fecha:</span> {pagoSeleccionado.fecha}</div>
                      <div><span className="font-medium">Concepto:</span> {pagoSeleccionado.concepto}</div>
                      <div><span className="font-medium">Monto:</span> {pagoSeleccionado.moneda} {pagoSeleccionado.monto.toFixed(2)}</div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Estado:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getEstadoColor(pagoSeleccionado.estado)}`}>
                          {pagoSeleccionado.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Detalles de Transacción</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Método:</span> {pagoSeleccionado.metodoPago}</div>
                      <div><span className="font-medium">Referencia:</span> {pagoSeleccionado.referencia}</div>
                      <div><span className="font-medium">Comprobante:</span> {pagoSeleccionado.numeroBoleta}</div>
                      <div><span className="font-medium">Tipo:</span> {pagoSeleccionado.tipoDocumento}</div>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Descripción</h4>
                  <p className="text-gray-700 text-sm">{pagoSeleccionado.descripcion}</p>
                </div>

                {/* Información bancaria */}
                {(pagoSeleccionado.bancoOrigen || pagoSeleccionado.cuentaDestino) && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Información Bancaria</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {pagoSeleccionado.bancoOrigen && (
                        <div><span className="font-medium">Banco Origen:</span> {pagoSeleccionado.bancoOrigen}</div>
                      )}
                      {pagoSeleccionado.cuentaDestino && (
                        <div><span className="font-medium">Cuenta Destino:</span> {pagoSeleccionado.cuentaDestino}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Observaciones */}
                {pagoSeleccionado.observaciones && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Observaciones</h4>
                    <p className="text-gray-700 text-sm">{pagoSeleccionado.observaciones}</p>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex flex-wrap gap-3 justify-center pt-4 border-t">
                  <button 
                    onClick={() => descargarComprobante(pagoSeleccionado)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaDownload /> Descargar PDF
                  </button>
                  <button 
                    onClick={() => imprimirComprobante(pagoSeleccionado)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaPrint /> Imprimir
                  </button>
                  <button 
                    onClick={() => setModalDetalles(false)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Exportación */}
        {modalExportar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">📊 Opciones de Exportación Avanzada</h3>
                  <button 
                    onClick={() => setModalExportar(false)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
                <p className="text-amber-100 mt-2">
                  {filtrarPagos().length} registros seleccionados con filtros actuales
                </p>
              </div>
              
              <div className="p-6 space-y-4">
                <button 
                  onClick={() => {
                    exportarPDF();
                    setModalExportar(false);
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg transition-colors flex items-center gap-3"
                >
                  <FaFilePdf className="text-2xl" />
                  <div className="text-left flex-1">
                    <div className="font-bold">Reporte PDF Completo</div>
                    <div className="text-sm opacity-90">Historial detallado con resúmenes y gráficos</div>
                  </div>
                  <div className="text-xs bg-red-600 px-2 py-1 rounded">Recomendado</div>
                </button>
                
                <button 
                  onClick={() => {
                    exportarExcel();
                    setModalExportar(false);
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-colors flex items-center gap-3"
                >
                  <FaFileExcel className="text-2xl" />
                  <div className="text-left flex-1">
                    <div className="font-bold">Archivo Excel/CSV</div>
                    <div className="text-sm opacity-90">Datos estructurados para análisis y contabilidad</div>
                  </div>
                  <div className="text-xs bg-green-600 px-2 py-1 rounded">Editable</div>
                </button>

                <button 
                  onClick={() => {
                    descargarTodos();
                    setModalExportar(false);
                  }}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-colors flex items-center gap-3"
                >
                  <FaDownload className="text-2xl" />
                  <div className="text-left flex-1">
                    <div className="font-bold">Todos los Comprobantes</div>
                    <div className="text-sm opacity-90">Descarga individual de cada PDF</div>
                  </div>
                  <div className="text-xs bg-purple-600 px-2 py-1 rounded">{filtrarPagos().length} PDFs</div>
                </button>
                
                <button 
                  onClick={() => {
                    enviarPorEmail();
                    setModalExportar(false);
                  }}
                  disabled={cargandoPDF}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-4 rounded-lg transition-colors flex items-center gap-3"
                >
                  {cargandoPDF ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaFileInvoice className="text-2xl" />
                  )}
                  <div className="text-left flex-1">
                    <div className="font-bold">
                      {cargandoPDF ? 'Enviando...' : 'Enviar por Email'}
                    </div>
                    <div className="text-sm opacity-90">
                      {cargandoPDF ? 'Preparando el envío' : `Recibir en: ${user?.email || 'correo registrado'}`}
                    </div>
                  </div>
                  <div className="text-xs bg-blue-600 px-2 py-1 rounded">Automático</div>
                </button>

                <div className="border-t pt-4">
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <div className="flex items-start gap-2">
                      <FaInfoCircle className="text-amber-600 mt-0.5" />
                      <div className="text-xs text-amber-800">
                        <strong>Filtros aplicados:</strong>
                        <ul className="mt-1 space-y-1">
                          {filtroAno && <li>• Año: {filtroAno}</li>}
                          {filtroEstado && <li>• Estado: {filtroEstado}</li>}
                          {filtroConcepto && <li>• Concepto: {filtroConcepto}</li>}
                          {busqueda && <li>• Búsqueda: "{busqueda}"</li>}
                          {!filtroAno && !filtroEstado && !filtroConcepto && !busqueda && <li>• Sin filtros (todos los registros)</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
