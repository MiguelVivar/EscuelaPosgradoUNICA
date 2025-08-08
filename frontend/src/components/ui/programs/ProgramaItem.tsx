"use client";

import { ProgramaItemProps } from "@/types";

export function ProgramaItem({
  programa,
  onMasInformacion,
}: ProgramaItemProps) {
  const handleMasInformacion = () => {
    if (onMasInformacion) {
      onMasInformacion(programa.nombre);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
        <svg
          className="w-4 h-4 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-gray-800 font-medium">{programa.nombre}</p>
      </div>
      <button
        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-xs rounded font-medium transition-colors"
        onClick={handleMasInformacion}
      >
        {programa.estado}
      </button>
    </div>
  );
}
