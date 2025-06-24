"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import QuickLinks from "./QuickLinks";
import ContactInfo from "./ContactInfo";
import SocialLinks from "./SocialLinks";
import { year } from "@/constants";

// Registrar el plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const quickLinksRef = useRef<HTMLDivElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (footerRef.current) {
        // Timeline principal para coordinar todas las animaciones
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        });

        // Animación del fondo del footer
        tl.fromTo(
          footerRef.current,
          { 
            y: 100, 
            opacity: 0,
            background: "linear-gradient(to bottom right, #18181b, #27272a, #18181b)"
          },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
            ease: "power3.out",
            background: "linear-gradient(to bottom right, #18181b, #27272a, #18181b)"
          }
        );

        // Animaciones escalonadas de las secciones
        tl.fromTo(
          quickLinksRef.current,
          { x: -50, opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
          "-=0.8"
        )
        .fromTo(
          contactInfoRef.current,
          { y: 50, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
          "-=0.6"
        )
        .fromTo(
          descriptionRef.current,
          { x: 50, opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
          "-=0.6"
        )
        .fromTo(
          socialLinksRef.current,
          { y: 30, opacity: 0, scale: 0.8 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.3)" },
          "-=0.4"
        )
        .fromTo(
          copyrightRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.3"
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);  return (
    <footer
      ref={footerRef}
      className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border-t border-amber-500/20 overflow-hidden relative"
    >
      {/* Efecto de partículas de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-amber-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-1/3 w-1 h-1 bg-amber-400 rounded-full animate-ping"></div>
      </div>

      {/* Contenido principal del footer */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Sección de enlaces rápidos */}
          <div ref={quickLinksRef} className="lg:col-span-1 transform transition-all duration-300 hover:scale-105">
            <QuickLinks />
          </div>

          {/* Sección de contacto */}
          <div ref={contactInfoRef} className="lg:col-span-1 transform transition-all duration-300 hover:scale-105">
            <ContactInfo />
          </div>

          {/* Sección adicional - Logo y descripción */}
          <div ref={descriptionRef} className="lg:col-span-1 space-y-6 transform transition-all duration-300 hover:scale-105">
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
            <div ref={socialLinksRef} className="pt-0">
              <h4 className="text-zinc-400 text-sm font-medium mb-4 tracking-wide">
                Síguenos
              </h4>
              <SocialLinks />
            </div>
          </div>
        </div>

        {/* Línea divisoria sutil */}
        <div ref={copyrightRef} className="mt-16 pt-8 border-t border-zinc-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-zinc-400 text-sm font-light tracking-wide">
              &copy; {year} Universidad Nacional &quot;San Luis Gonzaga&quot; de Ica
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
