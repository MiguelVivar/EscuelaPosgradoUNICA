"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/layout/PageHeader";

export default function CampusVirtualPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/iniciar-sesion");
    }
  }, [isAuthenticated, isLoading, router]);

  const goToAdminPanel = () => {
    router.push("/campus-virtual/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-full">
      {/* Header dinámico de la página */}
      <PageHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Contenido específico según el rol */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta de accesos rápidos */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Accesos Rápidos</h3>
            <div className="space-y-3">
              {user.role === 'ADMIN' && (
                <button
                  onClick={goToAdminPanel}
                  className="w-full p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Panel de Administración
                </button>
              )}
              {user.role === 'COORDINADOR' && (
                <>
                  <button
                    onClick={goToAdminPanel}
                    className="w-full p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    Panel de Coordinación
                  </button>
                  <button
                    onClick={() => router.push("/campus-virtual/cursos-gestion")}
                    className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Gestión de Cursos
                  </button>
                </>
              )}
              {(user.role === 'DOCENTE' || user.role === 'ALUMNO') && (
                <button
                  onClick={() => router.push("/campus-virtual/mis-cursos")}
                  className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Mis Cursos
                </button>
              )}
              <button
                onClick={() => router.push("/campus-virtual/perfil")}
                className="w-full p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                Mi Perfil
              </button>
            </div>
          </div>

          {/* Tarjeta de información del usuario */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Mi Información</h3>
            <div className="space-y-2">
              <p><span className="font-semibold">Nombre:</span> {user.nombres} {user.apellidos}</p>
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Rol:</span> {user.role}</p>
              {user.codigoEstudiante && (
                <p><span className="font-semibold">Código:</span> {user.codigoEstudiante}</p>
              )}
              {user.codigoDocente && (
                <p><span className="font-semibold">Código:</span> {user.codigoDocente}</p>
              )}
            </div>
          </div>

          {/* Tarjeta de notificaciones */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Notificaciones</h3>
            <div className="space-y-3 text-gray-600">
              <p className="text-sm">No tienes notificaciones nuevas</p>
              <div className="pt-4">
                <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                  Ver todas las notificaciones
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Nota temporal */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-700">
            <strong>Nota:</strong> Esta es una página temporal del campus virtual. 
            Aquí se integrarán los demás microservicios del sistema.
          </p>
        </div>

        {/* Espaciador para asegurar que el footer sea visible */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}
