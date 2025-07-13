"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common';
import { programasEstudioService } from '@/services/programasEstudioService';
import { facultadesService } from '@/services/facultadesService';
import { ProgramaEstudio, ProgramaEstudioForm } from '@/types/programaEstudio';
import { Facultad } from '@/types/facultad';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaPowerOff,
  FaGraduationCap,
  FaUniversity,
  FaBook,
  FaClock,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
  FaCertificate
} from 'react-icons/fa';

export default function ProgramasEstudioPage() {
  const { user } = useAuth();
  const [programas, setProgramas] = useState<ProgramaEstudio[]>([]);
  const [facultades, setFacultades] = useState<Facultad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacultad, setSelectedFacultad] = useState<number | ''>('');
  const [selectedNivel, setSelectedNivel] = useState<string>('');
  const [selectedModalidad, setSelectedModalidad] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingPrograma, setEditingPrograma] = useState<ProgramaEstudio | null>(null);
  const [formData, setFormData] = useState<ProgramaEstudioForm>({
    nombre: '',
    codigo: '',
    nivel: '',
    modalidad: '',
    duracionSemestres: 0,
    creditosTotales: 0,
    descripcion: '',
    objetivos: '',
    facultadId: 0
  });

  // Refs para animaciones
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  // Verificar permisos
  const canManage = user?.role === 'ADMIN' || user?.role === 'COORDINADOR';

  // Opciones predefinidas
  const nivelesOptions = ['MAESTRIA', 'DOCTORADO', 'SEGUNDA_ESPECIALIDAD'];
  const modalidadesOptions = ['PRESENCIAL', 'SEMIPRESENCIAL', 'VIRTUAL'];

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
    if (programas.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('tbody tr');
      gsap.fromTo(rows,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [programas]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [programasData, facultadesData] = await Promise.all([
        programasEstudioService.getProgramas(),
        facultadesService.getFacultadesActivas()
      ]);
      setProgramas(programasData);
      setFacultades(facultadesData);
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

  const filteredProgramas = programas.filter(programa => {
    const matchesSearch = programa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programa.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programa.facultad.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFacultad = selectedFacultad === '' || programa.facultad.id === selectedFacultad;
    const matchesNivel = selectedNivel === '' || programa.nivel === selectedNivel;
    const matchesModalidad = selectedModalidad === '' || programa.modalidad === selectedModalidad;
    
    return matchesSearch && matchesFacultad && matchesNivel && matchesModalidad;
  });

  const getNivelesUnicos = () => {
    const niveles = programas.map(programa => programa.nivel).filter(Boolean);
    return [...new Set(niveles)];
  };

  const getModalidadesUnicas = () => {
    const modalidades = programas.map(programa => programa.modalidad).filter(Boolean);
    return [...new Set(modalidades)];
  };

  const openModal = (programa?: ProgramaEstudio) => {
    if (programa) {
      setEditingPrograma(programa);
      setFormData({
        nombre: programa.nombre,
        codigo: programa.codigo,
        nivel: programa.nivel || '',
        modalidad: programa.modalidad || '',
        duracionSemestres: programa.duracionSemestres || 0,
        creditosTotales: programa.creditosTotales || 0,
        descripcion: programa.descripcion || '',
        objetivos: programa.objetivos || '',
        facultadId: programa.facultad.id
      });
    } else {
      setEditingPrograma(null);
      setFormData({
        nombre: '',
        codigo: '',
        nivel: '',
        modalidad: '',
        duracionSemestres: 0,
        creditosTotales: 0,
        descripcion: '',
        objetivos: '',
        facultadId: 0
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPrograma(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.facultadId) {
      Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar una facultad',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    try {
      const programaData = {
        nombre: formData.nombre,
        codigo: formData.codigo,
        nivel: formData.nivel || undefined,
        modalidad: formData.modalidad || undefined,
        duracionSemestres: formData.duracionSemestres || undefined,
        creditosTotales: formData.creditosTotales || undefined,
        descripcion: formData.descripcion || undefined,
        objetivos: formData.objetivos || undefined,
        facultadId: formData.facultadId
      };

      if (editingPrograma) {
        await programasEstudioService.updatePrograma(editingPrograma.id, programaData);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Programa actualizado correctamente',
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
      } else {
        await programasEstudioService.createPrograma(programaData);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Programa creado correctamente',
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
      }

      closeModal();
      loadData();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el programa';
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
    }
  };

  const handleToggleActive = async (programa: ProgramaEstudio) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas ${programa.activo ? 'desactivar' : 'activar'} el programa "${programa.nombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: programa.activo ? 'Desactivar' : 'Activar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await programasEstudioService.toggleActivePrograma(programa.id);
        Swal.fire({
          title: '¡Éxito!',
          text: `Programa ${programa.activo ? 'desactivado' : 'activado'} correctamente`,
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
        loadData();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al cambiar el estado del programa';
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#f59e0b'
        });
      }
    }
  };

  const handleToggleDisponible = async (programa: ProgramaEstudio) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas ${programa.disponible ? 'hacer no disponible' : 'hacer disponible'} para matrícula el programa "${programa.nombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: programa.disponible ? 'Hacer no disponible' : 'Hacer disponible',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await programasEstudioService.toggleDisponiblePrograma(programa.id);
        Swal.fire({
          title: '¡Éxito!',
          text: `Disponibilidad del programa cambiada correctamente`,
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
        loadData();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al cambiar la disponibilidad del programa';
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#f59e0b'
        });
      }
    }
  };

  const handleDelete = async (programa: ProgramaEstudio) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Esta acción eliminará el programa "${programa.nombre}" de forma permanente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await programasEstudioService.deletePrograma(programa.id);
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El programa ha sido eliminado correctamente',
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
        loadData();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el programa';
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#f59e0b'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Cargando programas de estudio...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
          <div className="p-2 sm:p-3 bg-amber-100 rounded-lg w-fit">
            <FaGraduationCap className="text-xl sm:text-2xl text-amber-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Gestión de Programas de Estudio
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Administra los programas académicos del sistema educativo
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{programas.length}</p>
              </div>
              <FaGraduationCap className="text-lg sm:text-2xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Activos</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">{programas.filter(p => p.activo).length}</p>
              </div>
              <FaCheckCircle className="text-lg sm:text-2xl text-green-500" />
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Disponibles</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-600">{programas.filter(p => p.disponible).length}</p>
              </div>
              <FaEye className="text-lg sm:text-2xl text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Facultades</p>
                <p className="text-lg sm:text-2xl font-bold text-indigo-600">{facultades.length}</p>
              </div>
              <FaUniversity className="text-lg sm:text-2xl text-indigo-500" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {/* Search */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar programas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Facultad Filter */}
            <div className="col-span-1">
              <select
                value={selectedFacultad}
                onChange={(e) => setSelectedFacultad(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                aria-label="Filtrar por facultad"
              >
                <option value="">Todas las facultades</option>
                {facultades.map(facultad => (
                  <option key={facultad.id} value={facultad.id}>{facultad.nombre}</option>
                ))}
              </select>
            </div>

            {/* Nivel Filter */}
            <div className="col-span-1">
              <select
                value={selectedNivel}
                onChange={(e) => setSelectedNivel(e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                aria-label="Filtrar por nivel"
              >
                <option value="">Todos los niveles</option>
                {getNivelesUnicos().map(nivel => (
                  <option key={nivel} value={nivel}>{nivel}</option>
                ))}
              </select>
            </div>

            {/* Modalidad Filter */}
            <div className="col-span-1">
              <select
                value={selectedModalidad}
                onChange={(e) => setSelectedModalidad(e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                aria-label="Filtrar por modalidad"
              >
                <option value="">Todas las modalidades</option>
                {getModalidadesUnicas().map(modalidad => (
                  <option key={modalidad} value={modalidad}>{modalidad}</option>
                ))}
              </select>
            </div>

            {/* Add Button */}
            {canManage && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-1">
                <Button
                  variant="primary"
                  onClick={() => openModal()}
                  leftIcon={FaPlus}
                  fullWidth
                  className="text-sm sm:text-base"
                >
                  <span className="lg:hidden">Nuevo</span>
                  <span className="hidden lg:inline">Nuevo Programa</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table/Cards */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table ref={tableRef} className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Programa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Facultad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nivel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modalidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estados
                </th>
                {canManage && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProgramas.map((programa) => (
                <tr key={programa.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <FaGraduationCap className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{programa.nombre}</div>
                        <div className="text-sm text-gray-500">{programa.codigo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUniversity className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{programa.facultad.nombre}</div>
                        <div className="text-sm text-gray-500">{programa.facultad.codigo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCertificate className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{programa.nivel || 'Sin especificar'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaBook className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{programa.modalidad || 'Sin especificar'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaClock className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{programa.duracionSemestres || 0} semestres</div>
                        <div className="text-sm text-gray-500">{programa.creditosTotales || 0} créditos</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        programa.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {programa.activo ? (
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
                        programa.disponible 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {programa.disponible ? (
                          <>
                            <FaEye className="mr-1" />
                            Disponible
                          </>
                        ) : (
                          <>
                            <FaEyeSlash className="mr-1" />
                            No disponible
                          </>
                        )}
                      </span>
                    </div>
                  </td>
                  {canManage && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openModal(programa)}
                          leftIcon={FaEdit}
                        >
                          Editar
                        </Button>
                        <Button
                          variant={programa.activo ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => handleToggleActive(programa)}
                          leftIcon={FaPowerOff}
                        >
                          {programa.activo ? 'Desactivar' : 'Activar'}
                        </Button>
                        {programa.activo && (
                          <Button
                            variant={programa.disponible ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => handleToggleDisponible(programa)}
                            leftIcon={programa.disponible ? FaEyeSlash : FaEye}
                          >
                            {programa.disponible ? 'Ocultar' : 'Mostrar'}
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(programa)}
                          leftIcon={FaTrash}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="lg:hidden">
          <div className="divide-y divide-gray-200">
            {filteredProgramas.map((programa) => (
              <div key={programa.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaGraduationCap className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{programa.nombre}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{programa.codigo}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      programa.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {programa.activo ? (
                        <>
                          <FaCheckCircle className="mr-1 w-3 h-3" />
                          Activo
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="mr-1 w-3 h-3" />
                          Inactivo
                        </>
                      )}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      programa.disponible 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {programa.disponible ? (
                        <>
                          <FaEye className="mr-1 w-3 h-3" />
                          Disponible
                        </>
                      ) : (
                        <>
                          <FaEyeSlash className="mr-1 w-3 h-3" />
                          No disponible
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                  {/* Facultad */}
                  <div className="flex items-center space-x-2">
                    <FaUniversity className="text-gray-400 w-4 h-4 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-900 truncate">{programa.facultad.nombre}</p>
                      <p className="text-xs text-gray-500">{programa.facultad.codigo}</p>
                    </div>
                  </div>

                  {/* Nivel */}
                  <div className="flex items-center space-x-2">
                    <FaCertificate className="text-gray-400 w-4 h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-900 truncate">{programa.nivel || 'Sin especificar'}</span>
                  </div>

                  {/* Modalidad */}
                  <div className="flex items-center space-x-2">
                    <FaBook className="text-gray-400 w-4 h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-900 truncate">{programa.modalidad || 'Sin especificar'}</span>
                  </div>

                  {/* Duración */}
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-gray-400 w-4 h-4 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-900">{programa.duracionSemestres || 0} semestres</p>
                      <p className="text-xs text-gray-500">{programa.creditosTotales || 0} créditos</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {canManage && (
                  <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openModal(programa)}
                        leftIcon={FaEdit}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        Editar
                      </Button>
                      <Button
                        variant={programa.activo ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => handleToggleActive(programa)}
                        leftIcon={FaPowerOff}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        {programa.activo ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      {programa.activo && (
                        <Button
                          variant={programa.disponible ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => handleToggleDisponible(programa)}
                          leftIcon={programa.disponible ? FaEyeSlash : FaEye}
                          className="flex-1 sm:flex-none text-xs sm:text-sm"
                        >
                          {programa.disponible ? 'Ocultar' : 'Mostrar'}
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(programa)}
                        leftIcon={FaTrash}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {filteredProgramas.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <FaInfoCircle className="mx-auto text-3xl sm:text-4xl text-gray-400 mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No se encontraron programas</h3>
              <p className="text-sm sm:text-base text-gray-500 px-4">
                {searchTerm || selectedFacultad || selectedNivel || selectedModalidad
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Aún no hay programas registrados en el sistema'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50">
          <div ref={modalRef} className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FaGraduationCap className="text-amber-600 w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {editingPrograma ? 'Editar Programa' : 'Nuevo Programa'}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Programa *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ej: Maestría en Administración"
                      required
                    />
                  </div>

                  {/* Código */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código *
                    </label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ej: MAD-001"
                      required
                    />
                  </div>

                  {/* Facultad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Facultad *
                    </label>
                    <select
                      value={formData.facultadId}
                      onChange={(e) => setFormData({ ...formData, facultadId: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                      aria-label="Seleccionar facultad"
                    >
                      <option value={0}>Seleccionar facultad</option>
                      {facultades.map(facultad => (
                        <option key={facultad.id} value={facultad.id}>
                          {facultad.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nivel */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nivel Académico
                    </label>
                    <select
                      value={formData.nivel}
                      onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      aria-label="Seleccionar nivel"
                    >
                      <option value="">Seleccionar nivel</option>
                      {nivelesOptions.map(nivel => (
                        <option key={nivel} value={nivel}>{nivel}</option>
                      ))}
                    </select>
                  </div>

                  {/* Modalidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modalidad
                    </label>
                    <select
                      value={formData.modalidad}
                      onChange={(e) => setFormData({ ...formData, modalidad: e.target.value })}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      aria-label="Seleccionar modalidad"
                    >
                      <option value="">Seleccionar modalidad</option>
                      {modalidadesOptions.map(modalidad => (
                        <option key={modalidad} value={modalidad}>{modalidad}</option>
                      ))}
                    </select>
                  </div>

                  {/* Duración en semestres */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración (Semestres)
                    </label>
                    <input
                      type="number"
                      value={formData.duracionSemestres}
                      onChange={(e) => setFormData({ ...formData, duracionSemestres: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Número de semestres"
                      min="1"
                    />
                  </div>

                  {/* Créditos totales */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Créditos Totales
                    </label>
                    <input
                      type="number"
                      value={formData.creditosTotales}
                      onChange={(e) => setFormData({ ...formData, creditosTotales: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Total de créditos académicos"
                      min="1"
                    />
                  </div>

                  {/* Descripción */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Descripción general del programa"
                      rows={3}
                    />
                  </div>

                  {/* Objetivos */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Objetivos
                    </label>
                    <textarea
                      value={formData.objetivos}
                      onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Objetivos académicos del programa"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    onClick={closeModal}
                    type="button"
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-full sm:w-auto order-1 sm:order-2"
                  >
                    {editingPrograma ? 'Actualizar' : 'Crear'} Programa
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
