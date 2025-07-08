"use client";

import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/common";
import { 
  PersonalInfoForm, 
  PasswordChangeForm, 
  AcademicInfoCard, 
  QuickActionsCard 
} from "@/components/ui/profile";
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

  const handlePasswordDataChange = (field: keyof ChangePasswordRequest, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage(null);
  };

  const handleCancel = () => {
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

  if (!user) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Cargando información del usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <PageHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Mensaje de estado */}
        {message && (
          <div className="mb-6">
            <Alert
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de información personal */}
          <div className="lg:col-span-2 space-y-8">
            <PersonalInfoForm
              formData={formData}
              isEditing={isEditing}
              isLoading={isLoading}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onInputChange={handleInputChange}
            />

            <PasswordChangeForm
              passwordData={passwordData}
              isChangingPassword={isChangingPassword}
              onPasswordDataChange={handlePasswordDataChange}
              onPasswordChange={handlePasswordChange}
            />
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            <AcademicInfoCard user={user} />
            <QuickActionsCard
              onNotificationClick={() => console.log('Notificaciones')}
              onPrivacyClick={() => console.log('Privacidad')}
              onHelpClick={() => console.log('Ayuda')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
