import React from "react";
import GoogleSignInButton from "@/components/ui/auth/GoogleSignInButton";

interface SocialLoginSectionProps {
  onGoogleSuccess: (credential: string) => void;
  onGoogleError: (error: any) => void;
  isLoading: boolean;
}

export default function SocialLoginSection({
  onGoogleSuccess,
  onGoogleError,
  isLoading
}: SocialLoginSectionProps) {
  return (
    <div className="space-y-6">
      {/* Separador con texto */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">
            O continúa con
          </span>
        </div>
      </div>

      {/* Botón de Google */}
      <div className="w-full">
        <GoogleSignInButton 
          onSuccess={onGoogleSuccess}
          onError={onGoogleError}
          disabled={isLoading}
        />
      </div>

      {/* Información adicional */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Al iniciar sesión con Google, aceptas que solo se permiten correos institucionales
          <span className="font-medium text-amber-600"> @unica.edu.pe</span>
        </p>
      </div>
    </div>
  );
}
