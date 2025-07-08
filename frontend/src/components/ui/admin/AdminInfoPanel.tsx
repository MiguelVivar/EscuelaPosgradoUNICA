import { AdminInfoPanelProps } from "@/types/Admin";

export default function AdminInfoPanel({ userRole }: AdminInfoPanelProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
      <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
        Panel de {userRole === 'ADMIN' ? 'Administración' : 'Coordinación'}
      </h3>
      <p className="text-blue-700 text-xs sm:text-sm leading-relaxed">
        {userRole === 'ADMIN' 
          ? 'Como administrador, tienes acceso completo para gestionar todos los usuarios del sistema, ver estadísticas y activar/desactivar cuentas.'
          : 'Como coordinador, puedes visualizar y gestionar información de docentes, alumnos y postulantes del sistema académico.'
        }
      </p>
    </div>
  );
}
