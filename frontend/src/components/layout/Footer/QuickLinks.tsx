"use client";

import Link from "next/link";
import quickLinks from "@/data/QuickLinks";

export default function QuickLinks() {
  return (
    <div className="space-y-4">
      <h3 className="text-3xl font-bold text-red-600 mb-6">Enlaces rápidos</h3>

      <div className="space-y-3">
        {quickLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="block text-white hover:text-slate-200 transition-colors duration-200 text-sm"
          >
            <span className="flex items-center">
              <span className="w-2 h-2 bg-red-800 rounded-full mr-3 opacity-60"></span>
              {link.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
