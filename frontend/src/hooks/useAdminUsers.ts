import { useState, useCallback, useEffect } from 'react';
import { UsuarioResponse, Role } from '@/types/auth';
import { UserStats, UserFormData } from '@/types/Admin';
import { API_CONFIG, getAuthHeaders } from '@/lib/api';
import Swal from 'sweetalert2';

interface UseAdminUsersProps {
  userRole: Role;
  isAuthenticated: boolean;
}

interface UseAdminUsersReturn {
  usuarios: UsuarioResponse[];
  stats: UserStats | null;
  loadingData: boolean;
  error: string | null;
  selectedRole: Role | 'ALL';
  showInactiveUsers: boolean;
  showCreateModal: boolean;
  editingUser: UsuarioResponse | null;
  setSelectedRole: (role: Role | 'ALL') => void;
  setShowInactiveUsers: (show: boolean) => void;
  setShowCreateModal: (show: boolean) => void;
  setEditingUser: (user: UsuarioResponse | null) => void;
  setUsuarios: (usuarios: UsuarioResponse[]) => void;
  setError: (error: string | null) => void;
  loadUsers: () => Promise<void>;
  loadAdminData: () => Promise<void>;
  toggleUserStatus: (userId: number, isActive: boolean) => Promise<void>;
  openCreateModal: () => void;
  openEditModal: (usuario: UsuarioResponse) => void;
  closeModal: () => void;
  handleSubmit: (formData: UserFormData) => Promise<void>;
}

export function useAdminUsers({ userRole, isAuthenticated }: UseAdminUsersProps): UseAdminUsersReturn {
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | 'ALL'>('ALL');
  const [showInactiveUsers, setShowInactiveUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioResponse | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      console.log('Loading users with:', {
        selectedRole,
        showInactiveUsers,
        userRole
      });

      const baseEndpoint = selectedRole === 'ALL' 
        ? (userRole === 'ADMIN' ? '/api/admin/usuarios' : '/api/coordinador/resumen')
        : userRole === 'ADMIN' 
          ? `/api/admin/usuarios/rol/${selectedRole}`
          : `/api/coordinador/${selectedRole.toLowerCase()}s`;
      
      // Si showInactiveUsers está habilitado y es admin, usar los endpoints que incluyen inactivos
      const endpoint = showInactiveUsers && userRole === 'ADMIN' 
        ? (selectedRole === 'ALL' ? '/api/admin/usuarios/all' : `/api/admin/usuarios/rol/${selectedRole}/all`)
        : baseEndpoint;

      console.log('Using endpoint:', endpoint);

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        if (selectedRole === 'ALL' && userRole !== 'ADMIN') {
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
  }, [selectedRole, showInactiveUsers, userRole]);

  const loadAdminData = useCallback(async () => {
    try {
      setLoadingData(true);
      setError(null);
      
      // Cargar estadísticas (solo para ADMIN)
      if (userRole === 'ADMIN') {
        const statsResponse = await fetch(`${API_CONFIG.BASE_URL}/api/admin/estadisticas`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
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
  }, [userRole, loadUsers]);

  const toggleUserStatus = useCallback(async (userId: number, isActive: boolean) => {
    if (userRole !== 'ADMIN') return;
    
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
  }, [userRole, loadUsers]);

  const openCreateModal = useCallback(() => {
    setEditingUser(null);
    setShowCreateModal(true);
  }, []);

  const openEditModal = useCallback((usuario: UsuarioResponse) => {
    setEditingUser(usuario);
    setShowCreateModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowCreateModal(false);
    setEditingUser(null);
  }, []);

  const handleSubmit = useCallback(async (formData: UserFormData) => {
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
        if (userRole === 'ADMIN') {
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
  }, [editingUser, loadUsers, userRole, loadAdminData]);

  // Effect para cargar datos cuando cambie el filtro de inactivos o rol
  useEffect(() => {
    if (isAuthenticated && (userRole === 'ADMIN' || userRole === 'COORDINADOR')) {
      loadUsers();
    }
  }, [showInactiveUsers, selectedRole, isAuthenticated, userRole, loadUsers]);

  return {
    usuarios,
    stats,
    loadingData,
    error,
    selectedRole,
    showInactiveUsers,
    showCreateModal,
    editingUser,
    setSelectedRole,
    setShowInactiveUsers,
    setShowCreateModal,
    setEditingUser,
    setUsuarios,
    setError,
    loadUsers,
    loadAdminData,
    toggleUserStatus,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit
  };
}
