import Button from "@/components/common/Button";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";
import { UsersTableProps } from "@/types/Admin";

export default function UsersTable({
  users,
  userRole,
  onEditUser,
  onToggleUserStatus,
}: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
        <div className="text-center py-6 sm:py-8 text-gray-500">
          <div className="text-4xl sm:text-5xl mb-3">👥</div>
          <p className="text-sm sm:text-base">No se encontraron usuarios para el rol seleccionado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
      {/* Vista de tabla para desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Usuario
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Email
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Rol
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Estado
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Último Acceso
              </th>
              {userRole === "ADMIN" && (
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((usuario) => (
              <tr
                key={usuario.id}
                className="border-b border-gray-100 hover:bg-gray-50/50"
              >
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {usuario.nombres} {usuario.apellidos}
                    </div>
                    <div className="text-sm text-gray-500">
                      @{usuario.username}
                    </div>
                    {usuario.codigoEstudiante && (
                      <div className="text-xs text-blue-600">
                        Est: {usuario.codigoEstudiante}
                      </div>
                    )}
                    {usuario.codigoDocente && (
                      <div className="text-xs text-green-600">
                        Doc: {usuario.codigoDocente}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-700">{usuario.email}</td>
                <td className="py-3 px-4">
                  <RoleBadge role={usuario.role} />
                </td>
                <td className="py-3 px-4">
                  <StatusBadge isActive={usuario.activo} />
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {usuario.ultimoAcceso
                    ? new Date(usuario.ultimoAcceso).toLocaleDateString()
                    : "N/A"}
                </td>
                {userRole === "ADMIN" && (
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEditUser(usuario)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800"
                      >
                        Editar
                      </Button>
                      <Button
                        variant={usuario.activo ? "danger" : "primary"}
                        size="sm"
                        onClick={() =>
                          onToggleUserStatus(usuario.id, usuario.activo)
                        }
                        className={
                          usuario.activo
                            ? "bg-red-100 hover:bg-red-200 text-red-800"
                            : "bg-green-600 hover:bg-green-800 text-green-800"
                        }
                      >
                        {usuario.activo ? "Desactivar" : "Activar"}
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de tarjetas para móvil y tablet */}
      <div className="lg:hidden space-y-3 sm:space-y-4">
        {users.map((usuario) => (
          <div
            key={usuario.id}
            className="bg-gray-50/70 rounded-lg p-3 sm:p-4 border border-gray-200"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              {/* Información principal */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                    {usuario.nombres} {usuario.apellidos}
                  </h3>
                  <div className="flex gap-2">
                    <RoleBadge role={usuario.role} />
                    <StatusBadge isActive={usuario.activo} />
                  </div>
                </div>
                
                <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Usuario:</span>
                    <span>@{usuario.username}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 break-all">
                    <span className="font-medium">Email:</span>
                    <span>{usuario.email}</span>
                  </div>
                  
                  {usuario.codigoEstudiante && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-blue-600">Estudiante:</span>
                      <span className="text-blue-600">{usuario.codigoEstudiante}</span>
                    </div>
                  )}
                  
                  {usuario.codigoDocente && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-green-600">Docente:</span>
                      <span className="text-green-600">{usuario.codigoDocente}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Último acceso:</span>
                    <span>
                      {usuario.ultimoAcceso
                        ? new Date(usuario.ultimoAcceso).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              {userRole === "ADMIN" && (
                <div className="flex flex-col sm:flex-col gap-2 sm:w-auto">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEditUser(usuario)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs sm:text-sm px-2 sm:px-3 py-1"
                  >
                    Editar
                  </Button>
                  <Button
                    variant={usuario.activo ? "danger" : "primary"}
                    size="sm"
                    onClick={() =>
                      onToggleUserStatus(usuario.id, usuario.activo)
                    }
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-1 ${
                      usuario.activo
                        ? "bg-red-100 hover:bg-red-200 text-red-800"
                        : "bg-green-100 hover:bg-green-200 text-green-800"
                    }`}
                  >
                    {usuario.activo ? "Desactivar" : "Activar"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
