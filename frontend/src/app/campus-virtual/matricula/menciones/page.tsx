"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common';
import { mencionesService } from '@/services/mencionesService';
import { programasEstudioService } from '@/services/programasEstudioService';
import { Mencion, MencionForm } from '@/types/mencion';
import { ProgramaEstudio } from '@/types/programaEstudio';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaPowerOff,
  FaGraduationCap,
  FaCertificate,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaClipboardList,
  FaCode,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

export default function MencionesPage() {
  const { user } = useAuth();
  const [menciones, setMenciones] = useState<Mencion[]>([]);
  const [programas, setProgramas] = useState<ProgramaEstudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrograma, setSelectedPrograma] = useState<number | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [editingMencion, setEditingMencion] = useState<Mencion | null>(null);
  const [formData, setFormData] = useState<MencionForm>({
    nombre: '',
    codigo: '',
    descripcion: '',
    requisitos: '',
    programaEstudioId: 0
  });

  // Refs para animaciones
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Animaciones de entrada
  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [loading]);

  // Animaciones de cards
  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.4, 
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }
  }, [menciones]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [mencionesData, programasData] = await Promise.all([
        mencionesService.getMenciones(),
        programasEstudioService.getProgramasActivos()
      ]);
      
      setMenciones(mencionesData);
      setProgramas(programasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los datos',
        confirmButtonColor: '#d97706'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleProgramaFilter = (programaId: number | '') => {
    setSelectedPrograma(programaId);
  };

  const filteredMenciones = menciones.filter(mencion => {
    const matchesSearch = mencion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mencion.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mencion.programaEstudio.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrograma = selectedPrograma === '' || mencion.programaEstudio.id === selectedPrograma;
    
    return matchesSearch && matchesPrograma;
  });

  const openModal = (mencion?: Mencion) => {
    if (mencion) {
      setEditingMencion(mencion);
      setFormData({
        nombre: mencion.nombre,
        codigo: mencion.codigo,
        descripcion: mencion.descripcion || '',
        requisitos: mencion.requisitos || '',
        programaEstudioId: mencion.programaEstudio.id
      });
    } else {
      setEditingMencion(null);
      setFormData({
        nombre: '',
        codigo: '',
        descripcion: '',
        requisitos: '',
        programaEstudioId: 0
      });
    }
    setShowModal(true);
    
    // Animación del modal
    setTimeout(() => {
      if (modalRef.current) {
        gsap.fromTo(modalRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    }, 50);
  };

  const closeModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setShowModal(false)
      });
    } else {
      setShowModal(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim() || !formData.codigo.trim() || !formData.programaEstudioId) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor, complete todos los campos obligatorios',
        confirmButtonColor: '#d97706'
      });
      return;
    }

    try {
      const mencionData = {
        nombre: formData.nombre.trim(),
        codigo: formData.codigo.trim(),
        descripcion: formData.descripcion.trim(),
        requisitos: formData.requisitos.trim(),
        programaEstudioId: formData.programaEstudioId
      };

      if (editingMencion) {
        await mencionesService.updateMencion(editingMencion.id, mencionData);
        Swal.fire({
          icon: 'success',
          title: '¡Actualizada!',
          text: 'La mención ha sido actualizada exitosamente',
          confirmButtonColor: '#d97706',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await mencionesService.createMencion(mencionData);
        Swal.fire({
          icon: 'success',
          title: '¡Creada!',
          text: 'La mención ha sido creada exitosamente',
          confirmButtonColor: '#d97706',
          timer: 2000,
          showConfirmButton: false
        });
      }

      closeModal();
      loadInitialData();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'No se pudo guardar la mención';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#d97706'
      });
    }
  };

  const handleToggleActive = async (mencion: Mencion) => {
    try {
      const result = await Swal.fire({
        title: `¿${mencion.activo ? 'Desactivar' : 'Activar'} mención?`,
        text: `¿Está seguro que desea ${mencion.activo ? 'desactivar' : 'activar'} la mención "${mencion.nombre}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d97706',
        cancelButtonColor: '#6b7280',
        confirmButtonText: `Sí, ${mencion.activo ? 'desactivar' : 'activar'}`,
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await mencionesService.toggleActive(mencion.id);
        
        Swal.fire({
          icon: 'success',
          title: '¡Estado actualizado!',
          text: `La mención ha sido ${mencion.activo ? 'desactivada' : 'activada'} exitosamente`,
          confirmButtonColor: '#d97706',
          timer: 2000,
          showConfirmButton: false
        });

        loadInitialData();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'No se pudo cambiar el estado de la mención';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#d97706'
      });
    }
  };

  const handleToggleDisponible = async (mencion: Mencion) => {
    try {
      const result = await Swal.fire({
        title: `¿${mencion.disponible ? 'Deshabilitar' : 'Habilitar'} disponibilidad?`,
        text: `¿Está seguro que desea ${mencion.disponible ? 'deshabilitar' : 'habilitar'} la disponibilidad de "${mencion.nombre}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d97706',
        cancelButtonColor: '#6b7280',
        confirmButtonText: `Sí, ${mencion.disponible ? 'deshabilitar' : 'habilitar'}`,
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await mencionesService.toggleDisponible(mencion.id);
        
        Swal.fire({
          icon: 'success',
          title: '¡Disponibilidad actualizada!',
          text: `La disponibilidad ha sido ${mencion.disponible ? 'deshabilitada' : 'habilitada'} exitosamente`,
          confirmButtonColor: '#d97706',
          timer: 2000,
          showConfirmButton: false
        });

        loadInitialData();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'No se pudo cambiar la disponibilidad de la mención';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage || 'No se pudo cambiar la disponibilidad de la mención',
        confirmButtonColor: '#d97706'
      });
    }
  };

  const handleDelete = async (mencion: Mencion) => {
    try {
      const result = await Swal.fire({
        title: '¿Eliminar mención?',
        text: `¿Está seguro que desea eliminar la mención "${mencion.nombre}"? Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await mencionesService.deleteMencion(mencion.id);
        
        Swal.fire({
          icon: 'success',
          title: '¡Eliminada!',
          text: 'La mención ha sido eliminada exitosamente',
          confirmButtonColor: '#d97706',
          timer: 2000,
          showConfirmButton: false
        });

        loadInitialData();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'No se pudo eliminar la mención';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#d97706'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="text-amber-800 font-medium">Cargando menciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-100 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 sm:p-3 bg-amber-600 text-white rounded-xl shadow-lg">
                <FaCertificate className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-900">
                  Gestión de Menciones
                </h1>
                <p className="text-amber-700 mt-1 text-sm sm:text-base">
                  Administra las menciones de los programas de estudio
                </p>
              </div>
            </div>
            
            {user?.role === 'ADMIN' && (
              <Button
                variant="primary"
                leftIcon={FaPlus}
                onClick={() => openModal()}
                className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
              >
                <span className="sm:hidden">Nueva</span>
                <span className="hidden sm:inline">Nueva Mención</span>
              </Button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-amber-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, código..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filtro por programa */}
            <div className="relative">
              <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-4 h-4 sm:w-5 sm:h-5" />
              <select
                value={selectedPrograma}
                onChange={(e) => handleProgramaFilter(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                title="Filtrar por programa de estudio"
              >
                <option value="">Todos los programas</option>
                {programas.map(programa => (
                  <option key={programa.id} value={programa.id}>
                    {programa.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-xs sm:text-sm font-medium">Total</p>
                <p className="text-lg sm:text-2xl font-bold text-amber-900">{menciones.length}</p>
              </div>
              <FaCertificate className="w-5 h-5 sm:w-8 sm:h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-xs sm:text-sm font-medium">Activas</p>
                <p className="text-lg sm:text-2xl font-bold text-green-700">
                  {menciones.filter(m => m.activo).length}
                </p>
              </div>
              <FaCheckCircle className="w-5 h-5 sm:w-8 sm:h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-xs sm:text-sm font-medium">Disponibles</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-700">
                  {menciones.filter(m => m.disponible).length}
                </p>
              </div>
              <FaEye className="w-5 h-5 sm:w-8 sm:h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-xs sm:text-sm font-medium">Inactivas</p>
                <p className="text-lg sm:text-2xl font-bold text-red-700">
                  {menciones.filter(m => !m.activo).length}
                </p>
              </div>
              <FaTimesCircle className="w-5 h-5 sm:w-8 sm:h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Lista de menciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredMenciones.map((mencion, index) => (
            <div
              key={mencion.id}
              ref={el => { if (el) cardsRef.current[index] = el; }}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 ${
                mencion.activo ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className="p-4 sm:p-6">
                {/* Header de la card */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3 sm:gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">{mencion.nombre}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <FaCode className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-amber-700 truncate">{mencion.codigo}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 sm:gap-2 sm:flex-col sm:items-end">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      mencion.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {mencion.activo ? 'Activa' : 'Inactiva'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      mencion.disponible ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {mencion.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                  </div>
                </div>

                {/* Información del programa */}
                <div className="mb-4 p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <FaGraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-amber-900">Programa:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-800 mt-1 truncate">{mencion.programaEstudio.nombre}</p>
                  <p className="text-xs text-amber-600">Código: {mencion.programaEstudio.codigo}</p>
                </div>

                {/* Descripción */}
                {mencion.descripcion && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaInfoCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Descripción:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">{mencion.descripcion}</p>
                  </div>
                )}

                {/* Requisitos */}
                {mencion.requisitos && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaClipboardList className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-blue-700">Requisitos:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-600 line-clamp-2">{mencion.requisitos}</p>
                  </div>
                )}

                {/* Fecha de creación */}
                <div className="text-xs text-gray-500 mb-4">
                  Creada: {new Date(mencion.fechaCreacion).toLocaleDateString()}
                </div>

                {/* Acciones */}
                {user?.role === 'ADMIN' && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 gap-3 sm:gap-2">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={FaEdit}
                        onClick={() => openModal(mencion)}
                        className="text-amber-600 border-amber-300 hover:bg-amber-50 text-xs sm:text-sm flex-1 sm:flex-none"
                      >
                        <span className="sm:hidden">Editar</span>
                        <span className="hidden sm:inline">Editar</span>
                      </Button>
                      
                      <Button
                        variant={mencion.activo ? "danger" : "secondary"}
                        size="sm"
                        leftIcon={FaPowerOff}
                        onClick={() => handleToggleActive(mencion)}
                        className="hover:shadow-md transition-all duration-200 text-xs sm:text-sm flex-1 sm:flex-none"
                      >
                        {mencion.activo ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={mencion.disponible ? "ghost" : "secondary"}
                        size="sm"
                        leftIcon={mencion.disponible ? FaEyeSlash : FaEye}
                        onClick={() => handleToggleDisponible(mencion)}
                        className="text-blue-600 hover:bg-blue-50 text-xs sm:text-sm flex-1 sm:flex-none"
                      >
                        {mencion.disponible ? 'Ocultar' : 'Mostrar'}
                      </Button>
                      
                      <Button
                        variant="danger"
                        size="sm"
                        leftIcon={FaTrash}
                        onClick={() => handleDelete(mencion)}
                        className="hover:shadow-md transition-all duration-200 text-xs sm:text-sm flex-1 sm:flex-none"
                      >
                        <span className="sm:hidden">Eliminar</span>
                        <span className="hidden sm:inline">Eliminar</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje cuando no hay resultados */}
        {filteredMenciones.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <FaCertificate className="w-12 h-12 sm:w-16 sm:h-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-amber-800 mb-2">No se encontraron menciones</h3>
            <p className="text-amber-600 text-sm sm:text-base px-4">
              {searchTerm || selectedPrograma 
                ? 'Intenta ajustar los filtros de búsqueda' 
                : 'Aún no hay menciones registradas'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                <FaCertificate className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 mr-2 sm:mr-3" />
                {editingMencion ? 'Editar Mención' : 'Nueva Mención'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Mención *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ej: Gestión de Recursos Humanos"
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
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ej: MEN-GRH"
                />
              </div>

              {/* Programa de Estudio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programa de Estudio *
                </label>
                <select
                  required
                  value={formData.programaEstudioId}
                  onChange={(e) => setFormData({ ...formData, programaEstudioId: Number(e.target.value) })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  title="Seleccionar programa de estudio"
                >
                  <option value={0}>Seleccionar programa</option>
                  {programas.map(programa => (
                    <option key={programa.id} value={programa.id}>
                      {programa.nombre} ({programa.codigo})
                    </option>
                  ))}
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  rows={4}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Descripción detallada de la mención..."
                />
              </div>

              {/* Requisitos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requisitos
                </label>
                <textarea
                  rows={3}
                  value={formData.requisitos}
                  onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Requisitos específicos para la mención..."
                />
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeModal}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={editingMencion ? FaEdit : FaPlus}
                  className="w-full sm:w-auto order-1 sm:order-2"
                >
                  {editingMencion ? 'Actualizar' : 'Crear'} Mención
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}