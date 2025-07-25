import React from "react";
import ResetFormContainer from "./ResetFormContainer";
import ResetIllustrationSection from "./ResetIllustrationSection";
import { usePasswordReset } from "@/hooks/usePasswordReset";

interface PasswordResetPageProps {
  className?: string;
}

export default function PasswordResetPage({ 
  className = "" 
}: PasswordResetPageProps) {
  const {
    isValidToken,
    password,
    confirmPassword,
    error,
    isLoading,
    success,
    showPassword,
    showConfirmPassword,
    setPassword,
    setConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleSubmit,
  } = usePasswordReset();

  return (
    <main className={`min-h-screen flex flex-col lg:flex-row justify-center items-stretch bg-gradient-to-br from-amber-50 via-zinc-50 to-amber-100 ${className}`}>
      <ResetFormContainer
        isValidToken={isValidToken}
        password={password}
        confirmPassword={confirmPassword}
        error={error}
        isLoading={isLoading}
        success={success}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
        onToggleConfirmPasswordVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
        onSubmit={handleSubmit}
      />
      <ResetIllustrationSection />
    </main>
  );
}
