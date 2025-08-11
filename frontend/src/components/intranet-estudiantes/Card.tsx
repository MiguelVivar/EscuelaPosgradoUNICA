"use client";

// Componente Card para las vistas de Intranet Estudiantes
import { ReactNode } from "react";

interface CardProps {
  title: string;
  description: string;
  status: ReactNode;
  color: "amber" | "red" | "zinc";
  icon: ReactNode;
  onClick: () => void;
}

const colorMap = {
  amber: "bg-amber-500 border-amber-400",
  red: "bg-red-500 border-red-400",
  zinc: "bg-zinc-500 border-zinc-400",
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
      className={`relative flex flex-col justify-between rounded-xl border-2 ${colorMap[color]} shadow-lg overflow-hidden min-h-[260px] transition-transform hover:scale-105 cursor-pointer`}
      onClick={onClick}
    >
      <div className={`flex items-center justify-between p-4 pb-0`}> 
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black/80 text-white text-2xl">
          {icon}
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-black/80 rounded-bl-3xl flex items-center justify-center">
          <span className="text-white text-2xl">➔</span>
        </div>
      </div>
      <div className="flex-1 p-4 pt-2 flex flex-col gap-2">
        <h2 className="text-white text-xl font-bold">{title}</h2>
        <p className="text-zinc-200 text-sm">{description}</p>
        <div className="mt-2">
          <div className="bg-neutral-800 rounded-lg p-3 text-white text-base font-semibold">
            {status}
          </div>
        </div>
      </div>
      <div className="p-4 pt-0">
        <button className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors">
          Ingresar <span className="text-xl">→</span>
        </button>
      </div>
    </div>
  );
}
