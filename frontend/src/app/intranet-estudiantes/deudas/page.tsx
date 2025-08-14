"use client";

import { FaArrowLeft, FaCreditCard, FaExclamationTriangle, FaCheckCircle, FaCalendarAlt, FaMoneyBillWave, FaDownload, FaFileAlt, FaPrint, FaTimes, FaInfoCircle, FaFilePdf, FaFileExcel, FaFilter, FaSearch, FaUniversity, FaMobile, FaReceipt, FaShoppingCart, FaCheck, FaClock, FaExclamationCircle, FaBuilding, FaPhoneAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getBolteasByStudent, GeneratedBoleta } from "@/data/esquelas-mock";

// Interfaces para el sistema de deudas
interface Deuda {
  id: number;
  concepto: string;
  descripcion: string;
  monto: number;
  fechaVencimiento: string;
  fechaGeneracion: string;
  estado: 'Pagado' | 'Pendiente' | 'Vencido' | 'Parcial';
  recargo: number;
  codigo: string;
  categoria: 'MATRICULA' | 'LABORATORIO' | 'BIBLIOTECA' | 'SEGURO' | 'TRAMITE';
  modalidadPago: string[];
  observaciones?: string;
  fechaPago?: string;
  metodoPago?: string;
  numeroRecibo?: string;
  entidadBancaria?: string;
}

interface ModalidadPago {
  id: string;
  nombre: string;
  tipo: 'presencial' | 'virtual' | 'banco';
  descripcion: string;
  comision: number;
  disponible: boolean;
  instrucciones: string[];
  cuentas?: { banco: string; numero: string; cci?: string }[];
}

