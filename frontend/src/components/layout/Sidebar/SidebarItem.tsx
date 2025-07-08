"use client";

import { useState } from "react";
import Link from "next/link";
import { SidebarItemComponentProps } from "@/types/Sidebar";


export default function SidebarItem({
  id, // eslint-disable-line @typescript-eslint/no-unused-vars
  icon,
  label,
  href,
  onClick,
  isActive = false,
  hasHover = false,
  hoverContent,
  width,
}: SidebarItemComponentProps) {
  const [showHover, setShowHover] = useState(false);

  const baseClasses = `
    group relative flex items-center justify-center
    ${width === "narrow" ? "w-16 h-16" : "w-full px-4 py-3"}
    text-white/80 hover:text-white
    transition-all duration-200 ease-in-out
    hover:bg-white/10
    ${isActive ? "bg-white/20 text-white" : ""}
  `;

  const iconClasses = `
    ${width === "narrow" ? "w-6 h-6" : "w-5 h-5 mr-3"}
    transition-transform duration-200
    group-hover:scale-110
  `;

  const handleMouseEnter = () => {
    if (hasHover && hoverContent) {
      setShowHover(true);
    }
  };

  const handleMouseLeave = () => {
    setShowHover(false);
  };

  const renderContent = () => (
    <div className={baseClasses}>
      <div className={iconClasses}>{icon}</div>
      {width === "wide" && (
        <span className="text-sm font-medium truncate">{label}</span>
      )}
      
      {/* Tooltip for narrow width */}
      {width === "narrow" && (
        <div className="
          absolute left-full ml-2 px-2 py-1
          bg-slate-800/90 text-white text-xs rounded
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          pointer-events-none z-50
          whitespace-nowrap
        ">
          {label}
        </div>
      )}

      {/* Hover content panel */}
      {hasHover && hoverContent && showHover && (
        <div className="
          absolute left-full ml-2 top-0
          bg-slate-800/95 backdrop-blur-sm
          rounded-lg shadow-xl border border-slate-600/50
          min-w-48 p-4 z-50
          transform transition-all duration-200
          opacity-100 scale-100
        ">
          {hoverContent.title && (
            <h3 className="text-white font-semibold text-sm mb-2">
              {hoverContent.title}
            </h3>
          )}
          {hoverContent.items && (
            <ul className="space-y-1">
              {hoverContent.items.map((item, index) => (
                <li
                  key={index}
                  className="text-slate-300 text-xs hover:text-white cursor-pointer"
                >
                  • {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {renderContent()}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {renderContent()}
    </button>
  );
}
