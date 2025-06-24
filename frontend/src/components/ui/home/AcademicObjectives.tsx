"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import about2 from "@/assets/about2.png"; 

export default function AcademicObjectives() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && contentRef.current && imageRef.current) {
      // Animación del contenedor principal
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );

      // Animación del contenido
      gsap.fromTo(
        contentRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.3 }
      );

      // Animación de la imagen
      gsap.fromTo(
        imageRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.6 }
      );
    }
  }, []);

  const objectives = [
    "Proporcionar capacitación especializada y de carácter interdisciplinario del más alto nivel académico, en las diferentes áreas del saber humano.",
    "Fomentar y desarrollo la investigación científica a través del aporte creador de los integrantes de la Escuela de Posgrado.",
    "Intensificar la cooperación e intercambio con escuelas similares e instituciones públicas o privadas a nivel nacional e internacional.",
    "Desarrollar acciones de extensión o proyección universitaria.",
    "Fomentar la producción de bienes y la prestación de servicios, privilegiando la creación intelectual.",
  ];

  return (
    <section ref={containerRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenido */}
          <div ref={contentRef} className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full">
                  EPG - UNICA
                </span>
                <div className="flex-1 h-px bg-amber-300"></div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Objetivos Académicos
              </h2>
            </div>

            {/* Descripción introductoria */}
            <div className="text-gray-700 leading-relaxed text-lg">
              <p>La Escuela de Posgrado tiene como objetivos:</p>
            </div>

            {/* Lista de objetivos */}
            <div className="space-y-6">
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-3"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed text-base">
                      {objective}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Imagen */}
          <div ref={imageRef} className="relative">
            <Image
              src={about2}
              alt="Objetivos Académicos"
              className="w-full h-auto rounded-lg shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
