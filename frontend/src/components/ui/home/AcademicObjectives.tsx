"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import about2 from "@/assets/about2.png";
import objectives from "@/data/Objectives";

// Registrar ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AcademicObjectives() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const objectivesListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Animación del header
      gsap.fromTo(
        headerRef.current,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animación de la descripción
      gsap.fromTo(
        descriptionRef.current,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: 0.2,
        }
      );

      // Animación de los objetivos uno por uno
      const objectiveItems = objectivesListRef.current?.children;
      if (objectiveItems) {
        gsap.fromTo(
          objectiveItems,
          {
            x: -30,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: objectivesListRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
            delay: 0.4,
          }
        );
      }

      // Animación de la imagen
      gsap.fromTo(
        imageRef.current,
        {
          x: 80,
          opacity: 0,
          scale: 0.9,
          rotation: 5,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          delay: 0.3,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {" "}
          {/* Contenido */}
          <div ref={contentRef} className="space-y-8">
            {/* Header */}
            <div ref={headerRef} className="space-y-4">
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
            <div
              ref={descriptionRef}
              className="text-gray-700 leading-relaxed text-lg"
            >
              <p>La Escuela de Posgrado tiene como objetivos:</p>
            </div>

            {/* Lista de objetivos */}
            <div ref={objectivesListRef} className="space-y-6">
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
