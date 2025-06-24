"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function MissionVision() {
  const containerRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && missionRef.current && visionRef.current) {
      // Animación del contenedor principal
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );

      // Animación de la misión
      gsap.fromTo(
        missionRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.3 }
      );

      // Animación de la visión
      gsap.fromTo(
        visionRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.6 }
      );
    }
  }, []);

  return (
    <section ref={containerRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Misión */}
          <div ref={missionRef} className="space-y-6">
            {/* Header Misión */}
            <div className="space-y-4">
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
            <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-amber-600">
              <p className="text-gray-700 leading-relaxed text-lg">
                La Escuela de Posgrado, está comprometida con la formación, 
                capacitación, investigación, asesoría y producción intelectual 
                de alto nivel. Capacita profesionales con excelencia académica 
                y con aptitud de respuesta científica y tecnológica a través de 
                la investigación científica. Propicia el mejoramiento de las 
                condiciones sociales, económicas, culturales y ambientales de 
                la Región y el País.
              </p>
            </div>
          </div>

          {/* Visión */}
          <div ref={visionRef} className="space-y-6">
            {/* Header Visión */}
            <div className="space-y-4">
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
            <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-red-600">
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  La Escuela de Posgrado es reconocida como un Centro de 
                  Excelencia Académica, entre las Instituciones de la Región 
                  Ica y del País.
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
                  compromisos con las instituciones y la sociedad, así como, 
                  con las fuentes que financien su desarrollo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
