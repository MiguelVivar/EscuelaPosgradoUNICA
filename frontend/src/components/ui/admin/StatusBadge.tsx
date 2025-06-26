import { StatusBadgeProps } from "@/types/Admin";

export default function StatusBadge({ isActive }: StatusBadgeProps) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {isActive ? 'Activo' : 'Inactivo'}
    </span>
  );
}
