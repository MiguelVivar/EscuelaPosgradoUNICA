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
    <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-4 sm:p-5 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
          Gestión de Usuarios
        </h2>
        
        <div className="flex flex-col gap-3">
          {/* Primera fila: Botón crear y checkbox */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {userRole === 'ADMIN' && (
              <Button
                variant="primary"
                size="md"
                onClick={onCreateUser}
                className="bg-green-500 hover:bg-green-600 w-full sm:w-auto order-1 sm:order-none"
              >
                <span className="hidden sm:inline">Crear Usuario</span>
                <span className="sm:hidden">+ Usuario</span>
              </Button>
            )}
            
            {userRole === 'ADMIN' && (
              <label className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 cursor-pointer text-sm sm:text-base order-2 sm:order-none">
                <input
                  type="checkbox"
                  checked={showInactiveUsers}
                  onChange={(e) => onToggleInactive(e.target.checked)}
                  className="rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-700">
                  <span className="hidden sm:inline">Incluir inactivos</span>
                  <span className="sm:hidden">Inactivos</span>
                </span>
              </label>
            )}
          </div>
          
          {/* Segunda fila: Select y botón filtrar */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <select
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value as Role | 'ALL')}
              className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
              className="w-full sm:w-auto"
            >
              <span className="hidden sm:inline">Filtrar</span>
              <span className="sm:hidden">🔍</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
