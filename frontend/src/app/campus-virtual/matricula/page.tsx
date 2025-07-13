"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { FiCalendar, FiMapPin, FiBookOpen, FiUsers, FiCreditCard, FiClock, FiSettings, FiTool } from "react-icons/fi";
import { Button, LoadingSpinner } from "@/components/common";

export default function MatriculaPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

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

  // Animaciones GSAP
  useEffect(() => {
    if (!isLoading && isAuthenticated && user && (user.role === 'ADMIN' || user.role === 'COORDINADOR')) {
      const tl = gsap.timeline();
      
      // Animar entrada del header
      tl.fromTo(headerRef.current, 
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
      
      // Animar cards con stagger
      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children);
        tl.fromTo(cards, 
          { opacity: 0, y: 30, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
        );
      }
      
      // Animar footer
      tl.fromTo(footerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [isLoading, isAuthenticated, user]);

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
      borderColor: "border-blue-200",
      requirement: "c) Gestionar períodos académicos para habilitar matrícula"
    },
    {
      title: "Sedes",
      description: "Administrar sedes donde se realizan las clases",
      icon: FiMapPin,
      href: "/campus-virtual/matricula/sedes",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-800",
      borderColor: "border-amber-200",
      requirement: "d) Gestionar sedes para registro de aulas"
    },
    {
      title: "Aulas",
      description: "Gestionar aulas donde se imparten las sesiones",
      icon: FiTool,
      href: "/campus-virtual/matricula/aulas",
      color: "from-slate-500 to-slate-600",
      bgColor: "bg-slate-50",
      textColor: "text-slate-800",
      borderColor: "border-slate-200",
      requirement: "e) Gestionar aulas para sesiones de clase"
    },
    {
      title: "Facultades",
      description: "Administrar facultades para otorgar grados académicos",
      icon: FiBookOpen,
      href: "/campus-virtual/matricula/facultades",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-200",
      requirement: "f) Gestionar facultades para grados académicos"
    },
    {
      title: "Programas de Estudio",
      description: "Gestionar programas asociados a facultades",
      icon: FiSettings,
      href: "/campus-virtual/matricula/programas-estudio",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-800",
      borderColor: "border-amber-200",
      requirement: "g) Gestionar programas de estudio asociados a facultades"
    },
    {
      title: "Menciones",
      description: "Administrar menciones asociadas a programas",
      icon: FiUsers,
      href: "/campus-virtual/matricula/menciones",
      color: "from-slate-500 to-slate-600",
      bgColor: "bg-slate-50",
      textColor: "text-slate-800",
      borderColor: "border-slate-200",
      requirement: "h) Gestionar menciones asociadas a programas"
    },
    {
      title: "Tasas de Pago",
      description: "Configurar tasas de pago por programa de estudios",
      icon: FiCreditCard,
      href: "/campus-virtual/matricula/tasas-pago",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-200",
      requirement: "t) Asociar tasas de pago a programas de estudios"
    },
    {
      title: "Comisiones de Posgrado",
      description: "Registrar comisiones de unidades de posgrado",
      icon: FiUsers,
      href: "/campus-virtual/matricula/comisiones",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-800",
      borderColor: "border-amber-200",
      requirement: "y) Registrar comisiones de unidades de posgrado"
    },
    {
      title: "Turnos de Matrícula",
      description: "Definir calendario de matrículas por programa",
      icon: FiClock,
      href: "/campus-virtual/matricula/turnos-matricula",
      color: "from-slate-500 to-slate-600",
      bgColor: "bg-slate-50",
      textColor: "text-slate-800",
      borderColor: "border-slate-200",
      requirement: "aa) Gestionar turnos de matrícula por programa"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-6 sm:mb-8">
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
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            
            return (
              <div
                key={index} 
                className="group block transform hover:scale-105 transition-all duration-300"
              >
                <Link href={item.href} className="block h-full">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 
                                hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {/* Header con gradiente */}
                    <div className={`bg-gradient-to-r ${item.color} p-4 sm:p-6 text-white`}>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 sm:p-3 flex-shrink-0">
                          <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg sm:text-xl font-bold leading-tight">{item.title}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-4 sm:p-6 flex-1 flex flex-col">
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base flex-1">
                        {item.description}
                      </p>
                      
                      {/* Requerimiento */}
                      <div className={`${item.bgColor} border ${item.borderColor} rounded-lg p-3 mb-4`}>
                        <p className={`text-xs sm:text-sm ${item.textColor} font-medium`}>
                          📋 {item.requirement}
                        </p>
                      </div>

                      {/* Botón de acción */}
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs sm:text-sm text-gray-500">
                          Gestión completa CRUD
                        </span>
                        <div className="bg-gray-100 group-hover:bg-gray-200 transition-colors duration-200 
                                      rounded-lg px-3 py-1 text-xs sm:text-sm font-medium text-gray-700">
                          Administrar →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Footer con información adicional */}
        <div ref={footerRef} className="mt-6 sm:mt-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              💡 Información del Sistema
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
              Cada módulo permite operaciones CRUD completas (Crear, Leer, Actualizar, Eliminar) 
              con validaciones de negocio y notificaciones mediante SweetAlert2. 
              Todos los datos se almacenan en la base de datos PostgreSQL del microservicio de matrícula.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
