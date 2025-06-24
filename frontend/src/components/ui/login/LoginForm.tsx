"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/Button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { elementRef: formRef, animateOnScroll } = useScrollAnimation();

  useEffect(() => {
    if (formRef.current) {
      animateOnScroll(formRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "power2.out",
      });
    }
  }, [animateOnScroll, formRef]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aquí iría la lógica de autenticación
      console.log("Datos de login:", formData);

      // Simulación de autenticación
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redireccionar después del login exitoso
      router.push("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={formRef as React.RefObject<HTMLDivElement>}
      className="w-full max-w-6xl mx-auto opacity-0 translate-y-8"
    >
      {/* Contenedor principal con glassmorphism - Grid de 2 columnas */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">
        
        {/* Columna Izquierda - Imagen y Branding */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 relative overflow-hidden flex flex-col justify-center items-center p-8 lg:p-12">
          {/* Elementos decorativos de fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center">
            {/* Logos */}
            <div className="flex justify-center items-center space-x-8 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
                <div className="relative bg-white/95 p-4 rounded-3xl shadow-2xl backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/assets/logoUNICA.png"
                    alt="Logo UNICA"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
                <div className="relative bg-white/95 p-4 rounded-3xl shadow-2xl backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/assets/logoPosgrado.png"
                    alt="Logo Posgrado"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Título principal */}
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-2xl">
              Bienvenido
            </h1>
            <h2 className="text-xl lg:text-2xl font-semibold text-white/95 mb-6 drop-shadow-lg">
              Escuela de Posgrado UNICA
            </h2>
            
            {/* Descripción */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <p className="text-white/90 text-lg leading-relaxed">
                "Formando líderes para el futuro a través de la excelencia académica y la investigación de vanguardia"
              </p>
            </div>

            {/* Elementos decorativos adicionales */}
            <div className="mt-8 flex justify-center space-x-4">
              <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Formulario */}
        <div className="px-8 py-10 lg:px-12 lg:py-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Iniciar Sesión
              </h2>
              <p className="text-gray-600 text-lg">
                Accede a tu cuenta institucional
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div className="space-y-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="relative w-full px-4 py-4 border-2 border-gray-200/50 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 hover:border-amber-300 hover:bg-white/90"
                    placeholder="correo@unica.edu.pe"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400 group-hover:text-amber-500 transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Contraseña
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="relative w-full px-4 py-4 border-2 border-gray-200/50 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 hover:border-amber-300 hover:bg-white/90 pr-12"
                    placeholder="Ingresa tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-amber-600 transition-colors duration-300 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Recordar sesión y recuperar contraseña */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded transition-all duration-200 hover:scale-110"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-gray-700 font-medium"
                  >
                    Recordar sesión
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/recuperar-password"
                    className="text-amber-600 hover:text-amber-700 font-semibold transition-all duration-200 hover:underline underline-offset-4"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              {/* Botón de envío */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 active:scale-95 focus:ring-4 focus:ring-amber-500/30 disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Iniciar Sesión</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>

              {/* Enlaces adicionales dentro del formulario */}
              <div className="text-center space-y-3 pt-4 border-t border-gray-200/50">
                <div className="text-sm text-gray-600">
                  ¿No tienes una cuenta?{" "}
                  <Link
                    href="/registro"
                    className="text-amber-600 hover:text-amber-700 font-bold transition-colors duration-200 hover:underline underline-offset-4"
                  >
                    Regístrate aquí
                  </Link>
                </div>

                <div className="text-sm text-gray-500">
                  <Link
                    href="/ayuda"
                    className="hover:text-amber-600 transition-colors duration-200 hover:underline underline-offset-4"
                  >
                    ¿Necesitas ayuda?
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Información adicional debajo del grid */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm border border-amber-200/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 p-2 bg-amber-100 rounded-full">
              <svg
                className="h-6 w-6 text-amber-600"
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-800 mb-1">
                Acceso Institucional
              </h3>
              <p className="text-sm text-amber-700">
                Utiliza tu correo institucional <span className="font-semibold">@unica.edu.pe</span> para acceder al sistema académico de la Escuela de Posgrado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
