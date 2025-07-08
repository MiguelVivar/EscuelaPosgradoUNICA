import React from 'react';
import { useRouter } from "next/navigation";
import { Card, SectionHeader } from '@/components/ui/common';
import { Button } from '@/components/common';
import { AuthResponse } from '@/types/auth';
import { 
  FaUserShield,
  FaGraduationCap, 
  FaBook, 
  FaUser, 
  FaTachometerAlt 
} from 'react-icons/fa';

interface QuickAccessCardProps {
  user: AuthResponse;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  description: string;
}

export default function QuickAccessCard({ user }: QuickAccessCardProps) {
  const router = useRouter();

  const getQuickActions = (): QuickAction[] => {
    const baseActions: QuickAction[] = [
      {
        id: "perfil",
        label: "Mi Perfil",
        icon: FaUser,
        href: "/campus-virtual/perfil",
        variant: "outline",
        description: "Gestionar información personal"
      }
    ];

    const roleSpecificActions: QuickAction[] = [];

    switch (user.role) {
      case 'ADMIN':
        roleSpecificActions.push({
          id: "admin-panel",
          label: "Panel de Administración",
          icon: FaUserShield,
          href: "/campus-virtual/admin",
          variant: "danger",
          description: "Gestionar usuarios y sistema"
        });
        break;

      case 'COORDINADOR':
        roleSpecificActions.push(
          {
            id: "coordinacion-panel",
            label: "Panel de Coordinación",
            icon: FaTachometerAlt,
            href: "/campus-virtual/admin",
            variant: "primary",
            description: "Supervisar actividades académicas"
          },
          {
            id: "gestion-cursos",
            label: "Gestión de Cursos",
            icon: FaGraduationCap,
            href: "/campus-virtual/cursos-gestion",
            variant: "secondary",
            description: "Crear y administrar cursos"
          }
        );
        break;

      case 'DOCENTE':
      case 'ALUMNO':
        roleSpecificActions.push({
          id: "mis-cursos",
          label: "Mis Cursos",
          icon: FaBook,
          href: "/campus-virtual/mis-cursos",
          variant: "primary",
          description: user.role === 'DOCENTE' ? "Gestionar mis clases" : "Ver mis materias"
        });
        break;
    }

    return [...roleSpecificActions, ...baseActions];
  };

  const quickActions = getQuickActions();

  return (
    <Card variant="glassmorphism" padding="lg">
      <SectionHeader 
        title="Accesos Rápidos"
        subtitle="Navega a las secciones principales"
        icon={FaTachometerAlt}
      />
      
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <div
              key={action.id}
              className="group p-3 sm:p-4 border border-gray-200/50 rounded-xl hover:border-gray-300/70 hover:bg-gray-50/50 transition-all duration-200"
            >
              {/* Layout móvil - Stack vertical */}
              <div className="block sm:hidden">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-gray-100/80 rounded-lg group-hover:bg-gray-200/80 transition-colors">
                    <IconComponent className="text-gray-600 text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm">{action.label}</h4>
                    <p className="text-xs text-gray-600 truncate">{action.description}</p>
                  </div>
                </div>
                <Button
                  variant={action.variant}
                  size="sm"
                  onClick={() => router.push(action.href)}
                  fullWidth
                >
                  Acceder
                </Button>
              </div>

              {/* Layout desktop - Horizontal */}
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="p-2 bg-gray-100/80 rounded-lg group-hover:bg-gray-200/80 transition-colors">
                    <IconComponent className="text-gray-600 text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800">{action.label}</h4>
                    <p className="text-sm text-gray-600 truncate">{action.description}</p>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <Button
                    variant={action.variant}
                    size="sm"
                    onClick={() => router.push(action.href)}
                  >
                    <span className="hidden md:inline">Acceder</span>
                    <span className="md:hidden">Ir</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
