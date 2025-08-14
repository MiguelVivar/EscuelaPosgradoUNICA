"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button, LoadingSpinner } from "@/components/common";
import { FiArrowLeft, FiRefreshCw, FiBook, FiCheck, FiX, FiDownload } from "react-icons/fi";

// Mock data - tipos
interface PlanEstudio {
  id: number;
  nombre: string;
  codigo: string;
  version: string;
  facultad: string;
  estado: string;
}

interface Curso {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
  semestre: number;
  tipo: string;
}

interface Equivalencia {
  id: number;
  cursoActual: Curso;
  cursoEquivalente: Curso | null;
  tipoEquivalencia: 'EXACTA' | 'PARCIAL' | 'NO_EQUIVALE';
  observaciones?: string;
}

// Mock data
const mockPlanesEstudio: PlanEstudio[] = [
  {
    id: 1,
    nombre: "Maestría en Administración de Negocios",
    codigo: "MBA-2020",
    version: "2020",
    facultad: "Administración",
    estado: "ACTIVO"
  },
  {
    id: 2,
    nombre: "Maestría en Administración de Negocios",
    codigo: "MBA-2024",
    version: "2024",
    facultad: "Administración",
    estado: "ACTIVO"
  },
  {
    id: 3,
    nombre: "Maestría en Gestión Pública",
    codigo: "MGP-2021",
    version: "2021",
    facultad: "Administración",
    estado: "ACTIVO"
  }
];

const mockCursos: Curso[] = [
  { id: 1, codigo: "ADM501", nombre: "Gestión Estratégica", creditos: 4, semestre: 1, tipo: "OBLIGATORIO" },
  { id: 2, codigo: "ADM502", nombre: "Finanzas Corporativas", creditos: 4, semestre: 1, tipo: "OBLIGATORIO" },
  { id: 3, codigo: "ADM503", nombre: "Marketing Avanzado", creditos: 3, semestre: 2, tipo: "OBLIGATORIO" },
  { id: 4, codigo: "ADM504", nombre: "Recursos Humanos", creditos: 3, semestre: 2, tipo: "ELECTIVO" },
  { id: 5, codigo: "ADM601", nombre: "Liderazgo Empresarial", creditos: 4, semestre: 1, tipo: "OBLIGATORIO" },
  { id: 6, codigo: "ADM602", nombre: "Análisis Financiero", creditos: 4, semestre: 1, tipo: "OBLIGATORIO" },
  { id: 7, codigo: "ADM603", nombre: "Estrategias de Marketing", creditos: 3, semestre: 2, tipo: "OBLIGATORIO" },
  { id: 8, codigo: "ADM604", nombre: "Gestión del Talento", creditos: 3, semestre: 2, tipo: "ELECTIVO" }
];

