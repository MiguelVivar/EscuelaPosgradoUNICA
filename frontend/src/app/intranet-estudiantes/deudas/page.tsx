"use client";

import { FaArrowLeft, FaCreditCard, FaExclamationTriangle, FaCheckCircle, FaCalendarAlt, FaMoneyBillWave, FaDownload } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Deudas() {
  const router = useRouter();
  
  const deudasData = [
    { 
      concepto: "Matrícula 2025-I", 
      monto: 450.00, 
      fechaVencimiento: "2025-03-15", 
      estado: "Pendiente",
      descripcion: "Matrícula del semestre académico 2025-I",
      recargo: 0.00
    },
    { 
      concepto: "Derecho de Laboratorio", 
      monto: 120.00, 
      fechaVencimiento: "2025-03-20", 
      estado: "Pendiente",
      descripcion: "Uso de laboratorios de investigación",
      recargo: 12.00
    },
    { 
      concepto: "Biblioteca Central", 
      monto: 80.00, 
      fechaVencimiento: "2025-02-28", 
      estado: "Vencido",
      descripción: "Acceso a recursos bibliográficos digitales",
      recargo: 24.00
    },
    { 
      concepto: "Seguro Estudiantil", 
      monto: 25.00, 
      fechaVencimiento: "2025-04-10", 
      estado: "Pagado",
      descripcion: "Seguro médico estudiantil 2025",
      recargo: 0.00
    },
  ];

  const resumenDeudas = {
    totalPendiente: 650.00,
    totalRecargos: 36.00,
    totalGeneral: 686.00,
    deudasVencidas: 1,
    proximoVencimiento: "2025-03-15"
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Pagado": return <FaCheckCircle className="text-green-500" />;
      case "Pendiente": return <FaExclamationTriangle className="text-amber-500" />;
      default: return <FaExclamationTriangle className="text-red-500" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Pagado": return "text-green-400 bg-green-900/20";
      case "Pendiente": return "text-amber-400 bg-amber-900/20";
      default: return "text-red-400 bg-red-900/20";
    }
  };

  const getDiasVencimiento = (fecha: string) => {
    const hoy = new Date();
    const vencimiento = new Date(fecha);
    const diferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
    return diferencia;
  };

  return (
    <div className="min-h-screen bg-amber-50 py-10 px-4">
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
            <FaCreditCard className="text-amber-400 text-3xl" />
            <h1 className="text-3xl md:text-4xl font-bold text-amber-400">Estado de Deudas</h1>
          </div>
        </div>

        {/* Resumen de Deudas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <FaMoneyBillWave className="text-2xl" />
              <h3 className="font-bold">Total Pendiente</h3>
            </div>
            <p className="text-3xl font-bold">S/ {resumenDeudas.totalPendiente.toFixed(2)}</p>
            <p className="text-amber-100 text-sm">Sin recargos</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaExclamationTriangle className="text-amber-400 text-xl" />
              <h3 className="text-amber-400 font-bold">Recargos</h3>
            </div>
            <p className="text-3xl font-bold text-white">S/ {resumenDeudas.totalRecargos.toFixed(2)}</p>
            <p className="text-zinc-400 text-sm">Por mora</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaCalendarAlt className="text-blue-400 text-xl" />
              <h3 className="text-blue-400 font-bold">Próximo Venc.</h3>
            </div>
            <p className="text-xl font-bold text-white">{resumenDeudas.proximoVencimiento}</p>
            <p className="text-zinc-400 text-sm">{getDiasVencimiento(resumenDeudas.proximoVencimiento)} días</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaCreditCard className="text-purple-400 text-xl" />
              <h3 className="text-purple-400 font-bold">Total a Pagar</h3>
            </div>
            <p className="text-3xl font-bold text-white">S/ {resumenDeudas.totalGeneral.toFixed(2)}</p>
            <p className="text-zinc-400 text-sm">Incluye recargos</p>
          </div>
        </div>

        {/* Tabla de Deudas */}
        <div className="bg-zinc-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FaCreditCard className="text-amber-400" />
            Detalle de Obligaciones Financieras
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-white">
              <thead>
                <tr className="bg-amber-500 text-zinc-900">
                  <th className="py-3 px-4 font-bold">Concepto</th>
                  <th className="py-3 px-4 font-bold">Descripción</th>
                  <th className="py-3 px-4 font-bold text-center">Monto</th>
                  <th className="py-3 px-4 font-bold text-center">Recargo</th>
                  <th className="py-3 px-4 font-bold text-center">Vencimiento</th>
                  <th className="py-3 px-4 font-bold text-center">Estado</th>
                  <th className="py-3 px-4 font-bold text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {deudasData.map((deuda, index) => (
                  <tr key={index} className="border-b border-zinc-700 hover:bg-zinc-700/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getEstadoIcon(deuda.estado)}
                        <span className="font-medium">{deuda.concepto}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-zinc-300 text-sm">{deuda.descripcion}</td>
                    <td className="py-4 px-4 text-center font-bold text-lg">S/ {deuda.monto.toFixed(2)}</td>
                    <td className="py-4 px-4 text-center">
                      {deuda.recargo > 0 ? (
                        <span className="text-red-400 font-bold">S/ {deuda.recargo.toFixed(2)}</span>
                      ) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col">
                        <span className="font-medium">{deuda.fechaVencimiento}</span>
                        {deuda.estado !== "Pagado" && (
                          <span className={`text-xs ${getDiasVencimiento(deuda.fechaVencimiento) < 0 ? 'text-red-400' : 'text-zinc-400'}`}>
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
                      {deuda.estado === "Pagado" ? (
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1">
                          <FaDownload className="w-3 h-3" />
                          Recibo
                        </button>
                      ) : (
                        <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-xs transition-colors">
                          Pagar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Información de Pagos */}
        <div className="bg-zinc-800 rounded-xl p-6">
          <h3 className="text-amber-400 font-bold text-lg mb-4">Modalidades de Pago</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 rounded-lg p-4">
              <h4 className="text-white font-bold mb-2">Presencial</h4>
              <ul className="text-zinc-300 text-sm space-y-1">
                <li>• Caja de la Universidad (Horario: 8:00 AM - 4:00 PM)</li>
                <li>• Banco de la Nación (Cuenta: 00-123-456789)</li>
                <li>• Banco Continental (Cuenta: 98-765-432101)</li>
              </ul>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4">
              <h4 className="text-white font-bold mb-2">Virtual</h4>
              <ul className="text-zinc-300 text-sm space-y-1">
                <li>• Banca por Internet</li>
                <li>• Aplicaciones móviles bancarias</li>
                <li>• PagoEfectivo (Código de pago disponible)</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-amber-900/20 rounded-lg border-l-4 border-amber-400">
            <p className="text-amber-200 text-sm">
              <strong>Importante:</strong> Los pagos realizados pueden demorar hasta 24 horas en reflejarse en el sistema. 
              Conserve su comprobante de pago hasta que se actualice su estado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
