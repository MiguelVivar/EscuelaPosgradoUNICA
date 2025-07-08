"use client";

import { SidebarProps } from "@/types";
import SidebarItem from "./SidebarItem";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logoUNICA from "@/assets/logoUNICA.png";

export default function Sidebar({
  items,
  className = "",
  width = "narrow",
  position = "left",
  backgroundColor = "bg-zinc-900/95",
}: SidebarProps) {
  const pathname = usePathname();
  
  // Determinar el estilo del sidebar según la página actual
  const getSidebarVariant = () => {
    if (pathname.startsWith("/campus-virtual/admin")) {
      return {
        backgroundColor: "bg-zinc-900/95",
        borderColor: "border-zinc-700/50",
        accentColor: "bg-zinc-600"
      };
    }
    if (pathname.startsWith("/campus-virtual/perfil")) {
      return {
        backgroundColor: "bg-zinc-900/95",
        borderColor: "border-zinc-700/50",
        accentColor: "bg-zinc-600"
      };
    }
    // Default para la página principal
    return {
      backgroundColor: backgroundColor,
      borderColor: "border-zinc-700/50",
      accentColor: "bg-zinc-600"
    };
  };

  const variant = getSidebarVariant();

  const sidebarClasses = `
    fixed top-0 ${position === "left" ? "left-0" : "right-0"}
    h-screen ${variant.backgroundColor} backdrop-blur-xl
    border-r ${variant.borderColor}
    ${width === "narrow" ? "w-16" : "w-64"}
    flex flex-col
    transition-all duration-300 ease-in-out
    z-40 shadow-2xl
    ${className}
  `;

  // Obtener el texto del header según la página
  const getHeaderText = () => {
    if (pathname.startsWith("/campus-virtual/admin")) {
      return width === "wide" ? "Administración" : "A";
    }
    if (pathname.startsWith("/campus-virtual/cursos-gestion")) {
      return width === "wide" ? "Gestión Cursos" : "C";
    }
    if (pathname.startsWith("/campus-virtual/mis-cursos")) {
      return width === "wide" ? "Mis Cursos" : "MC";
    }
    if (pathname.startsWith("/campus-virtual/perfil")) {
      return width === "wide" ? "Mi Perfil" : "P";
    }
    return width === "wide" ? "Menu" : "M";
  };

  return (
    <aside className={sidebarClasses}>
      {/* Header/Logo area */}
      <div className={`
        ${width === "narrow" ? "h-16" : "h-20"}
        flex items-center justify-center
        border-b ${variant.borderColor} mb-2
      `}>
        {width === "wide" ? (
          <Link href="/" className="text-white font-bold text-lg px-4 hover:text-amber-400 transition-colors cursor-pointer">
            {getHeaderText()}
          </Link>
        ) : (
          <Link href="/" className={`w-10 h-10 ${variant.accentColor} rounded-lg flex items-center justify-center p-1 hover:opacity-80 transition-opacity cursor-pointer`}>
            <Image
              src={logoUNICA}
              alt="Logo UNICA"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
          </Link>
        )}
      </div>

      {/* Navigation items */}
      <nav className="flex-1 py-2">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <SidebarItem {...item} width={width} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer area (optional) */}
      <div className={`
        ${width === "narrow" ? "h-16" : "h-20"}
        border-t ${variant.borderColor}
        flex items-center justify-center
      `}>
        {width === "wide" && (
          <div className="text-zinc-400 text-xs px-4 text-center">
            Escuela de Posgrado
          </div>
        )}
      </div>
    </aside>
  );
}