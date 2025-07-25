"use client";

import Image from "next/image";
import { HeroSectionProps } from "@/types";

export function HeroSection({ title, backgroundImage }: HeroSectionProps) {
  return (
    <section className="relative h-96 flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Universidad Nacional San Luis Gonzaga de Ica"
          className="w-full h-full object-cover"
          height={400}
          width={800}
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl font-bold mb-4">{title}</h1>
      </div>
    </section>
  );
}
