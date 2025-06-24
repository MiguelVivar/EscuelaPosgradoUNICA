"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FaArrowRight } from "react-icons/fa";
import Button from "@/components/common/Button";

export default function AdmissionResults() {
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (portalRef.current) {
      gsap.fromTo(
        portalRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.6 }
      );
    }
  }, []);

  const handleClick = () => {
    if (portalRef.current) {
      gsap.to(portalRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }
  };

  return (
    <div ref={portalRef} className="flex items-center">
      <Button
        variant="primary"
        size="md"
        className="flex items-center space-x-2"
        onClick={handleClick}
        rightIcon={FaArrowRight}
        href="https://drive.google.com/file/u/2/d/1bKewdaBGJL3HNw0Nhv9aC5qCEymdtEzq/view?usp=sharing"
        target="_blank"
      >
        <span className="text-sm font-medium">Resultados de Admisión</span>
      </Button>
    </div>
  );
}
