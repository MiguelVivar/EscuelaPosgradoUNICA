'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import pagosService from '@/services/pagosService';
import { PagosStats } from '@/types/pagos';

export default function PagosMain() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<Partial<PagosStats> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated, user?.role]);

  const loadStats = async () => {
    try {
      if (user?.role === 'ADMIN') {
        const adminStats = await pagosService.getStats();
        setStats(adminStats);
      } else {
        const userStats = await pagosService.getMisStats();
        setStats(userStats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      title: 'Deudas',
      description: user?.role === 'ADMIN' 
        ? 'Gestionar deudas de estudiantes' 
        : 'Ver mis deudas pendientes',
      href: '/campus-virtual/intranet/pagos/deudas',
      color: 'bg-amber-500 hover:bg-amber-600',
      icon: '💳',
      stat: user?.role === 'ADMIN' 
        ? `${stats?.totalDeudasPendientes || 0} pendientes`
        : `${stats?.totalDeudas || 0} deudas`
    },
    {
      title: 'Historial',
      description: user?.role === 'ADMIN' 
        ? 'Ver historial de todos los pagos' 
        : 'Mi historial de pagos',
      href: '/campus-virtual/intranet/pagos/historial',
      color: 'bg-amber-500 hover:bg-amber-600',
      icon: '📋',
      stat: user?.role === 'ADMIN' 
        ? `${stats?.totalPagos || 0} pagos`
        : `${stats?.totalPagos || 0} pagos`
    },
    {
      title: 'Solicitudes',
      description: user?.role === 'ADMIN' 
        ? 'Gestionar solicitudes de estudiantes' 
        : 'Mis solicitudes y peticiones',
      href: '/campus-virtual/intranet/pagos/solicitudes',
      color: 'bg-amber-500 hover:bg-amber-600',
      icon: '📝',
      stat: user?.role === 'ADMIN' 
        ? `${stats?.solicitudesPendientes || 0} pendientes`
        : `${stats?.totalSolicitudes || 0} solicitudes`
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {user?.role === 'ADMIN' ? 'Gestión de Pagos' : 'Centro de Pagos'}
          </h1>
          <p className="text-lg text-gray-600">
            {user?.role === 'ADMIN' 
              ? 'Administra deudas, pagos y solicitudes de estudiantes'
              : 'Consulta tus deudas, historial y realiza solicitudes'
            }
          </p>
        </div>

        {/* Estadísticas Rápidas */}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {user?.role === 'ADMIN' ? (
              <>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Deudas Pendientes</p>
                      <p className="text-2xl font-bold text-red-600">{stats.totalDeudasPendientes || 0}</p>
                    </div>
                    <div className="text-3xl">💳</div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    S/. {(stats.montoTotalPendiente || 0).toFixed(2)} pendientes
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pagos Realizados</p>
                      <p className="text-2xl font-bold text-green-600">{stats.totalPagos || 0}</p>
                    </div>
                    <div className="text-3xl">✅</div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    S/. {(stats.montoTotalPagado || 0).toFixed(2)} recaudados
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Solicitudes Pendientes</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.solicitudesPendientes || 0}</p>
                    </div>
                    <div className="text-3xl">📝</div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {stats.totalSolicitudes || 0} solicitudes totales
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Mis Deudas</p>
                      <p className="text-2xl font-bold text-red-600">{stats.totalDeudas || 0}</p>
                    </div>
                    <div className="text-3xl">💳</div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    S/. {(stats.montoTotalPendiente || 0).toFixed(2)} pendientes
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Mis Pagos</p>
                      <p className="text-2xl font-bold text-green-600">{stats.totalPagos || 0}</p>
                    </div>
                    <div className="text-3xl">✅</div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    S/. {(stats.montoTotalPagado || 0).toFixed(2)} pagados
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Mis Solicitudes</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalSolicitudes || 0}</p>
                    </div>
                    <div className="text-3xl">📝</div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {stats.solicitudesPendientes || 0} pendientes
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Menú Principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div className={`${item.color} text-white p-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{item.icon}</div>
                  <div className="text-right">
                    <div className="text-sm opacity-90">{item.stat}</div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                <p className="opacity-90">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Información adicional para usuarios */}
        {user?.role !== 'ADMIN' && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Importante</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">💳 Deudas</h4>
                <p>Consulta todas tus deudas pendientes. Aquí encontrarás información detallada sobre matrícula, pensiones y otros conceptos.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">📋 Historial</h4>
                <p>Revisa todos los pagos que has realizado, incluyendo fechas, métodos de pago y comprobantes.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">📝 Solicitudes</h4>
                <p>Realiza solicitudes de fraccionamiento, exoneraciones, becas y otras peticiones relacionadas con tus pagos.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">ℹ️ Soporte</h4>
                <p>Si tienes alguna consulta sobre tus pagos, no dudes en contactar con la administración académica.</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando información...</p>
          </div>
        )}
      </div>
    </main>
  );
}
