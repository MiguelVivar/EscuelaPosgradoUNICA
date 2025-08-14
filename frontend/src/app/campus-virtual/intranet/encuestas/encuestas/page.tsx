'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEncuestas } from '@/hooks/useEncuestas';
import Link from 'next/link';
import { FaClipboardList, FaClock, FaExclamationCircle, FaUsers, FaChartBar, FaPlay, FaEye } from 'react-icons/fa';

export default function EncuestasPage() {
  const { user } = useAuth();
  const [filterEstado, setFilterEstado] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { encuestas = [], loading, error } = useEncuestas();

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'EVALUACION_DOCENTE': return 'text-blue-600 bg-blue-100';
      case 'SERVICIOS': return 'text-green-600 bg-green-100';
      case 'INFRAESTRUCTURA': return 'text-purple-600 bg-purple-100';
      case 'SATISFACCION': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatearTipo = (tipo: string) => {
    switch (tipo) {
      case 'EVALUACION_DOCENTE': return 'Evaluación Docente';
      case 'SERVICIOS': return 'Servicios';
      case 'INFRAESTRUCTURA': return 'Infraestructura';
      case 'SATISFACCION': return 'Satisfacción';
      default: return tipo;
    }
  };

  const getEstadoEncuesta = (encuesta: any) => {
    const now = new Date();
    const inicio = new Date(encuesta.fechaInicio);
    const cierre = new Date(encuesta.fechaCierre);
    if (!encuesta.activa) return { estado: 'Inactiva', color: 'text-gray-600 bg-gray-100', icon: FaExclamationCircle };
    if (now > cierre) return { estado: 'Cerrada', color: 'text-red-600 bg-red-100', icon: FaExclamationCircle };
    if (encuesta.activa && now >= inicio && now <= cierre) return { estado: 'Disponible', color: 'text-amber-600 bg-amber-100', icon: FaPlay };
    return { estado: 'Inactiva', color: 'text-gray-600 bg-gray-100', icon: FaExclamationCircle };
  };

  const filteredEncuestas = encuestas.filter((encuesta: any) => {
    const matchesSearch = encuesta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      encuesta.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      encuesta.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesEstado = true;
    if (filterEstado) {
      const estado = getEstadoEncuesta(encuesta).estado;
      switch (filterEstado) {
        case 'disponible':
          matchesEstado = estado === 'Disponible';
          break;
        case 'completada':
          matchesEstado = false;
          break;
        case 'pendiente':
          matchesEstado = estado === 'Inactiva';
          break;
        case 'cerrada':
          matchesEstado = estado === 'Cerrada';
          break;
        default:
          matchesEstado = true;
      }
    }
    return matchesSearch && matchesEstado;
  });

  return (
    <main className="p-8 bg-zinc-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {user?.role === 'ADMIN' ? 'Gestión de Encuestas' : 'Mis Encuestas'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'ADMIN' ? 'Administra encuestas y consulta resultados' : 'Responde las encuestas disponibles para ti'}
          </p>
        </div>
      </div>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Buscar encuestas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="disponible">Disponibles</option>
          <option value="completada">Completadas</option>
          <option value="pendiente">Pendientes</option>
          <option value="cerrada">Cerradas</option>
        </select>
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando encuestas...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEncuestas.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-lg shadow text-center">
              <FaClipboardList className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 mb-2">No hay encuestas disponibles</p>
              <p className="text-gray-400">
                {searchTerm ? 'Intenta ajustar los filtros de búsqueda' : 'Las encuestas aparecerán aquí cuando estén disponibles'}
              </p>
            </div>
          ) : (
            filteredEncuestas.map((encuesta: any) => {
              const estadoInfo = getEstadoEncuesta(encuesta);
              const IconoEstado = estadoInfo.icon;
              return (
                <div key={encuesta.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTipoColor(encuesta.tipo)}`}>
                          {formatearTipo(encuesta.tipo)}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${estadoInfo.color}`}>
                          <IconoEstado className="text-xs" />
                          {estadoInfo.estado}
                        </span>
                        {encuesta.obligatoria && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
                            Obligatoria
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{encuesta.titulo}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{encuesta.descripcion}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <FaClock />
                        <span>{encuesta.duracionEstimada} minutos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUsers />
                        <span>{encuesta.totalRespuestas} respuestas</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                      <p>Disponible: {new Date(encuesta.fechaInicio).toLocaleDateString('es-PE')} - {new Date(encuesta.fechaCierre).toLocaleDateString('es-PE')}</p>
                    </div>
                    <div className="flex space-x-3">
                      {user?.role === 'ADMIN' ? (
                        <div className="flex space-x-3 w-full">
                          <Link
                            href={`/campus-virtual/intranet/encuestas/${encuesta.id}`}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center flex items-center justify-center gap-2"
                          >
                            <FaEye />
                            Ver Detalles
                          </Link>
                          <Link
                            href={`/campus-virtual/intranet/encuestas/${encuesta.id}/resultados`}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center flex items-center justify-center gap-2"
                          >
                            <FaChartBar />
                            Resultados
                          </Link>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="flex-1 px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed text-center"
                        >
                          No disponible
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </main>
  );
}
