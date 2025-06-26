import { UserStats, StatsCardProps } from "@/types/Admin";

function StatsCard({ title, value, color }: StatsCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-4">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
}

interface UserStatsGridProps {
  stats: UserStats;
}

export default function UserStatsGrid({ stats }: UserStatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <StatsCard title="Total Usuarios" value={stats.totalUsuarios} color="text-blue-600" />
      <StatsCard title="Administradores" value={stats.admins} color="text-purple-600" />
      <StatsCard title="Docentes" value={stats.docentes} color="text-green-600" />
      <StatsCard title="Alumnos" value={stats.alumnos} color="text-amber-600" />
      <StatsCard title="Coordinadores" value={stats.coordinadores} color="text-indigo-600" />
      <StatsCard title="Postulantes" value={stats.postulantes} color="text-orange-600" />
    </div>
  );
}
