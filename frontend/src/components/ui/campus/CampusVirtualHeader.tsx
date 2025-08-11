"use client";

import Image from "next/image";
import { Button } from "@/components/common";
import { CampusVirtualHeaderProps } from "@/types";
import logoPosgrado from "@/assets/logoPosgrado.png";

export default function CampusVirtualHeader({ 
  user, 
  onProfileClick, 
  onLogout 
}: CampusVirtualHeaderProps) {
  return (
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
            onClick={onProfileClick}
            variant="primary"
            className="text-xs sm:text-sm px-3 sm:px-4 py-2"
          >
            Ir a Perfil
          </Button>
          <Button
            onClick={onLogout}
            variant="danger"
            className="text-xs sm:text-sm px-3 sm:px-4 py-2"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
