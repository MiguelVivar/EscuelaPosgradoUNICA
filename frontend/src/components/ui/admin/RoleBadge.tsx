import { RoleBadgeProps } from "@/types/Admin";

export default function RoleBadge({ role }: RoleBadgeProps) {
  const roleStyles = {
    ADMIN: 'bg-purple-100 text-purple-800',
    COORDINADOR: 'bg-indigo-100 text-indigo-800',
    DOCENTE: 'bg-green-100 text-green-800',
    ALUMNO: 'bg-amber-100 text-amber-800',
    POSTULANTE: 'bg-orange-100 text-orange-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleStyles[role]}`}>
      {role}
    </span>
  );
}
