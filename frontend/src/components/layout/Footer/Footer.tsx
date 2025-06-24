"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import QuickLinks from "./QuickLinks";
import ContactInfo from "./ContactInfo";
import SocialLinks from "./SocialLinks";
import { year } from "@/utils";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (footerRef.current) {
      gsap.fromTo(
        footerRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.2 }
      );
    }
  }, []);
  return (
    <footer
      ref={footerRef}
      className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border-t border-amber-500/20"
    >
      {/* Contenido principal del footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Sección de enlaces rápidos */}
          <div className="lg:col-span-1">
            <QuickLinks />
          </div>

          {/* Sección de contacto */}
          <div className="lg:col-span-1">
            <ContactInfo />
          </div>

          {/* Sección adicional - Logo y descripción */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-light text-amber-400 tracking-wide">
                Escuela de Posgrado
              </h3>
              <p className="text-zinc-300 text-lg leading-relaxed font-light">
                Formando profesionales de excelencia con los más altos
                estándares académicos en la Universidad Nacional San Luis
                Gonzaga de Ica.
              </p>
            </div>

            {/* Redes sociales integradas */}
            <div className="pt-0">
              <h4 className="text-zinc-400 text-sm font-medium mb-4 tracking-wide">
                Síguenos
              </h4>
              <SocialLinks />
            </div>
          </div>
        </div>

        {/* Línea divisoria sutil */}
        <div className="mt-16 pt-8 border-t border-zinc-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-zinc-400 text-sm font-light tracking-wide">
              © {year} Universidad Nacional "San Luis Gonzaga" de Ica
            </div>
            <div className="text-zinc-500 text-xs font-light">
              Todos los derechos reservados
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
