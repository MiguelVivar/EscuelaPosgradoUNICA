"use client";

import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";

export default function CampusLocationInfo() {
  return (
    <div className="space-y-6">
      <h3 className="text-amber-400 font-semibold text-lg tracking-wide">
        Ubicación
      </h3>

      <div className="space-y-4">
        {/* Dirección */}
        <div className="flex items-start space-x-3 group">
          <div className="flex-shrink-0 p-2 bg-zinc-800/50 rounded-lg group-hover:bg-amber-500/10 transition-colors duration-200">
            <FaMapMarkerAlt className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h4 className="text-zinc-300 font-medium text-sm">Dirección</h4>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Prolongación Ayabaca S/N
              <br />
              Ciudad Universitaria
              <br />
              Ica - Perú
            </p>
          </div>
        </div>

        {/* Teléfono */}
        <div className="flex items-start space-x-3 group">
          <div className="flex-shrink-0 p-2 bg-zinc-800/50 rounded-lg group-hover:bg-amber-500/10 transition-colors duration-200">
            <FaPhone className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h4 className="text-zinc-300 font-medium text-sm">Teléfono</h4>
            <p className="text-zinc-400 text-xs">
              <a
                href="tel:+51056213366"
                className="hover:text-amber-400 transition-colors duration-200"
              >
                +51 056 213366
              </a>
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start space-x-3 group">
          <div className="flex-shrink-0 p-2 bg-zinc-800/50 rounded-lg group-hover:bg-amber-500/10 transition-colors duration-200">
            <FaEnvelope className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h4 className="text-zinc-300 font-medium text-sm">Email</h4>
            <p className="text-zinc-400 text-xs">
              <a
                href="mailto:posgrado@unica.edu.pe"
                className="hover:text-amber-400 transition-colors duration-200"
              >
                posgrado@unica.edu.pe
              </a>
            </p>
          </div>
        </div>

        {/* Horarios */}
        <div className="flex items-start space-x-3 group">
          <div className="flex-shrink-0 p-2 bg-zinc-800/50 rounded-lg group-hover:bg-amber-500/10 transition-colors duration-200">
            <FaClock className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h4 className="text-zinc-300 font-medium text-sm">Horarios</h4>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Lunes a Viernes: 8:00 - 17:00
              <br />
              Sábados: 8:00 - 12:00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
