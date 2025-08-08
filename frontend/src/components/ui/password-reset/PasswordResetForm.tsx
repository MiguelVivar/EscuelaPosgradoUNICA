import React from "react";
import PasswordInputField from "./PasswordInputField";
import Button from "@/components/common/Button";
import Link from "next/link";

interface PasswordResetFormProps {
  password: string;
  confirmPassword: string;
  error: string;
  isLoading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onTogglePasswordVisibility: () => void;
  onToggleConfirmPasswordVisibility: () => void;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export default function PasswordResetForm({
  password,
  confirmPassword,
  error,
  isLoading,
  showPassword,
  showConfirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  onTogglePasswordVisibility,
  onToggleConfirmPasswordVisibility,
  onSubmit,
  className = "",
}: PasswordResetFormProps) {
  return (
    <div className={`flex flex-col justify-center items-center w-full ${className}`}>
      <div className="w-full mb-6">
        <span className="block text-3xl sm:text-4xl font-semibold text-red-600 tracking-widest mb-4 text-left font-sans">
          NUEVA
        </span>
        <span className="block text-base font-bold text-zinc-700 mb-2 w-full text-left">
          Restablecer Contraseña
        </span>
        <p className="text-left text-zinc-700 text-xs font-sans leading-relaxed mb-4 mt-2">
          Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres para garantizar la seguridad de tu cuenta.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 w-full">
        {/* Nueva contraseña */}
        <PasswordInputField
          label="Nueva contraseña"
          value={password}
          onChange={onPasswordChange}
          showPassword={showPassword}
          onToggleVisibility={onTogglePasswordVisibility}
          placeholder="Nueva contraseña"
          required
        />

        {/* Confirmar contraseña */}
        <PasswordInputField
          label="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          showPassword={showConfirmPassword}
          onToggleVisibility={onToggleConfirmPasswordVisibility}
          placeholder="Confirmar nueva contraseña"
          required
        />

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
          className="bg-amber-500 text-white py-2 rounded shadow hover:bg-amber-600 transition font-semibold disabled:bg-amber-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Restableciendo..." : "Restablecer Contraseña"}
        </Button>
      </form>

      <div className="mt-4 text-center w-full">
        <Link
          href="/iniciar-sesion"
          className="hover:underline text-sm text-amber-600 font-medium"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    </div>
  );
}
