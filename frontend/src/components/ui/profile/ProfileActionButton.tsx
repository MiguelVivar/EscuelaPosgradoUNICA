import React from 'react';
import { IconType } from 'react-icons';

interface ProfileActionButtonProps {
  icon: IconType;
  title: string;
  description: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary';
}

export default function ProfileActionButton({
  icon: Icon,
  title,
  description,
  onClick,
  variant = 'default'
}: ProfileActionButtonProps) {
  const baseClasses = 'flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer';
  
  const variantClasses = {
    default: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
    primary: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50',
    secondary: 'border-purple-200 hover:border-purple-300 hover:bg-purple-50'
  };

  const iconClasses = {
    default: 'text-gray-600',
    primary: 'text-blue-600',
    secondary: 'text-purple-600'
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-white shadow-sm ${iconClasses[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <svg 
        className="w-5 h-5 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}
