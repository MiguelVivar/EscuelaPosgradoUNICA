"use client";

import { SectionHeaderProps } from "@/types";

export function SectionHeader({
  title,
  subtitle = "EPG - UNICA",
}: SectionHeaderProps) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-4 mb-6">
        <div className="h-px bg-amber-500 w-12"></div>
        <span className="text-amber-600 font-medium text-lg">{subtitle}</span>
        <div className="h-px bg-amber-500 w-12"></div>
      </div>
      <h2 className="text-4xl font-bold text-gray-800 mb-8">{title}</h2>
    </div>
  );
}
