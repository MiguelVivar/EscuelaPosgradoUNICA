'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEncuestas } from '@/hooks/useEncuestas';
import { Encuesta } from '@/types/encuestas';
import { 
  FaPlus, 
  FaEdit, 
  FaEye, 
  FaTrash, 
  FaUsers, 
  FaChartBar,
  FaCalendarAlt,
  FaClock,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import CreateEncuestaModal from '@/components/encuestas/CreateEncuestaModal';

export default function AdminEncuestasPage() {
  const { user: _user, isAuthenticated } = useAuth();
  const {
    encuestas,
    loading,
    eliminarEncuesta,
    actualizarEstadoEncuesta,
    refreshEncuestas
  } = useEncuestas();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Derivar estado de la encuesta
  const getEncuestaEstado = (encuesta: Encuesta) => {
    const now = new Date();
    const inicio = new Date(encuesta.fechaInicio);
    const cierre = new Date(encuesta.fechaCierre);
    if (!encuesta.activa) return 'INACTIVA';
    if (now > cierre) return 'FINALIZADA';
    if (encuesta.activa && now >= inicio && now <= cierre) return 'ACTIVA';
    return 'INACTIVA';
  };

  const filteredEncuestas = encuestas.filter(encuesta => {
    const matchesSearch = encuesta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         encuesta.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const estado = getEncuestaEstado(encuesta);
    const matchesStatus = statusFilter === 'ALL' || estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteEncuesta = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta encuesta?')) {
      await eliminarEncuesta(id);
    }
  };

  const handleToggleEstado = async (encuesta: Encuesta) => {
    const estadoActual = getEncuestaEstado(encuesta);
    const nuevoEstado = estadoActual === 'ACTIVA';
    await actualizarEstadoEncuesta(encuesta.id, !nuevoEstado);
  };

  const getEstadoBadge = (estado: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (estado) {
      case 'ACTIVA':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'INACTIVA':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'FINALIZADA':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando encuestas...</p>
        </div>
      </div>
    );
  }

  // ...existing code...
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Encuestas</h1>
              <p className="mt-2 text-gray-600">Administra las encuestas del sistema</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                Nueva Encuesta
              </button>
            </div>
          </div>
        </div>
        {/* Estadísticas eliminadas por falta de datos */}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSearch className="inline mr-1" />
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título o descripción..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaFilter className="inline mr-1" />
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="ALL">Todos los estados</option>
                <option value="ACTIVA">Activas</option>
                <option value="INACTIVA">Inactivas</option>
                <option value="FINALIZADA">Finalizadas</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={refreshEncuestas}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Lista de encuestas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Encuestas ({filteredEncuestas.length})
            </h2>
          </div>

          {filteredEncuestas.length === 0 ? (
            <div className="p-12 text-center">
              <FaChartBar className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay encuestas</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'ALL' 
                  ? 'No se encontraron encuestas con los filtros aplicados'
                  : 'Aún no has creado ninguna encuesta'
                }
              </p>
              {!searchTerm && statusFilter === 'ALL' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Crear Primera Encuesta
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredEncuestas.map((encuesta) => (
                <div key={encuesta.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {encuesta.titulo}
                        </h3>
                        <span className={getEstadoBadge(getEncuestaEstado(encuesta))}>
                          {getEncuestaEstado(encuesta)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{encuesta.descripcion}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FaCalendarAlt />
                          <span>Creada: {formatDate(encuesta.fechaCreacion)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaUsers />
                          <span>{encuesta.totalRespuestas || 0} respuestas</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaChartBar />
                          <span>{encuesta.preguntas.length} preguntas</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => {/* Ver resultados */}}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                        title="Ver resultados"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => {/* Editar encuesta */}}
                        className="p-2 text-amber-600 hover:bg-amber-100 rounded"
                        title="Editar encuesta"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleToggleEstado(encuesta)}
                        className={`p-2 rounded ${
                          getEncuestaEstado(encuesta) === 'ACTIVA' 
                            ? 'text-red-600 hover:bg-red-100' 
                            : 'text-green-600 hover:bg-green-100'
                        }`}
                        title={getEncuestaEstado(encuesta) === 'ACTIVA' ? 'Desactivar' : 'Activar'}
                      >
                        <FaClock />
                      </button>
                      <button
                        onClick={() => handleDeleteEncuesta(encuesta.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                        title="Eliminar encuesta"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear encuesta */}
      {showCreateModal && (
        <CreateEncuestaModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            refreshEncuestas();
          }}
        />
      )}
    </div>
  );
}