export default function EquivalenciaPlanesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Estados
  const [planActual, setPlanActual] = useState<number | "">("");
  const [planNuevo, setPlanNuevo] = useState<number | "">("");
  const [equivalencias, setEquivalencias] = useState<Equivalencia[]>([]);
  const [generandoEquivalencias, setGenerandoEquivalencias] = useState(false);
  const [cursosActuales, setCursosActuales] = useState<Curso[]>([]);
  const [cursosNuevos, setCursosNuevos] = useState<Curso[]>([]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/iniciar-sesion");
        return;
      }
      
      if (user && user.role !== 'ADMIN' && user.role !== 'COORDINADOR') {
        router.push("/campus-virtual");
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
        <LoadingSpinner size="lg" message="Cargando Equivalencia de Planes..." />
      </div>
    );
  }

  if (!isAuthenticated || !user || (user.role !== 'ADMIN' && user.role !== 'COORDINADOR')) {
    return null;
  }

  const generarEquivalencias = async () => {
    if (!planActual || !planNuevo) return;

    setGenerandoEquivalencias(true);

    // Simular generación de equivalencias
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock de equivalencias generadas
    const equivalenciasGeneradas: Equivalencia[] = cursosActuales.map((cursoActual, index) => {
      const cursoEquivalente = cursosNuevos[index] || null;
      let tipoEquivalencia: 'EXACTA' | 'PARCIAL' | 'NO_EQUIVALE' = 'NO_EQUIVALE';
      let observaciones = '';

      if (cursoEquivalente) {
        if (cursoActual.creditos === cursoEquivalente.creditos && 
            cursoActual.tipo === cursoEquivalente.tipo) {
          tipoEquivalencia = 'EXACTA';
        } else {
          tipoEquivalencia = 'PARCIAL';
          observaciones = `Diferencia en créditos: ${cursoActual.creditos} vs ${cursoEquivalente.creditos}`;
        }
      } else {
        observaciones = 'No existe curso equivalente en el plan nuevo';
      }

      return {
        id: index + 1,
        cursoActual,
        cursoEquivalente,
        tipoEquivalencia,
        observaciones
      };
    });

    setEquivalencias(equivalenciasGeneradas);
    setGenerandoEquivalencias(false);
  };

  const handlePlanActualChange = (planId: string) => {
    setPlanActual(planId === "" ? "" : Number(planId));
    if (planId === "1") {
      setCursosActuales(mockCursos.slice(0, 4));
    } else if (planId === "2") {
      setCursosActuales(mockCursos.slice(4, 8));
    } else {
      setCursosActuales([]);
    }
    setEquivalencias([]);
  };

  const handlePlanNuevoChange = (planId: string) => {
    setPlanNuevo(planId === "" ? "" : Number(planId));
    if (planId === "2") {
      setCursosNuevos(mockCursos.slice(4, 8));
    } else if (planId === "1") {
      setCursosNuevos(mockCursos.slice(0, 4));
    } else {
      setCursosNuevos([]);
    }
    setEquivalencias([]);
  };

  const getTipoEquivalenciaColor = (tipo: string) => {
    switch (tipo) {
      case 'EXACTA':
        return 'bg-green-100 text-green-800';
      case 'PARCIAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'NO_EQUIVALE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoEquivalenciaIcon = (tipo: string) => {
    switch (tipo) {
      case 'EXACTA':
        return <FiCheck className="w-4 h-4" />;
      case 'PARCIAL':
        return <FiRefreshCw className="w-4 h-4" />;
      case 'NO_EQUIVALE':
        return <FiX className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const exportarEquivalencias = () => {
    const data = equivalencias.map(eq => ({
      'Curso Actual': `${eq.cursoActual.codigo} - ${eq.cursoActual.nombre}`,
      'Créditos Actual': eq.cursoActual.creditos,
      'Curso Equivalente': eq.cursoEquivalente ? `${eq.cursoEquivalente.codigo} - ${eq.cursoEquivalente.nombre}` : 'N/A',
      'Créditos Equivalente': eq.cursoEquivalente?.creditos || 'N/A',
      'Tipo Equivalencia': eq.tipoEquivalencia,
      'Observaciones': eq.observaciones || 'N/A'
    }));

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `equivalencias_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                href="/campus-virtual/matricula"
                variant="outline"
                leftIcon={FiArrowLeft}
                className="hover:scale-105 transition-transform duration-200"
              >
                Volver
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  🔄 Equivalencia entre Planes de Estudio
                </h1>
                <p className="text-gray-600 mt-1">
                  Generar tabla de equivalencias entre plan actual y plan nuevo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Selección */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiBook className="text-green-600" />
            Seleccionar Planes de Estudio
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Actual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan de Estudio Actual
              </label>
              <select
                value={planActual}
                onChange={(e) => handlePlanActualChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Seleccionar plan actual</option>
                {mockPlanesEstudio.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.nombre} - {plan.version} ({plan.codigo})
                  </option>
                ))}
              </select>
            </div>

            {/* Plan Nuevo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan de Estudio Nuevo
              </label>
              <select
                value={planNuevo}
                onChange={(e) => handlePlanNuevoChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Seleccionar plan nuevo</option>
                {mockPlanesEstudio.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.nombre} - {plan.version} ({plan.codigo})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón Generar */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={generarEquivalencias}
              disabled={!planActual || !planNuevo || generandoEquivalencias}
              leftIcon={FiRefreshCw}
              className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              {generandoEquivalencias ? 'Generando...' : 'Generar Equivalencias'}
            </Button>
          </div>
        </div>

        {/* Tabla de Equivalencias */}
        {equivalencias.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FiRefreshCw className="text-green-600" />
                Tabla de Equivalencias
              </h2>
              <Button
                onClick={exportarEquivalencias}
                variant="outline"
                leftIcon={FiDownload}
                size="sm"
              >
                Exportar CSV
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Curso Actual
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Curso Equivalente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Observaciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {equivalencias.map((equivalencia) => (
                    <tr key={equivalencia.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {equivalencia.cursoActual.codigo}
                          </div>
                          <div className="text-sm text-gray-500">
                            {equivalencia.cursoActual.nombre}
                          </div>
                          <div className="text-xs text-gray-400">
                            {equivalencia.cursoActual.creditos} créditos
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {equivalencia.cursoEquivalente ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {equivalencia.cursoEquivalente.codigo}
                            </div>
                            <div className="text-sm text-gray-500">
                              {equivalencia.cursoEquivalente.nombre}
                            </div>
                            <div className="text-xs text-gray-400">
                              {equivalencia.cursoEquivalente.creditos} créditos
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Sin equivalencia</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTipoEquivalenciaColor(equivalencia.tipoEquivalencia)}`}>
                          {getTipoEquivalenciaIcon(equivalencia.tipoEquivalencia)}
                          {equivalencia.tipoEquivalencia.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs">
                          {equivalencia.observaciones || '-'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {equivalencias.length === 0 && planActual && planNuevo && !generandoEquivalencias && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 text-center">
            <FiRefreshCw className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Genera las Equivalencias
            </h3>
            <p className="text-gray-500 mb-4">
              Haz clic en &quot;Generar Equivalencias&quot; para crear la tabla de equivalencias entre los planes seleccionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
