import { Role } from "@/types/auth";
import Button from "@/components/common/Button";
import { UserManagementFiltersProps } from "@/types/Admin";

export default function UserManagementFilters({
  selectedRole,
  showInactiveUsers,
  userRole,
  onRoleChange,
  onToggleInactive,
  onCreateUser,
  onFilterUsers
}: UserManagementFiltersProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">
          Gestión de Usuarios
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {userRole === 'ADMIN' && (
            <Button
              variant="primary"
              size="md"
              onClick={onCreateUser}
              className="bg-green-500 hover:bg-green-600"
            >
              Crear Usuario
            </Button>
          )}
          
          {userRole === 'ADMIN' && (
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 cursor-pointer">
              <input
                type="checkbox"
                checked={showInactiveUsers}
                onChange={(e) => onToggleInactive(e.target.checked)}
                className="rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Incluir inactivos</span>
            </label>
          )}
          
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value as Role | 'ALL')}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            title="Filtrar usuarios por rol"
          >
            <option value="ALL">Todos los Roles</option>
            <option value="ADMIN">Administradores</option>
            <option value="COORDINADOR">Coordinadores</option>
            <option value="DOCENTE">Docentes</option>
            <option value="ALUMNO">Alumnos</option>
            <option value="POSTULANTE">Postulantes</option>
          </select>
          
          <Button
            variant="primary"
            size="md"
            onClick={onFilterUsers}
          >
            Filtrar
          </Button>
        </div>
      </div>
    </div>
  );
}
