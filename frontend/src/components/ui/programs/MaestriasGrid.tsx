"use client";

import { MaestriasGridProps } from "@/types";
import { MaestriaCategoria } from "./MaestriaCategoria";

export function MaestriasGrid({ maestrias, onMasInformacion }: MaestriasGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {maestrias.map((categoria, index) => (
        <MaestriaCategoria
          key={index}
          categoria={categoria}
          onMasInformacion={onMasInformacion}
        />
      ))}
    </div>
  );
}
