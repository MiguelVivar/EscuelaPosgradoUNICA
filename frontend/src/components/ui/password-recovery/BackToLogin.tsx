import React from "react";
import Link from "next/link";

interface BackToLoginProps {
  href?: string;
  text?: string;
  className?: string;
}

export default function BackToLogin({
  href = "/iniciar-sesion",
  text = "Volver a iniciar sesión",
  className = "",
}: BackToLoginProps) {
  return (
    <div className={`mt-4 text-center w-full ${className}`}>
      <Link
        href={href}
        className="hover:underline text-sm text-amber-600 font-medium"
      >
        {text}
      </Link>
    </div>
  );
}
