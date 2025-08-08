import React from 'react';
import { ContactFormProps, ContactFormData } from '@/types/contact';
import { Button, Notification } from '@/components/common';

interface ExtendedContactFormProps extends ContactFormProps {
  formData: ContactFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function ContactForm({ 
  formData,
  onInputChange,
  onSubmit, 
  isSubmitting, 
  submitStatus, 
  onReset 
}: ExtendedContactFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  const asuntoOptions = [
    { value: "", label: "Selecciona un asunto" },
    { value: "Consulta General", label: "Consulta General" },
    { value: "Información de Posgrado", label: "Información de Posgrado" },
    { value: "Matrícula", label: "Matrícula" },
    { value: "Admisión", label: "Admisión" },
    { value: "Trámites Administrativos", label: "Trámites Administrativos" },
    { value: "Quejas y Sugerencias", label: "Quejas y Sugerencias" },
    { value: "Otros", label: "Otros" }
  ];

  return (
    <form 
      className="flex-1 bg-white border border-gray-200 rounded-2xl shadow p-4 sm:p-6" 
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        Envíanos un mensaje
      </h2>
      
      {submitStatus.type && (
        <div className="mb-4">
          <Notification 
            type={submitStatus.type} 
            message={submitStatus.message}
            onClose={onReset}
          />
        </div>
      )}
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1 text-sm sm:text-base font-medium" htmlFor="nombre">
              Nombre *
            </label>
            <input 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              type="text" 
              id="nombre" 
              name="nombre"
              value={formData.nombre}
              onChange={onInputChange}
              placeholder="Tu nombre completo"
              required 
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 text-sm sm:text-base font-medium" htmlFor="email">
              Correo electrónico *
            </label>
            <input 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={onInputChange}
              placeholder="tucorreo@ejemplo.com"
              required 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1 text-sm sm:text-base font-medium" htmlFor="telefono">
              Teléfono (opcional)
            </label>
            <input 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              type="tel" 
              id="telefono" 
              name="telefono"
              value={formData.telefono}
              onChange={onInputChange}
              placeholder="(056) 123-4567"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 text-sm sm:text-base font-medium" htmlFor="asunto">
              Asunto *
            </label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              id="asunto" 
              name="asunto"
              value={formData.asunto}
              onChange={onInputChange}
              required
            >
              {asuntoOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base font-medium" htmlFor="mensaje">
            Mensaje *
          </label>
          <textarea 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical" 
            id="mensaje" 
            name="mensaje"
            value={formData.mensaje}
            onChange={onInputChange}
            rows={4} 
            placeholder="Describe tu consulta o mensaje..."
            maxLength={500}
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.mensaje.length}/500 caracteres
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button 
            type="submit" 
            variant="primary" 
            className="flex-1 sm:flex-none sm:min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </>
            ) : (
              'Enviar mensaje'
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1 sm:flex-none sm:min-w-[120px]"
            onClick={onReset}
            disabled={isSubmitting}
          >
            Limpiar
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 mt-3">
          * Campos obligatorios. Tu información será utilizada únicamente para responder a tu consulta.
        </div>
      </div>
    </form>
  );
}
