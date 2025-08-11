"use client";

import React from "react";
import { useContactForm } from "@/hooks/useContactForm";
import { 
  ContactPageHeader,
  ContactSection,
  DirectorySection
} from "@/components/ui/contact";
import { directoryData } from "@/data/directoryData";
import { institutionalContactInfo, mapConfig } from "@/data/contactData";

export default function ContactPage() {
  const [selectedDirectory, setSelectedDirectory] = React.useState("Alta Dirección");
  const { 
    formData, 
    isSubmitting, 
    submitStatus, 
    handleInputChange, 
    handleSubmit, 
    resetForm 
  } = useContactForm();

  const directoryMenuItems = Object.keys(directoryData);
  const currentDirectorySection = directoryData[selectedDirectory];

  const handleFormSubmit = async () => {
    const mockEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    
    await handleSubmit(mockEvent);
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 mt-16 sm:mt-20">
      <div className="container mx-auto max-w-7xl">
        <ContactPageHeader 
          title='Directorio de la Universidad Nacional "San Luis Gonzaga"'
          subtitle="Consulta de Facultades, Direcciones y Centros."
        />
          
        <ContactSection 
          contactInfo={institutionalContactInfo}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          submitStatus={submitStatus}
          onReset={resetForm}
          mapConfig={mapConfig}
        />

        <DirectorySection 
          menuItems={directoryMenuItems}
          selectedItem={selectedDirectory}
          onSelectItem={setSelectedDirectory}
          currentSection={currentDirectorySection}
        />
      </div>
    </div>
  );
}
