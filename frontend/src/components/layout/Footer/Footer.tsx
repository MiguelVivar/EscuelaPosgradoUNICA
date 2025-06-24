"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import QuickLinks from "./QuickLinks";
import ContactInfo from "./ContactInfo";
import SocialLinks from "./SocialLinks";

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
    <footer ref={footerRef} className="bg-amber-500 border-t-4 text-gray-900">
      {/* Contenido principal del footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Sección de enlaces rápidos */}
          <div>
            <QuickLinks />
          </div>

          {/* Sección de contacto */}
          <div>
            <ContactInfo />
          </div>
        </div>{" "}
        {/* Sección de redes sociales */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0">
            <div className="text-white text-sm font-medium">
              © 2025 Escuela de Posgrado - Universidad Nacional "San Luis
              Gonzaga" de Ica. Todos los derechos reservados.
            </div>

            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}
