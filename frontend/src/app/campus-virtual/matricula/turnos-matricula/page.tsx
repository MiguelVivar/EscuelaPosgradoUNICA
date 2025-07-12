"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common';
import { turnosMatriculaService } from '@/services/turnosMatriculaService';
import { periodosAcademicosService } from '@/services/periodosAcademicosService';
import { programasEstudioService } from '@/services/programasEstudioService';
import { TurnoMatricula, TurnoMatriculaForm, PeriodoAcademico, ProgramaEstudio } from '@/types/turnoMatricula';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaPowerOff,
  FaClock,
  FaCalendarAlt,
  FaGraduationCap,
  FaUsers,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaPlayCircle,
  FaPauseCircle,
  FaListOl,
  FaFileAlt,
  FaTasks
} from 'react-icons/fa';

export default function TurnosMatriculaPage() {
  const { user } = useAuth();
  const [turnos, setTurnos] = useState<TurnoMatricula[]>([]);
  const [periodos, setPeriodos] = useState<PeriodoAcademico[]>([]);
  const [programas, setProgramas] = useState<ProgramaEstudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriodo, setSelectedPeriodo] = useState<number | ''>('');
  const [selectedPrograma, setSelectedPrograma] = useState<number | ''>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingTurno, setEditingTurno] = useState<TurnoMatricula | null>(null);
  const [formData, setFormData] = useState<TurnoMatriculaForm>({
    nombre: '',
    codigo: '',
    fechaInicio: '',
    fechaFin: '',
    ordenTurno: 1,
    habilitado: false,
    descripcion: '',
    requisitos: '',
    periodoAcademicoId: 0,
    programaEstudioId: 0
  });

  // Refs para animaciones
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  // Verificar permisos
  const canManage = user?.role === 'ADMIN' || user?.role === 'COORDINADOR';

  useEffect(() => {
    loadData();
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
    if (turnos.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('tbody tr');
      gsap.fromTo(rows,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [turnos]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [turnosData, periodosData, programasData] = await Promise.all([
        turnosMatriculaService.getTurnos(),
        periodosAcademicosService.getPeriodosActivos(),
        programasEstudioService.getProgramas()
      ]);
      setTurnos(turnosData);
      setPeriodos(periodosData);
      setProgramas(programasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los datos',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTurnos = turnos.filter(turno => {
    const matchesSearch = turno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         turno.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         turno.periodoAcademico.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         turno.programaEstudio.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriodo = selectedPeriodo === '' || turno.periodoAcademico.id === selectedPeriodo;
    const matchesPrograma = selectedPrograma === '' || turno.programaEstudio.id === selectedPrograma;
    const matchesEstado = selectedEstado === '' || 
                         (selectedEstado === 'activo' && turno.activo) ||
                         (selectedEstado === 'inactivo' && !turno.activo) ||
                         (selectedEstado === 'habilitado' && turno.habilitado) ||
                         (selectedEstado === 'deshabilitado' && !turno.habilitado);
    
    return matchesSearch && matchesPeriodo && matchesPrograma && matchesEstado;
  });

  const openModal = (turno?: TurnoMatricula) => {
    if (turno) {
      setEditingTurno(turno);
      setFormData({
        nombre: turno.nombre,
        codigo: turno.codigo,
        fechaInicio: new Date(turno.fechaInicio).toISOString().slice(0, 16),
        fechaFin: new Date(turno.fechaFin).toISOString().slice(0, 16),
        ordenTurno: turno.ordenTurno,
        habilitado: turno.habilitado,
        descripcion: turno.descripcion || '',
        requisitos: turno.requisitos || '',
        periodoAcademicoId: turno.periodoAcademico.id,
        programaEstudioId: turno.programaEstudio.id
      });
    } else {
      setEditingTurno(null);
      setFormData({
        nombre: '',
        codigo: '',
        fechaInicio: '',
        fechaFin: '',
        ordenTurno: 1,
        habilitado: false,
        descripcion: '',
        requisitos: '',
        periodoAcademicoId: 0,
        programaEstudioId: 0
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTurno(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.periodoAcademicoId || !formData.programaEstudioId) {
      Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar un período académico y un programa de estudio',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    if (new Date(formData.fechaInicio) >= new Date(formData.fechaFin)) {
      Swal.fire({
        title: 'Error',
        text: 'La fecha de inicio debe ser anterior a la fecha de fin',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    try {
      const turnoData = {
        nombre: formData.nombre,
        codigo: formData.codigo,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        ordenTurno: formData.ordenTurno,
        habilitado: formData.habilitado,
        descripcion: formData.descripcion || undefined,
        requisitos: formData.requisitos || undefined,
        periodoAcademicoId: formData.periodoAcademicoId,
        programaEstudioId: formData.programaEstudioId
      };

      if (editingTurno) {
        await turnosMatriculaService.updateTurno(editingTurno.id, turnoData);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Turno actualizado correctamente',
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
      } else {
        await turnosMatriculaService.createTurno(turnoData);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Turno creado correctamente',
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
      }

      closeModal();
      loadData();
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Error al guardar el turno',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
    }
  };

  const handleToggleActive = async (turno: TurnoMatricula) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas ${turno.activo ? 'desactivar' : 'activar'} el turno "${turno.nombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: turno.activo ? 'Desactivar' : 'Activar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await turnosMatriculaService.toggleActive(turno.id);
        Swal.fire({
          title: '¡Éxito!',
          text: `Turno ${turno.activo ? 'desactivado' : 'activado'} correctamente`,
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
        loadData();
      } catch (error: any) {
        Swal.fire({
          title: 'Error',
          text: error.message || 'Error al cambiar el estado del turno',
          icon: 'error',
          confirmButtonColor: '#f59e0b'
        });
      }
    }
  };

  const handleToggleEnabled = async (turno: TurnoMatricula) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas ${turno.habilitado ? 'deshabilitar' : 'habilitar'} el turno "${turno.nombre}" para matrículas?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: turno.habilitado ? 'Deshabilitar' : 'Habilitar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await turnosMatriculaService.toggleEnabled(turno.id);
        Swal.fire({
          title: '¡Éxito!',
          text: `Turno ${turno.habilitado ? 'deshabilitado' : 'habilitado'} correctamente`,
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
        loadData();
      } catch (error: any) {
        Swal.fire({
          title: 'Error',
          text: error.message || 'Error al cambiar el estado habilitado del turno',
          icon: 'error',
          confirmButtonColor: '#f59e0b'
        });
      }
    }
  };

  const handleDelete = async (turno: TurnoMatricula) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Esta acción eliminará el turno "${turno.nombre}" de forma permanente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await turnosMatriculaService.deleteTurno(turno.id);
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El turno ha sido eliminado correctamente',
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
        loadData();
      } catch (error: any) {
        Swal.fire({
          title: 'Error',
          text: error.message || 'Error al eliminar el turno',
          icon: 'error',
          confirmButtonColor: '#f59e0b'
        });
      }
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoTurno = (turno: TurnoMatricula) => {
    const now = new Date();
    const inicio = new Date(turno.fechaInicio);
    const fin = new Date(turno.fechaFin);

    if (!turno.activo) return 'Inactivo';
    if (!turno.habilitado) return 'Deshabilitado';
    if (now < inicio) return 'Próximo';
    if (now > fin) return 'Finalizado';
    return 'En curso';
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'En curso': return 'bg-green-100 text-green-800';
      case 'Próximo': return 'bg-blue-100 text-blue-800';
      case 'Finalizado': return 'bg-gray-100 text-gray-800';
      case 'Deshabilitado': return 'bg-yellow-100 text-yellow-800';
      case 'Inactivo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Cargando turnos de matrícula...</p>
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
            <FaClock className="text-2xl text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Turnos de Matrícula</h1>
            <p className="text-gray-600">Administra los turnos y horarios de matrícula por programa</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="text-2xl text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Turnos</p>
                <p className="text-2xl font-bold text-gray-900">{turnos.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <FaCheckCircle className="text-2xl text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{turnos.filter(t => t.activo).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <FaPlayCircle className="text-2xl text-amber-600" />
              <div>
                <p className="text-sm text-gray-600">Habilitados</p>
                <p className="text-2xl font-bold text-gray-900">{turnos.filter(t => t.habilitado).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <FaUsers className="text-2xl text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">En Curso</p>
                <p className="text-2xl font-bold text-gray-900">
                  {turnos.filter(t => getEstadoTurno(t) === 'En curso').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y acciones */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            {/* Búsqueda */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, código..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro por período */}
            <select
              title="Filtrar por período académico"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              value={selectedPeriodo}
              onChange={(e) => setSelectedPeriodo(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <option value="">Todos los períodos</option>
              {periodos.map((periodo) => (
                <option key={periodo.id} value={periodo.id}>
                  {periodo.nombre}
                </option>
              ))}
            </select>

            {/* Filtro por programa */}
            <select
              title="Filtrar por programa de estudio"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              value={selectedPrograma}
              onChange={(e) => setSelectedPrograma(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <option value="">Todos los programas</option>
              {programas.map((programa) => (
                <option key={programa.id} value={programa.id}>
                  {programa.nombre}
                </option>
              ))}
            </select>

            {/* Filtro por estado */}
            <select
              title="Filtrar por estado del turno"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
              <option value="habilitado">Habilitados</option>
              <option value="deshabilitado">Deshabilitados</option>
            </select>
          </div>

          {/* Botón agregar */}
          {canManage && (
            <Button
              onClick={() => openModal()}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <FaPlus className="text-sm" />
              <span>Nuevo Turno</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabla de turnos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaListOl />
                    <span>Orden</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt />
                    <span>Turno</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaClock />
                    <span>Fechas</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaGraduationCap />
                    <span>Programa</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FaInfoCircle />
                    <span>Estado</span>
                  </div>
                </th>
                {canManage && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-end space-x-2">
                      <FaTasks />
                      <span>Acciones</span>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTurnos.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 6 : 5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <FaClock className="text-4xl text-gray-300" />
                      <p className="text-gray-500 text-lg">No se encontraron turnos</p>
                      <p className="text-gray-400 text-sm">
                        {searchTerm || selectedPeriodo || selectedPrograma || selectedEstado
                          ? 'Intenta ajustar los filtros de búsqueda'
                          : 'Comienza creando el primer turno de matrícula'
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTurnos
                  .sort((a, b) => a.ordenTurno - b.ordenTurno)
                  .map((turno) => {
                    const estado = getEstadoTurno(turno);
                    return (
                      <tr key={turno.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-amber-800">{turno.ordenTurno}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                                <FaCalendarAlt className="text-white text-sm" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {turno.nombre}
                              </p>
                              <p className="text-sm text-gray-500">
                                Código: {turno.codigo}
                              </p>
                              {turno.descripcion && (
                                <p className="text-xs text-gray-400 mt-1">
                                  {turno.descripcion}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600 font-medium">Inicio:</span>
                              <span className="text-gray-900">{formatDateTime(turno.fechaInicio)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-red-600 font-medium">Fin:</span>
                              <span className="text-gray-900">{formatDateTime(turno.fechaFin)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm space-y-1">
                            <div className="flex items-center space-x-2">
                              <FaGraduationCap className="text-blue-500" />
                              <span className="font-medium text-gray-900">{turno.programaEstudio.nombre}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Período: {turno.periodoAcademico.nombre}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(estado)}`}>
                              {estado}
                            </span>
                            <div className="flex space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                turno.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {turno.activo ? (
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
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                turno.habilitado ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {turno.habilitado ? (
                                  <>
                                    <FaPlayCircle className="mr-1" />
                                    Habilitado
                                  </>
                                ) : (
                                  <>
                                    <FaPauseCircle className="mr-1" />
                                    Deshabilitado
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        </td>
                        {canManage && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                onClick={() => openModal(turno)}
                                className="text-amber-600 hover:text-amber-900 hover:bg-amber-50 p-2 rounded-lg transition-all duration-200"
                                title="Editar turno"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                onClick={() => handleToggleActive(turno)}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                  turno.activo
                                    ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                                    : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                }`}
                                title={turno.activo ? 'Desactivar turno' : 'Activar turno'}
                              >
                                <FaPowerOff />
                              </Button>
                              <Button
                                onClick={() => handleToggleEnabled(turno)}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                  turno.habilitado
                                    ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50'
                                    : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
                                }`}
                                title={turno.habilitado ? 'Deshabilitar para matrícula' : 'Habilitar para matrícula'}
                              >
                                {turno.habilitado ? <FaPauseCircle /> : <FaPlayCircle />}
                              </Button>
                              <Button
                                onClick={() => handleDelete(turno)}
                                className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                                title="Eliminar turno"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar turno */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FaCalendarAlt className="text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingTurno ? 'Editar Turno' : 'Nuevo Turno'}
                  </h2>
                </div>
                <Button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Turno *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ej: Primer Turno - Maestría"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>

                  {/* Código */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ej: T1-MAE-2024-I"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    />
                  </div>

                  {/* Fecha de inicio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha y Hora de Inicio *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      title="Seleccionar fecha y hora de inicio"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      value={formData.fechaInicio}
                      onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                    />
                  </div>

                  {/* Fecha de fin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha y Hora de Fin *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      title="Seleccionar fecha y hora de fin"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      value={formData.fechaFin}
                      onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                    />
                  </div>

                  {/* Orden del turno */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orden del Turno *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="1"
                      value={formData.ordenTurno}
                      onChange={(e) => setFormData({ ...formData, ordenTurno: parseInt(e.target.value) || 1 })}
                    />
                  </div>

                  {/* Estado habilitado */}
                  <div className="flex items-center space-x-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Estado de Matrícula
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
                        checked={formData.habilitado}
                        onChange={(e) => setFormData({ ...formData, habilitado: e.target.checked })}
                      />
                      <span className="text-sm text-gray-700">
                        {formData.habilitado ? 'Habilitado para matrícula' : 'Deshabilitado para matrícula'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Período académico */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Período Académico *
                    </label>
                    <select
                      title="Seleccionar período académico"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      value={formData.periodoAcademicoId}
                      onChange={(e) => setFormData({ ...formData, periodoAcademicoId: parseInt(e.target.value) })}
                    >
                      <option value={0}>Seleccionar período</option>
                      {periodos.map((periodo) => (
                        <option key={periodo.id} value={periodo.id}>
                          {periodo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Programa de estudio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Programa de Estudio *
                    </label>
                    <select
                      title="Seleccionar programa de estudio"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      value={formData.programaEstudioId}
                      onChange={(e) => setFormData({ ...formData, programaEstudioId: parseInt(e.target.value) })}
                    >
                      <option value={0}>Seleccionar programa</option>
                      {programas.map((programa) => (
                        <option key={programa.id} value={programa.id}>
                          {programa.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    placeholder="Descripción del turno de matrícula..."
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  />
                </div>

                {/* Requisitos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requisitos
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    placeholder="Requisitos para la matrícula en este turno..."
                    value={formData.requisitos}
                    onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200"
                  >
                    {editingTurno ? 'Actualizar' : 'Crear'} Turno
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
