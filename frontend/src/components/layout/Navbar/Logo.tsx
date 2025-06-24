"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import logoPosgrado from "@/assets/logoPosgrado.png";

export default function Logo() {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: "back.out(1.7)",
          delay: 0.3,
        }
      );
    }
  }, []);

  return (
    <div ref={logoRef} className="flex items-center space-x-3">
      <div className="relative">
        <Image
          src={logoPosgrado}
          alt="Logo"
          width={70}
          height={70}
          className="w-12 h-12"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-amber-500 font-bold">
          Escuela de Posgrado
        </span>
        <span className="text-xl font-bold text-red-600">UNICA</span>
      </div>
    </div>
  );
}
