"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/layout/PageHeader";
import { 
  DashboardHeader, 
  QuickAccessCard, 
  UserInfoCard, 
  NotificationsCard,
  StatsOverview 
} from "@/components/ui/campus";
import { FaGraduationCap } from "react-icons/fa";

export default function CampusVirtualPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/iniciar-sesion");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando Campus Virtual...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const showStatsOverview = user.role === 'ADMIN' || user.role === 'COORDINADOR';

  return (
    <div className="min-h-full">
      {/* Header dinámico de la página */}
      <PageHeader />
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header del Dashboard */}
        <DashboardHeader />

        {/* Estadísticas para Admin/Coordinador */}
        {showStatsOverview && (
          <div className="mb-6 sm:mb-8">
            <StatsOverview user={user} />
          </div>
        )}

        {/* Grid principal de contenido - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Columna izquierda - Accesos rápidos */}
          <div className="order-1 lg:order-1">
            <QuickAccessCard user={user} />
          </div>

          {/* Columna central - Información del usuario */}
          <div className="order-3 lg:order-2">
            <UserInfoCard user={user} />
          </div>

          {/* Columna derecha - Notificaciones */}
          <div className="order-2 lg:order-3">
            <NotificationsCard />
          </div>
        </div>

        {/* Información del sistema - Responsive */}
        <div className="bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-200/50 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-shrink-0">
              <div className="p-2 sm:p-3 bg-amber-100 rounded-xl">
                <FaGraduationCap className="text-amber-600 text-lg sm:text-xl" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-2 text-base sm:text-lg">
                Campus Virtual - Escuela de Posgrado UNICA
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                Bienvenido al sistema integrado de gestión académica. Aquí podrás acceder 
                a todos los servicios digitales de la Escuela de Posgrado de la Universidad 
                Nacional San Luis Gonzaga de Ica.
              </p>
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Sistema Integrado
                </span>
                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Gestión Académica
                </span>
                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Multiplataforma
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Espaciador para footer */}
        <div className="h-16 sm:h-20"></div>
      </div>
    </div>
  );
}
