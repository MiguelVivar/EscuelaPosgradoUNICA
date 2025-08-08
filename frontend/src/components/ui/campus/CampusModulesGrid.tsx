"use client";

import { CampusModulesGridProps } from "@/types";
import CampusModuleCard from "./CampusModuleCard";
import AdminModuleCard from "./AdminModuleCard";

export default function CampusModulesGrid({ 
  modules, 
  userRole, 
  onAdminClick 
}: CampusModulesGridProps) {
  const isAdminOrCoordinator = userRole === 'COORDINADOR' || userRole === 'ADMIN';

  return (
    <div className={`flex flex-col ${!isAdminOrCoordinator ? 'items-center' : 'xl:flex-row'} gap-4 sm:gap-6`}>
      {/* Grid de 8 botones blancos - responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 w-full max-w-6xl">
        {modules.map((module) => (
          <CampusModuleCard 
            key={module.id} 
            module={module} 
          />
        ))}
      </div>

      {/* Botón ADMINISTRACIÓN - solo visible para COORDINADOR y ADMINISTRADOR */}
      {isAdminOrCoordinator && (
        <AdminModuleCard onClick={onAdminClick || (() => {})} />
      )}
    </div>
  );
}
