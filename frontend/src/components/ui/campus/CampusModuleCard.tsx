"use client";

import Image from "next/image";
import { ModuleCard } from "@/components/common";
import { CampusModuleCardProps } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export default function CampusModuleCard({ module }: CampusModuleCardProps) {
  const { id, title, href, icon, alt, isMultiLine } = module;
  const { user } = useAuth();

  // Si es el módulo INTRANET y el usuario es ALUMNO, redirigir a /intranet-estudiantes
  const finalHref = id === "intranet" && user?.role === "ALUMNO" ? "/intranet-estudiantes" : href;

  return (
    <ModuleCard 
      href={finalHref}
      className="p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3 lg:space-y-4 min-h-[120px] sm:min-h-[140px] lg:min-h-[180px]"
    >
      <div className="text-center">
        {isMultiLine ? (
          <>
            {title.split(' ').map((word, index) => (
              <h1 
                key={`${id}-${index}`}
                className="font-semibold text-blue-600 text-xs sm:text-sm lg:text-base xl:text-lg leading-tight"
              >
                {word}
              </h1>
            ))}
          </>
        ) : (
          <h1 className="font-semibold text-blue-600 text-sm sm:text-base lg:text-lg xl:text-xl leading-tight">
            {title}
          </h1>
        )}
      </div>
      <Image
        src={icon}
        width={144}
        height={144}
        alt={alt}
        className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 object-contain"
      />
    </ModuleCard>
  );
}
