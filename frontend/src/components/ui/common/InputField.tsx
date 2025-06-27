import React from 'react';
import { IconType } from 'react-icons';

interface InputFieldProps {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: IconType;
  badge?: string;
  className?: string;
  error?: string;
  maxLength?: number;
}

export default function InputField({
  label,
  value,
  onChange,
  name,
  type = 'text',
  placeholder,
  disabled = false,
  required = false,
  icon: Icon,
  badge,
  className = '',
  error,
  maxLength
}: InputFieldProps) {
  const isEditable = !disabled && onChange;

  if (!isEditable) {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          {Icon && <Icon className="text-gray-400 mr-3" />}
          <span className="flex-1">{value || 'No registrado'}</span>
          {badge && (
            <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">
              {badge}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon className="text-gray-400" size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
          }`}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
