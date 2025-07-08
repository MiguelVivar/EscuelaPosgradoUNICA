import React from 'react';
import { IconType } from 'react-icons';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: IconType;
  actions?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({ 
  title, 
  subtitle, 
  icon: Icon, 
  actions, 
  className = '' 
}: SectionHeaderProps) {
  return (
    <div className={`flex justify-between items-start mb-6 ${className}`}>
      <div className="flex items-center">
        {Icon && (
          <div className="mr-3">
            <Icon className="text-amber-500" size={24} />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
