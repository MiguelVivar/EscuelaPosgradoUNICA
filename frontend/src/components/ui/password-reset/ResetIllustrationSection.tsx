import React from "react";
import { FiLock } from "react-icons/fi";

interface ResetIllustrationSectionProps {
  className?: string;
}

export default function ResetIllustrationSection({ 
  className = "" 
}: ResetIllustrationSectionProps) {
  return (
    <section className={`hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 ${className}`}>
      <div className="text-center p-8">
        <FiLock className="mx-auto mb-6 text-amber-600" size={120} />
        <h2 className="text-3xl font-bold text-amber-800 mb-4">
          Nueva Contraseña
        </h2>
        <p className="text-amber-700 text-lg max-w-md">
          Estás a punto de establecer una nueva contraseña segura para tu cuenta de la Escuela de Posgrado UNICA.
        </p>
      </div>
      
      {/* Formas geométricas flotantes */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/60 rounded-full rotate-12 drop-shadow-xl"></div>
      <div className="absolute bottom-16 left-16 w-20 h-20 bg-amber-300 rounded-full -rotate-6 drop-shadow-lg"></div>
    </section>
  );
}
