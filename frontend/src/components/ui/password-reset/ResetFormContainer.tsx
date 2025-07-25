import React from "react";
import LogoBranding from "@/components/ui/password-recovery/LogoBranding";
import PasswordResetForm from "./PasswordResetForm";
import TokenValidationError from "./TokenValidationError";
import ResetSuccessMessage from "./ResetSuccessMessage";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface ResetFormContainerProps {
  isValidToken: boolean | null;
  password: string;
  confirmPassword: string;
  error: string;
  isLoading: boolean;
  success: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onTogglePasswordVisibility: () => void;
  onToggleConfirmPasswordVisibility: () => void;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export default function ResetFormContainer({
  isValidToken,
  password,
  confirmPassword,
  error,
  isLoading,
  success,
  showPassword,
  showConfirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  onTogglePasswordVisibility,
  onToggleConfirmPasswordVisibility,
  onSubmit,
  className = "",
}: ResetFormContainerProps) {
  const renderContent = () => {
    if (isValidToken === null) {
      return (
        <LoadingSpinner 
          message="Validando enlace de recuperación..." 
          className="text-zinc-600"
        />
      );
    }

    if (isValidToken === false) {
      return <TokenValidationError error={error} />;
    }

    if (success) {
      return <ResetSuccessMessage />;
    }

    return (
      <PasswordResetForm
        password={password}
        confirmPassword={confirmPassword}
        error={error}
        isLoading={isLoading}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        onPasswordChange={onPasswordChange}
        onConfirmPasswordChange={onConfirmPasswordChange}
        onTogglePasswordVisibility={onTogglePasswordVisibility}
        onToggleConfirmPasswordVisibility={onToggleConfirmPasswordVisibility}
        onSubmit={onSubmit}
      />
    );
  };

  return (
    <section className={`w-full lg:w-1/2 flex flex-col justify-center items-center px-4 py-8 sm:px-6 sm:py-12 md:py-16 ${className}`}>
      <div className="w-full max-w-md lg:max-w-full bg-white rounded-2xl shadow-2xl shadow-zinc-400 border border-zinc-200 px-6 sm:px-8 md:px-10 py-14 sm:py-20 md:py-24 flex flex-col items-center mt-16 lg:mt-0">
        <LogoBranding />
        {renderContent()}
      </div>
    </section>
  );
}
