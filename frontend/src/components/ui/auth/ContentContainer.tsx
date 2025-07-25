import React from 'react';

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function ContentContainer({ 
  children,
  className = "" 
}: ContentContainerProps) {
  const baseClasses = "relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
}
