import React from 'react';
import Card from '@/components/ui/common/Card';
import { FaIdCard, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
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

  const getRoleColor = () => {
    switch (user.role) {
      case 'ADMIN':
        return 'text-red-500';
      case 'ALUMNO':
        return 'text-blue-500';
      case 'DOCENTE':
        return 'text-green-500';
      case 'COORDINADOR':
        return 'text-purple-500';
      case 'POSTULANTE':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getRoleLabel = () => {
    switch (user.role) {
      case 'ADMIN':
        return 'Administrador';
      case 'ALUMNO':
        return 'Estudiante';
      case 'DOCENTE':
        return 'Docente';
      case 'COORDINADOR':
        return 'Coordinador';
      case 'POSTULANTE':
        return 'Postulante';
      default:
        return user.role;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <Card padding="md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Información Académica</h3>
      <div className="space-y-4">
        <div className="flex items-center">
          <RoleIcon className={`${getRoleColor()} mr-3`} size={20} />
          <div>
            <p className="text-sm text-gray-600">Rol</p>
            <p className="font-semibold text-gray-800">{getRoleLabel()}</p>
          </div>
        </div>

        {user.codigoEstudiante && (
          <div className="flex items-center">
            <FaUserGraduate className="text-blue-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-600">Código de Estudiante</p>
              <p className="font-semibold text-gray-800">{user.codigoEstudiante}</p>
            </div>
          </div>
        )}

        {user.codigoDocente && (
          <div className="flex items-center">
            <FaChalkboardTeacher className="text-green-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-600">Código de Docente</p>
              <p className="font-semibold text-gray-800">{user.codigoDocente}</p>
            </div>
          </div>
        )}

        {user.especialidad && (
          <div className="flex items-center">
            <FaIdCard className="text-purple-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-600">Especialidad</p>
              <p className="font-semibold text-gray-800">{user.especialidad}</p>
            </div>
          </div>
        )}

        {user.programaInteres && (
          <div className="flex items-center">
            <FaIdCard className="text-yellow-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-600">Programa de Interés</p>
              <p className="font-semibold text-gray-800">{user.programaInteres}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
