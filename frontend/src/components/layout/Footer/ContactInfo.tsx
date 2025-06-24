"use client";

import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export default function ContactInfo() {
  return (
    <div className="space-y-4">
      <h3 className="text-3xl font-bold text-red-600 mb-6">Contacto</h3>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <FaMapMarkerAlt className="w-5 h-5 text-red-800 mt-1 flex-shrink-0" />
          <span className="text-white text-sm">Calle Bolívar 232 - Ica</span>
        </div>

        <div className="flex items-center space-x-3">
          <FaPhone className="w-5 h-5 text-red-800 flex-shrink-0" />
          <span className="text-white text-sm">(056) 284400</span>
        </div>

        <div className="flex items-start space-x-3">
          <FaEnvelope className="w-5 h-5 text-red-800 mt-1 flex-shrink-0" />
          <span className="text-white text-sm">
            posgrado.admision@unica.edu.pe
          </span>
        </div>
      </div>
    </div>
  );
}
