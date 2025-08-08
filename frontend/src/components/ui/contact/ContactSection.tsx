import React from 'react';
import ContactInfoCard from './ContactInfoCard';
import ContactForm from './ContactForm';
import MapContainer from './MapContainer';
import { ContactFormData, ContactInfoCardProps, MapProps } from '@/types/contact';

interface ContactSectionProps extends ContactInfoCardProps {
  formData: ContactFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  submitStatus: {
    type: 'success' | 'error' | null;
    message: string;
  };
  onReset: () => void;
  mapConfig: MapProps;
}

export default function ContactSection({ 
  contactInfo,
  formData,
  onInputChange,
  onSubmit,
  isSubmitting,
  submitStatus,
  onReset,
  mapConfig
}: ContactSectionProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
      {/* Información de contacto institucional */}
      <ContactInfoCard contactInfo={contactInfo} />

      {/* Formulario de contacto */}
      <ContactForm 
        formData={formData}
        onInputChange={onInputChange}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        submitStatus={submitStatus}
        onReset={onReset}
      />

      {/* Mapa */}
      <MapContainer 
        title={mapConfig.title}
        embedUrl={mapConfig.embedUrl}
        width={mapConfig.width}
        height={mapConfig.height}
        className={mapConfig.className}
      />
    </div>
  );
}
