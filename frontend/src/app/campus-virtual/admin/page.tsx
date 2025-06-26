"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, getAuthHeaders } from "@/lib/api";
import { UsuarioResponse, MessageResponse, Role } from "@/types/auth";
import Swal from 'sweetalert2';
import {
  AdminPageHeader,
  UserStatsGrid,
  UserManagementFilters,
  UsersTable,
  UserFormModal,
  AdminInfoPanel,
  ErrorMessage,
  AdminLoading
} from "@/components/ui/admin";
import { UserStats} from "@/types/Admin";

export default function AdminCampusPage() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | 'ALL'>('ALL');
  const [showInactiveUsers, setShowInactiveUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioResponse | null>(null);

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
      console.log('Loading users with:', {
        selectedRole,
        showInactiveUsers,
        userRole: user?.role
      });

      const baseEndpoint = selectedRole === 'ALL' 
        ? (user?.role === 'ADMIN' ? '/api/admin/usuarios' : '/api/coordinador/resumen')
        : user?.role === 'ADMIN' 
          ? `/api/admin/usuarios/rol/${selectedRole}`
          : `/api/coordinador/${selectedRole.toLowerCase()}s`;
      
      // Si showInactiveUsers está habilitado y es admin, usar los endpoints que incluyen inactivos
      const endpoint = showInactiveUsers && user?.role === 'ADMIN' 
        ? (selectedRole === 'ALL' ? '/api/admin/usuarios/all' : `/api/admin/usuarios/rol/${selectedRole}/all`)
        : baseEndpoint;

      console.log('Using endpoint:', endpoint);

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
          console.log('Received data:', data);
          setUsuarios(Array.isArray(data) ? data : []);
        }
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar la lista de usuarios');
    }
  }, [selectedRole, showInactiveUsers, user?.role]);

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

  // Effect para recargar usuarios cuando cambie el filtro de inactivos
  useEffect(() => {
    if (isAuthenticated && user && (user.role === 'ADMIN' || user.role === 'COORDINADOR')) {
      loadUsers();
    }
  }, [showInactiveUsers, selectedRole, isAuthenticated, user, loadUsers]);

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
    setEditingUser(null);
    setShowCreateModal(true);
  };

  const openEditModal = (usuario: UsuarioResponse) => {
    setEditingUser(usuario);
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingUser(null);
  };

  const handleSubmit = async (formData: any) => {
    try {
      const endpoint = editingUser 
        ? `/api/admin/usuarios/${editingUser.id}` 
        : '/api/admin/usuarios';
      
      const method = editingUser ? 'PUT' : 'POST';
      
      const body = editingUser 
        ? { ...formData, password: undefined } // No enviar password en edición
        : formData;

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
        
        await Swal.fire({
          title: '¡Éxito!',
          text: editingUser 
            ? 'Usuario actualizado correctamente' 
            : 'Usuario creado correctamente',
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
      throw error; // Re-throw para que el modal maneje el error
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading || loadingData) {
    return <AdminLoading />;
  }

  if (!isAuthenticated || !user || (user.role !== 'ADMIN' && user.role !== 'COORDINADOR')) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 mt-20">
      <div className="min-h-screen container mx-auto px-4 py-8">
        {/* Header del Panel */}
        <AdminPageHeader user={user} onLogout={handleLogout} />

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Estadísticas - Solo para ADMIN */}
        {user.role === 'ADMIN' && stats && <UserStatsGrid stats={stats} />}

        {/* Filtros y Gestión de Usuarios */}
        <UserManagementFilters
          selectedRole={selectedRole}
          showInactiveUsers={showInactiveUsers}
          userRole={user.role}
          onRoleChange={setSelectedRole}
          onToggleInactive={setShowInactiveUsers}
          onCreateUser={openCreateModal}
          onFilterUsers={loadUsers}
        />

        {/* Tabla de Usuarios */}
        <UsersTable
          users={usuarios}
          userRole={user.role}
          onEditUser={openEditModal}
          onToggleUserStatus={toggleUserStatus}
        />

        {/* Información del Panel */}
        <AdminInfoPanel userRole={user.role} />

        {/* Espaciador para el footer */}
        <div className="h-20"></div>

        {/* Modal para Crear/Editar Usuario */}
        <UserFormModal
          isOpen={showCreateModal}
          onClose={closeModal}
          onSubmit={handleSubmit}
          editingUser={editingUser}
        />
      </div>
    </div>
  );
}
