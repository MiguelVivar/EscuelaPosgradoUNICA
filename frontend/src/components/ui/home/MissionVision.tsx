"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MissionVision() {
  const containerRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const missionHeaderRef = useRef<HTMLDivElement>(null);
  const visionHeaderRef = useRef<HTMLDivElement>(null);
  const missionContentRef = useRef<HTMLDivElement>(null);
  const visionContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Animación de los headers de Misión y Visión
      gsap.fromTo(
        [missionHeaderRef.current, visionHeaderRef.current],
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animación del contenido de Misión
      gsap.fromTo(
        missionContentRef.current,
        {
          x: -60,
          opacity: 0,
          scale: 0.95,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: missionContentRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          delay: 0.3,
        }
      );

      // Animación del contenido de Visión
      gsap.fromTo(
        visionContentRef.current,
        {
          x: 60,
          opacity: 0,
          scale: 0.95,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: visionContentRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          delay: 0.5,
        }
      );

      // Animación de los párrafos de visión por separado
      const visionParagraphs = visionContentRef.current?.querySelectorAll("p");
      if (visionParagraphs) {
        gsap.fromTo(
          visionParagraphs,
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: visionContentRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
            delay: 0.8,
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {" "}
          {/* Misión */}
          <div ref={missionRef} className="space-y-6">
            {/* Header Misión */}
            <div ref={missionHeaderRef} className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full">
                  EPG - UNICA
                </span>
                <div className="flex-1 h-px bg-amber-300"></div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Misión
              </h2>
            </div>

            {/* Contenido Misión */}
            <div
              ref={missionContentRef}
              className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-amber-600"
            >
              <p className="text-gray-700 leading-relaxed text-lg">
                La Escuela de Posgrado, está comprometida con la formación,
                capacitación, investigación, asesoría y producción intelectual
                de alto nivel. Capacita profesionales con excelencia académica y
                con aptitud de respuesta científica y tecnológica a través de la
                investigación científica. Propicia el mejoramiento de las
                condiciones sociales, económicas, culturales y ambientales de la
                Región y el País.
              </p>
            </div>
          </div>
          {/* Visión */}
          <div ref={visionRef} className="space-y-6">
            {/* Header Visión */}
            <div ref={visionHeaderRef} className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-bold text-red-600 uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full">
                  EPG - UNICA
                </span>
                <div className="flex-1 h-px bg-red-300"></div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Visión
              </h2>
            </div>

            {/* Contenido Visión */}
            <div
              ref={visionContentRef}
              className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-red-600"
            >
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  La Escuela de Posgrado es reconocida como un Centro de
                  Excelencia Académica, entre las Instituciones de la Región Ica
                  y del País.
                </p>

                <p>
                  Reconoce el desarrollo integral del hombre y de la sociedad,
                  interactuando con ella para lograr el beneficio económico y
                  social de la colectividad dentro del marco jurídico y el
                  respeto a los derechos humanos.
                </p>

                <p>
                  Conduce la investigación científica, con un enfoque
                  multidisciplinario y en concertación con el conjunto de
                  instituciones que operan en la región.
                </p>

                <p>
                  Asimismo, logra objetivos y metas planificado y programados
                  oportunamente, cumpliendo eficiente y eficazmente sus
                  compromisos con las instituciones y la sociedad, así como, con
                  las fuentes que financien su desarrollo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
