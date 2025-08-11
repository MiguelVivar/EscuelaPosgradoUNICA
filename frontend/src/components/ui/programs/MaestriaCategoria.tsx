"use client";

import { MaestriaCategoriaProps } from "@/types";
import { ProgramaItem } from "./ProgramaItem";

export function MaestriaCategoria({
  categoria,
  onMasInformacion,
}: MaestriaCategoriaProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {categoria.categoria}
      </h3>
      {categoria.programas.map((programa, programaIndex) => (
        <ProgramaItem
          key={programaIndex}
          programa={programa}
          onMasInformacion={onMasInformacion}
        />
      ))}
    </div>
  );
}
