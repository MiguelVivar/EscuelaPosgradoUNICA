"use client";

import { FaArrowLeft, FaHistory, FaDownload, FaEye, FaCalendarAlt, FaMoneyBillWave, FaCreditCard, FaFileInvoice } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HistorialPagos() {
  const router = useRouter();
  const [filtroAno, setFiltroAno] = useState("2025");
  
  const pagosData = [
    {
      fecha: "2025-01-10",
      concepto: "Matrícula Semestre 2025-I",
      descripcion: "Pago de matrícula y derechos académicos",
      monto: 450.00,
      metodoPago: "Transferencia Bancaria",
      referencia: "TXN-2025-001",
      estado: "Confirmado",
      comprobante: "REC-2025-001.pdf"
    },
    {
      fecha: "2024-12-15",
      concepto: "Derecho de Laboratorio",
      descripcion: "Acceso a laboratorios de investigación",
      monto: 120.00,
      metodoPago: "Tarjeta de Crédito",
      referencia: "TXN-2024-089",
      estado: "Confirmado",
      comprobante: "REC-2024-089.pdf"
    },
    {
      fecha: "2024-11-20",
      concepto: "Biblioteca Digital",
      descripcion: "Acceso anual a recursos bibliográficos",
      monto: 80.00,
      metodoPago: "Efectivo",
      referencia: "TXN-2024-067",
      estado: "Confirmado",
      comprobante: "REC-2024-067.pdf"
    },
    {
      fecha: "2024-10-25",
      concepto: "Seguro Estudiantil",
      descripcion: "Cobertura médica estudiantil 2024-2025",
      monto: 35.00,
      metodoPago: "Transferencia Bancaria",
      referencia: "TXN-2024-045",
      estado: "Confirmado",
      comprobante: "REC-2024-045.pdf"
    },
    {
      fecha: "2024-08-15",
      concepto: "Matrícula Semestre 2024-II",
      descripcion: "Pago de matrícula y derechos académicos",
      monto: 450.00,
      metodoPago: "Banca Online",
      referencia: "TXN-2024-023",
      estado: "Confirmado",
      comprobante: "REC-2024-023.pdf"
    },
    {
      fecha: "2024-07-30",
      concepto: "Certificado de Estudios",
      descripcion: "Emisión de certificado oficial",
      monto: 45.00,
      metodoPago: "PagoEfectivo",
      referencia: "TXN-2024-019",
      estado: "Confirmado",
      comprobante: "REC-2024-019.pdf"
    }
  ];

  const resumenPagos = {
    totalPagado2025: 570.00,
    totalPagado2024: 1130.00,
    pagosProcesados: 6,
    ultimoPago: "2025-01-10",
    metodosUsados: 5,
    montoPendiente: 0.00
  };

  const getMetodoIcon = (metodo: string) => {
    switch (metodo) {
      case "Tarjeta de Crédito": return <FaCreditCard className="text-amber-400" />;
      case "Transferencia Bancaria": return <FaMoneyBillWave className="text-amber-400" />;
      case "Banca Online": return <FaMoneyBillWave className="text-amber-400" />;
      default: return <FaFileInvoice className="text-amber-400" />;
    }
  };

  const filtrarPagos = (ano: string) => {
    return pagosData.filter(pago => pago.fecha.startsWith(ano));
  };

  return (
    <div className="min-h-screen bg-zinc-900 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.push('/intranet-estudiantes')}
            className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-lg transition-colors"
          >
            <FaArrowLeft />
          </button>
          <div className="flex items-center gap-3">
            <FaHistory className="text-amber-400 text-3xl" />
            <h1 className="text-3xl md:text-4xl font-bold text-amber-400">Historial de Pagos</h1>
          </div>
        </div>

        {/* Resumen de Pagos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <FaMoneyBillWave className="text-2xl" />
              <h3 className="font-bold">Total Pagado 2025</h3>
            </div>
            <p className="text-3xl font-bold">S/ {resumenPagos.totalPagado2025.toFixed(2)}</p>
            <p className="text-amber-100 text-sm">Año actual</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaCalendarAlt className="text-amber-400 text-xl" />
              <h3 className="text-amber-400 font-bold">Último Pago</h3>
            </div>
            <p className="text-xl font-bold text-white">{resumenPagos.ultimoPago}</p>
            <p className="text-zinc-400 text-sm">Fecha reciente</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaFileInvoice className="text-amber-400 text-xl" />
              <h3 className="text-amber-400 font-bold">Pagos Procesados</h3>
            </div>
            <p className="text-3xl font-bold text-white">{resumenPagos.pagosProcesados}</p>
            <p className="text-zinc-400 text-sm">Transacciones</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaCreditCard className="text-amber-400 text-xl" />
              <h3 className="text-amber-400 font-bold">Estado Financiero</h3>
            </div>
            <p className="text-2xl font-bold text-zinc-400">Al Día</p>
            <p className="text-zinc-400 text-sm">Sin pendientes</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-zinc-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaHistory className="text-amber-400" />
              Detalle de Transacciones
            </h2>
            <div className="flex gap-4">
              <select 
                value={filtroAno}
                onChange={(e) => setFiltroAno(e.target.value)}
                className="bg-zinc-700 text-white px-4 py-2 rounded-lg border border-zinc-600 focus:border-amber-400"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="">Todos los años</option>
              </select>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors">
                Exportar PDF
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabla de Historial */}
        <div className="bg-zinc-800 rounded-xl p-6 shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-white">
              <thead>
                <tr className="bg-amber-500 text-zinc-900">
                  <th className="py-3 px-4 font-bold">Fecha</th>
                  <th className="py-3 px-4 font-bold">Concepto</th>
                  <th className="py-3 px-4 font-bold">Descripción</th>
                  <th className="py-3 px-4 font-bold text-center">Monto</th>
                  <th className="py-3 px-4 font-bold text-center">Método</th>
                  <th className="py-3 px-4 font-bold text-center">Referencia</th>
                  <th className="py-3 px-4 font-bold text-center">Estado</th>
                  <th className="py-3 px-4 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {(filtroAno ? filtrarPagos(filtroAno) : pagosData).map((pago, index) => (
                  <tr key={index} className="border-b border-zinc-700 hover:bg-zinc-700/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-amber-400" />
                        <span className="font-medium">{pago.fecha}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-white">{pago.concepto}</span>
                    </td>
                    <td className="py-4 px-4 text-zinc-300 text-sm">{pago.descripcion}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-lg text-amber-400">S/ {pago.monto.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getMetodoIcon(pago.metodoPago)}
                        <span className="text-xs text-zinc-300">{pago.metodoPago}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-zinc-400 text-sm">
                      {pago.referencia}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-bold text-zinc-400 bg-zinc-900/20">
                        {pago.estado}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded text-xs transition-colors flex items-center gap-1">
                          <FaDownload className="w-3 h-3" />
                          PDF
                        </button>
                        <button className="bg-zinc-600 hover:bg-zinc-700 text-white px-2 py-1 rounded text-xs transition-colors flex items-center gap-1">
                          <FaEye className="w-3 h-3" />
                          Ver
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="mt-8 bg-zinc-800 rounded-xl p-6">
          <h3 className="text-amber-400 font-bold text-lg mb-4">Información de Pagos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 rounded-lg p-4">
              <h4 className="text-white font-bold mb-2">Métodos de Pago Aceptados</h4>
              <ul className="text-zinc-300 text-sm space-y-1">
                <li>• <span className="text-amber-400">Transferencia Bancaria:</span> BCP, BBVA, Interbank</li>
                <li>• <span className="text-amber-400">Tarjetas:</span> Visa, Mastercard, Diners</li>
                <li>• <span className="text-amber-400">Digital:</span> PagoEfectivo, Tunki, Yape</li>
                <li>• <span className="text-amber-400">Presencial:</span> Caja universitaria</li>
              </ul>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4">
              <h4 className="text-white font-bold mb-2">Soporte y Consultas</h4>
              <ul className="text-zinc-300 text-sm space-y-1">
                <li>• <span className="text-amber-400">Tesorería:</span> tesoreria@posgrado.edu.pe</li>
                <li>• <span className="text-amber-400">Teléfono:</span> (01) 456-7890 Anexo 123</li>
                <li>• <span className="text-amber-400">Horario:</span> Lunes a Viernes 8:00-17:00</li>
                <li>• <span className="text-amber-400">Ubicación:</span> Oficina 205 - Edificio Principal</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-amber-900/20 rounded-lg border-l-4 border-amber-400">
            <p className="text-amber-200 text-sm">
              <strong>Importante:</strong> Conserve todos sus comprobantes de pago. Los documentos están disponibles 
              para descarga durante 2 años desde la fecha de emisión. Para consultas sobre pagos anteriores, 
              contacte con Tesorería.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
