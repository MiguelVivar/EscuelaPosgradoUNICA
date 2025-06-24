"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import AdmissionResults from "./AdmissionResults";
import CampusVirtual from "./CampusVirtual";
import NavItems from "@/data/NavItems";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.2 }
      );
    }
  }, []);
  return (
    <div className="w-full">
      {/* Navbar */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200"
      >
        <div className="container mx-auto px-4">
          {" "}
          {/* Sección de Navegación */}
          <div className="flex items-center justify-between py-4">
            <Logo />

            {/* Navegación de Escritorio */}
            <div className="hidden lg:flex items-center space-x-8">
              {NavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href || "#"}
                  className={`font-medium transition-colors hover:text-amber-600 ${
                    pathname === item.href
                      ? "text-amber-600 border-b-2 border-amber-600 pb-1"
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Acciones de Escritorio */}
            <div className="hidden lg:flex items-center space-x-4">
              <CampusVirtual />
              <AdmissionResults />
            </div>

            {/* Botón de Menú Móvil */}
            <button
              ref={mobileButtonRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>{" "}
          {/* Menu de Navegación Móvil */}
          <MobileMenu
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </div>
      </nav>
    </div>
  );
}
