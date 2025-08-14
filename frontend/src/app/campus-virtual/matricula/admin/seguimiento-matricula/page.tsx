"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button, LoadingSpinner } from '@/components/common';

interface ProcesoMatricula {
  id: string;
  estudianteId: string;
  estudiante: {
    codigo: string;
    nombres: string;
    apellidos: string;
    email: string;
  };
  estado: 'INICIADO' | 'EN_PROCESO' | 'DOCUMENTOS_PENDIENTES' | 'REVISION' | 'COMPLETADO' | 'RECHAZADO';
  fechaInicio: string;
  fechaUltimaActualizacion: string;
  progreso: number; // 0-100
  etapaActual: string;
  observaciones?: string;
  documentosRequeridos: DocumentoRequerido[];
}

interface DocumentoRequerido {
  id: string;
  nombre: string;
  tipo: string;
  estado: 'PENDIENTE' | 'SUBIDO' | 'APROBADO' | 'RECHAZADO';
  fechaSubida?: string;
  observaciones?: string;
}

export default function SeguimientoMatriculaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [procesos, setProcesos] = useState<ProcesoMatricula[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [busqueda, setBusqueda] = useState('');

  // Datos de ejemplo - memorizados para evitar recreación en cada render
  const procesosEjemplo: ProcesoMatricula[] = useMemo(() => [
    {
      id: "1",
      estudianteId: "EST001",
      estudiante: {
        codigo: "2024001",
        nombres: "Juan Carlos",
        apellidos: "Pérez García",
        email: "juan.perez@unica.edu.pe"
      },
      estado: "EN_PROCESO",
      fechaInicio: "2024-08-01T10:00:00",
      fechaUltimaActualizacion: "2024-08-05T14:30:00",
      progreso: 65,
      etapaActual: "Revisión de documentos",
      observaciones: "Falta certificado médico",
      documentosRequeridos: [
        {
          id: "1",
          nombre: "Certificado de estudios",
          tipo: "ACADEMICO",
          estado: "APROBADO",
          fechaSubida: "2024-08-01T12:00:00"
        },
        {
          id: "2",
          nombre: "Certificado médico",
          tipo: "SALUD",
          estado: "PENDIENTE"
        },
        {
          id: "3",
          nombre: "Comprobante de pago",
          tipo: "FINANCIERO",
          estado: "APROBADO",
          fechaSubida: "2024-08-02T09:15:00"
        }
      ]
    },
    {
      id: "2",
      estudianteId: "EST002",
      estudiante: {
        codigo: "2024002",
        nombres: "María Elena",
        apellidos: "Rodríguez López",
        email: "maria.rodriguez@unica.edu.pe"
      },
      estado: "COMPLETADO",
      fechaInicio: "2024-07-28T08:00:00",
      fechaUltimaActualizacion: "2024-08-03T16:45:00",
      progreso: 100,
      etapaActual: "Matrícula completada",
      documentosRequeridos: [
        {
          id: "4",
          nombre: "Certificado de estudios",
          tipo: "ACADEMICO",
          estado: "APROBADO",
          fechaSubida: "2024-07-28T10:00:00"
        },
        {
          id: "5",
          nombre: "Certificado médico",
          tipo: "SALUD",
          estado: "APROBADO",
          fechaSubida: "2024-07-29T11:30:00"
        }
      ]
    },
    {
      id: "3",
      estudianteId: "EST003",
      estudiante: {
        codigo: "2024003",
        nombres: "Carlos Alberto",
        apellidos: "Sánchez Morales",
        email: "carlos.sanchez@unica.edu.pe"
      },
      estado: "DOCUMENTOS_PENDIENTES",
      fechaInicio: "2024-08-06T15:00:00",
      fechaUltimaActualizacion: "2024-08-06T15:00:00",
      progreso: 25,
      etapaActual: "Subida de documentos",
      observaciones: "Esperando documentos del estudiante",
      documentosRequeridos: [
        {
          id: "6",
          nombre: "Certificado de estudios",
          tipo: "ACADEMICO",
          estado: "PENDIENTE"
        },
        {
          id: "7",
          nombre: "DNI",
          tipo: "IDENTIFICACION",
          estado: "PENDIENTE"
        }
      ]
    }
  ], []); // Array vacío como dependencias porque son datos estáticos

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 1500));
        setProcesos(procesosEjemplo);
      } catch (error) {
        setError('Error al cargar los procesos de matrícula');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [procesosEjemplo]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'EN_PROCESO':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DOCUMENTOS_PENDIENTES':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REVISION':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'RECHAZADO':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'INICIADO':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDocumentoColor = (estado: string) => {
    switch (estado) {
      case 'APROBADO':
        return 'bg-green-100 text-green-800';
      case 'SUBIDO':
        return 'bg-blue-100 text-blue-800';
      case 'RECHAZADO':
        return 'bg-red-100 text-red-800';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const procesosFiltrados = procesos.filter(proceso => {
    const coincideBusqueda = proceso.estudiante.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
                            proceso.estudiante.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
                            proceso.estudiante.codigo.includes(busqueda);
    
    const coincideEstado = !filtroEstado || proceso.estado === filtroEstado;
    
    return coincideBusqueda && coincideEstado;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <LoadingSpinner size="lg" message="Cargando seguimiento de matrículas..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
                <span className="text-4xl">📋</span>
                Seguimiento de Matrícula
              </h1>
              <p className="text-slate-600">
                Monitoreo del proceso de matrícula para estar informado del progreso
              </p>
            </div>
            <Button
              onClick={() => router.push('/campus-virtual/matricula')}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
            >
              ← Volver
            </Button>
          </div>

          {/* Filtros */}
          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Filtros</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Buscar Estudiante
                </label>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Nombre, apellido o código..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado del Proceso
                </label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  title="Seleccionar estado del proceso"
                >
                  <option value="">Todos los estados</option>
                  <option value="INICIADO">Iniciado</option>
                  <option value="EN_PROCESO">En Proceso</option>
                  <option value="DOCUMENTOS_PENDIENTES">Documentos Pendientes</option>
                  <option value="REVISION">En Revisión</option>
                  <option value="COMPLETADO">Completado</option>
                  <option value="RECHAZADO">Rechazado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-800">Total Procesos</h4>
              <p className="text-2xl font-bold text-blue-600">{procesos.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-green-800">Completados</h4>
              <p className="text-2xl font-bold text-green-600">
                {procesos.filter(p => p.estado === 'COMPLETADO').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-yellow-800">En Proceso</h4>
              <p className="text-2xl font-bold text-yellow-600">
                {procesos.filter(p => ['EN_PROCESO', 'DOCUMENTOS_PENDIENTES', 'REVISION'].includes(p.estado)).length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-purple-800">Progreso Promedio</h4>
              <p className="text-2xl font-bold text-purple-600">
                {procesos.length > 0 ? Math.round(procesos.reduce((sum, p) => sum + p.progreso, 0) / procesos.length) : 0}%
              </p>
            </div>
          </div>

          {/* Lista de Procesos */}
          <div className="space-y-6">
            {procesosFiltrados.map((proceso) => (
              <div key={proceso.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {proceso.estudiante.nombres} {proceso.estudiante.apellidos}
                      </h3>
                      <span className="text-sm text-slate-500 font-mono">
                        {proceso.estudiante.codigo}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(proceso.estado)}`}>
                        {proceso.estado.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2">
                      📧 {proceso.estudiante.email}
                    </p>
                    
                    <p className="text-sm text-slate-600">
                      <strong>Etapa actual:</strong> {proceso.etapaActual}
                    </p>
                    
                    {proceso.observaciones && (
                      <p className="text-sm text-amber-700 mt-2">
                        <strong>Observaciones:</strong> {proceso.observaciones}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800 mb-1">
                      {proceso.progreso}%
                    </div>
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${proceso.progreso}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Documentos */}
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">
                    📄 Documentos Requeridos ({proceso.documentosRequeridos.filter(d => d.estado === 'APROBADO').length}/{proceso.documentosRequeridos.length})
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {proceso.documentosRequeridos.map((documento) => (
                      <div key={documento.id} className="border border-slate-200 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-medium text-slate-800">
                            {documento.nombre}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentoColor(documento.estado)}`}>
                            {documento.estado}
                          </span>
                        </div>
                        
                        <p className="text-xs text-slate-500 mb-1">
                          Tipo: {documento.tipo}
                        </p>
                        
                        {documento.fechaSubida && (
                          <p className="text-xs text-slate-500">
                            Subido: {new Date(documento.fechaSubida).toLocaleDateString('es-PE')}
                          </p>
                        )}
                        
                        {documento.observaciones && (
                          <p className="text-xs text-amber-600 mt-1">
                            {documento.observaciones}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fechas */}
                <div className="border-t border-slate-200 pt-3 mt-4">
                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                    <div>
                      <strong>Inicio:</strong> {new Date(proceso.fechaInicio).toLocaleString('es-PE')}
                    </div>
                    <div>
                      <strong>Última actualización:</strong> {new Date(proceso.fechaUltimaActualizacion).toLocaleString('es-PE')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje si no hay datos */}
          {procesosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">
                {busqueda || filtroEstado 
                  ? 'No se encontraron procesos con los filtros seleccionados' 
                  : 'No hay procesos de matrícula registrados'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
