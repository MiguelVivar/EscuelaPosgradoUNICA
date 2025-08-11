"use client";

import CampusQuickLinks from "./CampusQuickLinks";
import CampusSupportInfo from "./CampusSupportInfo";
import CampusLocationInfo from "./CampusLocationInfo";
import { year } from "@/constants";

export default function CampusFooter() {
  return (
    <footer className="bg-gradient-to-br from-zinc-900/95 via-zinc-800/95 to-zinc-900/95 border-t border-amber-500/20 backdrop-blur-sm">
      {/* Efecto de partículas sutil */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-6 left-10 w-1 h-1 bg-amber-400 rounded-full animate-pulse"></div>
        <div className="absolute top-12 right-16 w-0.5 h-0.5 bg-amber-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-12 left-1/4 w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-6 right-1/3 w-0.5 h-0.5 bg-amber-400 rounded-full animate-ping"></div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Enlaces rápidos del campus */}
          <div className="lg:col-span-1 transform transition-all duration-300 hover:scale-[1.02]">
            <CampusQuickLinks />
          </div>

          {/* Información de soporte */}
          <div className="lg:col-span-1 transform transition-all duration-300 hover:scale-[1.02]">
            <CampusSupportInfo />
          </div>

          {/* Información de ubicación */}
          <div className="lg:col-span-1 transform transition-all duration-300 hover:scale-[1.02]">
            <CampusLocationInfo />
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="mt-6 pt-6 border-t border-zinc-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-zinc-400 text-xs font-light tracking-wide">
              &copy; {year} Campus Virtual - Universidad Nacional &quot;San Luis
              Gonzaga&quot; de Ica
            </div>
            <div className="text-center">
              <p className="text-zinc-500 text-xs font-light">
                Hecho por{" "}
                <a
                  href="/equipo"
                  className="text-amber-400 hover:text-amber-300 transition-colors duration-200 underline underline-offset-2 hover:underline-offset-4"
                >
                  IV-Ciclo A
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
