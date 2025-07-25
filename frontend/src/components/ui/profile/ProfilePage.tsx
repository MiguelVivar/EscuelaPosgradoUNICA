import React from 'react';
import { useProfile } from '@/hooks/useProfile';
import ProfileLayout from './ProfileLayout';
import ProfileLoadingState from './ProfileLoadingState';
import ProfileMessageContainer from './ProfileMessageContainer';
import ProfileContent from './ProfileContent';

export default function ProfilePage() {
  const {
    user,
    formData,
    passwordData,
    isEditing,
    isLoading,
    isChangingPassword,
    message,
    setMessage,
    handleInputChange,
    handlePasswordDataChange,
    handleEdit,
    handleCancel,
    handleSave,
    handlePasswordChange
  } = useProfile();

  if (!user) {
    return <ProfileLoadingState />;
  }

  return (
    <ProfileLayout>
      <ProfileMessageContainer 
        message={message} 
        onClose={() => setMessage(null)} 
      />
      
      <ProfileContent
        user={user}
        formData={formData}
        passwordData={passwordData}
        isEditing={isEditing}
        isLoading={isLoading}
        isChangingPassword={isChangingPassword}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onInputChange={handleInputChange}
        onPasswordDataChange={handlePasswordDataChange}
        onPasswordChange={handlePasswordChange}
      />
    </ProfileLayout>
  );
}
