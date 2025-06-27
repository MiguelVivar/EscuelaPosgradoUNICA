"use client";
import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

// Importar imágenes desde assets
import posgradoImg from "../../assets/posgrado.png";
import rpfondoImg from "../../assets/rpfondo.png";

// Hook personalizado para manejar la recuperación de contraseña
function usePasswordRecovery() {
  const [enviado, setEnviado] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.endsWith("@unica.edu.pe");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email.trim()) {
      setError("Por favor, ingresa tu correo electrónico.");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, ingresa un correo institucional válido (@unica.edu.pe).");
      setIsLoading(false);
      return;
    }

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEnviado(true);
    } catch (err) {
      setError("Ocurrió un error. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    enviado,
    email,
    error,
    isLoading,
    setEmail,
    setError,
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
        priority
      />
    </div>
  );
}

// Componente para el formulario de recuperación
function RecuperarForm({
  enviado,
  error,
  email,
  setEmail,
  setError,
  handleSubmit,
  isLoading,
}: {
  enviado: boolean;
  error: string;
  email: string;
  setEmail: (v: string) => void;
  setError: (v: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="w-full mb-6">
        <span className="block text-3xl sm:text-4xl font-semibold text-red-600 tracking-widest mb-4 text-left font-sans">
          CAMPUS
        </span>
        <span className="block text-base font-bold text-zinc-700 mb-2 w-full text-left">
          Restablecer Contraseña
        </span>
        <p className="text-left text-zinc-700 text-xs font-sans leading-relaxed mb-4 mt-2">
          Introduzca su dirección de correo electrónico registrado para recibir un enlace de restablecimiento de contraseña en su bandeja de entrada.
        </p>
      </div>
      {enviado ? (
        <div className="text-green-700 bg-green-100 p-4 rounded mb-4 text-sm text-center">
          Si el correo existe, recibirás un enlace para restablecer tu contraseña.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
              <FiMail size={20} />
            </span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md outline-none bg-amber-50 text-base placeholder-zinc-500 focus:bg-amber-100 transition font-sans"
              placeholder="Correo electrónico"
              required
              autoComplete="off"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-amber-500 text-white py-2 rounded shadow hover:bg-amber-600 transition font-semibold disabled:bg-amber-300 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      )}
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

// Componente para la imagen ilustrativa
function ImagenIlustrativa() {
  return (
    <section className="hidden lg:flex lg:w-2/3 items-center justify-center relative overflow-hidden">
      <Image
        src={rpfondoImg}
        alt="Personas trabajando"
        fill
        className="object-cover"
        priority
      />
      {/* Formas geométricas flotantes */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/60 rounded-full rotate-12 drop-shadow-xl"></div>
      <div className="absolute bottom-16 left-16 w-20 h-20 bg-amber-300 rounded-full -rotate-6 drop-shadow-lg"></div>
    </section>
  );
}

export default function RecuperarContrasenaPage() {
  const {
    enviado,
    email,
    error,
    isLoading,
    setEmail,
    setError,
    handleSubmit
  } = usePasswordRecovery();

  return (
    <main className="min-h-screen flex flex-col lg:flex-row justify-center items-stretch bg-gradient-to-br from-amber-50 via-zinc-50 to-amber-100">
      {/* Formulario centrado y responsive */}
      <section className="w-full lg:w-1/3 flex flex-col justify-center items-center px-4 py-8 sm:px-6 sm:py-12 md:py-16">
        <div className="w-full max-w-md lg:max-w-full bg-white rounded-2xl shadow-2xl shadow-zinc-400 border border-zinc-200 px-6 sm:px-8 md:px-10 py-14 sm:py-20 md:py-24 flex flex-col items-center mt-16 lg:mt-0">
          <HeaderPosgrado />
          <RecuperarForm
            enviado={enviado}
            error={error}
            email={email}
            setEmail={setEmail}
            setError={setError}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </section>
      {/* Imagen ilustrativa solo en pantallas grandes */}
      <ImagenIlustrativa />
    </main>
  );
}