'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FiArrowLeft, FiSearch, FiDownload, FiPrinter, FiCalendar, FiDollarSign, FiUser, FiBook, FiPlus, FiTrash2, FiSave, FiEdit3 } from 'react-icons/fi';
import { 
  MOCK_STUDENTS, 
  MOCK_GENERATED_BOLETAS, 
  addBoletaToMock, 
  generateBoletaId, 
  generateConceptId,
  BoletaConcept,
  GeneratedBoleta,
  Student
} from '@/data/esquelas-mock';

// TODO: conectar con backend
const MOCK_PAYMENT_DETAILS = {
  'EST001': {
    conceptos: [
      { id: 1, concepto: 'Matrícula 2024-I', monto: 1200.00, fechaVencimiento: '2024-03-15', estado: 'pendiente' },
      { id: 2, concepto: 'Pensión Marzo 2024', monto: 800.00, fechaVencimiento: '2024-03-31', estado: 'pendiente' },
      { id: 3, concepto: 'Pensión Abril 2024', monto: 800.00, fechaVencimiento: '2024-04-30', estado: 'pendiente' },
      { id: 4, concepto: 'Biblioteca Virtual', monto: 150.00, fechaVencimiento: '2024-03-20', estado: 'pendiente' }
    ],
    totalPendiente: 2950.00,
    fechaGeneracion: '2024-03-10'
  },
  'EST002': {
    conceptos: [
      { id: 1, concepto: 'Matrícula 2024-I', monto: 1500.00, fechaVencimiento: '2024-03-15', estado: 'pendiente' },
      { id: 2, concepto: 'Pensión Marzo 2024', monto: 900.00, fechaVencimiento: '2024-03-31', estado: 'pendiente' },
      { id: 3, concepto: 'Laboratorio de Sistemas', monto: 200.00, fechaVencimiento: '2024-03-25', estado: 'pendiente' }
    ],
    totalPendiente: 2600.00,
    fechaGeneracion: '2024-03-10'
  },
  'EST003': {
    conceptos: [
      { id: 1, concepto: 'Matrícula 2024-I', monto: 1800.00, fechaVencimiento: '2024-03-15', estado: 'pendiente' },
      { id: 2, concepto: 'Pensión Marzo 2024', monto: 1200.00, fechaVencimiento: '2024-03-31', estado: 'pendiente' },
      { id: 3, concepto: 'Tesis Doctoral', monto: 500.00, fechaVencimiento: '2024-04-15', estado: 'pendiente' }
    ],
    totalPendiente: 3500.00,
    fechaGeneracion: '2024-03-10'
  },
  'EST004': {
    conceptos: [
      { id: 1, concepto: 'Matrícula 2024-I', monto: 1100.00, fechaVencimiento: '2024-03-15', estado: 'pendiente' },
      { id: 2, concepto: 'Pensión Marzo 2024', monto: 750.00, fechaVencimiento: '2024-03-31', estado: 'pendiente' },
      { id: 3, concepto: 'Certificados', monto: 80.00, fechaVencimiento: '2024-03-18', estado: 'pendiente' }
    ],
    totalPendiente: 1930.00,
    fechaGeneracion: '2024-03-10'
  }
};

interface PaymentConcept {
  id: number;
  concepto: string;
  monto: number;
  fechaVencimiento: string;
  estado: string;
}

interface PaymentDetails {
  conceptos: PaymentConcept[];
  totalPendiente: number;
  fechaGeneracion: string;
}

