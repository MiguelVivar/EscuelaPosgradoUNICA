"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEmailValidation } from "@/hooks/useEmailValidation";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/types/auth";
import LoginBrandingSection from "./LoginBrandingSection";
import LoginFormSection from "./LoginFormSection";
import EmailFormatInfo from "./EmailFormatInfo";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const { elementRef: formRef, animateOnScroll } = useScrollAnimation();
  const hasAnimated = useRef(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/campus-virtual");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (formRef.current && !hasAnimated.current) {
      hasAnimated.current = true;
      animateOnScroll(formRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "power2.out",
      });
    }
  }, [animateOnScroll, formRef]);

  const { validateEmail } = useEmailValidation();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (loginError) setLoginError("");
    if (successMessage) setSuccessMessage("");

    // Validar email en tiempo real
    if (name === "email") {
      if (value === "") {
        setEmailError("");
      } else if (!validateEmail(value)) {
        setEmailError("El correo debe tener el formato: 12345678@unica.edu.pe");
      } else {
        setEmailError("");
      }
    }
  }, [validateEmail, loginError, successMessage]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiar mensajes previos
    setLoginError("");
    setSuccessMessage("");
    
    // Validar el formato del correo antes de enviar
    if (!validateEmail(formData.email)) {
      setEmailError("El correo debe tener el formato: 12345678@unica.edu.pe");
      return;
    }

    // Validar que los campos no estén vacíos
    if (!formData.email.trim() || !formData.password.trim()) {
      setLoginError("Por favor, complete todos los campos");
      return;
    }

    setEmailError("");
    setIsLoading(true);

    try {
      const response = await login({
        usernameOrEmail: formData.email,
        password: formData.password,
      });

      setSuccessMessage(`¡Bienvenido/a, ${response.nombres}!`);
      
      // Esperar un momento para mostrar el mensaje de éxito
      setTimeout(() => {
        router.push("/campus-virtual");
      }, 1500);

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      
      if (error instanceof ApiError) {
        setLoginError(error.message);
      } else {
        setLoginError("Error de conexión. Por favor, intente nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, router, validateEmail, login]);

  const handleTogglePassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  return (
    <div
      ref={formRef as React.RefObject<HTMLDivElement>}
      className="w-full max-w-6xl mx-auto opacity-0 translate-y-8 mt-20"
    >
      {/* Contenedor principal con glassmorphism - Grid de 2 columnas */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">
        {/* Columna Izquierda - Imagen y Branding */}
        <LoginBrandingSection />

        {/* Columna Derecha - Formulario */}
        <LoginFormSection
          formData={formData}
          isLoading={isLoading}
          showPassword={showPassword}
          emailError={emailError}
          loginError={loginError}
          successMessage={successMessage}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onTogglePassword={handleTogglePassword}
        />
      </div>

      {/* Información adicional debajo del grid */}
      <EmailFormatInfo />
    </div>
  );
}
