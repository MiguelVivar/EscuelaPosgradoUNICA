'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FiArrowLeft, FiSearch, FiDownload, FiCalendar, FiDollarSign, FiUser, FiBook, FiClock, FiSettings } from 'react-icons/fi';

// Mock data - fácil de eliminar después
const MOCK_STUDENTS = [
  {
    id: '1',
    codigo: 'EST001',
    nombre: 'Ana García Pérez',
    email: 'ana.garcia@email.com',
    telefono: '987654321',
    programas: ['maestria-administracion', 'diplomado-gestion']
  },
  {
    id: '2',
    codigo: 'EST002',
    nombre: 'Carlos Mendoza Silva',
    email: 'carlos.mendoza@email.com',
    telefono: '987654322',
    programas: ['maestria-sistemas']
  },
  {
    id: '3',
    codigo: 'EST003',
    nombre: 'María López Torres',
    email: 'maria.lopez@email.com',
    telefono: '987654323',
    programas: ['doctorado-educacion']
  },
  {
    id: '4',
    codigo: 'EST004',
    nombre: 'Luis Rodríguez Vega',
    email: 'luis.rodriguez@email.com',
    telefono: '987654324',
    programas: ['maestria-gestion-publica']
  }
];

const MOCK_PROGRAMS = [
  {
    id: 'maestria-administracion',
    nombre: 'Maestría en Administración',
    duracion: 4, // semestres
    modalidad: 'Presencial',
    costoTotal: 12000.00,
    costoPorSemestre: 3000.00,
    conceptosAdicionales: [
      { concepto: 'Matrícula por semestre', monto: 300.00 },
      { concepto: 'Biblioteca digital', monto: 200.00 },
      { concepto: 'Laboratorio de casos', monto: 150.00 }
    ]
  },
  {
    id: 'maestria-sistemas',
    nombre: 'Maestría en Ingeniería de Sistemas',
    duracion: 4,
    modalidad: 'Semipresencial',
    costoTotal: 15000.00,
    costoPorSemestre: 3750.00,
    conceptosAdicionales: [
      { concepto: 'Matrícula por semestre', monto: 400.00 },
      { concepto: 'Laboratorio de sistemas', monto: 500.00 },
      { concepto: 'Plataforma virtual', monto: 250.00 }
    ]
  },
  {
    id: 'doctorado-educacion',
    nombre: 'Doctorado en Educación',
    duracion: 6,
    modalidad: 'Presencial',
    costoTotal: 24000.00,
    costoPorSemestre: 4000.00,
    conceptosAdicionales: [
      { concepto: 'Matrícula por semestre', monto: 500.00 },
      { concepto: 'Seminarios de investigación', monto: 800.00 },
      { concepto: 'Tutoría doctoral', monto: 600.00 }
    ]
  },
  {
    id: 'maestria-gestion-publica',
    nombre: 'Maestría en Gestión Pública',
    duracion: 4,
    modalidad: 'Virtual',
    costoTotal: 10000.00,
    costoPorSemestre: 2500.00,
    conceptosAdicionales: [
      { concepto: 'Matrícula por semestre', monto: 250.00 },
      { concepto: 'Plataforma e-learning', monto: 300.00 },
      { concepto: 'Tutorías virtuales', monto: 200.00 }
    ]
  },
  {
    id: 'diplomado-gestion',
    nombre: 'Diplomado en Gestión Empresarial',
    duracion: 2,
    modalidad: 'Presencial',
    costoTotal: 4000.00,
    costoPorSemestre: 2000.00,
    conceptosAdicionales: [
      { concepto: 'Matrícula por semestre', monto: 200.00 },
      { concepto: 'Material didáctico', monto: 150.00 },
      { concepto: 'Certificación', monto: 100.00 }
    ]
  }
];

interface PaymentPlan {
  semestre: number;
  fechaInicio: string;
  fechaFin: string;
  pension: number;
  conceptosAdicionales: Array<{ concepto: string; monto: number }>;
  totalSemestre: number;
}

interface Student {
  id: string;
  codigo: string;
  nombre: string;
  email: string;
  telefono: string;
  programas: string[];
}

interface Program {
  id: string;
  nombre: string;
  duracion: number;
  modalidad: string;
  costoTotal: number;
  costoPorSemestre: number;
  conceptosAdicionales: Array<{ concepto: string; monto: number }>;
}

