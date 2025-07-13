"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common';
import { sedesService } from '@/services/sedesService';
import { Sede, SedeForm } from '@/types/sede';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaPowerOff,
  FaMapMarkerAlt,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

export default function SedesPage() {
  const { user } = useAuth();
  
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSede, setEditingSede] = useState<Sede | null>(null);
  const [formData, setFormData] = useState<SedeForm>({
    nombre: "",
    codigo: "",
    direccion: "",
    telefono: "",
    email: ""
  });

  // Refs para animaciones
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  // Verificar permisos
  const canManage = user?.role === 'ADMIN' || user?.role === 'COORDINADOR';

  useEffect(() => {
    loadSedes();
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
    if (sedes.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('tbody tr');
      gsap.fromTo(rows,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [sedes]);

  const loadSedes = async () => {
    try {
      setLoading(true);
      const data = await sedesService.getSedes();
      setSedes(data);
    } catch (error) {
      console.error('Error al cargar sedes:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar las sedes',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSedes = sedes.filter(sede => {
    return sede.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           sede.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
           sede.direccion.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const openModal = (sede?: Sede) => {
    if (sede) {
      setEditingSede(sede);
      setFormData({
        nombre: sede.nombre,
        codigo: sede.codigo,
        direccion: sede.direccion,
        telefono: sede.telefono || "",
        email: sede.email || ""
      });
    } else {
      setEditingSede(null);
      setFormData({
        nombre: "",
        codigo: "",
        direccion: "",
        telefono: "",
        email: ""
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSede(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.nombre.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'El nombre de la sede es obligatorio',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    if (!formData.codigo.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'El código de la sede es obligatorio',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    if (!formData.direccion.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'La dirección de la sede es obligatoria',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    // Validación de email si se proporciona
    if (formData.email && !isValidEmail(formData.email)) {
      Swal.fire({
        title: 'Error',
        text: 'El formato del email no es válido',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    try {
      const sedeData = {
        nombre: formData.nombre.trim(),
        codigo: formData.codigo.trim().toUpperCase(),
        direccion: formData.direccion.trim(),
        telefono: formData.telefono.trim() || undefined,
        email: formData.email.trim() || undefined
      };

      if (editingSede) {
        await sedesService.updateSede(editingSede.id, sedeData);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Sede actualizada correctamente',
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
      } else {
        await sedesService.createSede(sedeData);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Sede creada correctamente',
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
      }

      closeModal();
      loadSedes();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar la sede';
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
    }
  };

  const handleToggleActive = async (sede: Sede) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas ${sede.activo ? 'desactivar' : 'activar'} la sede "${sede.nombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: sede.activo ? 'Desactivar' : 'Activar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await sedesService.toggleSedeActiva(sede.id);
        Swal.fire({
          title: '¡Éxito!',
          text: `Sede ${sede.activo ? 'desactivada' : 'activada'} correctamente`,
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
        loadSedes();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al cambiar el estado de la sede';
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#f59e0b'
        });
      }
    }
  };

  const handleDelete = async (sede: Sede) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Esta acción eliminará la sede "${sede.nombre}" de forma permanente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await sedesService.deleteSede(sede.id);
        Swal.fire({
          title: '¡Eliminada!',
          text: 'La sede ha sido eliminada correctamente',
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
        loadSedes();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la sede';
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#f59e0b'
        });
      }
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Cargando sedes...</p>
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
            <FaMapMarkerAlt className="text-2xl text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Sedes</h1>
            <p className="text-gray-600">Administra las sedes del sistema educativo</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sedes</p>
                <p className="text-2xl font-bold text-gray-900">{sedes.length}</p>
              </div>
              <FaBuilding className="text-2xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-green-600">{sedes.filter(s => s.activo).length}</p>
              </div>
              <FaCheckCircle className="text-2xl text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactivas</p>
                <p className="text-2xl font-bold text-red-600">{sedes.filter(s => !s.activo).length}</p>
              </div>
              <FaTimesCircle className="text-2xl text-red-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Con Email</p>
                <p className="text-2xl font-bold text-purple-600">{sedes.filter(s => s.email).length}</p>
              </div>
              <FaEnvelope className="text-2xl text-purple-500" />
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
                  placeholder="Buscar sedes..."
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
                  onClick={() => openModal()}
                  leftIcon={FaPlus}
                  fullWidth
                >
                  Nueva Sede
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
                  Sede
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fechas
                </th>
                {canManage && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSedes.map((sede) => (
                <tr key={sede.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <FaBuilding className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{sede.nombre}</div>
                        <div className="text-sm text-gray-500">{sede.codigo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-900 max-w-xs break-words">{sede.direccion}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {sede.telefono && (
                        <div className="flex items-center">
                          <FaPhone className="text-gray-400 mr-2 text-xs" />
                          <span className="text-sm text-gray-900">{sede.telefono}</span>
                        </div>
                      )}
                      {sede.email && (
                        <div className="flex items-center">
                          <FaEnvelope className="text-gray-400 mr-2 text-xs" />
                          <span className="text-sm text-gray-900 truncate max-w-xs" title={sede.email}>
                            {sede.email}
                          </span>
                        </div>
                      )}
                      {!sede.telefono && !sede.email && (
                        <span className="text-sm text-gray-400">Sin contacto</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sede.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {sede.activo ? (
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
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Creada: {formatDate(sede.fechaCreacion)}</div>
                      <div>Actualizada: {formatDate(sede.fechaActualizacion)}</div>
                    </div>
                  </td>
                  {canManage && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openModal(sede)}
                          leftIcon={FaEdit}
                        >
                          Editar
                        </Button>
                        <Button
                          variant={sede.activo ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => handleToggleActive(sede)}
                          leftIcon={FaPowerOff}
                        >
                          {sede.activo ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(sede)}
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

          {filteredSedes.length === 0 && (
            <div className="text-center py-12">
              <FaInfoCircle className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron sedes</h3>
              <p className="text-gray-500">
                {searchTerm
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Aún no hay sedes registradas en el sistema'
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
                    <FaMapMarkerAlt className="text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingSede ? 'Editar Sede' : 'Nueva Sede'}
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
                      Nombre de la Sede *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ej: Sede Central"
                      required
                      maxLength={100}
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
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ej: SC001"
                      required
                      maxLength={20}
                    />
                  </div>

                  {/* Dirección */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección *
                    </label>
                    <textarea
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Dirección completa de la sede"
                      required
                      rows={3}
                      maxLength={500}
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ej: (056) 123-4567"
                      maxLength={15}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ej: sede@universidad.edu.pe"
                      maxLength={100}
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
                    {editingSede ? 'Actualizar' : 'Crear'} Sede
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
