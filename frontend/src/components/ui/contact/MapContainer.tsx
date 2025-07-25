import React from 'react';
import { MapProps } from '@/types/contact';

export default function MapContainer({ 
  title = "Ubicación", 
  embedUrl, 
  width = "100%", 
  height = "250",
  className = ""
}: MapProps) {
  return (
    <div className={`w-full lg:w-80 lg:flex-shrink-0 min-h-[250px] sm:min-h-[300px] bg-gray-100 border border-gray-200 rounded-2xl shadow overflow-hidden ${className}`}>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 p-4">
        {title}
      </h2>
      <iframe
        title={title}
        src={embedUrl}
        width={width}
        height={height}
        className="sm:h-[300px]"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
