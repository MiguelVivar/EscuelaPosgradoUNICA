import React, { useState } from 'react';
import { Card, SectionHeader } from '@/components/ui/common';
import { Button } from '@/components/common';
import { 
  FaBell, 
  FaInfoCircle, 
  FaExclamationTriangle, 
  FaCheckCircle,
  FaEye,
  FaTimes
} from 'react-icons/fa';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export default function NotificationsCard() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: 'Bienvenido al Campus Virtual',
      message: 'Explora todas las funcionalidades disponibles en tu perfil.',
      timestamp: '2024-06-26',
      isRead: false
    },
    {
      id: '2', 
      type: 'success',
      title: 'Perfil actualizado',
      message: 'Tu información personal ha sido actualizada correctamente.',
      timestamp: '2024-06-25',
      isRead: true
    }
  ]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return { icon: FaInfoCircle, color: 'text-blue-500' };
      case 'warning':
        return { icon: FaExclamationTriangle, color: 'text-amber-500' };
      case 'success':
        return { icon: FaCheckCircle, color: 'text-green-500' };
      default:
        return { icon: FaInfoCircle, color: 'text-gray-500' };
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Card variant="glassmorphism" padding="lg">
      <SectionHeader 
        title="Notificaciones"
        subtitle={unreadCount > 0 ? `${unreadCount} sin leer` : "Todas leídas"}
        icon={FaBell}
        actions={
          notifications.length > 0 && (
            <Button variant="ghost" size="sm">
              Ver todas
            </Button>
          )
        }
      />
      
      <div className="space-y-2 sm:space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <FaBell className="mx-auto text-gray-400 text-2xl sm:text-3xl mb-3" />
            <p className="text-gray-500 text-sm sm:text-base">No tienes notificaciones nuevas</p>
          </div>
        ) : (
          notifications.slice(0, 3).map((notification) => {
            const { icon: IconComponent, color } = getNotificationIcon(notification.type);
            
            return (
              <div
                key={notification.id}
                className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 ${
                  notification.isRead 
                    ? 'border-gray-200/50 bg-gray-50/30' 
                    : 'border-blue-200/70 bg-blue-50/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                      <IconComponent className={`${color} text-base sm:text-lg`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-sm sm:text-base ${
                        notification.isRead ? 'text-gray-700' : 'text-gray-800'
                      }`}>
                        {notification.title}
                      </h4>
                      <p className={`text-xs sm:text-sm mt-1 ${
                        notification.isRead ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 sm:mt-2">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Marcar como leído"
                      >
                        <FaEye className="text-xs" />
                      </button>
                    )}
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Eliminar notificación"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {notifications.length > 3 && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200/50">
          <Button variant="ghost" size="sm" fullWidth>
            <span className="text-xs sm:text-sm">
              Ver {notifications.length - 3} notificaciones más
            </span>
          </Button>
        </div>
      )}
    </Card>
  );
}
