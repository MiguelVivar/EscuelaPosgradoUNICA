import React from "react";
import Link from "next/link";

interface TokenValidationErrorProps {
  error: string;
  className?: string;
}

export default function TokenValidationError({ 
  error, 
  className = "" 
}: TokenValidationErrorProps) {
  return (
    <div className={`flex flex-col justify-center items-center w-full ${className}`}>
      <div className="text-center">
        <div className="text-red-600 bg-red-100 p-4 rounded mb-4 text-sm">
          {error || "El enlace de recuperación no es válido o ha expirado."}
        </div>
        <Link
          href="/recuperar-password"
          className="text-amber-600 hover:underline font-medium"
        >
          Solicitar nuevo enlace de recuperación
        </Link>
      </div>
    </div>
  );
}
