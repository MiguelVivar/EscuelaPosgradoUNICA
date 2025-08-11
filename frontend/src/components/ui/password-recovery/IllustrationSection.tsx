import React from "react";
import Image from "next/image";
import rpfondoImg from "@/assets/rpfondo.png";

interface IllustrationSectionProps {
  className?: string;
}

export default function IllustrationSection({
  className = "",
}: IllustrationSectionProps) {
  return (
    <section
      className={`hidden lg:flex lg:w-2/3 items-center justify-center relative overflow-hidden ${className}`}
    >
      <Image
        src={rpfondoImg}
        alt="Personas trabajando"
        className="object-cover"
        height={400}
        width={800}
      />
      {/* Formas geométricas flotantes */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/60 rounded-full rotate-12 drop-shadow-xl"></div>
      <div className="absolute bottom-16 left-16 w-20 h-20 bg-amber-300 rounded-full -rotate-6 drop-shadow-lg"></div>
    </section>
  );
}
