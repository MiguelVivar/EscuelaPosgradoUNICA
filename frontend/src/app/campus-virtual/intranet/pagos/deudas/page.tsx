'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDeudas } from '@/hooks/useDeudas';
import CreateDeudaModal from '@/components/pagos/CreateDeudaModal';
import PagarDeudaModal from '@/components/pagos/PagarDeudaModal';
import UserSelector from '@/components/pagos/UserSelector';

export default function DeudasPage() {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeuda, setSelectedDeuda] = useState<any>(null);
  const [showPagarModal, setShowPagarModal] = useState(false);

  const {
    deudas,
    loading,
    error,
    selectedUsuarioId,
    showCreateModal,
    setSelectedUsuarioId,
    setShowCreateModal,
    loadDeudas,
    createDeuda,
    marcarPagada,
    deleteDeuda,
  } = useDeudas({
    userRole: user?.role || 'ALUMNO',
    isAuthenticated
  });

  const filteredDeudas = deudas.filter(deuda =>
    deuda.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deuda.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deuda.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (deuda.usuario && 
      `${deuda.usuario.nombres} ${deuda.usuario.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return 'text-yellow-600 bg-yellow-100';
      case 'VENCIDA': return 'text-red-600 bg-red-100';
      case 'PAGADA': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handlePagarDeuda = (deuda: any) => {
    setSelectedDeuda(deuda);
    setShowPagarModal(true);
  };

  return (
    <main className="p-8 bg-zinc-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {user?.role === 'ADMIN' ? 'Gestión de Deudas' : 'Mis Deudas Pendientes'}
        </h1>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Nueva Deuda
          </button>
        )}
      </div>

      {/* Filtros para Admin */}
      {user?.role === 'ADMIN' && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Filtrar por Usuario</label>
          <UserSelector
            selectedUserId={selectedUsuarioId}
            onUserSelect={setSelectedUsuarioId}
            placeholder="Todos los usuarios"
            className="max-w-md"
          />
        </div>
      )}

      {/* Buscador */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por tipo, código, concepto o usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
          <p className="mt-2 text-gray-600">Cargando deudas...</p>
        </div>
      ) : (
        <>
          {/* Tabla de Deudas */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  {user?.role === 'ADMIN' && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Emisión</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimiento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importe</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeudas.length === 0 ? (
                  <tr>
                    <td colSpan={user?.role === 'ADMIN' ? 9 : 8} className="px-4 py-8 text-center text-gray-500">
                      No hay deudas {searchTerm ? 'que coincidan con la búsqueda' : 'pendientes'}
                    </td>
                  </tr>
                ) : (
                  filteredDeudas.map((deuda) => (
                    <tr key={deuda.id} className="hover:bg-gray-50">
                      {user?.role === 'ADMIN' && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <div>
                            <div className="font-medium text-gray-900">
                              {deuda.usuario?.nombres} {deuda.usuario?.apellidos}
                            </div>
                            <div className="text-gray-500">{deuda.usuario?.email}</div>
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {deuda.tipo}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deuda.codigo}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {deuda.concepto}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(deuda.fechaEmision).toLocaleDateString('es-PE')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(deuda.fechaVencimiento).toLocaleDateString('es-PE')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        S/. {deuda.importe.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(deuda.estado)}`}>
                          {deuda.estado}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {user?.role === 'ADMIN' ? (
                          <>
                            <button
                              onClick={() => handlePagarDeuda(deuda)}
                              className="text-green-600 hover:text-green-900"
                              title="Marcar como pagada"
                            >
                              Pagar
                            </button>
                            <button
                              onClick={() => deleteDeuda(deuda.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar deuda"
                            >
                              Eliminar
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-500">Pendiente</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Resumen */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Resumen</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-600">Total de deudas:</span>
                <span className="ml-2 font-medium">{filteredDeudas.length}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Deudas pendientes:</span>
                <span className="ml-2 font-medium text-yellow-600">
                  {filteredDeudas.filter(d => d.estado === 'PENDIENTE').length}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Monto total:</span>
                <span className="ml-2 font-medium text-red-600">
                  S/. {filteredDeudas.reduce((total, deuda) => total + deuda.importe, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modales */}
      <CreateDeudaModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createDeuda}
        preselectedUsuarioId={selectedUsuarioId || undefined}
      />

      {selectedDeuda && (
        <PagarDeudaModal
          isOpen={showPagarModal}
          onClose={() => {
            setShowPagarModal(false);
            setSelectedDeuda(null);
          }}
          deudaId={selectedDeuda.id}
          concepto={selectedDeuda.concepto}
          importe={selectedDeuda.importe}
          onSubmit={marcarPagada}
        />
      )}
    </main>
  );
}
