import React from 'react';

interface PatternOverlayProps {
  className?: string;
  opacity?: number;
  patternSize?: number;
}

export default function PatternOverlay({ 
  className = "absolute inset-0 bg-slate-100/20",
  opacity = 0.15,
  patternSize = 20
}: PatternOverlayProps) {
  return (
    <div
      className={className}
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,${opacity}) 1px, transparent 0)`,
        backgroundSize: `${patternSize}px ${patternSize}px`,
      }}
    />
  );
}
