import React from 'react';
import Card from '@/components/ui/common/Card';
import InputField from '@/components/ui/common/InputField';
import SectionHeader from '@/components/ui/common/SectionHeader';
import Button from '@/components/common/Button';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

interface PersonalInfoFormProps {
  formData: {
    nombres: string;
    apellidos: string;
    dni: string;
    email: string;
    telefono: string;
    direccion: string;
  };
  isEditing: boolean;
  isLoading: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PersonalInfoForm({
  formData,
  isEditing,
  isLoading,
  onEdit,
  onSave,
  onCancel,
  onInputChange
}: PersonalInfoFormProps) {
  const actions = (
    <>
      {isEditing && (
        <Button
          variant="secondary"
          size="md"
          onClick={onCancel}
          disabled={isLoading}
          leftIcon={FaTimes}
        >
          Cancelar
        </Button>
      )}
      <Button
        variant={isEditing ? "primary" : "outline"}
        size="md"
        onClick={isEditing ? onSave : onEdit}
        disabled={isLoading}
        isLoading={isLoading}
        leftIcon={isEditing ? FaSave : FaEdit}
      >
        {isLoading ? 'Guardando...' : (isEditing ? 'Guardar' : 'Editar')}
      </Button>
    </>
  );

  return (
    <Card>
      <SectionHeader
        title="Información Personal"
        subtitle="Gestiona tu información básica de perfil"
        icon={FaUser}
        actions={actions}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Nombres"
          value={formData.nombres}
          icon={FaUser}
          badge="No editable"
          disabled
        />

        <InputField
          label="Apellidos"
          value={formData.apellidos}
          icon={FaUser}
          badge="No editable"
          disabled
        />

        <InputField
          label="DNI"
          value={formData.dni}
          icon={FaIdCard}
          badge="No editable"
          disabled
        />

        <InputField
          label="Email"
          value={formData.email}
          icon={FaEnvelope}
          badge="No editable"
          disabled
        />

        <InputField
          label="Teléfono"
          value={formData.telefono}
          onChange={onInputChange}
          name="telefono"
          type="tel"
          placeholder="Ingresa tu teléfono"
          icon={FaPhone}
          disabled={!isEditing}
        />

        <div className="md:col-span-2">
          <InputField
            label="Dirección"
            value={formData.direccion}
            onChange={onInputChange}
            name="direccion"
            placeholder="Ingresa tu dirección"
            disabled={!isEditing}
          />
        </div>
      </div>
    </Card>
  );
}
