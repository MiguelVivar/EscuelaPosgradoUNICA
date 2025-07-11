"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiCalendar, FiMapPin, FiBookOpen, FiUsers, FiCreditCard, FiClock, FiSettings, FiTool } from "react-icons/fi";

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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando Gestión de Matrícula...</p>
        </div>
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
      color: "from-blue-500 to-cyan-500",
      requirement: "c) Gestionar períodos académicos para habilitar matrícula"
    },
    {
      title: "Sedes",
      description: "Administrar sedes donde se realizan las clases",
      icon: FiMapPin,
      href: "/campus-virtual/matricula/sedes",
      color: "from-green-500 to-emerald-500",
      requirement: "d) Gestionar sedes para registro de aulas"
    },
    {
      title: "Aulas",
      description: "Gestionar aulas donde se imparten las sesiones",
      icon: FiTool,
      href: "/campus-virtual/matricula/aulas",
      color: "from-purple-500 to-indigo-500",
      requirement: "e) Gestionar aulas para sesiones de clase"
    },
    {
      title: "Facultades",
      description: "Administrar facultades para otorgar grados académicos",
      icon: FiBookOpen,
      href: "/campus-virtual/matricula/facultades",
      color: "from-amber-500 to-orange-500",
      requirement: "f) Gestionar facultades para grados académicos"
    },
    {
      title: "Programas de Estudio",
      description: "Gestionar programas asociados a facultades",
      icon: FiSettings,
      href: "/campus-virtual/matricula/programas-estudio",
      color: "from-red-500 to-pink-500",
      requirement: "g) Gestionar programas de estudio asociados a facultades"
    },
    {
      title: "Menciones",
      description: "Administrar menciones asociadas a programas",
      icon: FiUsers,
      href: "/campus-virtual/matricula/menciones",
      color: "from-teal-500 to-cyan-500",
      requirement: "h) Gestionar menciones asociadas a programas"
    },
    {
      title: "Tasas de Pago",
      description: "Configurar tasas de pago por programa de estudios",
      icon: FiCreditCard,
      href: "/campus-virtual/matricula/tasas-pago",
      color: "from-violet-500 to-purple-500",
      requirement: "t) Asociar tasas de pago a programas de estudios"
    },
    {
      title: "Comisiones de Posgrado",
      description: "Registrar comisiones de unidades de posgrado",
      icon: FiUsers,
      href: "/campus-virtual/matricula/comisiones",
      color: "from-gray-500 to-slate-500",
      requirement: "y) Registrar comisiones de unidades de posgrado"
    },
    {
      title: "Turnos de Matrícula",
      description: "Definir calendario de matrículas por programa",
      icon: FiClock,
      href: "/campus-virtual/matricula/turnos-matricula",
      color: "from-rose-500 to-pink-500",
      requirement: "aa) Gestionar turnos de matrícula por programa"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              🎓 Gestión de Matrícula
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Sistema integral para la administración de todos los componentes del proceso de matrícula. 
              Gestiona períodos académicos, infraestructura, programas de estudio y configuraciones necesarias 
              para el correcto funcionamiento del sistema de matrícula.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-lg">
              <FiSettings className="w-4 h-4" />
              <span>Acceso exclusivo para Administradores y Coordinadores</span>
            </div>
          </div>
        </div>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            
            return (
              <Link 
                key={index} 
                href={item.href}
                className="group block"
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 
                              hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden h-full">
                  {/* Header con gradiente */}
                  <div className={`bg-gradient-to-r ${item.color} p-6 text-white`}>
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    
                    {/* Requerimiento */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-800 font-medium">
                        📋 {item.requirement}
                      </p>
                    </div>

                    {/* Botón de acción */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Gestión completa CRUD
                      </span>
                      <div className="bg-gray-100 group-hover:bg-gray-200 transition-colors duration-200 
                                    rounded-lg px-3 py-1 text-sm font-medium text-gray-700">
                        Administrar →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer con información adicional */}
        <div className="mt-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              💡 Información del Sistema
            </h3>
            <p className="text-gray-600 text-sm">
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
