import React from 'react';

interface PageBackgroundProps {
  children: React.ReactNode;
  gradient?: string;
  className?: string;
}

export default function PageBackground({ 
  children,
  gradient = "bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50",
  className = ""
}: PageBackgroundProps) {
  const baseClasses = "min-h-screen relative overflow-hidden";
  const combinedClasses = `${baseClasses} ${gradient} ${className}`.trim();

  return (
    <main className={combinedClasses}>
      {children}
    </main>
  );
}
