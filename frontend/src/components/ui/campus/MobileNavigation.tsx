"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebarConfig } from "@/hooks/useSidebar";
import { 
  FaBars, 
  FaTimes, 
  FaSignOutAlt 
} from 'react-icons/fa';

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const sidebarConfig = useSidebarConfig();

  const handleLogout = () => {
    logout();
    router.push("/iniciar-sesion");
    setIsOpen(false);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <>
      {/* Mobile menu button - Only visible on mobile */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-zinc-900/90 backdrop-blur-sm text-white rounded-xl shadow-lg hover:bg-zinc-800/90 transition-colors"
        >
          {isOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile menu */}
      <div className={`sm:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-zinc-900/95 backdrop-blur-xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-zinc-700/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Campus Virtual</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/70 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <div className="text-white/80 text-sm">
              <p className="font-medium">{user.nombres} {user.apellidos}</p>
              <p className="text-white/60">{user.role}</p>
            </div>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 py-4">
            <ul className="space-y-2 px-4">
              {sidebarConfig.items.map((item) => {
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => item.href && handleNavigation(item.href)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="text-lg flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-zinc-700/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              <FaSignOutAlt className="text-lg" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
