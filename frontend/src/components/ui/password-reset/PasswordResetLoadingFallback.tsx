import React from "react";
import Image from "next/image";
import { FiLock } from "react-icons/fi";
import posgradoImg from "@/assets/posgrado.png";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface PasswordResetLoadingFallbackProps {
  className?: string;
}

export default function PasswordResetLoadingFallback({ 
  className = "" 
}: PasswordResetLoadingFallbackProps) {
  return (
    <main className={`min-h-screen flex flex-col lg:flex-row justify-center items-stretch bg-gradient-to-br from-amber-50 via-zinc-50 to-amber-100 ${className}`}>
      <section className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 px-8 py-20 flex flex-col items-center">
          <div className="flex flex-row items-start justify-between w-full mb-6 gap-4 -mt-14">
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
          <LoadingSpinner message="Cargando..." />
        </div>
      </section>
      <section className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
        <div className="text-center p-8">
          <FiLock className="mx-auto mb-6 text-amber-600" size={120} />
          <h2 className="text-3xl font-bold text-amber-800 mb-4">
            Nueva Contraseña
          </h2>
          <p className="text-amber-700 text-lg max-w-md">
            Estás a punto de establecer una nueva contraseña segura para tu cuenta de la Escuela de Posgrado UNICA.
          </p>
        </div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/60 rounded-full rotate-12 drop-shadow-xl"></div>
        <div className="absolute bottom-16 left-16 w-20 h-20 bg-amber-300 rounded-full -rotate-6 drop-shadow-lg"></div>
      </section>
    </main>
  );
}
