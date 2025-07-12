"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common';
import { aulasService } from '@/services/aulasService';
import { sedesService } from '@/services/sedesService';
import { Aula, AulaForm } from '@/types/aula';
import { Sede } from '@/types/sede';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaPowerOff,
  FaBuilding,
  FaChair,
  FaTv,
  FaMapMarkerAlt,
  FaUsers,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaGraduationCap
} from 'react-icons/fa';

export default function AulasPage() {
  const { user } = useAuth();
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSede, setSelectedSede] = useState<number | ''>('');
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [minCapacidad, setMinCapacidad] = useState<number | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [editingAula, setEditingAula] = useState<Aula | null>(null);
  const [formData, setFormData] = useState<AulaForm>({
    nombre: '',
    codigo: '',
    capacidad: 0,
    tipo: '',
    equipamiento: '',
    descripcion: '',
    sedeId: 0
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
    if (aulas.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('tbody tr');
      gsap.fromTo(rows,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [aulas]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [aulasData, sedesData] = await Promise.all([
        aulasService.getAulas(),
        sedesService.getSedesActivas()
      ]);
      setAulas(aulasData);
      setSedes(sedesData);
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

  const filteredAulas = aulas.filter(aula => {
    const matchesSearch = aula.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aula.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aula.sede.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSede = selectedSede === '' || aula.sede.id === selectedSede;
    const matchesTipo = selectedTipo === '' || aula.tipo === selectedTipo;
    const matchesCapacidad = minCapacidad === '' || aula.capacidad >= minCapacidad;
    
    return matchesSearch && matchesSede && matchesTipo && matchesCapacidad;
  });

  const getTiposUnicos = () => {
    const tipos = aulas.map(aula => aula.tipo).filter(Boolean);
    return [...new Set(tipos)];
  };

  const openModal = (aula?: Aula) => {
    if (aula) {
      setEditingAula(aula);
      setFormData({
        nombre: aula.nombre,
        codigo: aula.codigo,
        capacidad: aula.capacidad,
        tipo: aula.tipo || '',
        equipamiento: aula.equipamiento || '',
        descripcion: aula.descripcion || '',
        sedeId: aula.sede.id
      });
    } else {
      setEditingAula(null);
      setFormData({
        nombre: '',
        codigo: '',
        capacidad: 0,
        tipo: '',
        equipamiento: '',
        descripcion: '',
        sedeId: 0
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAula(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sedeId) {
      Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar una sede',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    try {
      const aulaData = {
        nombre: formData.nombre,
        codigo: formData.codigo,
        capacidad: formData.capacidad,
        tipo: formData.tipo || undefined,
        equipamiento: formData.equipamiento || undefined,
        descripcion: formData.descripcion || undefined,
        sedeId: formData.sedeId
      };

      if (editingAula) {
        await aulasService.updateAula(editingAula.id, aulaData);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Aula actualizada correctamente',
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
      } else {
        await aulasService.createAula(aulaData);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Aula creada correctamente',
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
      }

      closeModal();
      loadData();
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Error al guardar el aula',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
    }
  };

  const handleToggleActive = async (aula: Aula) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas ${aula.activo ? 'desactivar' : 'activar'} el aula "${aula.nombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: aula.activo ? 'Desactivar' : 'Activar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await aulasService.toggleActiveAula(aula.id);
        Swal.fire({
          title: '¡Éxito!',
          text: `Aula ${aula.activo ? 'desactivada' : 'activada'} correctamente`,
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
        loadData();
      } catch (error: any) {
        Swal.fire({
          title: 'Error',
          text: error.message || 'Error al cambiar el estado del aula',
          icon: 'error',
          confirmButtonColor: '#f59e0b'
        });
      }
    }
  };

  const handleDelete = async (aula: Aula) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Esta acción eliminará el aula "${aula.nombre}" de forma permanente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await aulasService.deleteAula(aula.id);
        Swal.fire({
          title: '¡Eliminada!',
          text: 'El aula ha sido eliminada correctamente',
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
        loadData();
      } catch (error: any) {
        Swal.fire({
          title: 'Error',
          text: error.message || 'Error al eliminar el aula',
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
          <p className="text-gray-600">Cargando aulas...</p>
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
            <FaBuilding className="text-2xl text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Aulas</h1>
            <p className="text-gray-600">Administra las aulas del sistema educativo</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Aulas</p>
                <p className="text-2xl font-bold text-gray-900">{aulas.length}</p>
              </div>
              <FaBuilding className="text-2xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-green-600">{aulas.filter(a => a.activo).length}</p>
              </div>
              <FaCheckCircle className="text-2xl text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactivas</p>
                <p className="text-2xl font-bold text-red-600">{aulas.filter(a => !a.activo).length}</p>
              </div>
              <FaTimesCircle className="text-2xl text-red-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Capacidad Total</p>
                <p className="text-2xl font-bold text-purple-600">{aulas.reduce((sum, a) => sum + a.capacidad, 0)}</p>
              </div>
              <FaUsers className="text-2xl text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* Search */}
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar aulas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sede Filter */}
            <div>
              <select
                value={selectedSede}
                onChange={(e) => setSelectedSede(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                aria-label="Filtrar por sede"
              >
                <option value="">Todas las sedes</option>
                {sedes.map(sede => (
                  <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                ))}
              </select>
            </div>

            {/* Tipo Filter */}
            <div>
              <select
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                aria-label="Filtrar por tipo de aula"
              >
                <option value="">Todos los tipos</option>
                {getTiposUnicos().map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            {/* Capacidad Mínima */}
            <div>
              <input
                type="number"
                placeholder="Capacidad mín."
                value={minCapacidad}
                onChange={(e) => setMinCapacidad(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                min="1"
              />
            </div>

            {/* Add Button */}
            {canManage && (
              <div>
                <Button
                  variant="primary"
                  onClick={() => openModal()}
                  leftIcon={FaPlus}
                  fullWidth
                >
                  Nueva Aula
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
                  Aula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sede
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipamiento
                </th>
                {canManage && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAulas.map((aula) => (
                <tr key={aula.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <FaBuilding className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{aula.nombre}</div>
                        <div className="text-sm text-gray-500">{aula.codigo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{aula.sede.nombre}</div>
                        <div className="text-sm text-gray-500">{aula.sede.codigo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUsers className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{aula.capacidad}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaGraduationCap className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{aula.tipo || 'Sin especificar'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      aula.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {aula.activo ? (
                        <>
                          <FaCheckCircle className="mr-1" />
                          Activa
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="mr-1" />
                          Inactiva
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaTv className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 truncate max-w-xs" title={aula.equipamiento}>
                        {aula.equipamiento || 'Sin especificar'}
                      </span>
                    </div>
                  </td>
                  {canManage && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openModal(aula)}
                          leftIcon={FaEdit}
                        >
                          Editar
                        </Button>
                        <Button
                          variant={aula.activo ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => handleToggleActive(aula)}
                          leftIcon={FaPowerOff}
                        >
                          {aula.activo ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(aula)}
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

          {filteredAulas.length === 0 && (
            <div className="text-center py-12">
              <FaInfoCircle className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron aulas</h3>
              <p className="text-gray-500">
                {searchTerm || selectedSede || selectedTipo || minCapacidad
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Aún no hay aulas registradas en el sistema'
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
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FaBuilding className="text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingAula ? 'Editar Aula' : 'Nueva Aula'}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Aula *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ej: Aula Magna"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ej: AM-001"
                      required
                    />
                  </div>

                  {/* Sede */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sede *
                    </label>
                    <select
                      value={formData.sedeId}
                      onChange={(e) => setFormData({ ...formData, sedeId: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                      aria-label="Seleccionar sede"
                    >
                      <option value={0}>Seleccionar sede</option>
                      {sedes.map(sede => (
                        <option key={sede.id} value={sede.id}>
                          {sede.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Capacidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacidad *
                    </label>
                    <input
                      type="number"
                      value={formData.capacidad}
                      onChange={(e) => setFormData({ ...formData, capacidad: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Número de personas"
                      min="1"
                      required
                    />
                  </div>

                  {/* Tipo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Aula
                    </label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      aria-label="Seleccionar tipo de aula"
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="Magistral">Magistral</option>
                      <option value="Laboratorio">Laboratorio</option>
                      <option value="Seminario">Seminario</option>
                      <option value="Conferencias">Conferencias</option>
                      <option value="Auditorio">Auditorio</option>
                      <option value="Taller">Taller</option>
                    </select>
                  </div>

                  {/* Equipamiento */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Equipamiento
                    </label>
                    <input
                      type="text"
                      value={formData.equipamiento}
                      onChange={(e) => setFormData({ ...formData, equipamiento: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ej: Proyector, Pizarra interactiva, Sistema de sonido"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Descripción adicional del aula"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="secondary"
                    onClick={closeModal}
                    type="button"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                  >
                    {editingAula ? 'Actualizar' : 'Crear'} Aula
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
