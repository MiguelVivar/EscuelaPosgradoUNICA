"use client";

import Link from "next/link";
import quickLinks from "@/data/QuickLinks";

export default function QuickLinks() {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-light text-amber-400 tracking-wide">
        Enlaces rápidos
      </h3>

      <div className="space-y-3">
        {quickLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="group flex items-center text-slate-300 hover:text-amber-400 transition-all duration-300 text-sm font-light"
          >
            <div className="w-1 h-1 bg-amber-500 rounded-full mr-4 opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
            <span className="group-hover:translate-x-1 transition-transform duration-300 text-lg">
              {link.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
