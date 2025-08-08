import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface PasswordValidationProps {
  password: string;
  confirmPassword: string;
  currentPassword: string;
}

interface ValidationRule {
  test: boolean;
  message: string;
}

export default function PasswordValidation({ 
  password, 
  confirmPassword, 
  currentPassword 
}: PasswordValidationProps) {
  const rules: ValidationRule[] = [
    {
      test: currentPassword.length > 0,
      message: 'Contraseña actual requerida'
    },
    {
      test: password.length >= 6,
      message: 'Mínimo 6 caracteres'
    },
    {
      test: password.length > 0 && confirmPassword.length > 0 && password === confirmPassword,
      message: 'Las contraseñas coinciden'
    },
    {
      test: /[A-Z]/.test(password),
      message: 'Al menos una mayúscula'
    },
    {
      test: /[0-9]/.test(password),
      message: 'Al menos un número'
    }
  ];

  const allValid = rules.every(rule => rule.test);

  if (!password && !confirmPassword && !currentPassword) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Requisitos de contraseña:</h4>
      <div className="space-y-2">
        {rules.map((rule, index) => (
          <div 
            key={index}
            className={`flex items-center space-x-2 text-sm ${
              rule.test ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            {rule.test ? (
              <FaCheck className="w-3 h-3" />
            ) : (
              <FaTimes className="w-3 h-3" />
            )}
            <span>{rule.message}</span>
          </div>
        ))}
      </div>
      {allValid && (
        <div className="mt-3 p-2 bg-green-100 rounded-md">
          <p className="text-sm text-green-800 font-medium">
            ✅ Contraseña válida
          </p>
        </div>
      )}
    </div>
  );
}
