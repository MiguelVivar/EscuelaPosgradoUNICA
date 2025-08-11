'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHistorial } from '@/hooks/useHistorial';
import UserSelector from '@/components/pagos/UserSelector';

export default function HistorialPage() {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    historial,
    loading,
    error,
    selectedUsuarioId,
    setSelectedUsuarioId,
  } = useHistorial({
    userRole: user?.role || 'ALUMNO',
    isAuthenticated
  });

  const filteredHistorial = historial.filter(pago =>
    pago.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pago.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pago.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pago.metodoPago.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pago.usuario && 
      `${pago.usuario.nombres} ${pago.usuario.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getMetodoPagoColor = (metodo: string) => {
    switch (metodo) {
      case 'EFECTIVO': return 'text-green-600 bg-green-100';
      case 'TRANSFERENCIA': return 'text-blue-600 bg-blue-100';
      case 'TARJETA': return 'text-purple-600 bg-purple-100';
      case 'YAPE': return 'text-pink-600 bg-pink-100';
      case 'PLIN': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <main className="p-8 bg-zinc-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {user?.role === 'ADMIN' ? 'Historial de Pagos' : 'Mi Historial de Pagos'}
        </h1>
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
          placeholder="Buscar por tipo, código, concepto, método de pago o usuario..."
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
          <p className="mt-2 text-gray-600">Cargando historial...</p>
        </div>
      ) : (
        <>
          {/* Tabla de Historial */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  {user?.role === 'ADMIN' && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importe</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Pago</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transacción</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistorial.length === 0 ? (
                  <tr>
                    <td colSpan={user?.role === 'ADMIN' ? 8 : 7} className="px-4 py-8 text-center text-gray-500">
                      No hay pagos {searchTerm ? 'que coincidan con la búsqueda' : 'registrados'}
                    </td>
                  </tr>
                ) : (
                  filteredHistorial.map((pago) => (
                    <tr key={pago.id} className="hover:bg-gray-50">
                      {user?.role === 'ADMIN' && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <div>
                            <div className="font-medium text-gray-900">
                              {pago.usuario?.nombres} {pago.usuario?.apellidos}
                            </div>
                            <div className="text-gray-500">{pago.usuario?.email}</div>
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pago.tipo}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pago.codigo}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {pago.concepto}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        S/. {pago.importe.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(pago.fechaPago).toLocaleDateString('es-PE')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMetodoPagoColor(pago.metodoPago)}`}>
                          {pago.metodoPago}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pago.numeroTransaccion || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Resumen */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Resumen de Pagos</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-600">Total de pagos:</span>
                <span className="ml-2 font-medium">{filteredHistorial.length}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Monto total pagado:</span>
                <span className="ml-2 font-medium text-green-600">
                  S/. {filteredHistorial.reduce((total, pago) => total + pago.importe, 0).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Último pago:</span>
                <span className="ml-2 font-medium">
                  {filteredHistorial.length > 0 
                    ? new Date(Math.max(...filteredHistorial.map(p => new Date(p.fechaPago).getTime()))).toLocaleDateString('es-PE')
                    : '-'
                  }
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Promedio por pago:</span>
                <span className="ml-2 font-medium">
                  S/. {filteredHistorial.length > 0 
                    ? (filteredHistorial.reduce((total, pago) => total + pago.importe, 0) / filteredHistorial.length).toFixed(2)
                    : '0.00'
                  }
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
