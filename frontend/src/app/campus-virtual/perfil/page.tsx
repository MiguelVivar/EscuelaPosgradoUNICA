"use client";

import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/layout/PageHeader";
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaEdit, FaSave, FaSpinner, FaKey } from "react-icons/fa";
import { useState, useEffect } from "react";
import { ChangePasswordRequest } from "@/types/auth";

export default function PerfilPage() {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState({
    nombres: user?.nombres || '',
    apellidos: user?.apellidos || '',
    dni: user?.dni || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || ''
  });
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    passwordActual: '',
    nuevaPassword: '',
    confirmarNuevaPassword: ''
  });

  // Sincronizar formData cuando el usuario cambie
  useEffect(() => {
    if (user) {
      setFormData({
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        dni: user.dni || '',
        email: user.email || '',
        telefono: user.telefono || '',
        direccion: user.direccion || ''
      });
    }
  }, [user]);

  // Limpiar mensaje después de unos segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      // Preparar datos para enviar (solo campos editables)
      const updateData: {
        telefono?: string;
        direccion?: string;
      } = {};

      if (formData.telefono !== user?.telefono) {
        updateData.telefono = formData.telefono;
      }

      if (formData.direccion !== user?.direccion) {
        updateData.direccion = formData.direccion;
      }

      // Solo enviar si hay cambios
      if (Object.keys(updateData).length > 0) {
        const response = await updateProfile(updateData);
        
        if (response.success) {
          setMessage({ text: 'Perfil actualizado exitosamente', type: 'success' });
          setIsEditing(false);
        } else {
          setMessage({ text: response.message, type: 'error' });
        }
        } else {
          setIsEditing(false);
          setMessage({ text: 'No hay cambios para guardar', type: 'success' });
        }
      } catch (error: unknown) {
        setMessage({ 
          text: error instanceof Error ? error.message : 'Error al actualizar el perfil', 
          type: 'error' 
        });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setIsChangingPassword(true);
      setMessage(null);

      // Validar que todos los campos estén llenos
      if (!passwordData.passwordActual || !passwordData.nuevaPassword || !passwordData.confirmarNuevaPassword) {
        setMessage({ text: 'Todos los campos de contraseña son obligatorios', type: 'error' });
        return;
      }

      // Validar que las nuevas contraseñas coincidan
      if (passwordData.nuevaPassword !== passwordData.confirmarNuevaPassword) {
        setMessage({ text: 'Las nuevas contraseñas no coinciden', type: 'error' });
        return;
      }

      // Validar longitud mínima
      if (passwordData.nuevaPassword.length < 6) {
        setMessage({ text: 'La nueva contraseña debe tener al menos 6 caracteres', type: 'error' });
        return;
      }

      const response = await changePassword(passwordData);
      
      if (response.success) {
        setMessage({ text: 'Contraseña cambiada exitosamente', type: 'success' });
        setPasswordData({
          passwordActual: '',
          nuevaPassword: '',
          confirmarNuevaPassword: ''
        });
      } else {
        setMessage({ text: response.message, type: 'error' });
      }
    } catch (error: unknown) {
      setMessage({ 
        text: error instanceof Error ? error.message : 'Error al cambiar la contraseña', 
        type: 'error' 
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-full">
      <PageHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Mensaje de estado */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de información personal */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
                <div className="flex gap-2">
                  {isEditing && (
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setMessage(null);
                        // Restaurar valores originales
                        setFormData({
                          nombres: user?.nombres || '',
                          apellidos: user?.apellidos || '',
                          dni: user?.dni || '',
                          email: user?.email || '',
                          telefono: user?.telefono || '',
                          direccion: user?.direccion || ''
                        });
                      }}
                      disabled={isLoading}
                      className="flex items-center px-4 py-2 rounded-lg transition-colors bg-gray-500 hover:bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={isLoading}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isEditing 
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    {isLoading ? (
                      <FaSpinner className="mr-2 animate-spin" />
                    ) : (
                      isEditing ? <FaSave className="mr-2" /> : <FaEdit className="mr-2" />
                    )}
                    {isLoading ? 'Guardando...' : (isEditing ? 'Guardar' : 'Editar')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombres
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaUser className="text-gray-400 mr-3" />
                    <span>{formData.nombres}</span>
                    <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">No editable</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaUser className="text-gray-400 mr-3" />
                    <span>{formData.apellidos}</span>
                    <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">No editable</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DNI
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaIdCard className="text-gray-400 mr-3" />
                    <span>{formData.dni || 'No registrado'}</span>
                    <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">No editable</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaEnvelope className="text-gray-400 mr-3" />
                    <span>{formData.email}</span>
                    <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">No editable</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu teléfono"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <FaPhone className="text-gray-400 mr-3" />
                      <span>{formData.telefono}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu dirección"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span>{formData.direccion}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cambio de contraseña */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaKey className="mr-3 text-purple-500" />
                Cambiar Contraseña
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña Actual
                  </label>
                  <input
                    type="password"
                    value={passwordData.passwordActual}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, passwordActual: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ingresa tu contraseña actual"
                    disabled={isChangingPassword}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={passwordData.nuevaPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, nuevaPassword: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ingresa tu nueva contraseña (mínimo 6 caracteres)"
                    disabled={isChangingPassword}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmarNuevaPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmarNuevaPassword: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Confirma tu nueva contraseña"
                    disabled={isChangingPassword}
                  />
                </div>
                <button 
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword}
                  className="flex items-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? (
                    <>
                      <FaSpinner className="mr-2 animate-spin" />
                      Cambiando...
                    </>
                  ) : (
                    <>
                      <FaKey className="mr-2" />
                      Cambiar Contraseña
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Información del rol */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Información Académica</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaIdCard className="text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Rol</p>
                    <p className="font-semibold">{user?.role}</p>
                  </div>
                </div>
                {user?.codigoEstudiante && (
                  <div className="flex items-center">
                    <FaIdCard className="text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Código de Estudiante</p>
                      <p className="font-semibold">{user.codigoEstudiante}</p>
                    </div>
                  </div>
                )}
                {user?.codigoDocente && (
                  <div className="flex items-center">
                    <FaIdCard className="text-green-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Código de Docente</p>
                      <p className="font-semibold">{user.codigoDocente}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Configuraciones rápidas */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Configuraciones</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="font-medium">Notificaciones</div>
                  <div className="text-sm text-gray-600">Gestionar preferencias</div>
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="font-medium">Privacidad</div>
                  <div className="text-sm text-gray-600">Configurar privacidad</div>
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="font-medium">Ayuda</div>
                  <div className="text-sm text-gray-600">Centro de ayuda</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
