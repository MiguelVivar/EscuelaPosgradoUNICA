import { useState, useCallback } from "react";
import { RecoveryService } from "@/services/recoveryService";
import { UsePasswordRecoveryReturn } from "@/types/passwordRecovery";

export function usePasswordRecovery(): UsePasswordRecoveryReturn {
  const [enviado, setEnviado] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.endsWith("@unica.edu.pe");
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      if (!email.trim()) {
        setError("Por favor, ingresa tu correo electrónico.");
        setIsLoading(false);
        return;
      }

      if (!validateEmail(email)) {
        setError(
          "Por favor, ingresa un correo institucional válido (@unica.edu.pe)."
        );
        setIsLoading(false);
        return;
      }

      try {
        console.log("🚀 Iniciando proceso de recuperación de contraseña...");
        const response = await RecoveryService.sendRecoveryEmail(email);

        console.log("📥 Respuesta recibida:", response);

        if (response.success) {
          console.log("✅ Email enviado exitosamente");
          setEnviado(true);
        } else {
          console.warn("⚠️ Error en la respuesta:", response.message);
          setError(
            response.message || "Error al enviar el correo de recuperación."
          );
        }
      } catch (err) {
        console.error("❌ Error en recuperación de contraseña:", err);

        let errorMessage = "Ocurrió un error. Por favor, intenta nuevamente.";

        if (err instanceof Error) {
          errorMessage = err.message;

          if (process.env.NODE_ENV === "development") {
            console.error("🔍 Detalles del error:", {
              name: err.name,
              message: err.message,
              stack: err.stack,
            });
          }
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [email, validateEmail]
  );

  const resetForm = useCallback(() => {
    setEnviado(false);
    setEmail("");
    setError("");
    setIsLoading(false);
  }, []);

  return {
    enviado,
    email,
    error,
    isLoading,
    setEmail,
    setError,
    handleSubmit,
    resetForm,
  };
}
