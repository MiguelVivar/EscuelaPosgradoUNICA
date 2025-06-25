import React from "react";

interface SubmitButtonProps {
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SubmitButton({ isLoading, onSubmit }: SubmitButtonProps) {
  return (
    <div className="pt-4">
      <button
        type="submit"
        disabled={isLoading}
        onClick={onSubmit}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 active:scale-95 focus:ring-4 focus:ring-amber-500/30 disabled:opacity-70"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Iniciando sesión...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>Iniciar Sesión</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          </div>
        )}
      </button>
    </div>
  );
}
