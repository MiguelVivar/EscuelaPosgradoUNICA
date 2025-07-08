import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glassmorphism';
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({ 
  children, 
  className = '', 
  variant = 'glassmorphism',
  padding = 'lg'
}: CardProps) {
  const baseClasses = "rounded-2xl shadow-xl border";
  
  const variantClasses = {
    default: "bg-white border-gray-200",
    glassmorphism: "bg-white/80 backdrop-blur-xl border-white/20"
  };

  const paddingClasses = {
    sm: "p-4",
    md: "p-6", 
    lg: "p-8"
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
}