export default function EsquelaPagosPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Nuevos estados para la funcionalidad de creación de boletas
  const [isCreatingBoleta, setIsCreatingBoleta] = useState(false);
  const [boletaConceptos, setBoletaConceptos] = useState<BoletaConcept[]>([
    { id: generateConceptId(), concepto: '', monto: 0, fechaVencimiento: '', estado: 'Pendiente' }
  ]);
  const [generatedBoletas, setGeneratedBoletas] = useState<GeneratedBoleta[]>(MOCK_GENERATED_BOLETAS);
  const [selectedBoleta, setSelectedBoleta] = useState<GeneratedBoleta | null>(null);

  const filteredStudents = MOCK_STUDENTS.filter(student =>
    student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.programa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Esta función ya no se usa pero se mantiene por compatibilidad
  // const handleStudentSelect = useCallback(async (student: Student) => {
  //   setLoading(true);
  //   setSelectedStudent(student);
  //   
  //   // Simular carga de datos
  //   setTimeout(() => {
  //     const details = MOCK_PAYMENT_DETAILS[student.codigo as keyof typeof MOCK_PAYMENT_DETAILS];
  //     setPaymentDetails(details || null);
  //     setLoading(false);
  //   }, 800);
  // }, []);

  const generateEsquela = useCallback(() => {
    if (!selectedStudent || !paymentDetails) return;

    const esquela = `
ESQUELA DE PAGOS
================

DATOS DEL ESTUDIANTE:
- Código: ${selectedStudent.codigo}
- Nombre: ${selectedStudent.nombre}
- Programa: ${selectedStudent.programa}
- Email: ${selectedStudent.email}
- Teléfono: ${selectedStudent.telefono}

CONCEPTOS PENDIENTES:
${paymentDetails.conceptos.map(concepto => 
  `- ${concepto.concepto}: S/. ${concepto.monto.toFixed(2)} (Vence: ${concepto.fechaVencimiento})`
).join('\n')}

TOTAL PENDIENTE: S/. ${paymentDetails.totalPendiente.toFixed(2)}

Fecha de generación: ${paymentDetails.fechaGeneracion}
Generado por: ${user?.nombres || 'Sistema'}

---
ESCUELA DE POSGRADO UNICA
    `;

    const blob = new Blob([esquela], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `esquela_${selectedStudent.codigo}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [selectedStudent, paymentDetails, user?.nombres]);

  const printEsquela = useCallback(() => {
    if (!selectedStudent || !paymentDetails) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Esquela de Pagos - ${selectedStudent.codigo}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .student-info { margin-bottom: 20px; }
          .concepts-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .concepts-table th, .concepts-table td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          .concepts-table th { background-color: #f5f5f5; }
          .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ESQUELA DE PAGOS</h1>
          <h2>ESCUELA DE POSGRADO UNICA</h2>
        </div>
        
        <div class="student-info">
          <h3>DATOS DEL ESTUDIANTE</h3>
          <p><strong>Código:</strong> ${selectedStudent.codigo}</p>
          <p><strong>Nombre:</strong> ${selectedStudent.nombre}</p>
          <p><strong>Programa:</strong> ${selectedStudent.programa}</p>
          <p><strong>Email:</strong> ${selectedStudent.email}</p>
          <p><strong>Teléfono:</strong> ${selectedStudent.telefono}</p>
        </div>

        <h3>CONCEPTOS PENDIENTES</h3>
        <table class="concepts-table">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Fecha Vencimiento</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${paymentDetails.conceptos.map(concepto => `
              <tr>
                <td>${concepto.concepto}</td>
                <td>S/. ${concepto.monto.toFixed(2)}</td>
                <td>${concepto.fechaVencimiento}</td>
                <td>${concepto.estado?.toUpperCase() || 'PENDIENTE'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total">
          TOTAL PENDIENTE: S/. ${paymentDetails.totalPendiente.toFixed(2)}
        </div>

        <div class="footer">
          <p>Fecha de generación: ${paymentDetails.fechaGeneracion}</p>
          <p>Generado por: ${user?.nombres || 'Sistema'}</p>
          <p>Este documento es válido para realizar pagos en las oficinas autorizadas.</p>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  }, [selectedStudent, paymentDetails, user?.nombres]);

  // Nuevas funciones para la creación de boletas - TODO: conectar con backend
  const addBoletaConcepto = useCallback(() => {
    const newId = generateConceptId();
    setBoletaConceptos([...boletaConceptos, { 
      id: newId, 
      concepto: '', 
      monto: 0, 
      fechaVencimiento: '', 
      estado: 'Pendiente' 
    }]);
  }, [boletaConceptos]);

  const removeBoletaConcepto = useCallback((id: string) => {
    if (boletaConceptos.length > 1) {
      setBoletaConceptos(boletaConceptos.filter(c => c.id !== id));
    }
  }, [boletaConceptos]);

  const updateBoletaConcepto = useCallback((id: string, field: string, value: string | number) => {
    setBoletaConceptos(boletaConceptos.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  }, [boletaConceptos]);

  const generateBoleta = useCallback(() => {
    if (!selectedStudent || boletaConceptos.some(c => !c.concepto || !c.monto || !c.fechaVencimiento)) {
      alert('Por favor completa todos los campos');
      return;
    }

    const conceptosValidos = boletaConceptos.map(c => ({
      id: c.id,
      concepto: c.concepto,
      monto: typeof c.monto === 'string' ? parseFloat(c.monto) : c.monto,
      fechaVencimiento: c.fechaVencimiento,
      estado: c.estado || 'Pendiente' as 'Pendiente' | 'Pagado' | 'Vencido'
    }));

    const total = conceptosValidos.reduce((sum, c) => sum + c.monto, 0);
    
    const nuevaBoleta: GeneratedBoleta = {
      id: generateBoletaId(),
      estudianteId: selectedStudent.id,
      estudianteNombre: selectedStudent.nombre,
      estudianteCodigo: selectedStudent.codigo,
      estudianteEmail: selectedStudent.email,
      programa: selectedStudent.programa,
      conceptos: conceptosValidos,
      total,
      fechaGeneracion: new Date().toISOString().split('T')[0],
      generadoPor: user?.nombres || 'Sistema',
      estado: 'Activa'
    };

    // TODO: conectar con backend - por ahora agregamos al mock data
    addBoletaToMock(nuevaBoleta);
    setGeneratedBoletas([...MOCK_GENERATED_BOLETAS]);
    
    // Limpiar formulario
    setBoletaConceptos([{ 
      id: generateConceptId(), 
      concepto: '', 
      monto: 0, 
      fechaVencimiento: '', 
      estado: 'Pendiente' 
    }]);
    setIsCreatingBoleta(false);
    setSelectedStudent(null);
    
    alert('Boleta generada exitosamente');
  }, [selectedStudent, boletaConceptos, user?.nombres]);

  const selectBoletaForView = useCallback((boleta: GeneratedBoleta) => {
    setSelectedBoleta(boleta);
    setPaymentDetails({
      conceptos: boleta.conceptos.map(c => ({ 
        id: parseInt(c.id) || 0, 
        concepto: c.concepto, 
        monto: c.monto, 
        fechaVencimiento: c.fechaVencimiento, 
        estado: c.estado?.toLowerCase() || 'pendiente' 
      })),
      totalPendiente: boleta.total,
      fechaGeneracion: boleta.fechaGeneracion
    });
    
    // Crear objeto student temporal para mostrar la boleta
    const tempStudent: Student = {
      id: boleta.estudianteId,
      codigo: boleta.estudianteCodigo,
      nombre: boleta.estudianteNombre,
      programa: boleta.programa,
      email: boleta.estudianteEmail,
      telefono: ''
    };
    setSelectedStudent(tempStudent);
  }, []);

  // Filtrar boletas para el alumno actual - TODO: conectar con backend
  const studentBoletas = user?.role === 'ADMIN' || user?.role === 'COORDINADOR' 
    ? generatedBoletas 
    : generatedBoletas.filter(b => b.estudianteId === user?.email || b.estudianteId === 'EST001'); // Simulamos que el usuario logueado es EST001

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/campus-virtual/matricula">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <FiArrowLeft />
                Regresar
              </button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Esquela de Pagos</h1>
              <p className="text-lg text-gray-600">
                {user?.role === 'ADMIN' ? 'Generar esquelas de pago para estudiantes' : 'Ver y descargar mi esquela de pagos'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de Búsqueda */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {user?.role === 'ADMIN' || user?.role === 'COORDINADOR' ? 'Panel de Control' : 'Mis Boletas'}
              </h3>
              
              {user?.role === 'ADMIN' || user?.role === 'COORDINADOR' ? (
                <>
                  {/* Botones de acción para admin */}
                  <div className="space-y-3 mb-6">
                    <button
                      onClick={() => {
                        setIsCreatingBoleta(!isCreatingBoleta);
                        setSelectedStudent(null);
                        setPaymentDetails(null);
                        setSelectedBoleta(null);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                        isCreatingBoleta 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      <FiEdit3 />
                      {isCreatingBoleta ? 'Cancelar Creación' : 'Crear Nueva Boleta'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsCreatingBoleta(false);
                        setSelectedStudent(null);
                        setPaymentDetails(null);
                        setSelectedBoleta(null);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                        !isCreatingBoleta && !selectedBoleta
                          ? 'bg-green-600 text-white' 
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      <FiSearch />
                      Ver Boletas Generadas
                    </button>
                  </div>

                  {isCreatingBoleta ? (
                    // Formulario de selección de estudiante para crear boleta
                    <>
                      <div className="relative mb-4">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Buscar estudiante para crear boleta..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredStudents.map((student) => (
                          <button
                            key={student.id}
                            onClick={() => {
                              setSelectedStudent(student);
                              setPaymentDetails(null);
                            }}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              selectedStudent?.id === student.id
                                ? 'bg-blue-50 border-blue-300'
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <div className="font-medium text-gray-800">{student.nombre}</div>
                            <div className="text-sm text-gray-600">{student.codigo}</div>
                            <div className="text-xs text-gray-500">{student.programa}</div>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    // Lista de boletas generadas
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {studentBoletas.length > 0 ? (
                        studentBoletas.map((boleta) => (
                          <button
                            key={boleta.id}
                            onClick={() => selectBoletaForView(boleta)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              selectedBoleta?.id === boleta.id
                                ? 'bg-green-50 border-green-300'
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <div className="font-medium text-gray-800">{boleta.id}</div>
                            <div className="text-sm text-gray-600">{boleta.estudianteNombre}</div>
                            <div className="text-xs text-gray-500">S/. {boleta.total.toFixed(2)} - {boleta.fechaGeneracion}</div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No hay boletas generadas
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                // Vista para estudiantes - solo sus boletas
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {studentBoletas.length > 0 ? (
                    studentBoletas.map((boleta) => (
                      <button
                        key={boleta.id}
                        onClick={() => selectBoletaForView(boleta)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedBoleta?.id === boleta.id
                            ? 'bg-blue-50 border-blue-300'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-medium text-gray-800">{boleta.id}</div>
                        <div className="text-sm text-gray-600">Total: S/. {boleta.total.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">Generada: {boleta.fechaGeneracion}</div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📄</div>
                      <p className="text-gray-600">No tienes boletas generadas</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Panel de Detalles */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {isCreatingBoleta && selectedStudent 
                  ? `Crear Boleta para ${selectedStudent.nombre}`
                  : (selectedBoleta ? `Boleta ${selectedBoleta.id}` : 'Detalle de Pagos Pendientes')
                }
              </h3>
              
              {isCreatingBoleta && selectedStudent ? (
                // Formulario de creación de boleta
                <>
                  {/* Información del estudiante */}
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-blue-600" />
                        <div>
                          <div className="font-medium">{selectedStudent.nombre}</div>
                          <div className="text-sm text-gray-600">{selectedStudent.codigo}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiBook className="text-green-600" />
                        <div>
                          <div className="font-medium">Programa</div>
                          <div className="text-sm text-gray-600">{selectedStudent.programa}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Formulario de conceptos */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800">Conceptos de Pago</h4>
                      <button
                        onClick={addBoletaConcepto}
                        className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <FiPlus />
                        Agregar Concepto
                      </button>
                    </div>

                    {boletaConceptos.map((concepto) => (
                      <div key={concepto.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 border border-gray-200 rounded-lg">
                        <div className="md:col-span-5">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Concepto
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Matrícula, Pensión, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={concepto.concepto}
                            onChange={(e) => updateBoletaConcepto(concepto.id, 'concepto', e.target.value)}
                          />
                        </div>
                        
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monto (S/.)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={concepto.monto}
                            onChange={(e) => updateBoletaConcepto(concepto.id, 'monto', e.target.value)}
                          />
                        </div>
                        
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha Vencimiento
                          </label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={concepto.fechaVencimiento}
                            onChange={(e) => updateBoletaConcepto(concepto.id, 'fechaVencimiento', e.target.value)}
                          />
                        </div>
                        
                        <div className="md:col-span-1 flex items-end">
                          {boletaConceptos.length > 1 && (
                            <button
                              onClick={() => removeBoletaConcepto(concepto.id)}
                              className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                              title="Eliminar concepto"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total y botón generar */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="text-green-600 text-xl" />
                      <div>
                        <div className="text-sm text-gray-600">Total de la Boleta</div>
                        <div className="text-2xl font-bold text-green-600">
                          S/. {boletaConceptos.reduce((sum, c) => {
                            const monto = typeof c.monto === 'string' ? parseFloat(c.monto) || 0 : c.monto;
                            return sum + monto;
                          }, 0).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={generateBoleta}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <FiSave />
                      Generar Boleta
                    </button>
                  </div>
                </>
              ) : loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando información de pagos...</p>
                </div>
              ) : selectedStudent && paymentDetails ? (
                <>
                  {/* Información del estudiante */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-blue-600" />
                        <div>
                          <div className="font-medium">{selectedStudent.nombre}</div>
                          <div className="text-sm text-gray-600">{selectedStudent.codigo}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiBook className="text-green-600" />
                        <div>
                          <div className="font-medium">Programa</div>
                          <div className="text-sm text-gray-600">{selectedStudent.programa}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabla de conceptos */}
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-3 text-left">Concepto</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">Monto</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">Vencimiento</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentDetails.conceptos.map((concepto) => (
                          <tr key={concepto.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3">{concepto.concepto}</td>
                            <td className="border border-gray-300 px-4 py-3 font-medium">
                              S/. {concepto.monto.toFixed(2)}
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              <div className="flex items-center gap-1">
                                <FiCalendar className="text-gray-400" />
                                {concepto.fechaVencimiento}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                concepto.estado === 'pendiente' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {concepto.estado?.toUpperCase() || 'PENDIENTE'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Total y acciones */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="text-red-600 text-xl" />
                      <div>
                        <div className="text-sm text-gray-600">Total Pendiente</div>
                        <div className="text-2xl font-bold text-red-600">
                          S/. {paymentDetails.totalPendiente.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={generateEsquela}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <FiDownload />
                        Descargar
                      </button>
                      <button
                        onClick={printEsquela}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FiPrinter />
                        Imprimir
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-500">
                    Fecha de generación: {paymentDetails.fechaGeneracion} | Generado por: {user?.nombres || 'Sistema'}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🧾</div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {user?.role === 'ADMIN' ? 'Selecciona un estudiante' : 'Esquela de Pagos'}
                  </h3>
                  <p className="text-gray-600">
                    {user?.role === 'ADMIN' 
                      ? 'Busca y selecciona un estudiante para generar su esquela de pagos.'
                      : 'Aquí podrás ver y descargar tu esquela de pagos con todos los conceptos pendientes.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Qué es una Esquela de Pagos?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">📋 Documento Oficial</h4>
              <p>La esquela de pagos es un documento oficial que detalla todos los conceptos pendientes de pago de un estudiante.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">💰 Información Detallada</h4>
              <p>Incluye montos, fechas de vencimiento y conceptos específicos como matrícula, pensiones y servicios adicionales.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">🏦 Para Pagos</h4>
              <p>Este documento puede ser utilizado para realizar pagos en bancos, agentes autorizados o en las oficinas de la institución.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
