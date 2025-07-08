"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/common";
import { FaSignOutAlt, FaUser } from "react-icons/fa";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    // Forzar una navegación con replace para limpiar el historial
    router.replace("/iniciar-sesion");
  };

  if (!user) return null;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 mb-6 sm:mb-8">
      {/* Layout para móviles - Stack vertical */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-sm" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                ¡Hola, {user.nombres}!
              </h1>
              <p className="text-sm text-gray-600">
                <span className="font-medium">{user.role}</span>
              </p>
            </div>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
            leftIcon={FaSignOutAlt}
          >
            Salir
          </Button>
        </div>
        <div className="bg-gray-50/70 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Conectado como:</p>
          <p className="text-sm font-medium text-gray-700 truncate">{user.email}</p>
        </div>
      </div>

      {/* Layout para tablets y desktop - Horizontal */}
      <div className="hidden sm:flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <FaUser className="text-white text-lg lg:text-xl" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
              Bienvenido/a, {user.nombres}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              <span className="font-medium">{user.role}</span> • Campus Virtual
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 lg:space-x-4">
          <div className="hidden md:block text-right mr-2 lg:mr-4">
            <p className="text-xs lg:text-sm text-gray-500">Conectado como</p>
            <p className="text-sm lg:text-base font-medium text-gray-700 max-w-48 truncate">
              {user.email}
            </p>
          </div>
          <Button
            variant="danger"
            size="md"
            onClick={handleLogout}
            leftIcon={FaSignOutAlt}
          >
            <span className="hidden sm:inline">Cerrar Sesión</span>
            <span className="sm:hidden">Salir</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
