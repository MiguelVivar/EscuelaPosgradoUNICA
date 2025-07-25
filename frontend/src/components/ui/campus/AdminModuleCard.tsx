"use client";

import Link from "next/link";
import Image from "next/image";
import { AdminModuleCardProps } from "@/types";
import administracion from "@/assets/administracion.png";

export default function AdminModuleCard({ onClick }: AdminModuleCardProps) {
  return (
    <div className="w-full xl:w-auto xl:flex-1 xl:max-w-sm">
      <Link 
        className="bg-amber-500 text-red-500 border border-zinc-700/7 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 w-full h-full min-h-[160px] sm:min-h-[180px] lg:min-h-[200px] xl:min-h-[360px] transition-colors duration-200 flex flex-col items-center justify-center space-y-3 sm:space-y-4" 
        href="/campus-virtual/admin"
        onClick={onClick}
      >
        <div className="text-center">
          <h1 className="font-semibold text-white text-xl sm:text-2xl lg:text-3xl xl:text-4xl leading-tight">
            ADMINISTRACIÓN
          </h1>
        </div>
        <Image
          src={administracion}
          width={144}
          height={144}
          alt="Administración"
          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 object-contain"
        />
      </Link>
    </div>
  );
}
