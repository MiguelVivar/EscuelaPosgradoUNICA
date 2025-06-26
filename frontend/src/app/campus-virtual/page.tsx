"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function CampusVirtualPage() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/iniciar-sesion");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

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
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 mt-20">
      <div className="min-h-screen container mx-auto px-4 py-8">
        {/* Header del Campus Virtual */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Campus Virtual - Escuela de Posgrado UNICA
              </h1>
              <p className="text-gray-600">
                Bienvenido/a, <span className="font-semibold text-blue-600">{user.nombres} {user.apellidos}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {user.role} • {user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Información del Usuario */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Información Personal</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">ID de Usuario:</span>
                <p className="text-gray-800">{user.id}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Usuario:</span>
                <p className="text-gray-800">{user.username}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Rol:</span>
                <p className="text-gray-800 capitalize">{user.role.toLowerCase()}</p>
              </div>
              {user.codigoEstudiante && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Código de Estudiante:</span>
                  <p className="text-gray-800">{user.codigoEstudiante}</p>
                </div>
              )}
              {user.codigoDocente && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Código de Docente:</span>
                  <p className="text-gray-800">{user.codigoDocente}</p>
                </div>
              )}
              {user.especialidad && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Especialidad:</span>
                  <p className="text-gray-800">{user.especialidad}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Acceso Rápido</h2>
            <div className="space-y-3">
              {/* Panel de Administración - Solo para ADMIN y COORDINADOR */}
              {(user.role === 'ADMIN' || user.role === 'COORDINADOR') && (
                <button 
                  onClick={goToAdminPanel}
                  className="w-full p-3 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                >
                  <div className="font-medium text-red-800">
                    {user.role === 'ADMIN' ? 'Panel de Administración' : 'Panel de Coordinación'}
                  </div>
                  <div className="text-sm text-red-600">
                    {user.role === 'ADMIN' ? 'Gestionar usuarios del sistema' : 'Gestionar información académica'}
                  </div>
                </button>
              )}
              
              <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                <div className="font-medium text-blue-800">Mis Cursos</div>
                <div className="text-sm text-blue-600">Ver materias inscritas</div>
              </button>
              <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
                <div className="font-medium text-green-800">Calificaciones</div>
                <div className="text-sm text-green-600">Consultar notas</div>
              </button>
              <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                <div className="font-medium text-purple-800">Recursos</div>
                <div className="text-sm text-purple-600">Material de estudio</div>
              </button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Estado de Sesión</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Token:</span>
                <p className="text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                  {user.token.substring(0, 50)}...
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Último Acceso:</span>
                <p className="text-gray-800">
                  {user.ultimoAcceso ? new Date(user.ultimoAcceso).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-green-600 font-medium">Sesión Activa</span>
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
