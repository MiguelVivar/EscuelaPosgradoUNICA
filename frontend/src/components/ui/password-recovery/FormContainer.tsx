import React from "react";
import LogoBranding from "./LogoBranding";
import PageHeader from "./PageHeader";
import RecoveryForm from "./RecoveryForm";
import SuccessMessage from "./SuccessMessage";
import BackToLogin from "./BackToLogin";

interface FormContainerProps {
  enviado: boolean;
  email: string;
  error: string;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export default function FormContainer({
  enviado,
  email,
  error,
  isLoading,
  onEmailChange,
  onSubmit,
  className = "",
}: FormContainerProps) {
  return (
    <section
      className={`w-full lg:w-1/3 flex flex-col justify-center items-center px-4 py-8 sm:px-6 sm:py-12 md:py-16 ${className}`}
    >
      <div className="w-full max-w-md lg:max-w-full bg-white rounded-2xl shadow-2xl shadow-zinc-400 border border-zinc-200 px-6 sm:px-8 md:px-10 py-14 sm:py-20 md:py-24 flex flex-col items-center mt-16 lg:mt-0">
        <LogoBranding />
        <PageHeader />

        {enviado ? (
          <div className="w-full">
            <SuccessMessage className="mb-4" />
            <BackToLogin />
          </div>
        ) : (
          <RecoveryForm
            email={email}
            error={error}
            isLoading={isLoading}
            onEmailChange={onEmailChange}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </section>
  );
}
