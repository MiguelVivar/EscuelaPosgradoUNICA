"use client";

import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-light text-amber-400 tracking-wide">
        Contacto
      </h3>

      <div className="space-y-5">
        <div className="group flex items-start space-x-4">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-amber-500/20 transition-colors duration-300">
            <FaMapMarkerAlt className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-slate-300 text-lg font-light leading-relaxed">
              Calle Bolívar 232, Ica
            </p>
          </div>
        </div>

        <div className="group flex items-center space-x-4">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-amber-500/20 transition-colors duration-300">
            <FaPhone className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-slate-300 text-lg font-light">(056) 284400</p>
          </div>
        </div>

        <div className="group flex items-start space-x-4">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-amber-500/20 transition-colors duration-300">
            <FaEnvelope className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-slate-300 text-lg font-light leading-relaxed">
              posgrado.admision@unica.edu.pe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
