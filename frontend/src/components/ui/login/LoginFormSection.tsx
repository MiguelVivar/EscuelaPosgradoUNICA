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
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTogglePassword: () => void;
}

export default function LoginFormSection({
  formData,
  isLoading,
  showPassword,
  emailError,
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
