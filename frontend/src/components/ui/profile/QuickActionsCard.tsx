import React from 'react';
import Card from '@/components/ui/common/Card';
import { FaCog, FaBell, FaQuestionCircle, FaShieldAlt } from 'react-icons/fa';

interface QuickActionsCardProps {
  onNotificationClick?: () => void;
  onPrivacyClick?: () => void;
  onHelpClick?: () => void;
}

export default function QuickActionsCard({ 
  onNotificationClick, 
  onPrivacyClick, 
  onHelpClick 
}: QuickActionsCardProps) {
  const actions = [
    {
      icon: FaBell,
      title: "Notificaciones",
      description: "Gestionar preferencias",
      onClick: onNotificationClick,
      color: "text-blue-500"
    },
    {
      icon: FaShieldAlt,
      title: "Privacidad",
      description: "Configurar privacidad",
      onClick: onPrivacyClick,
      color: "text-green-500"
    },
    {
      icon: FaQuestionCircle,
      title: "Ayuda",
      description: "Centro de ayuda",
      onClick: onHelpClick,
      color: "text-purple-500"
    }
  ];

  return (
    <Card padding="md">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FaCog className="mr-2 text-purple-500" />
        Configuraciones
      </h3>
      <div className="space-y-3">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <div className="flex items-center">
                <IconComponent className={`${action.color} mr-3 group-hover:scale-110 transition-transform`} size={18} />
                <div>
                  <div className="font-medium text-gray-800">{action.title}</div>
                  <div className="text-sm text-gray-600">{action.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
