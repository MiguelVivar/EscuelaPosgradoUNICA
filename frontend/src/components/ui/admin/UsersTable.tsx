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
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="text-center py-8 text-gray-500">
          No se encontraron usuarios para el rol seleccionado
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
      <div className="overflow-x-auto">
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
    </div>
  );
}
