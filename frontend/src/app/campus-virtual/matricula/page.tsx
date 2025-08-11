"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiBookOpen, FiCreditCard, FiClock, FiBarChart, FiTool, FiRotateCcw, FiPieChart } from "react-icons/fi";
import { Button, LoadingSpinner } from "@/components/common";

export default function MatriculaPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/iniciar-sesion");
        return;
      }
      
      // Permitir acceso a ADMIN, COORDINADOR y ALUMNO (para módulo completo)
      if (user && !['ADMIN', 'COORDINADOR', 'ALUMNO'].includes(user.role)) {
        router.push("/campus-virtual");
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
        <LoadingSpinner size="lg" message="Cargando Gestión de Matrícula..." />
      </div>
    );
  }

  if (!isAuthenticated || !user || !['ADMIN', 'COORDINADOR', 'ALUMNO'].includes(user.role)) {
    return null;
  }

  // Definir items según el rol
  const menuItems = [
    // Módulos para estudiantes
    ...(user.role === 'ALUMNO' ? [
      {
        title: "Matrícula Online",
        description: "Realice su matrícula en línea de manera fácil y rápida",
        icon: FiBookOpen,
        href: "/campus-virtual/matricula/online",
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
        borderColor: "border-blue-200"
      },
      {
        title: "Pagos y Cuotas",
        description: "Gestione sus pagos, cuotas y estado financiero",
        icon: FiCreditCard,
        href: "/campus-virtual/matricula/pagos",
        color: "from-green-500 to-green-600",
        bgColor: "bg-green-50",
        textColor: "text-green-800",
        borderColor: "border-green-200"
      },
      {
        title: "Seguimiento Académico",
        description: "Monitoree su progreso académico y notas",
        icon: FiClock,
        href: "/campus-virtual/matricula/seguimiento",
        color: "from-purple-500 to-purple-600",
        bgColor: "bg-purple-50",
        textColor: "text-purple-800",
        borderColor: "border-purple-200"
      },
      {
        title: "Reportes y Análisis",
        description: "Visualice reportes detallados y análisis de su rendimiento",
        icon: FiBarChart,
        href: "/campus-virtual/matricula/reportes",
        color: "from-orange-500 to-orange-600",
        bgColor: "bg-orange-50",
        textColor: "text-orange-800",
        borderColor: "border-orange-200"
      }
    ] : []),

    // Módulos administrativos
    ...(['ADMIN', 'COORDINADOR'].includes(user.role) ? [
      {
        title: "Rectificación de Matrícula",
        description: "Actualizar ficha de matrícula del estudiante",
        icon: FiTool,
        href: "/campus-virtual/matricula/admin/rectificacion",
        color: "from-orange-500 to-orange-600",
        bgColor: "bg-orange-50",
        textColor: "text-orange-800",
        borderColor: "border-orange-200"
      },
      {
        title: "Reinicio de Estudios",
        description: "Activar reinicio de estudios para la matrícula",
        icon: FiRotateCcw,
        href: "/campus-virtual/matricula/admin/reinicio-estudios",
        color: "from-teal-500 to-teal-600",
        bgColor: "bg-teal-50",
        textColor: "text-teal-800",
        borderColor: "border-teal-200"
      },
      {
        title: "Reporte de Estudiantes",
        description: "Visualizar reportes por programa, mención y sede",
        icon: FiPieChart,
        href: "/campus-virtual/matricula/admin/reporte-estudiantes",
        color: "from-indigo-500 to-indigo-600",
        bgColor: "bg-indigo-50",
        textColor: "text-indigo-800",
        borderColor: "border-indigo-200"
      },
      {
        title: "Seguimiento Matrícula",
        description: "Monitorear estado del proceso de matrícula",
        icon: FiClock,
        href: "/campus-virtual/matricula/admin/seguimiento-matricula",
        color: "from-emerald-500 to-emerald-600",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-800",
        borderColor: "border-emerald-200"
      },
      {
        title: "Créditos Aprobados",
        description: "Visualizar los créditos aprobados de estudiantes",
        icon: FiBarChart,
        href: "/campus-virtual/matricula/admin/creditos-estudiantes",
        color: "from-rose-500 to-rose-600",
        bgColor: "bg-rose-50",
        textColor: "text-rose-800",
        borderColor: "border-rose-200"
      }
    ] : [])
  ];

  const getWelcomeMessage = () => {
    switch(user.role) {
      case 'ALUMNO':
        return {
          title: "Portal de Matrícula Estudiantil",
          subtitle: "Gestione su matrícula, pagos y seguimiento académico"
        };
      case 'COORDINADOR':
        return {
          title: "Gestión de Matrícula",
          subtitle: "Administre estudiantes, matrículas y períodos académicos"
        };
      case 'ADMIN':
        return {
          title: "Administración de Matrícula",
          subtitle: "Control total del sistema de matrículas y configuraciones"
        };
      default:
        return {
          title: "Sistema de Matrícula",
          subtitle: "Gestión integral de matrículas"
        };
    }
  };

  const welcome = getWelcomeMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {welcome.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {welcome.subtitle}
          </p>
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border">
              <p className="text-gray-700">
                <span className="font-semibold">Usuario:</span> {user.nombres} {user.apellidos} 
                <span className="ml-4 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-medium">
                  {user.role}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="space-y-8">
          {/* Primera fila - 3 elementos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.slice(0, 3).map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group block"
                >
                  <div className={`${item.bgColor} border-2 ${item.borderColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 backdrop-blur-sm text-center`}>
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                      <IconComponent size={32} />
                    </div>
                    
                    <h3 className={`text-xl font-bold ${item.textColor} mb-3 group-hover:text-opacity-80`}>
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Segunda fila - 2 elementos centrados */}
          {menuItems.length > 3 && (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {menuItems.slice(3).map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group block"
                    >
                      <div className={`${item.bgColor} border-2 ${item.borderColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 backdrop-blur-sm text-center`}>
                        <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                          <IconComponent size={32} />
                        </div>
                        
                        <h3 className={`text-xl font-bold ${item.textColor} mb-3 group-hover:text-opacity-80`}>
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {user.role === 'ALUMNO' && (
          <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Acciones Rápidas</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => router.push('/campus-virtual/matricula/online')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Iniciar Matrícula
              </Button>
              <Button
                onClick={() => router.push('/campus-virtual/matricula/pagos')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Ver Pagos
              </Button>
              <Button
                onClick={() => router.push('/campus-virtual/matricula/seguimiento')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Mi Progreso
              </Button>
            </div>
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="text-center mt-12">
          <Button
            onClick={() => router.push('/campus-virtual')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            ← Volver al Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
