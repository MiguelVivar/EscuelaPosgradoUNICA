"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common';
import { matriculaService, PeriodoAcademico, PeriodoForm } from '@/services/matriculaService';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';
import { 
  FaPlus, 
  FaEdit, 
  FaSearch, 
  FaPowerOff,
  FaCalendarAlt,
  FaCalendarCheck,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaGraduationCap,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';

export default function PeriodosAcademicosPage() {
  const { user } = useAuth();
  
  const [periodos, setPeriodos] = useState<PeriodoAcademico[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPeriodo, setEditingPeriodo] = useState<PeriodoAcademico | null>(null);
  const [formData, setFormData] = useState<PeriodoForm>({
    codigo: "",
    nombre: "",
    anio: new Date().getFullYear().toString(),
    semestre: "I",
    fechaInicio: "",
    fechaFin: "",
    fechaInicioMatricula: "",
    fechaFinMatricula: "",
    habilitado: false,
    descripcion: ""
  });

  // Refs para animaciones
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  // Verificar permisos
  const canManage = user?.role === 'ADMIN' || user?.role === 'COORDINADOR';

  useEffect(() => {
    loadPeriodos();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (showModal && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, [showModal]);

  useEffect(() => {
    if (periodos.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('tbody tr');
      gsap.fromTo(rows,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [periodos]);

  // Auto-generar código cuando cambian año o semestre
  const updateCodigoIfEmpty = (anio: string, semestre: string) => {
    if (anio && semestre) {
      const newCodigo = `${anio}-${semestre}`;
      // Solo actualizar si el código está vacío o si coincide con el patrón auto-generado anterior
      if (!formData.codigo || formData.codigo === "" || formData.codigo.match(/^\d{4}-(I|II|VERANO)$/)) {
        setFormData(prev => ({
          ...prev,
          codigo: newCodigo
        }));
      }
    }
  };

  // Auto-generar código inicial cuando se abre el modal para nuevo período
  useEffect(() => {
    if (showModal && !editingPeriodo && formData.anio && formData.semestre && !formData.codigo) {
      const codigoInicial = `${formData.anio}-${formData.semestre}`;
      setFormData(prev => ({
        ...prev,
        codigo: codigoInicial
      }));
    }
  }, [showModal, editingPeriodo, formData.anio, formData.semestre, formData.codigo]);

  const loadPeriodos = async () => {
    try {
      setLoading(true);
      const periodosData = await matriculaService.getPeriodosAcademicos();
      setPeriodos(periodosData);
    } catch (error) {
      console.error('Error al cargar períodos:', error);
      
      // Manejo específico para errores 403
      if (error instanceof Error && error.message.includes('403')) {
        Swal.fire({
          title: 'Acceso Denegado',
          text: 'Tu sesión ha expirado o no tienes permisos para acceder a esta información.',
          icon: 'error',
          confirmButtonColor: '#f59e0b'
        });
        return;
      }
      
      // Errores de conectividad
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        Swal.fire({
          title: 'Error de Conexión',
          text: 'No se pudo conectar con el microservicio de Matrícula.',
          icon: 'error',
          confirmButtonColor: '#f59e0b'
        });
        return;
      }
      
      // Otros errores
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los períodos académicos',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPeriodos = periodos.filter(periodo => {
    return periodo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           periodo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
           periodo.anio.includes(searchTerm) ||
           periodo.semestre.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validaciones básicas
      if (!formData.nombre || !formData.anio || !formData.semestre) {
        Swal.fire({
          icon: "warning",
          title: "Campos requeridos",
          text: "Por favor completa todos los campos obligatorios",
          confirmButtonColor: '#f59e0b'
        });
        return;
      }

      // Generar código automáticamente si está vacío
      const codigoFinal = formData.codigo?.trim() || `${formData.anio}-${formData.semestre}`;
      
      // Verificar duplicados antes de crear (solo para nuevos períodos)
      if (!editingPeriodo) {
        const existePeriodo = periodos.some(p => 
          p.codigo.toLowerCase() === codigoFinal.toLowerCase() ||
          (p.anio === formData.anio && p.semestre === formData.semestre)
        );
        
        if (existePeriodo) {
          Swal.fire({
            icon: "warning",
            title: "Período Duplicado",
            text: `Ya existe un período académico para ${formData.anio}-${formData.semestre}`,
            confirmButtonColor: '#f59e0b'
          });
          return;
        }
      }
      
      // Crear el objeto de datos con código garantizado
      const dataToSend: PeriodoForm = {
        ...formData,
        codigo: codigoFinal
      };

      // Validar fechas
      const fechaInicio = new Date(formData.fechaInicio);
      const fechaFin = new Date(formData.fechaFin);
      const fechaInicioMatricula = new Date(formData.fechaInicioMatricula);
      const fechaFinMatricula = new Date(formData.fechaFinMatricula);

      if (fechaInicio >= fechaFin) {
        Swal.fire({
          icon: "warning",
          title: "Fechas inválidas",
          text: "La fecha de inicio debe ser anterior a la fecha de fin",
          confirmButtonColor: '#f59e0b'
        });
        return;
      }

      if (fechaInicioMatricula >= fechaFinMatricula) {
        Swal.fire({
          icon: "warning",
          title: "Fechas inválidas",
          text: "La fecha de inicio de matrícula debe ser anterior a la fecha de fin",
          confirmButtonColor: '#f59e0b'
        });
        return;
      }

      if (editingPeriodo) {
        // Actualizar período existente
        const updatedPeriodo = await matriculaService.updatePeriodoAcademico(editingPeriodo.id, dataToSend);
        const updatedPeriodos = periodos.map(p => 
          p.id === editingPeriodo.id ? updatedPeriodo : p
        );
        setPeriodos(updatedPeriodos);
        
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "El período académico ha sido actualizado exitosamente",
          confirmButtonColor: '#f59e0b'
        });
      } else {
        // Crear nuevo período
        await matriculaService.createPeriodoAcademico(dataToSend);
        
        // Recargar la lista completa para asegurar sincronización
        await loadPeriodos();
        
        Swal.fire({
          icon: "success",
          title: "¡Creado!",
          text: `Período académico "${codigoFinal}" creado exitosamente`,
          confirmButtonColor: '#f59e0b'
        });
      }

      handleCloseModal();
    } catch (error: unknown) {
      console.error("Error al guardar período:", error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudo guardar el período académico.';
      // Manejo específico para errores de duplicados
      if (errorMessage && (
        errorMessage.includes('ya existe') || 
        errorMessage.includes('duplicate') ||
        errorMessage.includes('UNIQUE constraint') ||
        errorMessage.includes('Duplicate entry')
      )) {
        Swal.fire({
          icon: "warning",
          title: "Período Duplicado",
          text: `El período académico "${formData.codigo || `${formData.anio}-${formData.semestre}`}" ya existe en la base de datos.`,
          confirmButtonColor: '#f59e0b'
        }).then(() => {
          // Recargar la lista para mostrar el período que ya existe
          loadPeriodos();
        });
      } else {
        // Otros errores
        Swal.fire({
          icon: "error",
          title: "Error al guardar",
          text: errorMessage || "No se pudo guardar el período académico.",
          confirmButtonColor: '#f59e0b'
        });
      }
    }
  };

  const handleEdit = (periodo: PeriodoAcademico) => {
    setEditingPeriodo(periodo);
    setFormData({
      codigo: periodo.codigo,
      nombre: periodo.nombre,
      anio: periodo.anio,
      semestre: periodo.semestre,
      fechaInicio: periodo.fechaInicio.split('T')[0],
      fechaFin: periodo.fechaFin.split('T')[0],
      fechaInicioMatricula: periodo.fechaInicioMatricula.split('T')[0],
      fechaFinMatricula: periodo.fechaFinMatricula.split('T')[0],
      habilitado: periodo.habilitado,
      descripcion: periodo.descripcion || ""
    });
    setShowModal(true);
  };

  const handleToggleActive = async (periodo: PeriodoAcademico) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Se ${periodo.activo ? 'desactivará' : 'reactivará'} el período académico "${periodo.nombre}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: "#6b7280",
      confirmButtonText: periodo.activo ? "Sí, desactivar" : "Sí, reactivar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        if (periodo.activo) {
          await matriculaService.deletePeriodoAcademico(periodo.id);
        } else {
          await matriculaService.reactivarPeriodoAcademico(periodo.id);
        }
        
        await loadPeriodos();
        
        Swal.fire({
          icon: "success",
          title: `¡${periodo.activo ? 'Desactivado' : 'Reactivado'}!`,
          text: `El período académico "${periodo.codigo}" ha sido ${periodo.activo ? 'desactivado' : 'reactivado'}`,
          confirmButtonColor: '#f59e0b'
        });
      } catch (error: unknown) {
        console.error("Error al cambiar estado del período:", error);
        const errorMessage = error instanceof Error ? error.message : `No se pudo ${periodo.activo ? 'desactivar' : 'reactivar'} el período académico`;
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonColor: '#f59e0b'
        });
      }
    }
  };

  const handleToggleHabilitado = async (periodo: PeriodoAcademico) => {
    try {
      const updatedPeriodo = await matriculaService.togglePeriodoHabilitado(periodo.id);
      const updatedPeriodos = periodos.map(p => 
        p.id === periodo.id ? updatedPeriodo : p
      );
      setPeriodos(updatedPeriodos);
      
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: `Período ${updatedPeriodo.habilitado ? 'habilitado' : 'deshabilitado'} para matrícula`,
        confirmButtonColor: '#f59e0b'
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "No se pudo cambiar el estado del período";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: '#f59e0b'
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPeriodo(null);
    setFormData({
      codigo: "",
      nombre: "",
      anio: new Date().getFullYear().toString(),
      semestre: "I",
      fechaInicio: "",
      fechaFin: "",
      fechaInicioMatricula: "",
      fechaFinMatricula: "",
      habilitado: false,
      descripcion: ""
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Cargando períodos académicos...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-amber-100 rounded-lg">
            <FaCalendarAlt className="text-2xl text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Períodos Académicos</h1>
            <p className="text-gray-600">Gestiona los períodos académicos y habilita procesos de matrícula</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Períodos</p>
                <p className="text-2xl font-bold text-gray-900">{periodos.length}</p>
              </div>
              <FaCalendarAlt className="text-2xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-green-600">{periodos.filter(p => p.activo).length}</p>
              </div>
              <FaCheckCircle className="text-2xl text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Habilitados</p>
                <p className="text-2xl font-bold text-purple-600">{periodos.filter(p => p.habilitado).length}</p>
              </div>
              <FaGraduationCap className="text-2xl text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactivos</p>
                <p className="text-2xl font-bold text-red-600">{periodos.filter(p => !p.activo).length}</p>
              </div>
              <FaTimesCircle className="text-2xl text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar períodos académicos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Add Button */}
            {canManage && (
              <div>
                <Button
                  variant="primary"
                  onClick={() => setShowModal(true)}
                  leftIcon={FaPlus}
                  fullWidth
                >
                  Nuevo Período
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Año/Semestre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período Académico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período Matrícula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                {canManage && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPeriodos.map((periodo) => (
                <tr key={periodo.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <FaCalendarAlt className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{periodo.nombre}</div>
                        {periodo.descripcion && (
                          <div className="text-sm text-gray-500 mt-1">{periodo.descripcion}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {periodo.codigo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaClock className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{periodo.anio}</div>
                        <div className="text-sm text-gray-500">Semestre {periodo.semestre}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaCalendarCheck className="text-gray-400 mr-2 flex-shrink-0" />
                      <div className="text-sm text-gray-900">
                        <div>{formatDate(periodo.fechaInicio)}</div>
                        <div className="text-gray-500">al {formatDate(periodo.fechaFin)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaGraduationCap className="text-gray-400 mr-2 flex-shrink-0" />
                      <div className="text-sm text-gray-900">
                        <div>{formatDate(periodo.fechaInicioMatricula)}</div>
                        <div className="text-gray-500">al {formatDate(periodo.fechaFinMatricula)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        periodo.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {periodo.activo ? (
                          <>
                            <FaCheckCircle className="mr-1" />
                            Activo
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="mr-1" />
                            Inactivo
                          </>
                        )}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        periodo.habilitado 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {periodo.habilitado ? (
                          <>
                            <FaToggleOn className="mr-1" />
                            Habilitado
                          </>
                        ) : (
                          <>
                            <FaToggleOff className="mr-1" />
                            Deshabilitado
                          </>
                        )}
                      </span>
                    </div>
                  </td>
                  {canManage && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {periodo.activo && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleHabilitado(periodo)}
                            leftIcon={periodo.habilitado ? FaToggleOn : FaToggleOff}
                          >
                            {periodo.habilitado ? 'Deshabilitar' : 'Habilitar'}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(periodo)}
                          leftIcon={FaEdit}
                        >
                          Editar
                        </Button>
                        <Button
                          variant={periodo.activo ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => handleToggleActive(periodo)}
                          leftIcon={FaPowerOff}
                        >
                          {periodo.activo ? 'Desactivar' : 'Reactivar'}
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPeriodos.length === 0 && (
            <div className="text-center py-12">
              <FaInfoCircle className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron períodos académicos</h3>
              <p className="text-gray-500">
                {searchTerm
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Aún no hay períodos académicos registrados en el sistema'
                }
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div ref={modalRef} className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <form onSubmit={handleSubmit}>
              {/* Header del Modal */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <FaCalendarAlt className="text-amber-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {editingPeriodo ? 'Editar Período Académico' : 'Nuevo Período Académico'}
                      </h2>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      type="button"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

              {/* Contenido del Modal */}
              <div className="p-6 space-y-6">
                {/* Información Básica */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código del Período *
                    </label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder={`ej: ${formData.anio}-${formData.semestre} (auto-generado)`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Período *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="ej: 2024-I"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Año *
                    </label>
                    <input
                      type="number"
                      value={formData.anio}
                      onChange={(e) => {
                        const newAnio = e.target.value;
                        setFormData({...formData, anio: newAnio});
                        updateCodigoIfEmpty(newAnio, formData.semestre);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      min="2020"
                      max="2030"
                      placeholder="2025"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Semestre *
                    </label>
                    <select
                      value={formData.semestre}
                      onChange={(e) => {
                        const newSemestre = e.target.value;
                        setFormData({...formData, semestre: newSemestre});
                        updateCodigoIfEmpty(formData.anio, newSemestre);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      title="Seleccionar semestre"
                      required
                    >
                      <option value="I">I</option>
                      <option value="II">II</option>
                      <option value="VERANO">Verano</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="habilitado"
                      checked={formData.habilitado}
                      onChange={(e) => setFormData({...formData, habilitado: e.target.checked})}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <label htmlFor="habilitado" className="ml-2 text-sm font-medium text-gray-700">
                      Habilitar período para matrícula
                    </label>
                  </div>
                </div>

                {/* Fechas del Período Académico */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Período Académico</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Inicio *
                      </label>
                      <input
                        type="date"
                        value={formData.fechaInicio}
                        onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        title="Fecha de inicio del período académico"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Fin *
                      </label>
                      <input
                        type="date"
                        value={formData.fechaFin}
                        onChange={(e) => setFormData({...formData, fechaFin: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        title="Fecha de fin del período académico"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Fechas de Matrícula */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">🎓 Período de Matrícula</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Inicio de Matrícula *
                      </label>
                      <input
                        type="date"
                        value={formData.fechaInicioMatricula}
                        onChange={(e) => setFormData({...formData, fechaInicioMatricula: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        title="Fecha de inicio de matrícula"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fin de Matrícula *
                      </label>
                      <input
                        type="date"
                        value={formData.fechaFinMatricula}
                        onChange={(e) => setFormData({...formData, fechaFinMatricula: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        title="Fecha de fin de matrícula"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Descripción opcional del período académico"
                  />
                </div>
              </div>

              {/* Footer del Modal */}
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={handleCloseModal}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                >
                  {editingPeriodo ? 'Actualizar' : 'Crear'} Período
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
