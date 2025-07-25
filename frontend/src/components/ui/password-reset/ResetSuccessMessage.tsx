import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import Link from "next/link";

interface ResetSuccessMessageProps {
  className?: string;
}

export default function ResetSuccessMessage({ 
  className = "" 
}: ResetSuccessMessageProps) {
  return (
    <div className={`flex flex-col justify-center items-center w-full ${className}`}>
      <div className="text-center">
        <FiCheckCircle className="mx-auto mb-4 text-green-500" size={48} />
        <div className="text-green-700 bg-green-100 p-4 rounded mb-4 text-sm">
          ¡Contraseña restablecida exitosamente! Serás redirigido al inicio de sesión en unos segundos.
        </div>
        <Link
          href="/iniciar-sesion"
          className="text-amber-600 hover:underline font-medium"
        >
          Ir a iniciar sesión ahora
        </Link>
      </div>
    </div>
  );
}
