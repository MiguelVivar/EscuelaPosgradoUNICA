"use client";
import React, { Suspense } from "react";
import { PasswordResetPage, PasswordResetLoadingFallback } from "@/components/ui/password-reset";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PasswordResetLoadingFallback />}>
      <PasswordResetPage />
    </Suspense>
  );
}
