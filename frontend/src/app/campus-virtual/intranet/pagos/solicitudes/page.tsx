'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSolicitudes } from '@/hooks/useSolicitudes';
import CreateSolicitudModal from '@/components/pagos/CreateSolicitudModal';
import RespondSolicitudModal from '@/components/pagos/RespondSolicitudModal';
import { Solicitud } from '@/types/pagos';

export default function SolicitudesPage() {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [showRespondModal, setShowRespondModal] = useState(false);

  const {
    solicitudes,
    loading,
    error,
    showCreateModal,
    setShowCreateModal,
    createSolicitud,
    respondSolicitud,
  } = useSolicitudes({
    userRole: user?.role || 'ALUMNO',
    isAuthenticated
  });

  const filteredSolicitudes = solicitudes.filter(solicitud => {
    const matchesSearch = 
      solicitud.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (solicitud.usuario && 
        `${solicitud.usuario.nombres} ${solicitud.usuario.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesEstado = !filterEstado || solicitud.estado === filterEstado;
    
    return matchesSearch && matchesEstado;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return 'text-yellow-600 bg-yellow-100';
      case 'APROBADA': return 'text-green-600 bg-green-100';
      case 'RECHAZADA': return 'text-red-600 bg-red-100';
      case 'EN_REVISION': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'FRACCIONAMIENTO': return 'text-blue-600 bg-blue-100';
      case 'EXONERACION': return 'text-green-600 bg-green-100';
      case 'BECA': return 'text-purple-600 bg-purple-100';
      case 'OTRO': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleResponder = (solicitud: Solicitud) => {
    setSelectedSolicitud(solicitud);
    setShowRespondModal(true);
  };

  const estadosCount = {
    total: solicitudes.length,
    pendientes: solicitudes.filter(s => s.estado === 'PENDIENTE').length,
    aprobadas: solicitudes.filter(s => s.estado === 'APROBADA').length,
    rechazadas: solicitudes.filter(s => s.estado === 'RECHAZADA').length,
  };

  return (
    <main className="p-8 bg-zinc-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {user?.role === 'ADMIN' ? 'Gestión de Solicitudes' : 'Mis Solicitudes'}
        </h1>
        {user?.role !== 'ADMIN' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Nueva Solicitud
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="Buscar por tipo, asunto, descripción o usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="APROBADA">Aprobada</option>
            <option value="RECHAZADA">Rechazada</option>
            <option value="EN_REVISION">En Revisión</option>
          </select>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{estadosCount.total}</div>
          <div className="text-sm text-gray-600">Total Solicitudes</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{estadosCount.pendientes}</div>
          <div className="text-sm text-gray-600">Pendientes</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{estadosCount.aprobadas}</div>
          <div className="text-sm text-gray-600">Aprobadas</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{estadosCount.rechazadas}</div>
          <div className="text-sm text-gray-600">Rechazadas</div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando solicitudes...</p>
        </div>
      ) : (
        <>
          {/* Lista de Solicitudes */}
          <div className="space-y-4">
            {filteredSolicitudes.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                No hay solicitudes {searchTerm || filterEstado ? 'que coincidan con los filtros' : 'registradas'}
              </div>
            ) : (
              filteredSolicitudes.map((solicitud) => (
                <div key={solicitud.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(solicitud.tipo)}`}>
                          {solicitud.tipo}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(solicitud.estado)}`}>
                          {solicitud.estado}
                        </span>
                        {user?.role === 'ADMIN' && solicitud.usuario && (
                          <span className="text-sm text-gray-600">
                            por {solicitud.usuario.nombres} {solicitud.usuario.apellidos}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {solicitud.asunto}
                      </h3>
                      <p className="text-gray-700 mb-3 line-clamp-3">
                        {solicitud.descripcion}
                      </p>
                      <div className="flex text-sm text-gray-500 space-x-4">
                        <span>
                          Enviada: {new Date(solicitud.fechaSolicitud).toLocaleDateString('es-PE')}
                        </span>
                        {solicitud.fechaRespuesta && (
                          <span>
                            Respondida: {new Date(solicitud.fechaRespuesta).toLocaleDateString('es-PE')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {user?.role === 'ADMIN' && solicitud.estado === 'PENDIENTE' && (
                        <button
                          onClick={() => handleResponder(solicitud)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Responder
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Respuesta del admin */}
                  {solicitud.respuesta && (
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                      <h4 className="font-medium text-gray-900 mb-2">Respuesta:</h4>
                      <p className="text-gray-700">{solicitud.respuesta}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Modales */}
      <CreateSolicitudModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createSolicitud}
      />

      {selectedSolicitud && (
        <RespondSolicitudModal
          isOpen={showRespondModal}
          onClose={() => {
            setShowRespondModal(false);
            setSelectedSolicitud(null);
          }}
          solicitudId={selectedSolicitud.id}
          asunto={selectedSolicitud.asunto}
          descripcion={selectedSolicitud.descripcion}
          onSubmit={respondSolicitud}
        />
      )}
    </main>
  );
}
