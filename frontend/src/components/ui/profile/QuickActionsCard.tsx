import React from 'react';
import Card from '@/components/ui/common/Card';
import ProfileActionButton from './ProfileActionButton';
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
  const handleNotificationClick = () => {
    onNotificationClick?.();
  };

  const handlePrivacyClick = () => {
    onPrivacyClick?.();
  };

  const handleHelpClick = () => {
    onHelpClick?.();
  };

  return (
    <Card padding="md">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FaCog className="mr-2 text-purple-500" />
        Configuraciones
      </h3>
      <div className="space-y-3">
        <ProfileActionButton
          icon={FaBell}
          title="Notificaciones"
          description="Gestionar preferencias de notificaciones"
          onClick={handleNotificationClick}
          variant="primary"
        />
        
        <ProfileActionButton
          icon={FaShieldAlt}
          title="Privacidad"
          description="Configurar opciones de privacidad"
          onClick={handlePrivacyClick}
          variant="secondary"
        />
        
        <ProfileActionButton
          icon={FaQuestionCircle}
          title="Ayuda"
          description="Centro de ayuda y soporte"
          onClick={handleHelpClick}
          variant="default"
        />
      </div>
    </Card>
  );
}
