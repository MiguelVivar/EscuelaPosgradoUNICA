"use client";

import Link from "next/link";
import { FaHome, FaUser, FaBook, FaChartBar } from "react-icons/fa";

const campusLinks = [
  {
    name: "Campus Virtual",
    href: "/campus-virtual",
    icon: <FaHome className="w-4 h-4" />,
  },
  {
    name: "Mi Perfil",
    href: "/campus-virtual/perfil",
    icon: <FaUser className="w-4 h-4" />,
  },
  {
    name: "Matrícula",
    href: "/campus-virtual/matricula",
    icon: <FaBook className="w-4 h-4" />,
  },
  {
    name: "Intranet",
    href: "/campus-virtual/intranet",
    icon: <FaChartBar className="w-4 h-4" />,
  },
];

export default function CampusQuickLinks() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-amber-400 tracking-wide">
        Acceso rápido
      </h3>

      <div className="space-y-3">
        {campusLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="group flex items-center text-slate-300 hover:text-amber-400 transition-all duration-300 text-sm font-light"
          >
            <div className="flex items-center justify-center w-6 h-6 mr-3 text-amber-500/60 group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300">
              {link.icon}
            </div>
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              {link.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
