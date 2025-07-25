"use client";

import { DoctoradosGridProps } from "@/types";
import { DoctoradoCard } from "./DoctoradoCard";

export function DoctoradosGrid({ doctorados, onVerMas }: DoctoradosGridProps) {
  const primeraFila = doctorados.slice(0, 3);
  const segundaFila = doctorados.slice(3, 5);

  return (
    <>
      {/* Primera fila - 3 elementos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {primeraFila.map((doctorado) => (
          <DoctoradoCard
            key={doctorado.id}
            doctorado={doctorado}
            onVerMas={onVerMas}
          />
        ))}
      </div>

      {/* Segunda fila - 2 elementos centrados */}
      {segundaFila.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {segundaFila.map((doctorado) => (
            <DoctoradoCard
              key={doctorado.id}
              doctorado={doctorado}
              onVerMas={onVerMas}
            />
          ))}
        </div>
      )}
    </>
  );
}
