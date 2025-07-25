"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface ModuleCardProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function ModuleCard({ 
  href, 
  children, 
  className = "", 
  onClick 
}: ModuleCardProps) {
  const baseClasses = "bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 hover:bg-white/90 transition-colors duration-200 flex flex-col items-center justify-center";

  return (
    <Link 
      className={`${baseClasses} ${className}`}
      href={href}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
