import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RecoveryService } from "@/services/recoveryService";
import { UsePasswordResetReturn, PasswordValidationOptions } from "@/types";

const DEFAULT_VALIDATION_OPTIONS: PasswordValidationOptions = {
  minLength: 6,
  requireUppercase: false,
  requireLowercase: false,
  requireNumbers: false,
  requireSpecialChars: false,
};

export function usePasswordReset(
  validationOptions: PasswordValidationOptions = DEFAULT_VALIDATION_OPTIONS
): UsePasswordResetReturn {
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false);
        setError("Token de recuperación no válido.");
        return;
      }

      try {
        const response = await RecoveryService.validateRecoveryToken(token);
        setIsValidToken(response.valid);
        if (!response.valid) {
          setError(response.message);
        }
      } catch (err) {
        setIsValidToken(false);
        setError(`Error al validar el token: ${err instanceof Error ? err.message : 'Ocurrió un error inesperado.'}`);
      }
    };

    validateToken();
  }, [token]);

  const validatePassword = (pass: string): boolean => {
    const { minLength = 6 } = validationOptions;
    return pass.length >= minLength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!password.trim()) {
      setError("Por favor, ingresa tu nueva contraseña.");
      setIsLoading(false);
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Por favor, confirma tu nueva contraseña.");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError(`La contraseña debe tener al menos ${validationOptions.minLength || 6} caracteres.`);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await RecoveryService.resetPassword(token!, password, confirmPassword);
      
      if (response.success) {
        setSuccess(true);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          router.push("/iniciar-sesion");
        }, 3000);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('Error al restablecer contraseña:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
}
