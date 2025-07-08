import React from "react";
import { PasswordInputProps } from "@/types/Login";

export default function PasswordInput({
  value,
  onChange,
  showPassword,
  onToggleVisibility,
}: PasswordInputProps) {
  return (
    <div className="space-y-3">
      <label
        htmlFor="password"
        className="block text-sm font-semibold text-gray-700"
      >
        Contraseña
      </label>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          required
          value={value}
          onChange={onChange}
          className="relative w-full px-4 py-4 border-2 border-gray-200/50 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 hover:border-amber-300 hover:bg-white/90 pr-12"
          placeholder="Ingresa tu contraseña"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-amber-600 transition-colors duration-300 focus:outline-none"
        >
          {showPassword ? (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
