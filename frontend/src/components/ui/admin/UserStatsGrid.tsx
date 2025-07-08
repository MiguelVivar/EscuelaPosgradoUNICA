import { UserStats, StatsCardProps } from "@/types/Admin";

function StatsCard({ title, value, color }: StatsCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-lg sm:rounded-xl shadow-lg border border-white/20 p-3 sm:p-4 text-center">
      <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${color} mb-1`}>{value}</div>
      <div className="text-xs sm:text-sm text-gray-600 leading-tight">{title}</div>
    </div>
  );
}

interface UserStatsGridProps {
  stats: UserStats;
}

export default function UserStatsGrid({ stats }: UserStatsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
      <StatsCard title="Total Usuarios" value={stats.totalUsuarios} color="text-blue-600" />
      <StatsCard title="Administradores" value={stats.admins} color="text-purple-600" />
      <StatsCard title="Docentes" value={stats.docentes} color="text-green-600" />
      <StatsCard title="Alumnos" value={stats.alumnos} color="text-amber-600" />
      <StatsCard title="Coordinadores" value={stats.coordinadores} color="text-indigo-600" />
      <StatsCard title="Postulantes" value={stats.postulantes} color="text-orange-600" />
    </div>
  );
}
