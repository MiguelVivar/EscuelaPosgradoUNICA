import React from 'react';

interface ContactPageHeaderProps {
  title: string;
  subtitle: string;
}

export default function ContactPageHeader({ title, subtitle }: ContactPageHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
        {title}
      </h1>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
        {subtitle}
      </p>
    </div>
  );
}
