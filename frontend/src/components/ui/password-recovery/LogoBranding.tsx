import React from "react";
import Image from "next/image";
import posgradoImg from "@/assets/posgrado.png";

interface LogoBrandingProps {
  className?: string;
}

export default function LogoBranding({ className = "" }: LogoBrandingProps) {
  return (
    <div
      className={`flex flex-row items-start justify-between w-full mb-6 gap-4 -mt-14 ${className}`}
    >
      <div className="flex flex-col items-start flex-1">
        <span className="block text-xl sm:text-2xl font-semibold text-amber-500 leading-tight font-sans">
          Escuela de Posgrado
        </span>
        <span className="block text-2xl sm:text-3xl font-semibold text-red-600 leading-tight font-sans tracking-wide mt-1">
          UNICA
        </span>
      </div>
      <Image
        src={posgradoImg}
        alt="Posgrado"
        width={96}
        height={96}
        className="h-20 sm:h-24 w-auto"
      />
    </div>
  );
}
