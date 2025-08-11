"use client";

import bg from "@/assets/bg.jpg";
import { HeroSection, SectionHeader } from "@/components/common";
import { DoctoradosGrid, MaestriasGrid } from "@/components/ui/programs";
import { doctorados, maestrias } from "@/data/programas";

export default function ProgramasPage() {
  const handleVerMasDoctorado = (id: number) => {
    console.log(`Ver más información del doctorado con ID: ${id}`);
    // Aquí puedes implementar la navegación o modal
  };

  const handleMasInformacionMaestria = (nombre: string) => {
    console.log(`Más información sobre la maestría: ${nombre}`);
    // Aquí puedes implementar la navegación o modal
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection 
        title="Programas Académicos"
        backgroundImage={bg.src}
      />

      {/* Doctorados Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <SectionHeader title="Doctorados" />
        <DoctoradosGrid 
          doctorados={doctorados}
          onVerMas={handleVerMasDoctorado}
        />
      </section>

      {/* Maestrías Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Maestrías" />
          <MaestriasGrid 
            maestrias={maestrias}
            onMasInformacion={handleMasInformacionMaestria}
          />
        </div>
      </section>
    </main>
  );
}