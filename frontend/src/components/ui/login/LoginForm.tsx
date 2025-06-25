"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEmailValidation } from "@/hooks/useEmailValidation";
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
  const router = useRouter();
  const { elementRef: formRef, animateOnScroll } = useScrollAnimation();
  const hasAnimated = useRef(false);

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
  }, [validateEmail]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar el formato del correo antes de enviar
    if (!validateEmail(formData.email)) {
      setEmailError("El correo debe tener el formato: 12345678@unica.edu.pe");
      return;
    }

    setEmailError("");
    setIsLoading(true);

    try {
      // Aquí iría la lógica de autenticación
      console.log("Datos de login:", formData);

      // Simulación de autenticación
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redireccionar después del login exitoso
      router.push("/campus-virtual");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, router, validateEmail]);

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
