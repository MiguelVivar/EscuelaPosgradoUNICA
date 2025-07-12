"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common';
import { facultadesService } from '@/services/facultadesService';
import { Facultad, FacultadForm } from '@/types/facultad';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaPowerOff,
  FaGraduationCap,
  FaUserTie,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
  FaCalendarAlt,
  FaFilter,
  FaUniversity
} from 'react-icons/fa';

export default function FacultadesPage() {
  const { user } = useAuth();
  const [facultades, setFacultades] = useState<Facultad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchByDecano, setSearchByDecano] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingFacultad, setEditingFacultad] = useState<Facultad | null>(null);
  const [formData, setFormData] = useState<FacultadForm>({
    nombre: '',
    codigo: '',
    descripcion: '',
    decano: ''
  });

  // Refs para animaciones
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Verificar permisos
  const canManage = user?.role === 'ADMIN' || user?.role === 'COORDINADOR';

  useEffect(() => {
    loadFacultades();
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
    if (facultades.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('tbody tr');
      gsap.fromTo(rows,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [facultades]);

  useEffect(() => {
    if (statsRef.current) {
      gsap.fromTo(statsRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [facultades]);

  const loadFacultades = async () => {
    try {
      setLoading(true);
      const data = await facultadesService.getFacultades();
      setFacultades(data);
    } catch (error) {
      console.error('Error al cargar facultades:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las facultades',
        confirmButtonColor: '#d97706'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim() && !searchByDecano.trim()) {
      loadFacultades();
      return;
    }

    try {
      setLoading(true);
      let results: Facultad[] = [];
      
      if (searchTerm.trim()) {
        results = await facultadesService.searchFacultadesByNombre(searchTerm);
      } else if (searchByDecano.trim()) {
        results = await facultadesService.searchFacultadesByDecano(searchByDecano);
      }
      
      setFacultades(results);
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al realizar la búsqueda',
        confirmButtonColor: '#d97706'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchByDecano('');
    setStatusFilter('all');
    loadFacultades();
  };

  const openModal = (facultad?: Facultad) => {
    if (facultad) {
      setEditingFacultad(facultad);
      setFormData({
        nombre: facultad.nombre,
        codigo: facultad.codigo,
        descripcion: facultad.descripcion || '',
        decano: facultad.decano || ''
      });
    } else {
      setEditingFacultad(null);
      setFormData({
        nombre: '',
        codigo: '',
        descripcion: '',
        decano: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFacultad(null);
    setFormData({
      nombre: '',
      codigo: '',
      descripcion: '',
      decano: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingFacultad) {
        await facultadesService.updateFacultad(editingFacultad.id, formData);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Facultad actualizada correctamente',
          confirmButtonColor: '#d97706'
        });
      } else {
        await facultadesService.createFacultad(formData);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Facultad creada correctamente',
          confirmButtonColor: '#d97706'
        });
      }
      
      closeModal();
      loadFacultades();
    } catch (error: any) {
      console.error('Error al guardar facultad:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error al guardar la facultad',
        confirmButtonColor: '#d97706'
      });
    }
  };

  const handleDelete = async (facultad: Facultad) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la facultad "${facultad.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d97706',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await facultadesService.deleteFacultad(facultad.id);
        Swal.fire({
          icon: 'success',
          title: '¡Eliminada!',
          text: 'La facultad ha sido eliminada',
          confirmButtonColor: '#d97706'
        });
        loadFacultades();
      } catch (error: any) {
        console.error('Error al eliminar facultad:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Error al eliminar la facultad',
          confirmButtonColor: '#d97706'
        });
      }
    }
  };

  const handleToggleActive = async (facultad: Facultad) => {
    const action = facultad.activo ? 'desactivar' : 'activar';
    const result = await Swal.fire({
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} facultad?`,
      text: `¿Deseas ${action} la facultad "${facultad.nombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d97706',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await facultadesService.toggleFacultadActive(facultad.id);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: `Facultad ${action}da correctamente`,
          confirmButtonColor: '#d97706'
        });
        loadFacultades();
      } catch (error: any) {
        console.error('Error al cambiar estado:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || `Error al ${action} la facultad`,
          confirmButtonColor: '#d97706'
        });
      }
    }
  };

  // Filtrar facultades según el estado seleccionado
  const filteredFacultades = facultades.filter(facultad => {
    if (statusFilter === 'active') return facultad.activo;
    if (statusFilter === 'inactive') return !facultad.activo;
    return true; // 'all'
  });

  // Estadísticas
  const stats = {
    total: facultades.length,
    activas: facultades.filter(f => f.activo).length,
    inactivas: facultades.filter(f => !f.activo).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600"></div>
          <p className="text-gray-600 text-lg">Cargando facultades...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-3 mb-4 lg:mb-0">
              <div className="p-3 bg-amber-100 rounded-xl">
                <FaUniversity className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Facultades</h1>
                <p className="text-gray-600">Administra las facultades de la universidad</p>
              </div>
            </div>
            
            {canManage && (
              <Button
                variant="primary"
                leftIcon={FaPlus}
                onClick={() => openModal()}
                className="self-start lg:self-auto"
              >
                Nueva Facultad
              </Button>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaBuilding className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Facultades</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <FaCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Facultades Activas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activas}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-xl">
                <FaTimesCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Facultades Inactivas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactivas}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por nombre
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nombre de la facultad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por decano
              </label>
              <div className="relative">
                <FaUserTie className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nombre del decano..."
                  value={searchByDecano}
                  onChange={(e) => setSearchByDecano(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
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

            <div className="flex items-end space-x-2">
              <Button
                variant="primary"
                onClick={handleSearch}
                className="flex-1"
              >
                Buscar
              </Button>
              <Button
                variant="outline"
                onClick={handleClearSearch}
              >
                Limpiar
              </Button>
            </div>
          </div>
        </div>

        {/* Tabla de facultades */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table ref={tableRef} className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facultad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Decano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Creación
                  </th>
                  {canManage && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFacultades.map((facultad) => (
                  <tr key={facultad.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-amber-100 rounded-lg mr-3">
                          <FaGraduationCap className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{facultad.nombre}</div>
                          {facultad.descripcion && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {facultad.descripcion}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {facultad.codigo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUserTie className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {facultad.decano || 'No asignado'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        facultad.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {facultad.activo ? (
                          <>
                            <FaCheckCircle className="w-3 h-3 mr-1" />
                            Activa
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="w-3 h-3 mr-1" />
                            Inactiva
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaCalendarAlt className="h-4 w-4 text-gray-400 mr-2" />
                        {new Date(facultad.fechaCreacion).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    {canManage && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openModal(facultad)}
                            className="text-amber-600 hover:text-amber-900 p-2 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                            title="Editar"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(facultad)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              facultad.activo
                                ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                                : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                            }`}
                            title={facultad.activo ? 'Desactivar' : 'Activar'}
                          >
                            <FaPowerOff className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(facultad)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Eliminar"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredFacultades.length === 0 && (
              <div className="text-center py-12">
                <FaGraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay facultades</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || searchByDecano || statusFilter !== 'all'
                    ? 'No se encontraron facultades con los filtros aplicados.'
                    : 'Comienza creando una nueva facultad.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para crear/editar facultad */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div ref={modalRef} className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
            <div className="bg-amber-600 text-white px-6 py-4 rounded-t-xl">
              <h3 className="text-lg font-semibold flex items-center">
                <FaGraduationCap className="mr-2" />
                {editingFacultad ? 'Editar Facultad' : 'Nueva Facultad'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Facultad *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ej: Facultad de Ingeniería"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código *
                </label>
                <input
                  type="text"
                  required
                  value={formData.codigo}
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ej: FI"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Decano
                </label>
                <input
                  type="text"
                  value={formData.decano}
                  onChange={(e) => setFormData({...formData, decano: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Nombre del decano"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Descripción de la facultad..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeModal}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {editingFacultad ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
