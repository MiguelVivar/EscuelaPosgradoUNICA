"use client";

import Image from "next/image";
import { DoctoradoCardProps } from "@/types";
import { Button } from "@/components/common";

export function DoctoradoCard({ doctorado, onVerMas }: DoctoradoCardProps) {
  const handleVerMas = () => {
    if (onVerMas) {
      onVerMas(doctorado.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="h-48 bg-gray-300 relative">
        <Image
          src={doctorado.imagen.src}
          alt={doctorado.titulo}
          className="w-full h-full object-cover"
          height={192}
          width={288}
        />
        <div className="absolute bottom-4 left-4">
          <Button variant="danger" size="sm" onClick={handleVerMas}>
            Ver más
          </Button>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 text-center">
          {doctorado.titulo}
        </h3>
      </div>
    </div>
  );
}
