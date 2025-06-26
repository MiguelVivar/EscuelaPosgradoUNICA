"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, getAuthHeaders } from "@/lib/api";
import { UsuarioResponse, MessageResponse, Role } from "@/types/auth";
import Swal from 'sweetalert2';

interface UserStats {
  totalUsuarios: number;
  admins: number;
  docentes: number;
  alumnos: number;
  coordinadores: number;
  postulantes: number;
}

interface UserFormData {
  nombres: string;
  apellidos: string;
  email: string;
  username: string;
  password?: string;
  role: Role;
  codigoEstudiante?: string;
  codigoDocente?: string;
}

export default function AdminCampusPage() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | 'ALL'>('ALL');
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioResponse | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    nombres: '',
    apellidos: '',
    email: '',
    username: '',
    password: '',
    role: 'POSTULANTE',
    codigoEstudiante: '',
    codigoDocente: ''
  });

  // Verificar acceso
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/iniciar-sesion");
        return;
      }
      
      // Solo permitir acceso a ADMIN y COORDINADOR
      if (user && user.role !== 'ADMIN' && user.role !== 'COORDINADOR') {
        router.push("/campus-virtual");
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  const loadUsers = useCallback(async () => {
    try {
      const endpoint = selectedRole === 'ALL' 
        ? (user?.role === 'ADMIN' ? '/api/admin/usuarios' : '/api/coordinador/resumen')
        : user?.role === 'ADMIN' 
          ? `/api/admin/usuarios/rol/${selectedRole}`
          : `/api/coordinador/${selectedRole.toLowerCase()}s`;

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        if (selectedRole === 'ALL' && user?.role !== 'ADMIN') {
          // Para coordinadores, cargar todos los tipos por separado
          const [docentes, alumnos, postulantes, coordinadores] = await Promise.all([
            fetch(`${API_CONFIG.BASE_URL}/api/coordinador/docentes`, { headers: getAuthHeaders() }).then(r => r.json()),
            fetch(`${API_CONFIG.BASE_URL}/api/coordinador/alumnos`, { headers: getAuthHeaders() }).then(r => r.json()),
            fetch(`${API_CONFIG.BASE_URL}/api/coordinador/postulantes`, { headers: getAuthHeaders() }).then(r => r.json()),
            fetch(`${API_CONFIG.BASE_URL}/api/coordinador/coordinadores`, { headers: getAuthHeaders() }).then(r => r.json())
          ]);
          setUsuarios([...docentes, ...alumnos, ...postulantes, ...coordinadores]);
        } else {
          const data = await response.json();
          setUsuarios(Array.isArray(data) ? data : []);
        }
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar la lista de usuarios');
    }
  }, [selectedRole, user?.role]);

  // Cargar datos administrativos
  const loadAdminData = useCallback(async () => {
    try {
      setLoadingData(true);
      setError(null);
      
      // Cargar estadísticas (solo para ADMIN)
      if (user?.role === 'ADMIN') {
        const statsResponse = await fetch(`${API_CONFIG.BASE_URL}/api/admin/estadisticas`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        
        if (statsResponse.ok) {
          const statsData: MessageResponse = await statsResponse.json();
          // Parsear las estadísticas del mensaje
          const statsMatch = statsData.message.match(/Total: (\d+), Admins: (\d+), Docentes: (\d+), Alumnos: (\d+), Coordinadores: (\d+), Postulantes: (\d+)/);
          if (statsMatch) {
            setStats({
              totalUsuarios: parseInt(statsMatch[1]),
              admins: parseInt(statsMatch[2]),
              docentes: parseInt(statsMatch[3]),
              alumnos: parseInt(statsMatch[4]),
              coordinadores: parseInt(statsMatch[5]),
              postulantes: parseInt(statsMatch[6])
            });
          }
        }
      }

      // Cargar usuarios
      await loadUsers();
    } catch (error) {
      console.error('Error al cargar datos administrativos:', error);
      setError('Error al cargar los datos administrativos');
    } finally {
      setLoadingData(false);
    }
  }, [user?.role, loadUsers]);

  useEffect(() => {
    if (isAuthenticated && user && (user.role === 'ADMIN' || user.role === 'COORDINADOR')) {
      loadAdminData();
    }
  }, [isAuthenticated, user, loadAdminData]);

  const toggleUserStatus = async (userId: number, isActive: boolean) => {
    if (user?.role !== 'ADMIN') return;
    
    const result = await Swal.fire({
      title: isActive ? '¿Desactivar usuario?' : '¿Activar usuario?',
      text: isActive 
        ? 'El usuario no podrá acceder al sistema' 
        : 'El usuario podrá acceder al sistema nuevamente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isActive ? '#dc2626' : '#16a34a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: isActive ? 'Sí, desactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;
    
    try {
      const endpoint = isActive ? 'desactivar' : 'activar';
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/usuarios/${userId}/${endpoint}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        await loadUsers();
        await Swal.fire({
          title: '¡Éxito!',
          text: `Usuario ${isActive ? 'desactivado' : 'activado'} correctamente`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo cambiar el estado del usuario',
        icon: 'error'
      });
    }
  };

  const openCreateModal = () => {
    setFormData({
      nombres: '',
      apellidos: '',
      email: '',
      username: '',
      password: '',
      role: 'POSTULANTE',
      codigoEstudiante: '',
      codigoDocente: ''
    });
    setShowCreateModal(true);
  };

  const openEditModal = (usuario: UsuarioResponse) => {
    setEditingUser(usuario);
    setFormData({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      username: usuario.username,
      role: usuario.role,
      codigoEstudiante: usuario.codigoEstudiante || '',
      codigoDocente: usuario.codigoDocente || ''
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombres || !formData.apellidos || !formData.email || !formData.username) {
      await Swal.fire({
        title: 'Error',
        text: 'Por favor completa todos los campos obligatorios',
        icon: 'error'
      });
      return;
    }

    if (showCreateModal && !formData.password) {
      await Swal.fire({
        title: 'Error',
        text: 'La contraseña es obligatoria para nuevos usuarios',
        icon: 'error'
      });
      return;
    }

    try {
      const endpoint = showCreateModal 
        ? '/api/admin/usuarios' 
        : `/api/admin/usuarios/${editingUser?.id}`;
      
      const method = showCreateModal ? 'POST' : 'PUT';
      
      const body = showCreateModal 
        ? formData 
        : { ...formData, password: undefined }; // No enviar password en edición

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method,
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await loadUsers();
        if (user?.role === 'ADMIN') {
          await loadAdminData();
        }
        
        setShowCreateModal(false);
        setShowEditModal(false);
        setEditingUser(null);
        
        await Swal.fire({
          title: '¡Éxito!',
          text: showCreateModal 
            ? 'Usuario creado correctamente' 
            : 'Usuario actualizado correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el servidor');
      }
    } catch (error: unknown) {
      console.error('Error al guardar usuario:', error);
      await Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'No se pudo guardar el usuario',
        icon: 'error'
      });
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel administrativo...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || (user.role !== 'ADMIN' && user.role !== 'COORDINADOR')) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 mt-20">
      <div className="min-h-screen container mx-auto px-4 py-8">
        {/* Header del Panel Administrativo */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {user.role === 'ADMIN' ? 'Panel de Administración' : 'Panel de Coordinación'}
              </h1>
              <p className="text-gray-600">
                Bienvenido/a, <span className="font-semibold text-blue-600">{user.nombres} {user.apellidos}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {user.role} • Escuela de Posgrado UNICA
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/campus-virtual')}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Campus Virtual
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Estadísticas - Solo para ADMIN */}
        {user.role === 'ADMIN' && stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsuarios}</div>
              <div className="text-sm text-gray-600">Total Usuarios</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
              <div className="text-sm text-gray-600">Administradores</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-4">
              <div className="text-2xl font-bold text-green-600">{stats.docentes}</div>
              <div className="text-sm text-gray-600">Docentes</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-4">
              <div className="text-2xl font-bold text-amber-600">{stats.alumnos}</div>
              <div className="text-sm text-gray-600">Alumnos</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-4">
              <div className="text-2xl font-bold text-indigo-600">{stats.coordinadores}</div>
              <div className="text-sm text-gray-600">Coordinadores</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.postulantes}</div>
              <div className="text-sm text-gray-600">Postulantes</div>
            </div>
          </div>
        )}

        {/* Filtros y Gestión de Usuarios */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">
              Gestión de Usuarios
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.role === 'ADMIN' && (
                <button
                  onClick={openCreateModal}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Crear Usuario
                </button>
              )}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role | 'ALL')}
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
              <button
                onClick={loadUsers}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Filtrar
              </button>
            </div>
          </div>

          {/* Lista de Usuarios */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuario</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rol</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Último Acceso</th>
                  {user.role === 'ADMIN' && (
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {usuario.nombres} {usuario.apellidos}
                        </div>
                        <div className="text-sm text-gray-500">@{usuario.username}</div>
                        {usuario.codigoEstudiante && (
                          <div className="text-xs text-blue-600">Est: {usuario.codigoEstudiante}</div>
                        )}
                        {usuario.codigoDocente && (
                          <div className="text-xs text-green-600">Doc: {usuario.codigoDocente}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{usuario.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        usuario.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        usuario.role === 'COORDINADOR' ? 'bg-indigo-100 text-indigo-800' :
                        usuario.role === 'DOCENTE' ? 'bg-green-100 text-green-800' :
                        usuario.role === 'ALUMNO' ? 'bg-amber-100 text-amber-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {usuario.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {usuario.ultimoAcceso 
                        ? new Date(usuario.ultimoAcceso).toLocaleDateString()
                        : 'N/A'
                      }
                    </td>
                    {user.role === 'ADMIN' && (
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(usuario)}
                            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-xs font-medium transition-colors duration-200"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => toggleUserStatus(usuario.id, usuario.activo)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                              usuario.activo
                                ? 'bg-red-100 hover:bg-red-200 text-red-800'
                                : 'bg-green-100 hover:bg-green-200 text-green-800'
                            }`}
                          >
                            {usuario.activo ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {usuarios.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron usuarios para el rol seleccionado
              </div>
            )}
          </div>
        </div>

        {/* Información del Panel */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Panel de {user.role === 'ADMIN' ? 'Administración' : 'Coordinación'}</h3>
          <p className="text-blue-700 text-sm">
            {user.role === 'ADMIN' 
              ? 'Como administrador, tienes acceso completo para gestionar todos los usuarios del sistema, ver estadísticas y activar/desactivar cuentas.'
              : 'Como coordinador, puedes visualizar y gestionar información de docentes, alumnos y postulantes del sistema académico.'
            }
          </p>
        </div>

        {/* Espaciador para el footer */}
        <div className="h-20"></div>

        {/* Modal para Crear Usuario */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-gray-800">Crear Nuevo Usuario</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombres *
                      </label>
                      <input
                        type="text"
                        value={formData.nombres}
                        onChange={(e) => setFormData({...formData, nombres: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ingrese los nombres"
                        title="Nombres del usuario"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellidos *
                      </label>
                      <input
                        type="text"
                        value={formData.apellidos}
                        onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ingrese los apellidos"
                        title="Apellidos del usuario"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="correo@ejemplo.com"
                        title="Correo electrónico del usuario"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Usuario *
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nombre de usuario"
                        title="Nombre de usuario para el sistema"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña *
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Contraseña del usuario"
                        title="Contraseña para el usuario"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol *
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        title="Seleccione el rol del usuario"
                        required
                      >
                        <option value="POSTULANTE">Postulante</option>
                        <option value="ALUMNO">Alumno</option>
                        <option value="DOCENTE">Docente</option>
                        <option value="COORDINADOR">Coordinador</option>
                        <option value="ADMIN">Administrador</option>
                      </select>
                    </div>
                    
                    {(formData.role === 'ALUMNO' || formData.role === 'POSTULANTE') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Código de Estudiante
                        </label>
                        <input
                          type="text"
                          value={formData.codigoEstudiante}
                          onChange={(e) => setFormData({...formData, codigoEstudiante: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Código de estudiante"
                          title="Código único del estudiante"
                        />
                      </div>
                    )}
                    
                    {formData.role === 'DOCENTE' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Código de Docente
                        </label>
                        <input
                          type="text"
                          value={formData.codigoDocente}
                          onChange={(e) => setFormData({...formData, codigoDocente: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Código de docente"
                          title="Código único del docente"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      Crear Usuario
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal para Editar Usuario */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-gray-800">Editar Usuario</h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombres *
                      </label>
                      <input
                        type="text"
                        value={formData.nombres}
                        onChange={(e) => setFormData({...formData, nombres: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ingrese los nombres"
                        title="Nombres del usuario"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellidos *
                      </label>
                      <input
                        type="text"
                        value={formData.apellidos}
                        onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ingrese los apellidos"
                        title="Apellidos del usuario"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="correo@ejemplo.com"
                        title="Correo electrónico del usuario"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Usuario *
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nombre de usuario"
                        title="Nombre de usuario para el sistema"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol *
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        title="Seleccione el rol del usuario"
                        required
                      >
                        <option value="POSTULANTE">Postulante</option>
                        <option value="ALUMNO">Alumno</option>
                        <option value="DOCENTE">Docente</option>
                        <option value="COORDINADOR">Coordinador</option>
                        <option value="ADMIN">Administrador</option>
                      </select>
                    </div>
                    
                    {(formData.role === 'ALUMNO' || formData.role === 'POSTULANTE') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Código de Estudiante
                        </label>
                        <input
                          type="text"
                          value={formData.codigoEstudiante}
                          onChange={(e) => setFormData({...formData, codigoEstudiante: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Código de estudiante"
                          title="Código único del estudiante"
                        />
                      </div>
                    )}
                    
                    {formData.role === 'DOCENTE' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Código de Docente
                        </label>
                        <input
                          type="text"
                          value={formData.codigoDocente}
                          onChange={(e) => setFormData({...formData, codigoDocente: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Código de docente"
                          title="Código único del docente"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                    <p className="text-amber-700 text-sm">
                      <strong>Nota:</strong> Para cambiar la contraseña, debe hacerse a través de un proceso separado de seguridad.
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      Actualizar Usuario
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
