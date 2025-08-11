"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useUserSearch } from "@/hooks/useUserSearch";
import {
  AdminPageHeader,
  UserStatsGrid,
  UserManagementFilters,
  UsersTable,
  UserFormModal,
  AdminInfoPanel,
  ErrorMessage,
  AdminLoading,
  ExcelManager
} from "@/components/ui/admin";

export default function AdminDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const {
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
    setUsuarios,
    loadUsers,
    loadAdminData,
    toggleUserStatus,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit
  } = useAdminUsers({
    userRole: user?.role || 'ADMIN',
    isAuthenticated
  });

  const {
    searchText,
    isSearching,
    handleSearchChange,
    searchUsers
  } = useUserSearch({
    selectedRole,
    showInactiveUsers,
    onUsersUpdate: setUsuarios,
    loadUsers
  });

  // Cargar datos iniciales
  useEffect(() => {
    if (isAuthenticated && user && (user.role === 'ADMIN' || user.role === 'COORDINADOR')) {
      loadAdminData();
    }
  }, [isAuthenticated, user, loadAdminData]);

  const handleLogout = () => {
    logout();
    router.replace("/iniciar-sesion");
  };

  // Retornar temprano si no hay usuario autenticado
  if (!user) {
    return <AdminLoading />;
  }

  if (loadingData) {
    return <AdminLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header del Panel */}
        <AdminPageHeader user={user} onLogout={handleLogout} />

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Estadísticas - Para ADMIN y COORDINADOR */}
        {(user?.role === 'ADMIN' || user?.role === 'COORDINADOR') && stats && (
          <UserStatsGrid stats={stats} />
        )}

        {/* Filtros y Gestión de Usuarios */}
        <UserManagementFilters
          selectedRole={selectedRole}
          showInactiveUsers={showInactiveUsers}
          userRole={user?.role || 'ADMIN'}
          searchText={searchText}
          isSearching={isSearching}
          onRoleChange={setSelectedRole}
          onToggleInactive={setShowInactiveUsers}
          onCreateUser={openCreateModal}
          onFilterUsers={loadUsers}
          onSearchChange={handleSearchChange}
          onSearchUsers={searchUsers}
        />

        {/* Gestión de Excel - Solo para ADMIN */}
        {user?.role === 'ADMIN' && (
          <ExcelManager onImportComplete={loadAdminData} />
        )}

        {/* Tabla de Usuarios */}
        <UsersTable
          users={usuarios}
          userRole={user?.role || 'ADMIN'}
          onEditUser={openEditModal}
          onToggleUserStatus={toggleUserStatus}
        />

        {/* Información del Panel */}
        <AdminInfoPanel userRole={user?.role || 'ADMIN'} />

        {/* Espaciador para el footer */}
        <div className="h-16 sm:h-20"></div>

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
