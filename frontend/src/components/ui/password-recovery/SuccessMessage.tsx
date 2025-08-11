import React from "react";
import { Alert } from "@/components/ui/common";

interface SuccessMessageProps {
  message?: string;
  className?: string;
}

export default function SuccessMessage({
  message = "Si el correo existe, recibirás un enlace para restablecer tu contraseña.",
  className = "",
}: SuccessMessageProps) {
  return (
    <Alert
      type="success"
      message={message}
      className={`text-center ${className}`}
    />
  );
}
