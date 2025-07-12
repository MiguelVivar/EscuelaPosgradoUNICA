"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { 
  FiMapPin, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiToggleLeft, 
  FiToggleRight, 
  FiArrowLeft, 
  FiRefreshCw,
  FiSearch,
  FiMail,
  FiPhone,
  FiHome
} from "react-icons/fi";
import Link from "next/link";
import { sedesService } from "@/services/sedesService";
import { Sede, SedeForm } from "@/types/sede";
import ServiceStatus from "@/components/ui/ServiceStatus";

export default function SedesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [filteredSedes, setFilteredSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSede, setEditingSede] = useState<Sede | null>(null);
  const [serviceAvailable, setServiceAvailable] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<SedeForm>({
    nombre: "",
    codigo: "",
    direccion: "",
    telefono: "",
    email: ""
  });

  // Verificar autenticación y autorización
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
  }, [isLoading, isAuthenticated, user, router]);

  // Cargar sedes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadSedes();
    }
  }, [isAuthenticated, user]);

  // Verificar estado del servicio al cargar
  useEffect(() => {
    checkServiceStatus();
  }, []);

  // Filtrar sedes cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSedes(sedes);
    } else {
      const filtered = sedes.filter(sede =>
        sede.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sede.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sede.direccion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSedes(filtered);
    }
  }, [searchTerm, sedes]);

  const checkServiceStatus = async () => {
    console.log("🔍 [DEBUG] Verificando estado del servicio de sedes...");
    const isAvailable = await sedesService.checkHealth();
    console.log("🔍 [DEBUG] Estado del servicio:", isAvailable);
    setServiceAvailable(isAvailable);
  };

  const loadSedes = async () => {
    try {
      setLoading(true);
      console.log("🔍 [DEBUG] Iniciando carga de sedes...");
      
      const data = await sedesService.getSedes();
      console.log("🔍 [DEBUG] Sedes cargadas:", data);
      
      setSedes(data);
      setFilteredSedes(data);
    } catch (error) {
      console.error("Error al cargar sedes:", error);
      
      let errorMessage = "Error al cargar las sedes";
      if (error instanceof Error) {
        if (error.message.includes("403")) {
          errorMessage = "No tienes permisos para acceder a esta funcionalidad";
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          errorMessage = "Error de conexión. Verifica tu conexión a internet.";
        } else {
          errorMessage = error.message;
        }
      }
      
      await Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Entendido"
      });
    } finally {
      setLoading(false);
    }
  };

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
    setFormData({
      nombre: "",
      codigo: "",
      direccion: "",
      telefono: "",
      email: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.nombre.trim()) {
      await Swal.fire({
        title: "Error",
        text: "El nombre de la sede es obligatorio",
        icon: "error"
      });
      return;
    }

    if (!formData.codigo.trim()) {
      await Swal.fire({
        title: "Error",
        text: "El código de la sede es obligatorio",
        icon: "error"
      });
      return;
    }

    if (!formData.direccion.trim()) {
      await Swal.fire({
        title: "Error",
        text: "La dirección de la sede es obligatoria",
        icon: "error"
      });
      return;
    }

    // Validación de email si se proporciona
    if (formData.email && !isValidEmail(formData.email)) {
      await Swal.fire({
        title: "Error",
        text: "El formato del email no es válido",
        icon: "error"
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

      let result: Sede;
      
      if (editingSede) {
        result = await sedesService.updateSede(editingSede.id, sedeData);
        await Swal.fire({
          title: "¡Éxito!",
          text: "Sede actualizada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        result = await sedesService.createSede(sedeData);
        await Swal.fire({
          title: "¡Éxito!",
          text: "Sede creada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      }

      closeModal();
      await loadSedes();
    } catch (error) {
      console.error("Error al guardar sede:", error);
      
      let errorMessage = "Error al guardar la sede";
      if (error instanceof Error) {
        if (error.message.includes("ya existe")) {
          errorMessage = "Ya existe una sede con ese nombre o código";
        } else if (error.message.includes("403")) {
          errorMessage = "No tienes permisos para realizar esta acción";
        } else {
          errorMessage = error.message;
        }
      }
      
      await Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error"
      });
    }
  };

  const handleToggleActive = async (sede: Sede) => {
    const action = sede.activo ? "desactivar" : "activar";
    
    const result = await Swal.fire({
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} sede?`,
      text: `¿Estás seguro de que quieres ${action} la sede "${sede.nombre}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: sede.activo ? "#ef4444" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await sedesService.toggleSedeActiva(sede.id);
        
        await Swal.fire({
          title: "¡Éxito!",
          text: `Sede ${sede.activo ? "desactivada" : "activada"} correctamente`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
        
        await loadSedes();
      } catch (error) {
        console.error("Error al cambiar estado de sede:", error);
        
        let errorMessage = "Error al cambiar el estado de la sede";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        await Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error"
        });
      }
    }
  };

  const handleDelete = async (sede: Sede) => {
    const result = await Swal.fire({
      title: "¿Eliminar sede?",
      text: `¿Estás seguro de que quieres eliminar la sede "${sede.nombre}"? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await sedesService.deleteSede(sede.id);
        
        await Swal.fire({
          title: "¡Eliminada!",
          text: "La sede ha sido eliminada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
        
        await loadSedes();
      } catch (error) {
        console.error("Error al eliminar sede:", error);
        
        let errorMessage = "Error al eliminar la sede";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        await Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error"
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

  // Mostrar loading mientras se verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado o no tiene permisos, no mostrar nada (el useEffect manejará la redirección)
  if (!isAuthenticated || !user || (user.role !== 'ADMIN' && user.role !== 'COORDINADOR')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Link 
                  href="/campus-virtual/matricula"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  <span>Volver a Matrícula</span>
                </Link>
              </div>
              
              <div className="flex items-center gap-4">
                <ServiceStatus 
                  isAvailable={serviceAvailable} 
                  serviceName="Matrícula - Sedes"
                  onRetry={checkServiceStatus}
                />
                <button
                  onClick={loadSedes}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Actualizar
                </button>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                <FiMapPin className="w-8 h-8 text-green-600" />
                Gestión de Sedes
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Administra las sedes donde se realizan las clases. Gestiona información de ubicación, 
                contacto y estado de cada sede de la institución.
              </p>
            </div>
          </div>
        </div>

        {/* Barra de acciones */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Búsqueda */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, código o dirección..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Botón agregar */}
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiPlus className="w-5 h-5" />
                Nueva Sede
              </button>
            </div>

            {/* Estadísticas */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Total: <strong>{sedes.length}</strong></span>
              <span>Activas: <strong>{sedes.filter(s => s.activo).length}</strong></span>
              <span>Inactivas: <strong>{sedes.filter(s => !s.activo).length}</strong></span>
              {searchTerm && (
                <span>Encontradas: <strong>{filteredSedes.length}</strong></span>
              )}
            </div>
          </div>
        </div>

        {/* Lista de sedes */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando sedes...</p>
          </div>
        ) : filteredSedes.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-12 text-center">
            <FiMapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? "No se encontraron sedes" : "No hay sedes registradas"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? "Intenta con otros términos de búsqueda" 
                : "Comienza agregando la primera sede"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl mx-auto"
              >
                <FiPlus className="w-5 h-5" />
                Crear primera sede
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSedes.map((sede) => (
              <div
                key={sede.id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Header de la tarjeta */}
                <div className={`p-6 ${sede.activo 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-r from-gray-400 to-gray-500'} text-white`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{sede.nombre}</h3>
                      <p className="text-green-100 font-medium">Código: {sede.codigo}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sede.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sede.activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-6">
                  {/* Información de contacto */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <FiHome className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Dirección</p>
                        <p className="text-gray-800 font-medium">{sede.direccion}</p>
                      </div>
                    </div>

                    {sede.telefono && (
                      <div className="flex items-center gap-3">
                        <FiPhone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Teléfono</p>
                          <p className="text-gray-800 font-medium">{sede.telefono}</p>
                        </div>
                      </div>
                    )}

                    {sede.email && (
                      <div className="flex items-center gap-3">
                        <FiMail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-gray-800 font-medium">{sede.email}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fechas */}
                  <div className="text-xs text-gray-500 mb-4 space-y-1">
                    <p>Creada: {formatDate(sede.fechaCreacion)}</p>
                    <p>Actualizada: {formatDate(sede.fechaActualizacion)}</p>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleToggleActive(sede)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        sede.activo
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {sede.activo ? (
                        <>
                          <FiToggleRight className="w-4 h-4" />
                          Desactivar
                        </>
                      ) : (
                        <>
                          <FiToggleLeft className="w-4 h-4" />
                          Activar
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(sede)}
                        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        <FiEdit className="w-4 h-4" />
                        Editar
                      </button>
                      
                      <button
                        onClick={() => handleDelete(sede)}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal para agregar/editar sede */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {editingSede ? "Editar Sede" : "Nueva Sede"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Sede *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Sede Central"
                      required
                      maxLength={100}
                    />
                  </div>

                  {/* Código */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código *
                    </label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: SC001"
                      required
                      maxLength={20}
                    />
                  </div>

                  {/* Dirección */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <textarea
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dirección completa de la sede"
                      required
                      rows={3}
                      maxLength={500}
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: (056) 123-4567"
                      maxLength={15}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: sede@universidad.edu.pe"
                      maxLength={100}
                    />
                  </div>

                  {/* Botones */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all duration-200"
                    >
                      {editingSede ? "Actualizar" : "Crear"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
