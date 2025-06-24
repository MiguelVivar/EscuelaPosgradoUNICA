"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Button from "@/components/common/Button";
import about from "@/assets/about.png";

export default function Welcome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && imageRef.current && contentRef.current) {
      // Animación del contenedor principal
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );

      // Animación de la imagen
      gsap.fromTo(
        imageRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.3 }
      );

      // Animación del contenido
      gsap.fromTo(
        contentRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.6 }
      );
    }
  }, []);

  return (
    <section ref={containerRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Imagen */}
          <div ref={imageRef} className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-amber-50">
                <Image
                  src={about}
                  alt="Bienvenida a la Escuela de Posgrado"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Efecto de superposición */}
              <div className="absolute inset-0 bg-gradient-to-t from-black from-0% via-transparent to-transparent opacity-20"></div>
            </div>
          </div>

          {/* Contenido */}
          <div ref={contentRef} className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-sm font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full">
                  Bienvenidos
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Escuela de Posgrado de la{" "}
                <span className="text-red-600">Universidad Nacional</span>{" "}
                <span className="text-amber-600">&quot;San Luis Gonzaga&quot;</span>
              </h1>
            </div>

            {/* Descripción */}
            <div className="space-y-6 text-gray-700 leading-relaxed text-md">
              <p>
                La{" "}
                <span className="font-semibold text-amber-600">
                  Escuela de Posgrado
                </span>
                , es la unidad Académica que imparte conocimiento de los más
                altos niveles científicos, tecnológicos y Humanísticos;
                orientados a la permanente formación, capacitación y
                perfeccionamiento de los participantes en las diversas Maestrías
                y Doctorados acorde con las necesidades del desarrollo Regional,
                Nacional e Internacional.
              </p>

              <p>
                En el quehacer del desarrollo universitario, la Escuela de
                Posgrado inicia sus actividades como{" "}
                <span className="font-semibold text-red-600">
                  Programa Académico de Perfeccionamiento
                </span>{" "}
                autorizado mediante{" "}
                <span className="font-semibold">
                  Resolución Rectoral N° 11080
                </span>{" "}
                de fecha 05 de Julio de 1982. Posteriormente en el año 1985
                recibe el reconocimiento oficial de la Comisión Nacional
                Interuniversitaria mediante{" "}
                <span className="font-semibold">
                  Resolución N°5062-85-CONAI
                </span>
                , como programa Académico de Maestría en Educación.
              </p>
            </div>

            {/* Botón de acción */}
            <div className="pt-4">
              <Button
                variant="primary"
                size="lg"
                className="shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Ver Acta de Creación del Programa Académico de Perfeccionamiento
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
