"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import posgradoImg from "@/assets/posgrado.png";
import { RecoveryService } from "@/services/recoveryService";

// Hook personalizado para manejar el reset de contraseña
function usePasswordReset() {
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
      } catch (error) {
        setIsValidToken(false);
        setError(`Error al validar el token: ${error instanceof Error ? error.message : 'Ocurrió un error inesperado.'}`);
      }
    };

    validateToken();
  }, [token]);

  const validatePassword = (pass: string): boolean => {
    return pass.length >= 6;
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
      setError("La contraseña debe tener al menos 6 caracteres.");
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
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      if (error instanceof Error) {
        setError(error.message);
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
    handleSubmit
  };
}

// Componente para el logo y título
function HeaderPosgrado() {
  return (
    <div className="flex flex-row items-start justify-between w-full mb-6 gap-4 -mt-14">
      <div className="flex flex-col items-start flex-1">
        <span className="block text-xl sm:text-2xl font-semibold text-amber-500 leading-tight font-sans">
          Escuela de Posgrado
        </span>
        <span className="block text-2xl sm:text-3xl font-semibold text-red-600 leading-tight font-sans tracking-wide mt-1">
          UNICA
        </span>
      </div>
      <Image
        src={posgradoImg}
        alt="Posgrado"
        width={96}
        height={96}
        className="h-20 sm:h-24 w-auto"
      />
    </div>
  );
}

// Componente para el formulario de reset
function ResetForm({
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
  handleSubmit
}: {
  isValidToken: boolean | null;
  password: string;
  confirmPassword: string;
  error: string;
  isLoading: boolean;
  success: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  setShowPassword: (v: boolean) => void;
  setShowConfirmPassword: (v: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  if (isValidToken === null) {
    return (
      <div className="flex flex-col justify-center items-center w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-zinc-600">Validando enlace de recuperación...</p>
        </div>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="flex flex-col justify-center items-center w-full">
        <div className="text-center">
          <div className="text-red-600 bg-red-100 p-4 rounded mb-4 text-sm">
            {error || "El enlace de recuperación no es válido o ha expirado."}
          </div>
          <Link
            href="/recuperar-password"
            className="text-amber-600 hover:underline font-medium"
          >
            Solicitar nuevo enlace de recuperación
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col justify-center items-center w-full">
        <div className="text-center">
          <FiCheckCircle className="mx-auto mb-4 text-green-500" size={48} />
          <div className="text-green-700 bg-green-100 p-4 rounded mb-4 text-sm">
            ¡Contraseña restablecida exitosamente! Serás redirigido al inicio de sesión en unos segundos.
          </div>
          <Link
            href="/iniciar-sesion"
            className="text-amber-600 hover:underline font-medium"
          >
            Ir a iniciar sesión ahora
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="w-full mb-6">
        <span className="block text-3xl sm:text-4xl font-semibold text-red-600 tracking-widest mb-4 text-left font-sans">
          NUEVA
        </span>
        <span className="block text-base font-bold text-zinc-700 mb-2 w-full text-left">
          Restablecer Contraseña
        </span>
        <p className="text-left text-zinc-700 text-xs font-sans leading-relaxed mb-4 mt-2">
          Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres para garantizar la seguridad de tu cuenta.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        {/* Nueva contraseña */}
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
            <FiLock size={20} />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="pl-10 pr-12 py-2 w-full rounded-md outline-none bg-amber-50 text-base placeholder-zinc-500 focus:bg-amber-100 transition font-sans"
            placeholder="Nueva contraseña"
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        {/* Confirmar contraseña */}
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
            <FiLock size={20} />
          </span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="pl-10 pr-12 py-2 w-full rounded-md outline-none bg-amber-50 text-base placeholder-zinc-500 focus:bg-amber-100 transition font-sans"
            placeholder="Confirmar nueva contraseña"
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-amber-500 text-white py-2 rounded shadow hover:bg-amber-600 transition font-semibold disabled:bg-amber-300 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Restableciendo..." : "Restablecer Contraseña"}
        </button>
      </form>

      <div className="mt-4 text-center w-full">
        <Link
          href="/iniciar-sesion"
          className="hover:underline text-sm text-amber-600 font-medium"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    </div>
  );
}

// Componente principal que usa useSearchParams
function ResetPasswordContent() {
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
    handleSubmit
  } = usePasswordReset();

  return (
    <main className="min-h-screen flex flex-col lg:flex-row justify-center items-stretch bg-gradient-to-br from-amber-50 via-zinc-50 to-amber-100">
      {/* Formulario centrado */}
      <section className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 py-8 sm:px-6 sm:py-12 md:py-16">
        <div className="w-full max-w-md lg:max-w-full bg-white rounded-2xl shadow-2xl shadow-zinc-400 border border-zinc-200 px-6 sm:px-8 md:px-10 py-14 sm:py-20 md:py-24 flex flex-col items-center mt-16 lg:mt-0">
          <HeaderPosgrado />
          <ResetForm
            isValidToken={isValidToken}
            password={password}
            confirmPassword={confirmPassword}
            error={error}
            isLoading={isLoading}
            success={success}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            handleSubmit={handleSubmit}
          />
        </div>
      </section>

      {/* Imagen ilustrativa solo en pantallas grandes */}
      <section className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
        <div className="text-center p-8">
          <FiLock className="mx-auto mb-6 text-amber-600" size={120} />
          <h2 className="text-3xl font-bold text-amber-800 mb-4">
            Nueva Contraseña
          </h2>
          <p className="text-amber-700 text-lg max-w-md">
            Estás a punto de establecer una nueva contraseña segura para tu cuenta de la Escuela de Posgrado UNICA.
          </p>
        </div>
        
        {/* Formas geométricas flotantes */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/60 rounded-full rotate-12 drop-shadow-xl"></div>
        <div className="absolute bottom-16 left-16 w-20 h-20 bg-amber-300 rounded-full -rotate-6 drop-shadow-lg"></div>
      </section>
    </main>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row justify-center items-stretch bg-gradient-to-br from-amber-50 via-zinc-50 to-amber-100">
      <section className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 px-8 py-20 flex flex-col items-center">
          <div className="flex flex-row items-start justify-between w-full mb-6 gap-4 -mt-14">
            <div className="flex flex-col items-start flex-1">
              <span className="block text-xl sm:text-2xl font-semibold text-amber-500 leading-tight font-sans">
                Escuela de Posgrado
              </span>
              <span className="block text-2xl sm:text-3xl font-semibold text-red-600 leading-tight font-sans tracking-wide mt-1">
                UNICA
              </span>
            </div>
            <Image
              src={posgradoImg}
              alt="Posgrado"
              width={96}
              height={96}
              className="h-20 sm:h-24 w-auto"
            />
          </div>
          <div className="flex flex-col justify-center items-center w-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-zinc-600">Cargando...</p>
            </div>
          </div>
        </div>
      </section>
      <section className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
        <div className="text-center p-8">
          <FiLock className="mx-auto mb-6 text-amber-600" size={120} />
          <h2 className="text-3xl font-bold text-amber-800 mb-4">
            Nueva Contraseña
          </h2>
          <p className="text-amber-700 text-lg max-w-md">
            Estás a punto de establecer una nueva contraseña segura para tu cuenta de la Escuela de Posgrado UNICA.
          </p>
        </div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/60 rounded-full rotate-12 drop-shadow-xl"></div>
        <div className="absolute bottom-16 left-16 w-20 h-20 bg-amber-300 rounded-full -rotate-6 drop-shadow-lg"></div>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
