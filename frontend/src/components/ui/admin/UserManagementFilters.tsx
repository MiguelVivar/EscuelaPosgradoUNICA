import { Role } from "@/types/auth";
import Button from "@/components/common/Button";
import { UserManagementFiltersProps } from "@/types/Admin";

export default function UserManagementFilters({
  selectedRole,
  showInactiveUsers,
  userRole,
  searchText,
  isSearching = false,
  onRoleChange,
  onToggleInactive,
  onCreateUser,
  onFilterUsers,
  onSearchChange,
  onSearchUsers
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

          {/* Tercera fila: Buscador */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSearchUsers()}
                placeholder="Buscar por nombres y apellidos... (mínimo 2 caracteres)"
                className="w-full px-3 sm:px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchText && (
                <button
                  onClick={() => {
                    onSearchChange('');
                    onFilterUsers(); // Recargar todos los usuarios
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  title="Limpiar búsqueda"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            <Button
              variant="secondary"
              size="md"
              onClick={onSearchUsers}
              className="w-full sm:w-auto"
              disabled={!searchText.trim() || isSearching}
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="hidden sm:inline">Buscando...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Buscar</span>
                  <span className="sm:hidden">🔍</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
