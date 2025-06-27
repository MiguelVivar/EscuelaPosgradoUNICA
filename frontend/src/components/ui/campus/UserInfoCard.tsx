import React from 'react';
import { Card, SectionHeader } from '@/components/ui/common';
import { AuthResponse } from '@/types/auth';
import { 
  FaUser, 
  FaEnvelope, 
  FaIdCard, 
  FaUserGraduate, 
  FaChalkboardTeacher,
  FaUserShield,
  FaUsers
} from 'react-icons/fa';

interface UserInfoCardProps {
  user: AuthResponse;
}

interface InfoItem {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  color: string;
}

export default function UserInfoCard({ user }: UserInfoCardProps) {
  const getRoleInfo = () => {
    const roleConfig = {
      'ADMIN': { icon: FaUserShield, color: 'text-red-500', label: 'Administrador' },
      'COORDINADOR': { icon: FaUsers, color: 'text-green-500', label: 'Coordinador' },
      'DOCENTE': { icon: FaChalkboardTeacher, color: 'text-blue-500', label: 'Docente' },
      'ALUMNO': { icon: FaUserGraduate, color: 'text-purple-500', label: 'Alumno' },
      'POSTULANTE': { icon: FaUser, color: 'text-orange-500', label: 'Postulante' }
    };
    
    return roleConfig[user.role as keyof typeof roleConfig] || roleConfig['ALUMNO'];
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  const getInfoItems = (): InfoItem[] => {
    const baseItems: InfoItem[] = [
      {
        icon: FaUser,
        label: "Nombre Completo",
        value: `${user.nombres} ${user.apellidos}`,
        color: "text-blue-500"
      },
      {
        icon: FaEnvelope,
        label: "Correo Electrónico",
        value: user.email,
        color: "text-green-500"
      },
      {
        icon: RoleIcon,
        label: "Rol",
        value: roleInfo.label,
        color: roleInfo.color
      }
    ];

    // Agregar información específica del rol
    if (user.dni) {
      baseItems.push({
        icon: FaIdCard,
        label: "DNI",
        value: user.dni,
        color: "text-gray-500"
      });
    }

    if (user.codigoEstudiante) {
      baseItems.push({
        icon: FaUserGraduate,
        label: "Código de Estudiante",
        value: user.codigoEstudiante,
        color: "text-purple-500"
      });
    }

    if (user.codigoDocente) {
      baseItems.push({
        icon: FaChalkboardTeacher,
        label: "Código de Docente",
        value: user.codigoDocente,
        color: "text-blue-500"
      });
    }

    if (user.especialidad) {
      baseItems.push({
        icon: FaUser,
        label: "Especialidad",
        value: user.especialidad,
        color: "text-amber-500"
      });
    }

    return baseItems;
  };

  const infoItems = getInfoItems();

  return (
    <Card variant="glassmorphism" padding="lg">
      <SectionHeader 
        title="Mi Información"
        subtitle="Datos personales y académicos"
        icon={FaUser}
      />
      
      <div className="space-y-3 sm:space-y-4">
        {infoItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="flex items-center p-2 sm:p-3 bg-gray-50/50 rounded-lg">
              <div className="flex-shrink-0 mr-3">
                <IconComponent className={`${item.color} text-base sm:text-lg`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">{item.label}</p>
                <p className="text-sm sm:text-base text-gray-800 font-semibold truncate">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {(user.telefono || user.direccion) && (
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200/50">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Información de Contacto
          </h4>
          <div className="space-y-1 sm:space-y-2">
            {user.telefono && (
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-medium">Teléfono:</span> {user.telefono}
              </p>
            )}
            {user.direccion && (
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-medium">Dirección:</span> 
                <span className="block sm:inline sm:ml-1 break-words">{user.direccion}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