export default function Deudas() {
  const router = useRouter();
  const { user } = useAuth();
  const [modalPago, setModalPago] = useState(false);
  const [modalRecibo, setModalRecibo] = useState(false);
  const [deudaSeleccionada, setDeudaSeleccionada] = useState<Deuda | null>(null);
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState<ModalidadPago | null>(null);
  const [modalConfirmacionPago, setModalConfirmacionPago] = useState(false);
  const [modalExportar, setModalExportar] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [mostrarProcesandoPago, setMostrarProcesandoPago] = useState(false);

  // Obtener esquelas del estudiante actual desde los datos compartidos
  const esquelasEstudiante = getBolteasByStudent(user?.email || 'estudiante@unica.edu.pe');
  
  // Datos más realistas y completos de deudas
  const deudasData: Deuda[] = [
    { 
      id: 1,
      concepto: "Matrícula 2025-I", 
      descripcion: "Matrícula del semestre académico 2025-I - Maestría en Administración",
      monto: 450.00, 
      fechaVencimiento: "2025-03-15",
      fechaGeneracion: "2025-01-15",
      estado: "Pendiente",
      recargo: 0.00,
      codigo: "MAT-2025-001",
      categoria: "MATRICULA",
      modalidadPago: ["presencial", "virtual", "banco"],
      observaciones: "Pago obligatorio para mantener matrícula vigente"
    },
    { 
      id: 2,
      concepto: "Derecho de Laboratorio", 
      descripcion: "Uso de laboratorios de investigación y equipos especializados",
      monto: 120.00, 
      fechaVencimiento: "2025-03-20",
      fechaGeneracion: "2025-01-20",
      estado: "Pendiente",
      recargo: 12.00,
      codigo: "LAB-2025-002",
      categoria: "LABORATORIO",
      modalidadPago: ["presencial", "banco"],
      observaciones: "Incluye recargo por pago tardío del 10%"
    },
    { 
      id: 3,
      concepto: "Biblioteca Central", 
      descripcion: "Acceso a recursos bibliográficos digitales y físicos",
      monto: 80.00, 
      fechaVencimiento: "2025-02-28",
      fechaGeneracion: "2025-01-10",
      estado: "Vencido",
      recargo: 24.00,
      codigo: "BIB-2025-003",
      categoria: "BIBLIOTECA",
      modalidadPago: ["presencial", "virtual", "banco"],
      observaciones: "Acceso suspendido hasta regularizar pago"
    },
    { 
      id: 4,
      concepto: "Seguro Estudiantil", 
      descripcion: "Seguro médico estudiantil 2025 - Cobertura completa",
      monto: 25.00, 
      fechaVencimiento: "2025-04-10",
      fechaGeneracion: "2024-12-15",
      estado: "Pagado",
      recargo: 0.00,
      codigo: "SEG-2025-004",
      categoria: "SEGURO",
      modalidadPago: ["presencial"],
      fechaPago: "2024-12-18",
      metodoPago: "Banco Continental",
      numeroRecibo: "RC-2024-5678",
      entidadBancaria: "Banco Continental"
    },
    {
      id: 5,
      concepto: "Certificado de Estudios",
      descripcion: "Tramite de certificado oficial de estudios con notas",
      monto: 85.00,
      fechaVencimiento: "2025-03-25",
      fechaGeneracion: "2025-02-01",
      estado: "Pendiente",
      recargo: 0.00,
      codigo: "CER-2025-005",
      categoria: "TRAMITE",
      modalidadPago: ["presencial", "virtual"],
      observaciones: "Requerido para postulación a doctorado"
    },
    {
      id: 6,
      concepto: "Matrícula Extemporánea 2024-II",
      descripcion: "Regularización de matrícula fuera de plazo",
      monto: 280.00,
      fechaVencimiento: "2024-12-20",
      fechaGeneracion: "2024-11-15",
      estado: "Pagado",
      recargo: 50.00,
      codigo: "MEX-2024-006",
      categoria: "MATRICULA",
      modalidadPago: ["presencial"],
      fechaPago: "2024-12-15",
      metodoPago: "Caja Universitaria",
      numeroRecibo: "RC-2024-3456",
      entidadBancaria: "Caja UNICA"
    }
  ];

  // Modalidades de pago disponibles
  const modalidadesPago: ModalidadPago[] = [
    {
      id: "caja_universitaria",
      nombre: "Caja Universitaria",
      tipo: "presencial",
      descripcion: "Pago directo en las oficinas de la universidad",
      comision: 0.00,
      disponible: true,
      instrucciones: [
        "Acérquese a la Caja Universitaria con su DNI",
        "Presente el código de pago o mencione el concepto",
        "Realice el pago en efectivo o con tarjeta",
        "Conserve el comprobante de pago"
      ],
      cuentas: []
    },
    {
      id: "banco_nacion",
      nombre: "Banco de la Nación",
      tipo: "banco",
      descripcion: "Pago en ventanilla o agentes autorizados",
      comision: 3.50,
      disponible: true,
      instrucciones: [
        "Diríjase a cualquier agencia del Banco de la Nación",
        "Solicite pago a favor de UNICA", 
        "Proporcione el código de pago",
        "Pague en efectivo, el banco no acepta tarjetas para este servicio"
      ],
      cuentas: [
        { banco: "Banco de la Nación", numero: "00-123-456789", cci: "01812312345678901234" }
      ]
    },
    {
      id: "banco_continental",
      nombre: "Banco Continental",
      tipo: "banco", 
      descripcion: "Pago en ventanilla, banca por internet o app móvil",
      comision: 5.00,
      disponible: true,
      instrucciones: [
        "Ventanilla: Acérquese con DNI y código de pago",
        "Internet: Ingrese a la banca por internet",
        "App: Use la aplicación móvil del banco",
        "Transferencia: Use la cuenta CCI proporcionada"
      ],
      cuentas: [
        { banco: "Banco Continental", numero: "98-765-432101", cci: "01199876543210123456" }
      ]
    },
    {
      id: "pago_efectivo",
      nombre: "PagoEfectivo",
      tipo: "virtual",
      descripcion: "Pago en bodegas, farmacias y agentes autorizados",
      comision: 2.50,
      disponible: true,
      instrucciones: [
        "Genere el código CIP desde la plataforma",
        "Acérquese a cualquier agente PagoEfectivo",
        "Proporcione el código CIP generado",
        "Realice el pago en efectivo"
      ]
    },
    {
      id: "banca_movil",
      nombre: "Banca Móvil",
      tipo: "virtual",
      descripcion: "Pago desde aplicaciones bancarias móviles",
      comision: 1.50,
      disponible: true,
      instrucciones: [
        "Descargue la app de su banco preferido",
        "Seleccione 'Pago de Servicios'",
        "Busque 'Universidad Nacional San Luis Gonzaga'",
        "Ingrese el código de pago y confirme"
      ]
    }
  ];

  // Calcular resumen de deudas
  const calcularResumenDeudas = () => {
    const pendientes = deudasData.filter(d => d.estado === 'Pendiente' || d.estado === 'Vencido');
    const totalPendiente = pendientes.reduce((sum, d) => sum + d.monto + d.recargo, 0);
    const totalRecargos = pendientes.reduce((sum, d) => sum + d.recargo, 0);
    const deudasVencidas = deudasData.filter(d => d.estado === 'Vencido').length;
    const proximoVencimiento = pendientes
      .sort((a, b) => new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime())[0]?.fechaVencimiento;
    
    return {
      totalPendiente,
      totalRecargos,
      totalGeneral: totalPendiente,
      deudasVencidas,
      proximoVencimiento: proximoVencimiento || 'N/A'
    };
  };

  const resumenDeudas = calcularResumenDeudas();

  // Funciones auxiliares
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Pagado": return <FaCheckCircle className="text-amber-500" />;
      case "Pendiente": return <FaClock className="text-zinc-500" />;
      case "Vencido": return <FaExclamationTriangle className="text-red-500" />;
      case "Parcial": return <FaExclamationCircle className="text-amber-500" />;
      default: return <FaExclamationTriangle className="text-red-500" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Pagado": return "text-amber-800 bg-amber-100";
      case "Pendiente": return "text-zinc-800 bg-zinc-100";
      case "Vencido": return "text-red-800 bg-red-100";
      case "Parcial": return "text-amber-800 bg-amber-100";
      default: return "text-red-800 bg-red-100";
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "MATRICULA": return "text-amber-800 bg-amber-100";
      case "LABORATORIO": return "text-zinc-800 bg-zinc-100";
      case "BIBLIOTECA": return "text-red-800 bg-red-100";
      case "SEGURO": return "text-amber-800 bg-amber-100";
      case "TRAMITE": return "text-zinc-800 bg-zinc-100";
      default: return "text-gray-800 bg-gray-100";
    }
  };

  const getDiasVencimiento = (fecha: string) => {
    const hoy = new Date();
    const vencimiento = new Date(fecha);
    const diferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
    return diferencia;
  };

  const filtrarDeudas = () => {
    let deudasFiltradas = deudasData;

    if (filtroEstado) {
      deudasFiltradas = deudasFiltradas.filter(d => d.estado === filtroEstado);
    }

    if (busqueda) {
      deudasFiltradas = deudasFiltradas.filter(d => 
        d.concepto.toLowerCase().includes(busqueda.toLowerCase()) ||
        d.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        d.codigo.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    return deudasFiltradas.sort((a, b) => new Date(b.fechaGeneracion).getTime() - new Date(a.fechaGeneracion).getTime());
  };

  // Funciones de acciones
  const iniciarPago = (deuda: Deuda) => {
    setDeudaSeleccionada(deuda);
    setModalPago(true);
  };

  const verRecibo = (deuda: Deuda) => {
    setDeudaSeleccionada(deuda);
    setModalRecibo(true);
  };

  const seleccionarModalidad = (modalidad: ModalidadPago) => {
    setModalidadSeleccionada(modalidad);
    setModalConfirmacionPago(true);
    setModalPago(false);
  };

  const procesarPago = () => {
    setModalConfirmacionPago(false);
    setMostrarProcesandoPago(true);
    
    // Simular procesamiento
    setTimeout(() => {
      setMostrarProcesandoPago(false);
      alert('¡Pago procesado exitosamente! El estado se actualizará en las próximas 24 horas.');
      setDeudaSeleccionada(null);
      setModalidadSeleccionada(null);
    }, 3000);
  };

  const generarReciboPDF = (deuda: Deuda) => {
    const contenidoRecibo = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Recibo de Pago - ${deuda.codigo}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #f59e0b; margin-bottom: 10px; }
          .university { font-size: 18px; margin-bottom: 5px; }
          .recibo-titulo { font-size: 20px; font-weight: bold; margin-top: 20px; }
          .info-section { margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🏛️ UNIVERSIDAD NACIONAL SAN LUIS GONZAGA</div>
          <div class="university">Escuela de Posgrado</div>
          <div class="recibo-titulo">RECIBO DE PAGO OFICIAL</div>
          <div>N° ${deuda.numeroRecibo || 'RC-' + deuda.codigo}</div>
        </div>

        <div class="grid">
          <div class="info-section">
            <h3>DATOS DEL PAGADOR</h3>
            <p><strong>Nombre:</strong> ${user?.nombres || 'N/A'} ${user?.apellidos || ''}</p>
            <p><strong>Código:</strong> ${user?.codigoEstudiante || user?.id || 'N/A'}</p>
            <p><strong>Programa:</strong> Maestría en Administración</p>
            <p><strong>Email:</strong> ${user?.email || 'N/A'}</p>
          </div>

          <div class="info-section">
            <h3>DATOS DEL PAGO</h3>
            <p><strong>Código:</strong> ${deuda.codigo}</p>
            <p><strong>Fecha de Pago:</strong> ${deuda.fechaPago || new Date().toLocaleDateString('es-PE')}</p>
            <p><strong>Método:</strong> ${deuda.metodoPago || 'N/A'}</p>
            <p><strong>Entidad:</strong> ${deuda.entidadBancaria || 'N/A'}</p>
          </div>
        </div>

        <div class="info-section">
          <h3>DETALLE DEL CONCEPTO</h3>
          <p><strong>Concepto:</strong> ${deuda.concepto}</p>
          <p><strong>Descripción:</strong> ${deuda.descripcion}</p>
          <p><strong>Categoría:</strong> ${deuda.categoria}</p>
          <p><strong>Monto Base:</strong> S/ ${deuda.monto.toFixed(2)}</p>
          ${deuda.recargo > 0 ? `<p><strong>Recargo:</strong> S/ ${deuda.recargo.toFixed(2)}</p>` : ''}
          <p><strong>Total Pagado:</strong> S/ ${(deuda.monto + deuda.recargo).toFixed(2)}</p>
        </div>

        <div class="info-section">
          <h3>OBSERVACIONES</h3>
          <p>${deuda.observaciones || 'Pago realizado correctamente sin observaciones.'}</p>
        </div>

        <div class="footer">
          <p><strong>ESCUELA DE POSGRADO - UNIVERSIDAD NACIONAL SAN LUIS GONZAGA</strong></p>
          <p>Este documento constituye comprobante oficial de pago</p>
          <p>Generado el ${new Date().toLocaleDateString('es-PE')} a las ${new Date().toLocaleTimeString('es-PE')}</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([contenidoRecibo], { type: 'text/html' });
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

  const exportarExcel = () => {
    const datosParaExcel = filtrarDeudas().map(deuda => ({
      'Código': deuda.codigo,
      'Concepto': deuda.concepto,
      'Descripción': deuda.descripcion,
      'Categoría': deuda.categoria,
      'Monto': `S/ ${deuda.monto.toFixed(2)}`,
      'Recargo': `S/ ${deuda.recargo.toFixed(2)}`,
      'Total': `S/ ${(deuda.monto + deuda.recargo).toFixed(2)}`,
      'Estado': deuda.estado,
      'Fecha Vencimiento': deuda.fechaVencimiento,
      'Fecha Generación': deuda.fechaGeneracion,
      'Observaciones': deuda.observaciones || 'N/A'
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
    link.setAttribute('download', `deudas-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportarReportePDF = () => {
    const deudasFiltradas = filtrarDeudas();
    
    const contenidoReporte = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Deudas</title>
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
          <h1>🏛️ ESCUELA DE POSGRADO</h1>
          <h2>REPORTE DE OBLIGACIONES FINANCIERAS</h2>
          <p>Estudiante: ${user?.nombres || 'N/A'} ${user?.apellidos || ''}</p>
          <p>Generado el: ${new Date().toLocaleDateString('es-PE')}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            ${deudasFiltradas.map(deuda => `
              <tr>
                <td>${deuda.codigo}</td>
                <td>${deuda.concepto}</td>
                <td>S/ ${(deuda.monto + deuda.recargo).toFixed(2)}</td>
                <td>${deuda.estado}</td>
                <td>${new Date(deuda.fechaVencimiento).toLocaleDateString('es-PE')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <h3>Resumen Financiero</h3>
          <p><strong>Total Pendiente:</strong> S/ ${resumenDeudas.totalPendiente.toFixed(2)}</p>
          <p><strong>Total Recargos:</strong> S/ ${resumenDeudas.totalRecargos.toFixed(2)}</p>
          <p><strong>Deudas Vencidas:</strong> ${resumenDeudas.deudasVencidas}</p>
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

  // Funciones para esquelas de pago
  const descargarEsquela = (boleta: GeneratedBoleta) => {
    console.log('Descargando esquela:', boleta.id);
    // Generar PDF realista de la esquela
    const contenidoEsquela = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Esquela de Pago - ${boleta.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
          .conceptos { margin: 20px 0; }
          .concepto-item { padding: 10px; border: 1px solid #e5e7eb; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏛️ UNIVERSIDAD NACIONAL SAN LUIS GONZAGA</h1>
          <h2>ESQUELA DE PAGO</h2>
          <p>ID: ${boleta.id}</p>
        </div>
        
        <div class="conceptos">
          <h3>Conceptos a Pagar:</h3>
          ${boleta.conceptos.map(concepto => `
            <div class="concepto-item">
              <p><strong>${concepto.concepto}</strong></p>
              <p>Monto: S/ ${concepto.monto.toFixed(2)}</p>
              <p>Vence: ${concepto.fechaVencimiento}</p>
            </div>
          `).join('')}
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <p><strong>Total: S/ ${boleta.total.toFixed(2)}</strong></p>
          <p>Estado: ${boleta.estado}</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([contenidoEsquela], { type: 'text/html' });
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

  const imprimirEsquela = (boleta: GeneratedBoleta) => {
    descargarEsquela(boleta); // Reutilizar la función de descarga para imprimir
  };

  const getEstadoBoletaColor = (estado: string) => {
    switch (estado) {
      case "Pagada": return "text-amber-800 bg-amber-100";
      case "Activa": return "text-zinc-800 bg-zinc-100";
      default: return "text-red-800 bg-red-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4">
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
              <FaCreditCard className="text-amber-500 text-4xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Estado de Deudas</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Sistema integral para la gestión de pagos académicos y administrativos. 
              Consulta tus deudas pendientes, realiza pagos en línea y descarga tus comprobantes oficiales.
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg">
              <FaUniversity className="text-sm" />
              <span className="text-sm font-medium">Gestión Financiera Estudiantil</span>
            </div>
          </div>
        </div>

        {/* Resumen Financiero */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-red-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaMoneyBillWave className="text-3xl" />
              <h3 className="font-bold text-lg">Total Pendiente</h3>
            </div>
            <p className="text-3xl font-bold mb-2">S/ {resumenDeudas.totalPendiente.toFixed(2)}</p>
            <p className="text-red-100 text-sm">Monto por pagar</p>
          </div>

          <div className="bg-amber-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-3xl" />
              <h3 className="font-bold text-lg">Recargos</h3>
            </div>
            <p className="text-3xl font-bold mb-2">S/ {resumenDeudas.totalRecargos.toFixed(2)}</p>
            <p className="text-amber-100 text-sm">Por pagos tardíos</p>
          </div>

          <div className="bg-zinc-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaCalendarAlt className="text-3xl" />
              <h3 className="font-bold text-lg">Vencidas</h3>
            </div>
            <p className="text-3xl font-bold mb-2">{resumenDeudas.deudasVencidas}</p>
            <p className="text-zinc-200 text-sm">Obligaciones</p>
          </div>

          <div className="bg-amber-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaClock className="text-3xl" />
              <h3 className="font-bold text-lg">Próximo</h3>
            </div>
            <p className="text-lg font-bold mb-2">{resumenDeudas.proximoVencimiento}</p>
            <p className="text-amber-100 text-sm">Fecha límite</p>
          </div>
        </div>

        {/* Esquelas de Pago Generadas */}
        {esquelasEstudiante.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaFileAlt className="text-amber-500" />
              Esquelas de Pago Generadas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {esquelasEstudiante.map((boleta) => (
                <div key={boleta.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-amber-400 transition-colors">
                  <div className="flex flex-col gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FaReceipt className="text-amber-500" />
                        <h3 className="font-bold text-gray-800">{boleta.id}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getEstadoBoletaColor(boleta.estado)}`}>
                          {boleta.estado}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        Generada: {boleta.fechaGeneracion}
                      </p>
                      <p className="text-gray-600 text-sm mb-3">
                        Estado: {boleta.estado}
                      </p>
                      <p className="text-gray-600 text-sm mb-3">
                        Total: <span className="text-amber-600 font-bold">S/ {boleta.total.toFixed(2)}</span>
                      </p>
                      
                      {/* Conceptos de la esquela */}
                      <div className="space-y-2">
                        <h4 className="text-gray-700 font-medium text-sm">Conceptos incluidos:</h4>
                        {boleta.conceptos.map((concepto) => (
                          <div key={concepto.id} className="bg-white rounded p-2 text-sm border border-gray-200">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-800">{concepto.concepto}</span>
                              <span className="text-amber-600 font-bold">S/ {concepto.monto.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-gray-500 text-xs">
                                Vence: {concepto.fechaVencimiento}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${getEstadoColor(concepto.estado || 'Pendiente')}`}>
                                {concepto.estado || 'Pendiente'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Acciones */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => descargarEsquela(boleta)}
                        className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded text-sm transition-colors flex items-center gap-2"
                      >
                        <FaDownload className="w-3 h-3" />
                        PDF
                      </button>
                      <button
                        onClick={() => imprimirEsquela(boleta)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded text-sm transition-colors flex items-center gap-2"
                      >
                        <FaPrint className="w-3 h-3" />
                        Imprimir
                      </button>
                      {boleta.estado === 'Activa' && (
                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors flex items-center gap-2">
                          <FaShoppingCart className="w-3 h-3" />
                          Pagar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-amber-600 mt-1" />
                <div>
                  <p className="text-amber-700 text-sm">
                    <strong>Información:</strong> Las esquelas de pago son generadas automáticamente por la administración. 
                    Puedes descargar e imprimir estos documentos para realizar tus pagos en cualquier entidad bancaria autorizada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaCreditCard className="text-amber-500" />
              Detalle de Obligaciones Financieras
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por concepto, código o descripción..."
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
              <option value="Pagado">Pagado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Vencido">Vencido</option>
              <option value="Parcial">Parcial</option>
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-800">
              <thead>
                <tr className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                  <th className="py-4 px-4 font-bold">Concepto</th>
                  <th className="py-4 px-4 font-bold">Descripción</th>
                  <th className="py-4 px-4 font-bold text-center">Categoría</th>
                  <th className="py-4 px-4 font-bold text-center">Monto</th>
                  <th className="py-4 px-4 font-bold text-center">Recargo</th>
                  <th className="py-4 px-4 font-bold text-center">Vencimiento</th>
                  <th className="py-4 px-4 font-bold text-center">Estado</th>
                  <th className="py-4 px-4 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrarDeudas().map((deuda) => (
                  <tr key={deuda.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {getEstadoIcon(deuda.estado)}
                        <div>
                          <span className="font-medium block">{deuda.concepto}</span>
                          <span className="text-xs text-gray-500">{deuda.codigo}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600 text-sm">{deuda.descripcion}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getCategoriaColor(deuda.categoria)}`}>
                        {deuda.categoria}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-lg text-amber-600">S/ {deuda.monto.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {deuda.recargo > 0 ? (
                        <span className="text-red-600 font-bold">S/ {deuda.recargo.toFixed(2)}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium">{new Date(deuda.fechaVencimiento).toLocaleDateString('es-PE')}</span>
                        {deuda.estado !== "Pagado" && (
                          <span className={`text-xs ${getDiasVencimiento(deuda.fechaVencimiento) < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                            {getDiasVencimiento(deuda.fechaVencimiento) < 0 ? 
                              `Vencido hace ${Math.abs(getDiasVencimiento(deuda.fechaVencimiento))} días` : 
                              `Faltan ${getDiasVencimiento(deuda.fechaVencimiento)} días`}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getEstadoColor(deuda.estado)}`}>
                        {deuda.estado}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex gap-1 justify-center flex-wrap">
                        {deuda.estado === "Pagado" ? (
                          <button 
                            onClick={() => verRecibo(deuda)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded text-xs transition-colors flex items-center gap-1"
                            title="Descargar recibo de pago"
                          >
                            <FaDownload className="w-3 h-3" />
                            Recibo
                          </button>
                        ) : (
                          <button 
                            onClick={() => iniciarPago(deuda)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors flex items-center gap-1"
                            title="Iniciar proceso de pago"
                          >
                            <FaShoppingCart className="w-3 h-3" />
                            Pagar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filtrarDeudas().length === 0 && (
              <div className="text-center py-8">
                <FaExclamationTriangle className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron obligaciones financieras con los filtros aplicados</p>
              </div>
            )}
          </div>
        </div>

        {/* Información de Pagos */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-amber-600 font-bold text-lg mb-4 flex items-center gap-2">
            <FaUniversity className="text-amber-500" />
            Modalidades de Pago Disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <FaBuilding className="text-amber-500 text-xl" />
                <h4 className="text-gray-800 font-bold">Presencial</h4>
              </div>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Caja Universitaria (Sin comisión)</li>
                <li>• Banco de la Nación (Comisión: S/ 3.50)</li>
                <li>• Banco Continental (Comisión: S/ 5.00)</li>
                <li>• Horario: 8:00 AM - 4:00 PM</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <FaMobile className="text-zinc-500 text-xl" />
                <h4 className="text-gray-800 font-bold">Digital</h4>
              </div>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Banca por Internet</li>
                <li>• Apps móviles bancarias (Comisión: S/ 1.50)</li>
                <li>• PagoEfectivo (Comisión: S/ 2.50)</li>
                <li>• Disponible 24/7</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <FaPhoneAlt className="text-red-500 text-xl" />
                <h4 className="text-gray-800 font-bold">Soporte</h4>
              </div>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Mesa de Ayuda: (056) 456-7890</li>
                <li>• Email: pagos@posgrado.unica.edu.pe</li>
                <li>• WhatsApp: +51 987-654-321</li>
                <li>• Horario: Lunes a Viernes 8:00-17:00</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-amber-600 mt-1" />
              <div>
                <p className="text-amber-700 text-sm">
                  <strong>Importante:</strong> Los pagos realizados pueden demorar hasta 24 horas en reflejarse en el sistema. 
                  Conserve su comprobante de pago hasta que se actualice su estado. Para pagos urgentes, 
                  puede enviar el voucher al email institucional para verificación inmediata.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pago */}
      {modalPago && deudaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaShoppingCart className="text-amber-500" />
                Iniciar Pago
              </h3>
              <button 
                onClick={() => setModalPago(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">{deudaSeleccionada.concepto}</h4>
              <p className="text-gray-600 text-sm mb-2">{deudaSeleccionada.descripcion}</p>
              <div className="flex justify-between items-center">
                <span>Monto:</span>
                <span className="font-bold text-amber-600">S/ {deudaSeleccionada.monto.toFixed(2)}</span>
              </div>
              {deudaSeleccionada.recargo > 0 && (
                <div className="flex justify-between items-center">
                  <span>Recargo:</span>
                  <span className="font-bold text-red-600">S/ {deudaSeleccionada.recargo.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-amber-600">S/ {(deudaSeleccionada.monto + deudaSeleccionada.recargo).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-800 mb-3">Seleccione modalidad de pago:</h4>
              {modalidadesPago.filter(m => deudaSeleccionada.modalidadPago.includes(m.tipo) && m.disponible).map(modalidad => (
                <button
                  key={modalidad.id}
                  onClick={() => seleccionarModalidad(modalidad)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800">{modalidad.nombre}</span>
                    <span className="text-sm text-gray-500">
                      {modalidad.comision > 0 ? `Comisión: S/ ${modalidad.comision.toFixed(2)}` : 'Sin comisión'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{modalidad.descripcion}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Pago */}
      {modalConfirmacionPago && deudaSeleccionada && modalidadSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaCheck className="text-amber-500" />
                Confirmar Pago
              </h3>
              <button 
                onClick={() => setModalConfirmacionPago(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Resumen del Pago</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Concepto:</span>
                    <span className="font-medium">{deudaSeleccionada.concepto}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Modalidad:</span>
                    <span className="font-medium">{modalidadSeleccionada.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>S/ {(deudaSeleccionada.monto + deudaSeleccionada.recargo).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comisión:</span>
                    <span>S/ {modalidadSeleccionada.comision.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total a Pagar:</span>
                      <span className="text-amber-600">S/ {(deudaSeleccionada.monto + deudaSeleccionada.recargo + modalidadSeleccionada.comision).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
                <h5 className="font-bold text-amber-800 mb-2">Instrucciones de Pago:</h5>
                <ul className="text-amber-700 text-sm space-y-1">
                  {modalidadSeleccionada.instrucciones.map((instruccion, index) => (
                    <li key={index}>• {instruccion}</li>
                  ))}
                </ul>
                {modalidadSeleccionada.cuentas && modalidadSeleccionada.cuentas.length > 0 && (
                  <div className="mt-3">
                    <h6 className="font-bold text-amber-800 mb-1">Cuentas Bancarias:</h6>
                    {modalidadSeleccionada.cuentas.map((cuenta, index) => (
                      <div key={index} className="text-amber-700 text-sm">
                        <strong>{cuenta.banco}:</strong> {cuenta.numero}
                        {cuenta.cci && <span> (CCI: {cuenta.cci})</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setModalConfirmacionPago(false)}
                className="flex-1 bg-zinc-500 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={procesarPago}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaCheck />
                Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Recibo */}
      {modalRecibo && deudaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaReceipt className="text-amber-500" />
                Recibo de Pago
              </h3>
              <button 
                onClick={() => setModalRecibo(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Concepto:</span>
                  <span className="font-medium">{deudaSeleccionada.concepto}</span>
                </div>
                <div className="flex justify-between">
                  <span>Código:</span>
                  <span className="font-medium">{deudaSeleccionada.codigo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Recibo N°:</span>
                  <span className="font-medium">{deudaSeleccionada.numeroRecibo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fecha de Pago:</span>
                  <span className="font-medium">{deudaSeleccionada.fechaPago}</span>
                </div>
                <div className="flex justify-between">
                  <span>Método:</span>
                  <span className="font-medium">{deudaSeleccionada.metodoPago}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total Pagado:</span>
                    <span className="text-amber-600">S/ {(deudaSeleccionada.monto + deudaSeleccionada.recargo).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => generarReciboPDF(deudaSeleccionada)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaFilePdf />
                Descargar PDF
              </button>
              <button
                onClick={() => {
                  generarReciboPDF(deudaSeleccionada);
                  setModalRecibo(false);
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaPrint />
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Procesamiento */}
      {mostrarProcesandoPago && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="animate-spin text-amber-500 text-4xl mb-4">
              <FaClock />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Procesando Pago...</h3>
            <p className="text-gray-600">Por favor espere mientras procesamos su pago</p>
          </div>
        </div>
      )}

      {/* Modal de Exportación */}
      {modalExportar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaDownload className="text-amber-500" />
                Opciones de Exportación
              </h3>
              <button 
                onClick={() => setModalExportar(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  exportarReportePDF();
                  setModalExportar(false);
                }}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors flex items-center gap-3"
              >
                <FaFilePdf className="text-red-500 text-xl" />
                <div>
                  <div className="font-bold text-gray-800">Reporte PDF Completo</div>
                  <div className="text-gray-600 text-sm">Incluye todas las obligaciones y resumen</div>
                </div>
              </button>

              <button
                onClick={() => {
                  exportarExcel();
                  setModalExportar(false);
                }}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors flex items-center gap-3"
              >
                <FaFileExcel className="text-amber-600 text-xl" />
                <div>
                  <div className="font-bold text-gray-800">Exportar a Excel/CSV</div>
                  <div className="text-gray-600 text-sm">Datos tabulados para análisis</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
