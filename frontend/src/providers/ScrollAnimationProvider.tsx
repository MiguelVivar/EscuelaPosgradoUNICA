"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollAnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Configuración global de ScrollTrigger
    ScrollTrigger.defaults({
      scroller: window,
      markers: false, // Cambiar a true para debug
    });

    // Refresh ScrollTrigger cuando cambie el contenido
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    // Refresh inmediato para asegurar que todo esté bien configurado
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(refreshTimeout);
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.killAll();
    };
  }, []);

  return <>{children}</>;
}