export default function CuotasProgramaPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredStudents = MOCK_STUDENTS.filter(student =>
    student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availablePrograms = selectedStudent 
    ? MOCK_PROGRAMS.filter(program => selectedStudent.programas.includes(program.id))
    : MOCK_PROGRAMS;

  const generatePaymentPlan = useCallback((program: Program) => {
    const plan: PaymentPlan[] = [];
    const currentDate = new Date();
    
    for (let i = 1; i <= program.duracion; i++) {
      const semestreStart = new Date(currentDate);
      semestreStart.setMonth(currentDate.getMonth() + (i - 1) * 6);
      
      const semestreEnd = new Date(semestreStart);
      semestreEnd.setMonth(semestreStart.getMonth() + 5);
      semestreEnd.setDate(semestreEnd.getDate() + 29); // Final del semestre
      
      const totalConceptos = program.conceptosAdicionales.reduce((sum, concepto) => sum + concepto.monto, 0);
      
      plan.push({
        semestre: i,
        fechaInicio: semestreStart.toISOString().split('T')[0],
        fechaFin: semestreEnd.toISOString().split('T')[0],
        pension: program.costoPorSemestre,
        conceptosAdicionales: program.conceptosAdicionales,
        totalSemestre: program.costoPorSemestre + totalConceptos
      });
    }
    
    return plan;
  }, []);

  const handleProgramSelect = useCallback((program: Program) => {
    setLoading(true);
    setSelectedProgram(program);
    
    setTimeout(() => {
      const plan = generatePaymentPlan(program);
      setPaymentPlan(plan);
      setLoading(false);
    }, 1000);
  }, [generatePaymentPlan]);

  const exportPaymentPlan = useCallback(() => {
    if (!selectedStudent || !selectedProgram || !paymentPlan.length) return;

    const csvContent = [
      ['Estudiante', selectedStudent.nombre],
      ['Código', selectedStudent.codigo],
      ['Programa', selectedProgram.nombre],
      ['Modalidad', selectedProgram.modalidad],
      ['Duración', `${selectedProgram.duracion} semestres`],
      ['Costo Total', `S/. ${selectedProgram.costoTotal.toFixed(2)}`],
      [''],
      ['Semestre', 'Fecha Inicio', 'Fecha Fin', 'Pensión', 'Conceptos Adicionales', 'Total Semestre'],
      ...paymentPlan.map(plan => [
        `Semestre ${plan.semestre}`,
        plan.fechaInicio,
        plan.fechaFin,
        `S/. ${plan.pension.toFixed(2)}`,
        plan.conceptosAdicionales.map(c => `${c.concepto}: S/. ${c.monto.toFixed(2)}`).join('; '),
        `S/. ${plan.totalSemestre.toFixed(2)}`
      ]),
      [''],
      ['Total del Programa', '', '', '', '', `S/. ${paymentPlan.reduce((sum, plan) => sum + plan.totalSemestre, 0).toFixed(2)}`]
    ];

    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cuotas_${selectedStudent.codigo}_${selectedProgram.id}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [selectedStudent, selectedProgram, paymentPlan]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 p-8">
      <div className="max-w-7xl mx-auto">
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
              <h1 className="text-4xl font-bold text-gray-800">Cuotas por Programa</h1>
              <p className="text-lg text-gray-600">
                {user?.role === 'ADMIN' ? 'Calcular cuotas de programas académicos' : 'Ver mis cuotas de programa'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Panel de Búsqueda de Estudiante */}
          <div className="xl:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {user?.role === 'ADMIN' ? 'Seleccionar Estudiante' : 'Mi Información'}
              </h3>
              
              {user?.role === 'ADMIN' ? (
                <>
                  <div className="relative mb-4">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar estudiante..."
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
                          setSelectedProgram(null);
                          setPaymentPlan([]);
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedStudent?.id === student.id
                            ? 'bg-blue-50 border-blue-300'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-medium text-gray-800">{student.nombre}</div>
                        <div className="text-sm text-gray-600">{student.codigo}</div>
                        <div className="text-xs text-gray-500">{student.programas.length} programa(s)</div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="text-4xl mb-2">👤</div>
                  <p className="text-gray-600 mb-4">Ver mis cuotas de programa</p>
                  <button
                    onClick={() => {
                      setSelectedStudent(MOCK_STUDENTS[0]);
                      setSelectedProgram(null);
                      setPaymentPlan([]);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ver Mis Cuotas
                  </button>
                </div>
              )}
            </div>

            {/* Panel de Programas */}
            {selectedStudent && (
              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Programas Disponibles</h3>
                <div className="space-y-2">
                  {availablePrograms.map((program) => (
                    <button
                      key={program.id}
                      onClick={() => handleProgramSelect(program)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedProgram?.id === program.id
                          ? 'bg-green-50 border-green-300'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium text-gray-800 text-sm">{program.nombre}</div>
                      <div className="text-xs text-gray-600">{program.modalidad}</div>
                      <div className="text-xs text-gray-500">{program.duracion} semestres</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panel Principal */}
          <div className="xl:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Cálculo de Cuotas</h3>
                {selectedProgram && paymentPlan.length > 0 && (
                  <button
                    onClick={exportPaymentPlan}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FiDownload />
                    Exportar Plan
                  </button>
                )}
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Calculando cuotas del programa...</p>
                </div>
              ) : selectedStudent && selectedProgram && paymentPlan.length > 0 ? (
                <>
                  {/* Información del estudiante y programa */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <FiUser className="text-blue-600" />
                        <h4 className="font-medium text-gray-800">Información del Estudiante</h4>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div><span className="font-medium">Nombre:</span> {selectedStudent.nombre}</div>
                        <div><span className="font-medium">Código:</span> {selectedStudent.codigo}</div>
                        <div><span className="font-medium">Email:</span> {selectedStudent.email}</div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <FiBook className="text-green-600" />
                        <h4 className="font-medium text-gray-800">Información del Programa</h4>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div><span className="font-medium">Programa:</span> {selectedProgram.nombre}</div>
                        <div><span className="font-medium">Modalidad:</span> {selectedProgram.modalidad}</div>
                        <div><span className="font-medium">Duración:</span> {selectedProgram.duracion} semestres</div>
                        <div><span className="font-medium">Costo Total:</span> S/. {selectedProgram.costoTotal.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Resumen financiero */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-amber-50 p-4 rounded-lg text-center">
                      <FiSettings className="text-amber-600 text-2xl mx-auto mb-2" />
                      <div className="text-lg font-bold text-amber-800">
                        S/. {selectedProgram.costoPorSemestre.toFixed(2)}
                      </div>
                      <div className="text-sm text-amber-600">Pensión por Semestre</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <FiClock className="text-purple-600 text-2xl mx-auto mb-2" />
                      <div className="text-lg font-bold text-purple-800">
                        {selectedProgram.duracion}
                      </div>
                      <div className="text-sm text-purple-600">Semestres Totales</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <FiDollarSign className="text-red-600 text-2xl mx-auto mb-2" />
                      <div className="text-lg font-bold text-red-800">
                        S/. {paymentPlan.reduce((sum, plan) => sum + plan.totalSemestre, 0).toFixed(2)}
                      </div>
                      <div className="text-sm text-red-600">Total del Programa</div>
                    </div>
                  </div>

                  {/* Tabla de cuotas */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-3 text-left">Semestre</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">Período</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">Pensión</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">Conceptos Adicionales</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">Total Semestre</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentPlan.map((plan, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 font-medium">
                              Semestre {plan.semestre}
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              <div className="flex items-center gap-1 text-sm">
                                <FiCalendar className="text-gray-400" />
                                {plan.fechaInicio} / {plan.fechaFin}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 font-medium">
                              S/. {plan.pension.toFixed(2)}
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              <div className="space-y-1">
                                {plan.conceptosAdicionales.map((concepto, i) => (
                                  <div key={i} className="text-sm">
                                    {concepto.concepto}: <span className="font-medium">S/. {concepto.monto.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 font-bold text-lg">
                              S/. {plan.totalSemestre.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-100 font-bold">
                          <td colSpan={4} className="border border-gray-300 px-4 py-3 text-right">
                            TOTAL DEL PROGRAMA:
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-xl text-red-600">
                            S/. {paymentPlan.reduce((sum, plan) => sum + plan.totalSemestre, 0).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 text-xs text-gray-500">
                    Plan generado automáticamente el {new Date().toLocaleDateString()} por {user?.nombres || 'Sistema'}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">Calculadora de Cuotas</h3>
                  <p className="text-gray-600 mb-4">
                    {!selectedStudent 
                      ? 'Selecciona un estudiante para comenzar'
                      : 'Selecciona un programa académico para calcular las cuotas de pago'
                    }
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>• Se calculan automáticamente las cuotas por semestre</p>
                    <p>• Incluye conceptos adicionales y fechas de pago</p>
                    <p>• Exportable a CSV para reportes</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Información sobre Cuotas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">💰 Cálculo Automático</h4>
              <p>Las cuotas se calculan automáticamente basándose en la duración del programa y los conceptos adicionales correspondientes.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">📅 Fechas de Pago</h4>
              <p>Se generan fechas estimadas para cada semestre. Las fechas reales pueden variar según el calendario académico oficial.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">📋 Conceptos Incluidos</h4>
              <p>Incluye pensiones, matrículas, laboratorios y otros conceptos específicos según el programa académico seleccionado.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
