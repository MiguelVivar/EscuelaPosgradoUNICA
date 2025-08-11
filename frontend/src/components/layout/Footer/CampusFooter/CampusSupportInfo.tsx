"use client";

import {
  FaHeadset,
  FaQuestionCircle,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa";

const supportLinks = [
  {
    name: "Soporte Técnico",
    description: "Ayuda con problemas técnicos",
    icon: <FaHeadset className="w-4 h-4" />,
    contact: "soporte@unica.edu.pe",
  },
  {
    name: "Preguntas Frecuentes",
    description: "Respuestas a consultas comunes",
    icon: <FaQuestionCircle className="w-4 h-4" />,
    href: "/faq",
  },
  {
    name: "Contacto Académico",
    description: "Consultas sobre programas",
    icon: <FaEnvelope className="w-4 h-4" />,
    contact: "posgrado.admision@unica.edu.pe",
  },
  {
    name: "Portal Principal",
    description: "Sitio web institucional",
    icon: <FaGlobe className="w-4 h-4" />,
    href: "/",
  },
];

export default function CampusSupportInfo() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-amber-400 tracking-wide">
        Soporte y ayuda
      </h3>

      <div className="space-y-4">
        {supportLinks.map((item) => (
          <div key={item.name} className="group">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-slate-800/50 rounded-lg flex items-center justify-center group-hover:bg-amber-500/20 transition-colors duration-300 flex-shrink-0">
                <div className="text-amber-400">{item.icon}</div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-slate-300 text-sm font-medium group-hover:text-amber-400 transition-colors duration-300">
                  {item.name}
                </h4>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  {item.description}
                </p>
                {item.contact && (
                  <p className="text-amber-400/80 text-xs mt-1 font-mono">
                    {item.contact}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
