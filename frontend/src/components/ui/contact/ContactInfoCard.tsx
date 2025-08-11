import React from 'react';
import { ContactInfoCardProps } from '@/types/contact';

export default function ContactInfoCard({ contactInfo }: ContactInfoCardProps) {
  const renderContactValue = (value: string, type?: string) => {
    const baseClasses = "text-gray-700 text-sm sm:text-base";
    
    switch (type) {
      case 'email':
        return (
          <div className={`${baseClasses} break-all`}>
            {value}
          </div>
        );
      case 'phone':
        return (
          <div className={baseClasses}>
            {value}
          </div>
        );
      case 'address':
        return (
          <div className={baseClasses}>
            {value}
          </div>
        );
      default:
        return (
          <div className={baseClasses}>
            {value}
          </div>
        );
    }
  };

  return (
    <div className="w-full lg:w-80 lg:flex-shrink-0 bg-white border border-gray-200 rounded-2xl shadow p-4 sm:p-6 flex flex-col gap-4 justify-between">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          Contacto institucional
        </h2>
        <div className="space-y-3">
          {contactInfo.map((info, index) => (
            <div key={index}>
              <span className="font-semibold text-gray-700 text-sm sm:text-base">
                {info.label}
              </span>
              {renderContactValue(info.value, info.type)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
