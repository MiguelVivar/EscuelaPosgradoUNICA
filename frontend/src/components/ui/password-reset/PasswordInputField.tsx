import React from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { PasswordInputFieldProps } from "@/types";

export default function PasswordInputField({
  label,
  value,
  onChange,
  showPassword,
  onToggleVisibility,
  placeholder = "",
  required = false,
  className = "",
}: PasswordInputFieldProps) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
        <FiLock size={20} />
      </span>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-12 py-2 w-full rounded-md outline-none bg-amber-50 text-base placeholder-zinc-500 focus:bg-amber-100 transition font-sans"
        placeholder={placeholder}
        required={required}
        autoComplete="new-password"
        aria-label={label}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-600"
        onClick={onToggleVisibility}
        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </button>
    </div>
  );
}
