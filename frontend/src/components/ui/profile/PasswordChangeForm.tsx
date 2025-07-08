import React from 'react';
import Card from '@/components/ui/common/Card';
import InputField from '@/components/ui/common/InputField';
import SectionHeader from '@/components/ui/common/SectionHeader';
import Button from '@/components/common/Button';
import { FaKey, FaLock } from 'react-icons/fa';
import { ChangePasswordRequest } from '@/types/auth';

interface PasswordChangeFormProps {
  passwordData: ChangePasswordRequest;
  isChangingPassword: boolean;
  onPasswordDataChange: (field: keyof ChangePasswordRequest, value: string) => void;
  onPasswordChange: () => void;
}

export default function PasswordChangeForm({
  passwordData,
  isChangingPassword,
  onPasswordDataChange,
  onPasswordChange
}: PasswordChangeFormProps) {
  return (
    <Card className="mt-8">
      <SectionHeader
        title="Cambiar Contraseña"
        subtitle="Actualiza tu contraseña para mantener tu cuenta segura"
        icon={FaKey}
      />

      <div className="space-y-4">
        <InputField
          label="Contraseña Actual"
          value={passwordData.passwordActual}
          onChange={(e) => onPasswordDataChange('passwordActual', e.target.value)}
          type="password"
          placeholder="Ingresa tu contraseña actual"
          icon={FaLock}
          disabled={isChangingPassword}
          required
        />

        <InputField
          label="Nueva Contraseña"
          value={passwordData.nuevaPassword}
          onChange={(e) => onPasswordDataChange('nuevaPassword', e.target.value)}
          type="password"
          placeholder="Ingresa tu nueva contraseña (mínimo 6 caracteres)"
          icon={FaLock}
          disabled={isChangingPassword}
          required
        />

        <InputField
          label="Confirmar Nueva Contraseña"
          value={passwordData.confirmarNuevaPassword}
          onChange={(e) => onPasswordDataChange('confirmarNuevaPassword', e.target.value)}
          type="password"
          placeholder="Confirma tu nueva contraseña"
          icon={FaLock}
          disabled={isChangingPassword}
          required
        />

        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={onPasswordChange}
            disabled={isChangingPassword}
            isLoading={isChangingPassword}
            leftIcon={FaKey}
            className="w-full sm:w-auto"
          >
            {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
