"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import { AdminPageHeaderProps } from "@/types/Admin";



export default function AdminPageHeader({ user, onLogout }: AdminPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-0">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
            {user.role === 'ADMIN' ? 'Panel de Administración' : 'Panel de Coordinación'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 break-words">
            Bienvenido/a, <span className="font-semibold text-blue-600">{user.nombres} {user.apellidos}</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {user.role} • Escuela de Posgrado UNICA
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:flex-shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => router.push('/campus-virtual')}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            Campus Virtual
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={onLogout}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
