"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common';
import { comisionesService } from '@/services/comisionesService';
import { facultadesService } from '@/services/facultadesService';
import { Comision, ComisionRequest } from '@/types/comision';
import { Facultad } from '@/types/facultad';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';
import { 
  FaUsers, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaPowerOff, 
  FaSearch, 
  FaFilter,
  FaUniversity,
  FaUserTie,
  FaCalendarAlt,
  FaTimes,
  FaSave,
  FaGraduationCap,
  FaUser
} from 'react-icons/fa';

const TIPOS_COMISION = [
  'POSGRADO',
  'SEGUNDA_ESPECIALIDAD',
  'ADMISIONES',
  'CALIDAD',
  'INVESTIGACION'
];

export default function ComisionesPage() {
  const { user } = useAuth();
  const [comisiones, setComisiones] = useState<Comision[]>([]);
  const [facultades, setFacultades] = useState<Facultad[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComision, setEditingComision] = useState<Comision | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacultad, setSelectedFacultad] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [formData, setFormData] = useState<ComisionRequest>({
    nombre: '',
    codigo: '',
    tipo: '',
    presidente: '',
    secretario: '',
    miembros: '',
    descripcion: '',
    funciones: '',
    fechaInicioGestion: '',
    fechaFinGestion: '',
    facultadId: 0
  });

  // Verificar permisos de gestión
  const canManage = user?.role === 'ADMIN' || user?.role === 'COORDINADOR';

  // Cargar datos iniciales
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [comisionesData, facultadesData] = await Promise.all([
        comisionesService.getComisiones(),
        facultadesService.getFacultadesActivas()
      ]);
      
      setComisiones(comisionesData);
      setFacultades(facultadesData);
      
      // Animación de entrada
      gsap.fromTo('.comision-card', 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las comisiones',
        confirmButtonColor: '#d97706'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Animación de entrada de página
  useEffect(() => {
    gsap.fromTo('.page-header', 
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
    
    gsap.fromTo('.filters-section', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power2.out" }
    );
  }, []);

  // Filtrar comisiones
  const filteredComisiones = comisiones.filter(comision => {
    const matchesSearch = comision.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comision.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (comision.presidente && comision.presidente.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFacultad = selectedFacultad === '' || comision.facultad.id.toString() === selectedFacultad;
    const matchesTipo = selectedTipo === '' || comision.tipo === selectedTipo;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && comision.activo) ||
                         (statusFilter === 'inactive' && !comision.activo);

    return matchesSearch && matchesFacultad && matchesTipo && matchesStatus;
  });

  // Obtener datos únicos para filtros
  const getTiposUnicos = () => {
    const tipos = comisiones.map(c => c.tipo).filter(Boolean);
    return [...new Set(tipos)];
  };

  const getFacultadesUnicas = () => {
    const facultadesComisiones = comisiones.map(c => c.facultad);
    return facultadesComisiones.filter((facultad, index, self) => 
      index === self.findIndex(f => f.id === facultad.id)
    );
  };

  // Abrir modal
  const openModal = (comision?: Comision) => {
    if (comision) {
      setEditingComision(comision);
      setFormData({
        nombre: comision.nombre,
        codigo: comision.codigo,
        tipo: comision.tipo,
        presidente: comision.presidente || '',
        secretario: comision.secretario || '',
        miembros: comision.miembros || '',
        descripcion: comision.descripcion || '',
        funciones: comision.funciones || '',
        fechaInicioGestion: comision.fechaInicioGestion || '',
        fechaFinGestion: comision.fechaFinGestion || '',
        facultadId: comision.facultad.id
      });
    } else {
      setEditingComision(null);
      setFormData({
        nombre: '',
        codigo: '',
        tipo: '',
        presidente: '',
        secretario: '',
        miembros: '',
        descripcion: '',
        funciones: '',
        fechaInicioGestion: '',
        fechaFinGestion: '',
        facultadId: 0
      });
    }
    setIsModalOpen(true);

    // Animación del modal
    setTimeout(() => {
      gsap.fromTo('.modal-content', 
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }, 10);
  };

  // Cerrar modal
  const closeModal = () => {
    gsap.to('.modal-content', {
      scale: 0.9,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setIsModalOpen(false);
        setEditingComision(null);
      }
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.codigo || !formData.tipo || !formData.facultadId) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor, complete todos los campos obligatorios',
        confirmButtonColor: '#d97706'
      });
      return;
    }

    try {
      let result;
      if (editingComision) {
        result = await comisionesService.updateComision(editingComision.id, formData);
        Swal.fire({
          icon: 'success',
          title: 'Comisión actualizada',
          text: 'La comisión se ha actualizado correctamente',
          confirmButtonColor: '#d97706'
        });
      } else {
        result = await comisionesService.createComision(formData);
        Swal.fire({
          icon: 'success',
          title: 'Comisión creada',
          text: 'La comisión se ha creado correctamente',
          confirmButtonColor: '#d97706'
        });
      }
      
      closeModal();
      loadData();
    } catch (error) {
      console.error('Error al guardar comisión:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al guardar la comisión',
        confirmButtonColor: '#d97706'
      });
    }
  };

  // Alternar estado activo
  const handleToggleActive = async (comision: Comision) => {
    const action = comision.activo ? 'desactivar' : 'activar';
    
    const result = await Swal.fire({
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} comisión?`,
      text: `¿Está seguro que desea ${action} la comisión "${comision.nombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d97706',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await comisionesService.toggleActiveComision(comision.id, !comision.activo);
        Swal.fire({
          icon: 'success',
          title: 'Estado actualizado',
          text: `La comisión se ha ${action}do correctamente`,
          confirmButtonColor: '#d97706'
        });
        loadData();
      } catch (error) {
        console.error(`Error al ${action} comisión:`, error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No se pudo ${action} la comisión`,
          confirmButtonColor: '#d97706'
        });
      }
    }
  };

  // Eliminar comisión
  const handleDelete = async (comision: Comision) => {
    const result = await Swal.fire({
      title: '¿Eliminar comisión?',
      text: `¿Está seguro que desea eliminar la comisión "${comision.nombre}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await comisionesService.deleteComision(comision.id);
        Swal.fire({
          icon: 'success',
          title: 'Comisión eliminada',
          text: 'La comisión se ha eliminado correctamente',
          confirmButtonColor: '#d97706'
        });
        loadData();
      } catch (error) {
        console.error('Error al eliminar comisión:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la comisión',
          confirmButtonColor: '#d97706'
        });
      }
    }
  };

  // Buscar
  const handleSearch = () => {
    // Los filtros se aplican automáticamente a través de filteredComisiones
    gsap.fromTo('.comision-card', 
      { opacity: 0.5, scale: 0.95 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.4, 
        stagger: 0.05,
        ease: "power2.out"
      }
    );
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFacultad('');
    setSelectedTipo('');
    setStatusFilter('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando comisiones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="page-header mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                  <FaUsers className="text-white text-2xl sm:text-3xl" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
                    Gestión de Comisiones
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">
                    Administra las comisiones de unidades de posgrado
                  </p>
                </div>
              </div>
              
              {/* Estadísticas */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-center min-w-[100px]">
                  <div className="text-lg sm:text-xl font-bold">{comisiones.length}</div>
                  <div className="text-xs opacity-90">Total</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-center min-w-[100px]">
                  <div className="text-lg sm:text-xl font-bold">
                    {comisiones.filter(c => c.activo).length}
                  </div>
                  <div className="text-xs opacity-90">Activas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-section mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
              {/* Búsqueda */}
              <div className="sm:col-span-2">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, código o presidente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Facultad Filter */}
              <div>
                <div className="relative">
                  <FaUniversity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedFacultad}
                    onChange={(e) => setSelectedFacultad(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
                    aria-label="Filtrar por facultad"
                  >
                    <option value="">Todas las facultades</option>
                    {getFacultadesUnicas().map(facultad => (
                      <option key={facultad.id} value={facultad.id.toString()}>
                        {facultad.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tipo Filter */}
              <div>
                <div className="relative">
                  <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedTipo}
                    onChange={(e) => setSelectedTipo(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
                    aria-label="Filtrar por tipo"
                  >
                    <option value="">Todos los tipos</option>
                    {getTiposUnicos().map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Estado Filter */}
              <div>
                <div className="relative">
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    title="Filtrar por estado"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">Todas</option>
                    <option value="active">Activas</option>
                    <option value="inactive">Inactivas</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  className="flex-1 sm:flex-none"
                >
                  Buscar
                </Button>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex-1 sm:flex-none"
                >
                  Limpiar
                </Button>
              </div>

              {/* Add Button */}
              {canManage && (
                <div className="w-full sm:w-auto sm:ml-auto">
                  <Button
                    variant="primary"
                    onClick={() => openModal()}
                    leftIcon={FaPlus}
                    className="w-full sm:w-auto"
                  >
                    Nueva Comisión
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de Comisiones */}
        <div className="space-y-4">
          {filteredComisiones.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
              <FaUsers className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No se encontraron comisiones
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedFacultad || selectedTipo || statusFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Aún no hay comisiones registradas'}
              </p>
            </div>
          ) : (
            filteredComisiones.map((comision, index) => (
              <div
                key={comision.id}
                className="comision-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Información Principal */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-1">
                          {comision.nombre}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            {comision.codigo}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {comision.tipo}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            comision.activo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {comision.activo ? 'Activa' : 'Inactiva'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <FaUniversity className="mr-2 text-amber-600" />
                          <span className="font-medium">Facultad:</span>
                          <span className="ml-1 truncate">{comision.facultad.nombre}</span>
                        </div>
                        
                        {comision.presidente && (
                          <div className="flex items-center text-gray-600">
                            <FaUserTie className="mr-2 text-amber-600" />
                            <span className="font-medium">Presidente:</span>
                            <span className="ml-1 truncate">{comision.presidente}</span>
                          </div>
                        )}

                        {comision.secretario && (
                          <div className="flex items-center text-gray-600">
                            <FaUser className="mr-2 text-amber-600" />
                            <span className="font-medium">Secretario:</span>
                            <span className="ml-1 truncate">{comision.secretario}</span>
                          </div>
                        )}

                        {comision.fechaInicioGestion && (
                          <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="mr-2 text-amber-600" />
                            <span className="font-medium">Inicio Gestión:</span>
                            <span className="ml-1">
                              {new Date(comision.fechaInicioGestion).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {comision.descripcion && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {comision.descripcion}
                        </p>
                      )}
                    </div>

                    {/* Acciones */}
                    {canManage && (
                      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 lg:min-w-[200px]">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModal(comision)}
                            leftIcon={FaEdit}
                            className="flex-1 sm:flex-none text-amber-600 border-amber-300 hover:bg-amber-50"
                          >
                            Editar
                          </Button>
                          <Button
                            variant={comision.activo ? 'secondary' : 'primary'}
                            size="sm"
                            onClick={() => handleToggleActive(comision)}
                            leftIcon={FaPowerOff}
                            className="flex-1 sm:flex-none"
                          >
                            {comision.activo ? 'Desactivar' : 'Activar'}
                          </Button>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(comision)}
                            leftIcon={FaTrash}
                            className="flex-1 sm:flex-none"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="modal-content bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {editingComision ? 'Editar Comisión' : 'Nueva Comisión'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-gray-500" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Comisión *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={200}
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ej: Comisión de Unidad de Posgrado"
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
                      maxLength={20}
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ej: CUP-FCI-001"
                    />
                  </div>

                  {/* Facultad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facultad *
                    </label>
                    <select
                      value={formData.facultadId}
                      onChange={(e) => setFormData({ ...formData, facultadId: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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

                  {/* Tipo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo *
                    </label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                      aria-label="Seleccionar tipo"
                    >
                      <option value="">Seleccionar tipo</option>
                      {TIPOS_COMISION.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  {/* Presidente */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Presidente
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      value={formData.presidente}
                      onChange={(e) => setFormData({ ...formData, presidente: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Nombre del presidente"
                    />
                  </div>

                  {/* Secretario */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secretario
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      value={formData.secretario}
                      onChange={(e) => setFormData({ ...formData, secretario: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Nombre del secretario"
                    />
                  </div>

                  {/* Fechas de Gestión */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inicio de Gestión
                    </label>
                    <input
                      type="date"
                      value={formData.fechaInicioGestion}
                      onChange={(e) => setFormData({ ...formData, fechaInicioGestion: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      title="Fecha de inicio de gestión"
                      aria-label="Fecha de inicio de gestión"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fin de Gestión
                    </label>
                    <input
                      type="date"
                      value={formData.fechaFinGestion}
                      onChange={(e) => setFormData({ ...formData, fechaFinGestion: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      title="Fecha de fin de gestión"
                      aria-label="Fecha de fin de gestión"
                    />
                  </div>

                  {/* Miembros */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Miembros
                    </label>
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={formData.miembros}
                      onChange={(e) => setFormData({ ...formData, miembros: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Lista de miembros separados por comas"
                    />
                  </div>

                  {/* Descripción */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      rows={3}
                      maxLength={1000}
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Descripción de la comisión"
                    />
                  </div>

                  {/* Funciones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Funciones
                    </label>
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={formData.funciones}
                      onChange={(e) => setFormData({ ...formData, funciones: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Funciones principales de la comisión"
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={closeModal}
                    type="button"
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    leftIcon={FaSave}
                    className="w-full sm:w-auto order-1 sm:order-2"
                  >
                    {editingComision ? 'Actualizar' : 'Crear'} Comisión
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
