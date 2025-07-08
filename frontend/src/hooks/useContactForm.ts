import { useState, useCallback } from 'react';
import emailjs from '@emailjs/browser';

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

interface SubmitStatus {
  type: 'success' | 'error' | null;
  message: string;
}

const initialFormData: FormData = {
  nombre: "",
  email: "",
  telefono: "",
  asunto: "",
  mensaje: ""
};

export const useContactForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: null, message: "" });

  // Configuración de EmailJS
  const EMAIL_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
  const EMAIL_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
  const EMAIL_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (submitStatus.type === 'error') {
      setSubmitStatus({ type: null, message: "" });
    }
  }, [submitStatus.type]);

  const validateForm = useCallback(() => {
    if (!formData.nombre.trim()) {
      setSubmitStatus({ type: 'error', message: 'El nombre es requerido' });
      return false;
    }
    if (!formData.email.trim()) {
      setSubmitStatus({ type: 'error', message: 'El correo electrónico es requerido' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setSubmitStatus({ type: 'error', message: 'El formato del correo electrónico no es válido' });
      return false;
    }
    if (!formData.asunto.trim()) {
      setSubmitStatus({ type: 'error', message: 'El asunto es requerido' });
      return false;
    }
    if (!formData.mensaje.trim()) {
      setSubmitStatus({ type: 'error', message: 'El mensaje es requerido' });
      return false;
    }
    if (formData.mensaje.length > 500) {
      setSubmitStatus({ type: 'error', message: 'El mensaje no puede exceder los 500 caracteres' });
      return false;
    }
    return true;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setSubmitStatus({ type: null, message: "" });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: "" });

    if (!validateForm()) {
      return;
    }

    // Verificar configuración de EmailJS
    if (!EMAIL_SERVICE_ID || !EMAIL_TEMPLATE_ID || !EMAIL_PUBLIC_KEY) {
      setSubmitStatus({
        type: 'error',
        message: 'Error de configuración. Por favor, contacta al administrador.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const templateParams = {
        from_name: formData.nombre,
        from_email: formData.email,
        phone: formData.telefono || 'No proporcionado',
        subject: formData.asunto,
        message: formData.mensaje,
        to_email: 'diga@unica.edu.pe'
      };

      await emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        templateParams,
        EMAIL_PUBLIC_KEY
      );

      setSubmitStatus({
        type: 'success',
        message: 'Mensaje enviado correctamente. Te responderemos pronto.'
      });

      // Limpiar formulario después de envío exitoso
      setFormData(initialFormData);

    } catch (error) {
      console.error('Error enviando email:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Error al enviar el mensaje. Por favor, inténtalo nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, EMAIL_PUBLIC_KEY]);

  return {
    formData,
    isSubmitting,
    submitStatus,
    handleInputChange,
    handleSubmit,
    resetForm
  };
};
