"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiCalendar, FiMapPin, FiBookOpen, FiUsers, FiCreditCard, FiClock, FiSettings, FiTool } from "react-icons/fi";
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
      
      // Solo permitir acceso a ADMIN y COORDINADOR
      if (user && user.role !== 'ADMIN' && user.role !== 'COORDINADOR') {
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

  if (!isAuthenticated || !user || (user.role !== 'ADMIN' && user.role !== 'COORDINADOR')) {
    return null;
  }

  const menuItems = [
    {
      title: "Períodos Académicos",
      description: "Gestionar períodos académicos y habilitar matrículas",
      icon: FiCalendar,
      href: "/campus-virtual/matricula/periodos-academicos",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-200"
    },
    {
      title: "Sedes",
      description: "Administrar sedes donde se realizan las clases",
      icon: FiMapPin,
      href: "/campus-virtual/matricula/sedes",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-800",
      borderColor: "border-amber-200"
    },
    {
      title: "Aulas",
      description: "Gestionar aulas donde se imparten las sesiones",
      icon: FiTool,
      href: "/campus-virtual/matricula/aulas",
      color: "from-slate-500 to-slate-600",
      bgColor: "bg-slate-50",
      textColor: "text-slate-800",
      borderColor: "border-slate-200"
    },
    {
      title: "Facultades",
      description: "Administrar facultades para otorgar grados académicos",
      icon: FiBookOpen,
      href: "/campus-virtual/matricula/facultades",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-200"
    },
    {
      title: "Programas de Estudio",
      description: "Gestionar programas asociados a facultades",
      icon: FiSettings,
      href: "/campus-virtual/matricula/programas-estudio",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-800",
      borderColor: "border-amber-200"
    },
    {
      title: "Menciones",
      description: "Administrar menciones asociadas a programas",
      icon: FiUsers,
      href: "/campus-virtual/matricula/menciones",
      color: "from-slate-500 to-slate-600",
      bgColor: "bg-slate-50",
      textColor: "text-slate-800",
      borderColor: "border-slate-200"
    },
    {
      title: "Tasas de Pago",
      description: "Configurar tasas de pago por programa de estudios",
      icon: FiCreditCard,
      href: "/campus-virtual/matricula/tasas-pago",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-200"
    },
    {
      title: "Comisiones de Posgrado",
      description: "Registrar comisiones de unidades de posgrado",
      icon: FiUsers,
      href: "/campus-virtual/matricula/comisiones",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-800",
      borderColor: "border-amber-200"
    },
    {
      title: "Turnos de Matrícula",
      description: "Definir calendario de matrículas por programa",
      icon: FiClock,
      href: "/campus-virtual/matricula/turnos-matricula",
      color: "from-slate-500 to-slate-600",
      bgColor: "bg-slate-50",
      textColor: "text-slate-800",
      borderColor: "border-slate-200"
    },
    {
      title: "Equivalencias de Planes de Estudio",
      description: "Registrar y consultar equivalencias entre cursos de diferentes planes de estudio",
      icon: FiSettings,
      href: "/campus-virtual/matricula/equivalencias",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                🎓 Gestión de Matrícula
              </h1>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-4xl mx-auto">
                Sistema integral para la administración de todos los componentes del proceso de matrícula. 
                Gestiona períodos académicos, infraestructura, programas de estudio y configuraciones necesarias 
                para el correcto funcionamiento del sistema de matrícula.
              </p>
              <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 text-sm bg-amber-50 text-amber-700 px-4 py-2 rounded-lg border border-amber-200">
                <FiSettings className="w-4 h-4" />
                <span>Acceso exclusivo para Administradores y Coordinadores</span>
              </div>
            </div>
            
            {/* Botón de regreso */}
            <div className="mt-6 flex justify-center">
              <Button
                href="/campus-virtual"
                variant="outline"
                leftIcon={FiSettings}
                className="hover:scale-105 transition-transform duration-200"
              >
                Volver al Campus Virtual
              </Button>
            </div>
          </div>
        </div>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            
            return (
              <div
                key={index} 
                className="group transform hover:scale-105 transition-all duration-300"
              >
                <Link href={item.href} className="block h-full">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 
                                hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
                    {/* Header con gradiente */}
                    <div className={`bg-gradient-to-r ${item.color} p-6 sm:p-8 text-white relative overflow-hidden`}>
                      {/* Decoración de fondo */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                      
                      <div className="relative flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex-shrink-0">
                          <IconComponent className="w-8 h-8" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-6 sm:p-8">
                      <p className="text-gray-600 text-base leading-relaxed mb-6">
                        {item.description}
                      </p>
                      
                      {/* Indicador de acceso */}
                      <div className="flex items-center justify-between">
                        <div className={`${item.bgColor} ${item.textColor} px-3 py-1 rounded-full text-sm font-medium`}>
                          Administrar
                        </div>
                        <div className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
