import React from "react";
import EmailInput from "./EmailInput";
import SubmitButton from "./SubmitButton";
import BackToLogin from "./BackToLogin";
import { Alert } from "@/components/ui/common";

interface RecoveryFormProps {
  email: string;
  error: string;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export default function RecoveryForm({
  email,
  error,
  isLoading,
  onEmailChange,
  onSubmit,
  className = "",
}: RecoveryFormProps) {
  return (
    <div
      className={`flex flex-col justify-center items-center w-full ${className}`}
    >
      <form onSubmit={onSubmit} className="space-y-5 w-full">
        <EmailInput
          value={email}
          onChange={onEmailChange}
          disabled={isLoading}
        />

        {error && (
          <Alert type="error" message={error} className="text-center" />
        )}

        <SubmitButton isLoading={isLoading} />
      </form>

      <BackToLogin />
    </div>
  );
}
