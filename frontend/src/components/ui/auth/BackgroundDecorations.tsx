import React from 'react';

interface BackgroundDecorationsProps {
  className?: string;
}

export default function BackgroundDecorations({ 
  className = "absolute inset-0 overflow-hidden" 
}: BackgroundDecorationsProps) {
  return (
    <div className={className}>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-200/30 to-cyan-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-100/20 to-blue-100/20 rounded-full blur-3xl animate-pulse"></div>
    </div>
  );
}
