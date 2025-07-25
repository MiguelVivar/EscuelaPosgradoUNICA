import React from "react";

interface PageHeaderProps {
  className?: string;
}

export default function PageHeader({ className = "" }: PageHeaderProps) {
  return (
    <div className={`w-full mb-6 ${className}`}>
      <span className="block text-3xl sm:text-4xl font-semibold text-red-600 tracking-widest mb-4 text-left font-sans">
        CAMPUS
      </span>
      <span className="block text-base font-bold text-zinc-700 mb-2 w-full text-left">
        Restablecer Contraseña
      </span>
      <p className="text-left text-zinc-700 text-xs font-sans leading-relaxed mb-4 mt-2">
        Introduzca su dirección de correo electrónico registrado para recibir un
        enlace de restablecimiento de contraseña en su bandeja de entrada.
      </p>
    </div>
  );
}
