import React from 'react';
import { 
  PersonalInfoForm, 
  PasswordChangeForm, 
  AcademicInfoCard, 
  QuickActionsCard 
} from '@/components/ui/profile';
import { ChangePasswordRequest, AuthResponse } from '@/types/auth';

interface ProfileContentProps {
  user: AuthResponse;
  formData: {
    nombres: string;
    apellidos: string;
    dni: string;
    email: string;
    telefono: string;
    direccion: string;
  };
  passwordData: ChangePasswordRequest;
  isEditing: boolean;
  isLoading: boolean;
  isChangingPassword: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordDataChange: (field: keyof ChangePasswordRequest, value: string) => void;
  onPasswordChange: () => void;
}

export default function ProfileContent({
  user,
  formData,
  passwordData,
  isEditing,
  isLoading,
  isChangingPassword,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
  onPasswordDataChange,
  onPasswordChange
}: ProfileContentProps) {
  const handleNotificationClick = () => {
    console.log('Notificaciones');
  };

  const handlePrivacyClick = () => {
    console.log('Privacidad');
  };

  const handleHelpClick = () => {
    console.log('Ayuda');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Panel de información personal */}
      <div className="lg:col-span-2 space-y-8">
        <PersonalInfoForm
          formData={formData}
          isEditing={isEditing}
          isLoading={isLoading}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onInputChange={onInputChange}
        />

        <PasswordChangeForm
          passwordData={passwordData}
          isChangingPassword={isChangingPassword}
          onPasswordDataChange={onPasswordDataChange}
          onPasswordChange={onPasswordChange}
        />
      </div>

      {/* Panel lateral */}
      <div className="space-y-6">
        <AcademicInfoCard user={user} />
        <QuickActionsCard
          onNotificationClick={handleNotificationClick}
          onPrivacyClick={handlePrivacyClick}
          onHelpClick={handleHelpClick}
        />
      </div>
    </div>
  );
}
