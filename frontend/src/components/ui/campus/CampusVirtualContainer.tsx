"use client";

import { ReactNode } from "react";

interface CampusVirtualContainerProps {
  children: ReactNode;
}

export default function CampusVirtualContainer({ children }: CampusVirtualContainerProps) {
  return (
    <div>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 mt-16 sm:mt-20">
        <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
          {/* Espaciador para asegurar que el footer sea visible */}
          <div className="h-10 sm:h-16 lg:h-20"></div>
        </div>
      </div>
    </div>
  );
}
