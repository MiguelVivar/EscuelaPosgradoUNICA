"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import administracion from "@/assets/administracion.png";
import admision from "@/assets/intranet.png";
import aulaVirtual from "@/assets/aulavirtual.png";
import caja from "@/assets/caja.png";
import docentes from "@/assets/docentes.png";
import gradosTitulos from "@/assets/grado-titulos.png";
import intranet from "@/assets/intranet.png";
import matricula from "@/assets/matricula.png";
import tramites from "@/assets/tramites.png";
import logoPosgrado from "@/assets/logoPosgrado.png";
import { Button } from "@/components/common";

export default function CampusVirtualPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/iniciar-sesion");
  };

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
          <p className="text-gray-600 font-medium">
            Cargando Campus Virtual...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 mt-16 sm:mt-20">
        <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header del Campus Virtual */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-0">
              {/* Logo */}
              <div className="flex-shrink-0 order-1 lg:order-1">
                <Image
                  src={logoPosgrado}
                  width={144}
                  height={144}
                  alt="Logo Posgrado"
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 xl:w-36 xl:h-36 object-contain"
                />
              </div>
              
              {/* Contenido central */}
              <div className="flex-1 text-center px-2 sm:px-4 lg:px-8 order-2 lg:order-2">
                <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 mb-2 leading-tight">
                  Campus Virtual - Escuela de Posgrado UNICA
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Bienvenido/a,{" "}
                  <span className="font-semibold text-blue-600">
                    {user.nombres} {user.apellidos}
                  </span>
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {user.role} • {user.email}
                </p>
              </div>
              
              {/* Botones */}
              <div className="flex flex-row lg:flex-col items-center gap-3 lg:gap-4 order-3 lg:order-3">
                <Button
                  onClick={() => router.push("/campus-virtual/perfil")}
                  variant="primary"
                  className="text-xs sm:text-sm px-3 sm:px-4 py-2"
                >
                  Ir a Perfil
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="danger"
                  className="text-xs sm:text-sm px-3 sm:px-4 py-2"
                >
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
          {/*Creacion de botones del Campus Virtual */}
          <div>
            <div className={`flex flex-col ${!(user.role === 'COORDINADOR' || user.role === 'ADMIN') ? 'items-center' : 'xl:flex-row'} gap-4 sm:gap-6`}>
              {/* Grid de 8 botones blancos - responsive */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 w-full max-w-6xl">
                {/*Intranet*/}
                <Link className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-3 sm:p-4 lg:p-6 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center space-y-2 sm:space-y-3 lg:space-y-4 min-h-[120px] sm:min-h-[140px] lg:min-h-[180px]" href={"/campus-virtual/intranet"}>
                  <div className="text-center">
                    <h1 className="font-semibold text-blue-600 text-sm sm:text-base lg:text-lg xl:text-xl leading-tight">
                      INTRANET
                    </h1>
                  </div>
                  <Image
                    src={intranet}
                    width={144}
                    height={144}
                    alt="Intranet"
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 object-contain"
                  />
                </Link>

                {/*Matricula*/}
                <Link className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-3 sm:p-4 lg:p-6 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center space-y-2 sm:space-y-3 lg:space-y-4 min-h-[120px] sm:min-h-[140px] lg:min-h-[180px]" href={"/campus-virtual/matricula"}>
                  <div className="text-center">
                    <h1 className="font-semibold text-blue-600 text-sm sm:text-base lg:text-lg xl:text-xl leading-tight">
                      MATRÍCULA
                    </h1>
                  </div>
                  <Image
                    src={matricula}
                    width={144}
                    height={144}
                    alt="Matricula"
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 object-contain"
                  />
                </Link>

                {/*Admision*/}
                <Link className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-3 sm:p-4 lg:p-6 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center space-y-2 sm:space-y-3 lg:space-y-4 min-h-[120px] sm:min-h-[140px] lg:min-h-[180px]" href={"/campus-virtual/admision"}>
                  <div className="text-center">
                    <h1 className="font-semibold text-blue-600 text-sm sm:text-base lg:text-lg xl:text-xl leading-tight">
                      ADMISIÓN
                    </h1>
                  </div>
                  <Image
                    src={admision}
                    width={144}
                    height={144}
                    alt="Admision"
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 object-contain"
                  />
                </Link>

                {/*Gestion de docentes */}
                <Link className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-3 sm:p-4 lg:p-6 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center space-y-2 sm:space-y-3 lg:space-y-4 min-h-[120px] sm:min-h-[140px] lg:min-h-[180px]" href={"/campus-virtual/docentes"}>
                  <div className="text-center">
                    <h1 className="font-semibold text-blue-600 text-xs sm:text-sm lg:text-base xl:text-lg leading-tight">
                      GESTIÓN
                    </h1>
                    <h1 className="font-semibold text-blue-600 text-xs sm:text-sm lg:text-base xl:text-lg leading-tight">
                      DE DOCENTES
                    </h1>
                  </div>
                  <Image
                    src={docentes}
                    width={144}
                    height={144}
                    alt="Docentes"
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 object-contain"
                  />
                </Link>

                {/*Aula virtual*/}
                <Link className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-3 sm:p-4 lg:p-6 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center space-y-2 sm:space-y-3 lg:space-y-4 min-h-[120px] sm:min-h-[140px] lg:min-h-[180px]" href={"/campus-virtual/aula-virtual"}>
                  <div className="text-center">
                    <h1 className="font-semibold text-blue-600 text-sm sm:text-base lg:text-lg xl:text-xl leading-tight">
                      AULA
                    </h1>
                    <h1 className="font-semibold text-blue-600 text-sm sm:text-base lg:text-lg xl:text-xl leading-tight">
                      VIRTUAL
                    </h1>
                  </div>
                  <Image
                    src={aulaVirtual}
                    width={144}
                    height={144}
                    alt="Aula virtual"
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 object-contain"
                  />
                </Link>

                {/*Caja*/}
                <Link className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-3 sm:p-4 lg:p-6 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center space-y-2 sm:space-y-3 lg:space-y-4 min-h-[120px] sm:min-h-[140px] lg:min-h-[180px]" href={"/campus-virtual/caja"}>
                  <div className="text-center">
                    <h1 className="font-semibold text-blue-600 text-sm sm:text-base lg:text-lg xl:text-xl leading-tight">
                      CAJA
                    </h1>
                  </div>
                  <Image
                    src={caja}
                    width={144}
                    height={144}
                    alt="Caja"
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 object-contain"
                  />
                </Link>

                {/*Tramites*/}
                <Link className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-3 sm:p-4 lg:p-6 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center space-y-2 sm:space-y-3 lg:space-y-4 min-h-[120px] sm:min-h-[140px] lg:min-h-[180px]" href={"/campus-virtual/tramites"}>
                  <div className="text-center">
                    <h1 className="font-semibold text-blue-600 text-sm sm:text-base lg:text-lg xl:text-xl leading-tight">
                      TRÁMITES
                    </h1>
                  </div>
                  <Image
                    src={tramites}
                    width={144}
                    height={144}
                    alt="tramites"
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 object-contain"
                  />
                </Link>

                {/*Grado y titulo*/}
                <Link className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-3 sm:p-4 lg:p-6 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center space-y-2 sm:space-y-3 lg:space-y-4 min-h-[120px] sm:min-h-[140px] lg:min-h-[180px]" href={"/campus-virtual/grado-titulos"}>
                  <div className="text-center">
                    <h1 className="font-semibold text-blue-600 text-xs sm:text-sm lg:text-base xl:text-lg leading-tight">
                      GRADO Y
                    </h1>
                    <h1 className="font-semibold text-blue-600 text-xs sm:text-sm lg:text-base xl:text-lg leading-tight">
                      TÍTULOS
                    </h1>
                  </div>
                  <Image
                    src={gradosTitulos}
                    width={144}
                    height={144}
                    alt="Docentes"
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 object-contain"
                  />
                </Link>
              </div>

              {/* Botón ADMINISTRACIÓN - solo visible para COORDINADOR y ADMINISTRADOR */}
              {(user.role === 'COORDINADOR' || user.role === 'ADMIN') && (
                <div className="w-full xl:w-auto xl:flex-1 xl:max-w-sm">
                  <Link className="bg-amber-500 text-red-500 border border-zinc-700/7 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 w-full h-full min-h-[160px] sm:min-h-[180px] lg:min-h-[200px] xl:min-h-[360px] transition-colors duration-200 flex flex-col items-center justify-center space-y-3 sm:space-y-4" href={"/campus-virtual/admin"}>
                    <div className="text-center">
                      <h1 className="font-semibold text-white text-xl sm:text-2xl lg:text-3xl xl:text-4xl leading-tight">
                        ADMINISTRACIÓN
                      </h1>
                    </div>
                    <Image
                      src={administracion}
                      width={144}
                      height={144}
                      alt="Administración"
                      className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 object-contain"
                    />
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* Espaciador para asegurar que el footer sea visible */}
          <div className="h-10 sm:h-16 lg:h-20"></div>
        </div>
      </div>
    </div>
  );
}
