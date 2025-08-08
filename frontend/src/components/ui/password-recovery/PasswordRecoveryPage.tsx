import React from "react";
import FormContainer from "./FormContainer";
import IllustrationSection from "./IllustrationSection";
import { usePasswordRecovery } from "@/hooks/usePasswordRecovery";

interface PasswordRecoveryPageProps {
  className?: string;
}

export default function PasswordRecoveryPage({
  className = "",
}: PasswordRecoveryPageProps) {
  const { enviado, email, error, isLoading, setEmail, handleSubmit } =
    usePasswordRecovery();

  return (
    <main
      className={`min-h-screen flex flex-col lg:flex-row justify-center items-stretch bg-gradient-to-br from-amber-50 via-zinc-50 to-amber-100 ${className}`}
    >
      <FormContainer
        enviado={enviado}
        email={email}
        error={error}
        isLoading={isLoading}
        onEmailChange={setEmail}
        onSubmit={handleSubmit}
      />
      <IllustrationSection />
    </main>
  );
}
