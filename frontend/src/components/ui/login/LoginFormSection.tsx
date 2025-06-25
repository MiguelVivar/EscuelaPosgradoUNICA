import React from "react";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import FormActions from "./FormActions";
import SubmitButton from "./SubmitButton";

interface LoginFormSectionProps {
  formData: {
    email: string;
    password: string;
  };
  isLoading: boolean;
  showPassword: boolean;
  emailError: string;
  loginError?: string;
  successMessage?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTogglePassword: () => void;
}

export default function LoginFormSection({
  formData,
  isLoading,
  showPassword,
  emailError,
  loginError,
  successMessage,
  onInputChange,
  onSubmit,
  onTogglePassword,
}: LoginFormSectionProps) {
  return (
    <div className="px-8 py-10 lg:px-12 lg:py-12 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Iniciar Sesión
          </h2>
          <p className="text-gray-600 text-lg">
            Accede a tu cuenta institucional
          </p>
        </div>

        {/* Mensajes de error y éxito */}
        {loginError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {loginError}
            </p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <EmailInput
            value={formData.email}
            onChange={onInputChange}
            error={emailError}
          />

          <PasswordInput
            value={formData.password}
            onChange={onInputChange}
            showPassword={showPassword}
            onToggleVisibility={onTogglePassword}
          />

          <FormActions />

          <SubmitButton isLoading={isLoading} onSubmit={onSubmit} />
        </form>
      </div>
    </div>
  );
}
