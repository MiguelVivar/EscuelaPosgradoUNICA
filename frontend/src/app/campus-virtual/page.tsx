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
    <div>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 mt-20 flex flex-row">
        <div className="min-h-screen container mx-auto px-4 py-8">
          {/* Header del Campus Virtual */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8  mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 ml-40 mr-0">
                <img src="./logoposgrado.png" alt="Logo Posgrado" className="w-36 h-36 object-contain"/>
              </div>
              <div className="flex-1 text-center px-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 ml-0">Campus Virtual - Escuela de Posgrado UNICA</h1>
                <p className="text-gray-600">Bienvenido/a, <span className="font-semibold text-blue-600">{user.nombres} {user.apellidos}</span></p>
                <p className="text-sm text-gray-500 mt-1">{user.role} • {user.email}</p>
              </div>
              <div className="flex-shrink-0">
                <button onClick={handleLogout} className="px-6 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 mr-32">Cerrar Sesión</button>
              </div>
            </div>
          </div>
        {/*Creacion de botones del Campus Virtual */}
          <div>
            <div className="flex gap-6">
              {/* Grid de 8 botones blancos (2x4) */}
              <div className="grid grid-cols-4 grid-rows-2 gap-4">
                {/*Intranet*/}
                <button className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 w-55 h-55 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center space-y-4">
                  <div className="text-center">
                    <h1 className="font-semibold text-blue-600 text-xl leading-tight">INTRANET</h1>
                  </div>
                  <img src="./intranet.png" alt="Intranet" className="w-24 h-24 object-contain"/>
                </button>
                
                {/*Matricula*/}
                <button className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 w-55 h-55 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center space-y-4">
                  <div className="text-center">
                    <h1 className="font-semibold text-blue-600 text-xl leading-tight">MATRÍCULA</h1>
                  </div>
                  <img src="./matricula.png" alt="Matricula" className="w-24 h-24 object-contain"/>
                </button>
                
                {/*Admision*/}
                <button className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 w-55 h-55 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center space-y-4">
                  <div className="text-center">
                    <h1 className="font-semibold text-blue-600 text-xl leading-tight">ADMISIÓN</h1>
                  </div>
                  <img src="./admision.png" alt="Admision" className="w-24 h-24 object-contain"/>
                </button>
                
                {/*Gestion de docentes */}
                <button className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 w-55 h-55 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center space-y-4">
                  <div className="text-center">
                    <h1 className="font-semibold text-blue-600 text-xl leading-tight">GESTIÓN</h1>
                    <h1 className="font-semibold text-blue-600 text-xl leading-tight">DE DOCENTES</h1>
                  </div>
                  <img src="./docentes.png" alt="Docentes" className="w-24 h-24 object-contain"/>
                </button>
                
                {/*Aula virtual*/}
                <button className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 w-55 h-55 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center space-y-4">
                  <div className="text-center">
                    <h1 className="font-semibold text-blue-600 text-xl leading-tight">AULA</h1>
                    <h1 className="font-semibold text-blue-600 text-xl leading-tight">VIRTUAL</h1>
                  </div>
                  <img src="./aulavirtual.png" alt="Aula virtual" className="w-24 h-24 object-contain"/>
                </button>
                
                {/*Caja*/}
                <button className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 w-55 h-55 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center space-y-4">
                  <div className="text-center">
                    <h1 className="font-semibold text-blue-600 text-xl leading-tight">CAJA</h1>
                  </div>
                  <img src="./caja.png" alt="Caja" className="w-24 h-24 object-contain"/>
                </button>
                
                {/*Tramites*/}
                <button className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 w-55 h-55 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center space-y-4">
                  <div className="text-center">
                    <h1 className="font-semibold text-blue-600 text-xl leading-tight">TRÁMITES</h1>
                  </div>
                  <img src="./tramites.png" alt="tramites" className="w-24 h-24 object-contain"/>
                </button>
                
                {/*Grado y titulo*/}
                <button className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 w-55 h-55 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center space-y-4">
                  <div className="text-center">
                    <h1 className="font-semibold text-blue-600 text-xl leading-tight">GRADO Y</h1>
                    <h1 className="font-semibold text-blue-600 text-xl leading-tight">TÍTULOS</h1>
                  </div>
                  <img src="./grado-titulos.png" alt="Docentes" className="w-24 h-24 object-contain"/>
                </button>
              </div>
              
              {/* Botón ADMINISTRACIÓN - ocupa todo el espacio restante */}
              <div className="flex-1">
                <button className="bg-amber-500 text-red-500 border border-zinc-700/7 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 w-full h-full text-white transition-colors duration-200 flex flex-col items-center justify-center space-y-4">
                  <div className="text-center ">
                    <h1 className="font-semibold text-white text-3xl leading-tight">ADMINISTRACIÓN</h1>
                    <img src="./administracion.png" alt="Intranet" className="w-65 h-65 object-contain"/>
                  </div>
                </button>
              </div>
            </div>
          </div> 
        {/* Espaciador para asegurar que el footer sea visible */}
          <div className="h-20">
          </div>
        </div>
      </div>
    </div>
  );
}
