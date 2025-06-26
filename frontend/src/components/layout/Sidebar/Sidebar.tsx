"use client";

import { SidebarProps } from "@/types";
import SidebarItem from "./SidebarItem";

export default function Sidebar({
  items,
  className = "",
  width = "narrow",
  position = "left",
  backgroundColor = "bg-zinc-900/95",
}: SidebarProps) {
  const sidebarClasses = `
    fixed top-0 ${position === "left" ? "left-0" : "right-0"}
    h-screen ${backgroundColor} backdrop-blur-xl
    border-r border-zinc-700/50
    ${width === "narrow" ? "w-16" : "w-64"}
    flex flex-col
    transition-all duration-300 ease-in-out
    z-40 shadow-2xl
    ${className}
  `;

  return (
    <aside className={sidebarClasses}>
      {/* Header/Logo area */}
      <div className={`
        ${width === "narrow" ? "h-16" : "h-20"}
        flex items-center justify-center
        border-b border-zinc-700/50 mb-2
      `}>
        {width === "wide" ? (
          <div className="text-white font-bold text-lg px-4">
            Menu
          </div>
        ) : (
          <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
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
        border-t border-zinc-700/50
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