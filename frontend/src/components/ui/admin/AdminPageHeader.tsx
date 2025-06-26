"use client";

import Button from "@/components/common/Button";
import { AdminPageHeaderProps } from "@/types/Admin";

export default function AdminPageHeader({
  user,
  onLogout,
}: AdminPageHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {user.role === "ADMIN"
              ? "Panel de Administración"
              : "Panel de Coordinación"}
          </h1>
          <p className="text-gray-600">
            Bienvenido/a,{" "}
            <span className="font-semibold text-blue-600">
              {user.nombres} {user.apellidos}
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {user.role} • Escuela de Posgrado UNICA
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="danger" size="md" onClick={onLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
