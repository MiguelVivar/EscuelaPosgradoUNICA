import React from "react";
import { FiMail } from "react-icons/fi";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function EmailInput({
  value,
  onChange,
  disabled = false,
  placeholder = "Correo electrónico",
  className = "",
}: EmailInputProps) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
        <FiMail size={20} />
      </span>
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4 py-2 w-full rounded-md outline-none bg-amber-50 text-base placeholder-zinc-500 focus:bg-amber-100 transition font-sans"
        placeholder={placeholder}
        required
        autoComplete="off"
        disabled={disabled}
      />
    </div>
  );
}
