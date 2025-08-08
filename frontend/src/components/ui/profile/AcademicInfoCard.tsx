import React from 'react';
import Card from '@/components/ui/common/Card';
import UserInfoItem from './UserInfoItem';
import { FaIdCard, FaUserGraduate, FaChalkboardTeacher, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { AuthResponse } from '@/types/auth';

interface AcademicInfoCardProps {
  user: AuthResponse;
}

export default function AcademicInfoCard({ user }: AcademicInfoCardProps) {
  const getRoleIcon = () => {
    switch (user.role) {
      case 'ALUMNO':
        return FaUserGraduate;
      case 'DOCENTE':
      case 'COORDINADOR':
        return FaChalkboardTeacher;
      default:
        return FaIdCard;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <RoleIcon className="mr-2 text-purple-500" />
        Información Académica
      </h3>
      
      <div className="space-y-4">
        <UserInfoItem
          icon={FaUser}
          label="Rol"
          value={user.role}
          variant="highlight"
        />
        
        {user.codigoEstudiante && (
          <UserInfoItem
            icon={FaIdCard}
            label="Código de Estudiante"
            value={user.codigoEstudiante}
          />
        )}
        
        {user.codigoDocente && (
          <UserInfoItem
            icon={FaIdCard}
            label="Código de Docente"
            value={user.codigoDocente}
          />
        )}
        
        {user.especialidad && (
          <UserInfoItem
            icon={FaUserGraduate}
            label="Especialidad"
            value={user.especialidad}
          />
        )}
        
        <UserInfoItem
          icon={FaCalendarAlt}
          label="Miembro desde"
          value={new Date().getFullYear().toString()}
        />
      </div>
    </Card>
  );
}
