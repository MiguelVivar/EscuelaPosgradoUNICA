"use client";

import { useSidebarConfig, useBreadcrumbs } from "@/hooks/useSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";

interface PageHeaderProps {
  className?: string;
  showBreadcrumbs?: boolean;
  showPageInfo?: boolean;
}

export default function PageHeader({ 
  className = "",
  showBreadcrumbs = true,
  showPageInfo = true 
}: PageHeaderProps) {
  const { user } = useAuth();
  const sidebarConfig = useSidebarConfig();
  const breadcrumbs = useBreadcrumbs();

  const getPageIcon = () => {
    switch (sidebarConfig.pageType) {
      case 'admin':
        return '👑';
      case 'cursos':
        return '📚';
      case 'perfil':
        return '👤';
      case 'dashboard':
        return '🏠';
      default:
        return '📋';
    }
  };

  const getPageDescription = () => {
    switch (sidebarConfig.pageType) {
      case 'admin':
        return user?.role === 'ADMIN' 
          ? 'Gestiona usuarios, roles y configuraciones del sistema'
          : 'Gestiona cursos, docentes y estudiantes';
      case 'cursos':
        return user?.role === 'DOCENTE'
          ? 'Administra tus cursos, estudiantes y calificaciones'
          : 'Accede a tus cursos, tareas y materiales de estudio';
      case 'perfil':
        return 'Actualiza tu información personal y configuraciones';
      case 'dashboard':
        return `Bienvenido/a al campus virtual, ${user?.nombres || 'Usuario'}`;
      default:
        return 'Campus Virtual - Escuela de Posgrado UNICA';
    }
  };

  return (
    <div className={`bg-white/90 backdrop-blur-sm border-b border-gray-200/50 ${className}`}>
      {/* Breadcrumbs */}
      {showBreadcrumbs && breadcrumbs.length > 1 && (
        <div className="px-6 py-3 border-b border-gray-100">
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && (
                  <FaChevronRight className="w-3 h-3 text-gray-400 mx-2" />
                )}
                {crumb.isActive ? (
                  <span className="text-amber-600 font-medium">
                    {crumb.label}
                  </span>
                ) : (
                  <Link 
                    href={crumb.href} 
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}

      {/* Page Info */}
      {showPageInfo && (
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">
              {getPageIcon()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {sidebarConfig.pageTitle}
              </h1>
              <p className="text-gray-600">
                {getPageDescription()}
              </p>
            </div>
            {user && (
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {user.role}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {user.nombres} {user.apellidos}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
