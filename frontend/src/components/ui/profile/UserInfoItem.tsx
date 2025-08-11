import React from 'react';
import { IconType } from 'react-icons';

interface UserInfoItemProps {
  icon: IconType;
  label: string;
  value: string;
  variant?: 'default' | 'highlight';
}

export default function UserInfoItem({
  icon: Icon,
  label,
  value,
  variant = 'default'
}: UserInfoItemProps) {
  const containerClasses = variant === 'highlight' 
    ? 'bg-blue-50 border border-blue-200 rounded-lg p-3'
    : 'p-3';

  const iconClasses = variant === 'highlight'
    ? 'text-blue-600'
    : 'text-gray-600';

  const labelClasses = variant === 'highlight'
    ? 'text-blue-800 font-medium'
    : 'text-gray-600';

  const valueClasses = variant === 'highlight'
    ? 'text-blue-900 font-semibold'
    : 'text-gray-900 font-medium';

  return (
    <div className={containerClasses}>
      <div className="flex items-center space-x-3">
        <Icon className={`w-4 h-4 ${iconClasses}`} />
        <div className="flex-1">
          <p className={`text-sm ${labelClasses}`}>{label}</p>
          <p className={`text-sm ${valueClasses}`}>{value || 'No especificado'}</p>
        </div>
      </div>
    </div>
  );
}
