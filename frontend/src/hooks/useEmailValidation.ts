import { useCallback } from "react";

export const useEmailValidation = () => {
  // Función para validar el formato de correo institucional
  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^\d{8}@unica\.edu\.pe$/;
    return emailRegex.test(email);
  }, []);

  return { validateEmail };
};
