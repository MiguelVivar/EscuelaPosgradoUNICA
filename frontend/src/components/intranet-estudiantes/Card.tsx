"use client";

// Componente Card para las vistas de Intranet Estudiantes
import { ReactNode } from "react";

interface CardProps {
  title: string;
  description: string;
  status: ReactNode;
  color: "blue" | "orange" | "slate";
  icon: ReactNode;
  onClick: () => void;
}

const colorMap = {
  blue: "bg-white border-blue-200 hover:border-blue-300",
  orange: "bg-white border-orange-200 hover:border-orange-300", 
  slate: "bg-white border-gray-200 hover:border-gray-300",
};

const iconColorMap = {
  blue: "bg-blue-500",
  orange: "bg-orange-500",
  slate: "bg-gray-600",
};

export default function Card({
  title,
  description,
  status,
  color,
  icon,
  onClick,
}: CardProps) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl ${colorMap[color]} border-2 shadow-lg overflow-hidden min-h-[280px] transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group`}
      onClick={onClick}
    >
      {/* Header con icono */}
      <div className="flex items-center justify-between p-6 pb-4"> 
        <div className={`w-16 h-16 flex items-center justify-center rounded-2xl ${iconColorMap[color]} text-white text-3xl group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
          <span className="text-gray-600 text-lg font-bold">→</span>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 px-6 pb-4 flex flex-col gap-3">
        <h2 className="text-gray-800 text-xl font-bold leading-tight">{title}</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        
        {/* Status card */}
        <div className="mt-auto">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="text-gray-700 text-sm font-medium">
              {status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
