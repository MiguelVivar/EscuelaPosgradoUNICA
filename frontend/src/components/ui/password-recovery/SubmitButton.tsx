import React from "react";

interface SubmitButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  loadingText?: string;
  buttonText?: string;
  className?: string;
}

export default function SubmitButton({
  isLoading,
  disabled = false,
  loadingText = "Enviando...",
  buttonText = "Enviar",
  className = "",
}: SubmitButtonProps) {
  const isDisabled = isLoading || disabled;

  return (
    <button
      type="submit"
      className={`w-full bg-amber-500 text-white py-2 rounded shadow hover:bg-amber-600 transition font-semibold disabled:bg-amber-300 disabled:cursor-not-allowed ${className}`}
      disabled={isDisabled}
    >
      {isLoading ? loadingText : buttonText}
    </button>
  );
}
