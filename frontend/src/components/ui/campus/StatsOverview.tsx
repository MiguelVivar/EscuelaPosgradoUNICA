import React from 'react';
import { Card, SectionHeader } from '@/components/ui/common';
import { AuthResponse } from '@/types/auth';
import { 
  FaUsers, 
  FaBook, 
  FaGraduationCap, 
  FaChartLine,
  FaChalkboardTeacher
} from 'react-icons/fa';

interface StatsOverviewProps {
  user: AuthResponse;
}

interface StatItem {
  id: string;
  label: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
  change?: string;
}

export default function StatsOverview({ user }: StatsOverviewProps) {
  // Datos simulados - en una aplicación real vendrían de una API
  const getStatsData = (): StatItem[] => {
    if (user.role === 'ADMIN') {
      return [
        {
          id: 'total-users',
          label: 'Total Usuarios',
          value: 1247,
          icon: FaUsers,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          change: '+12'
        },
        {
          id: 'courses',
          label: 'Cursos Activos',
          value: 45,
          icon: FaBook,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          change: '+3'
        },
        {
          id: 'teachers',
          label: 'Docentes',
          value: 89,
          icon: FaChalkboardTeacher,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          change: '+5'
        },
        {
          id: 'students',
          label: 'Estudiantes',
          value: 1089,
          icon: FaGraduationCap,
          color: 'text-amber-600',
          bgColor: 'bg-amber-100',
          change: '+67'
        }
      ];
    } else if (user.role === 'COORDINADOR') {
      return [
        {
          id: 'my-programs',
          label: 'Programas Supervisados',
          value: 8,
          icon: FaGraduationCap,
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        },
        {
          id: 'active-courses',
          label: 'Cursos Coordinados',
          value: 23,
          icon: FaBook,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        },
        {
          id: 'enrollment',
          label: 'Matrículas Pendientes',
          value: 12,
          icon: FaUsers,
          color: 'text-amber-600',
          bgColor: 'bg-amber-100'
        },
        {
          id: 'performance',
          label: 'Rendimiento Promedio',
          value: '87%',
          icon: FaChartLine,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100'
        }
      ];
    }
    return [];
  };

  const statsData = getStatsData();

  if (statsData.length === 0) {
    return null;
  }

  return (
    <Card variant="glassmorphism" padding="lg">
      <SectionHeader 
        title="Resumen Estadístico"
        subtitle={user.role === 'ADMIN' ? 'Vista general del sistema' : 'Supervisión académica'}
        icon={FaChartLine}
      />
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsData.map((stat) => {
          const IconComponent = stat.icon;
          
          return (
            <div
              key={stat.id}
              className="p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:border-gray-300/70 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className={`p-1.5 sm:p-2 ${stat.bgColor} rounded-lg`}>
                  <IconComponent className={`${stat.color} text-sm sm:text-lg`} />
                </div>
                {stat.change && (
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {stat.change}
                  </span>
                )}
              </div>
              
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-800 mb-1">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-tight">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200/50">
        <p className="text-xs text-gray-500 text-center">
          Datos actualizados al {new Date().toLocaleDateString('es-ES')}
        </p>
      </div>
    </Card>
  );
}
