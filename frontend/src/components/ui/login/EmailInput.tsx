import React from "react";

interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function EmailInput({ value, onChange, error }: EmailInputProps) {
  return (
    <div className="space-y-3">
      <label
        htmlFor="email"
        className="block text-sm font-semibold text-gray-700"
      >
        Correo Electrónico Institucional
      </label>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={value}
          onChange={onChange}
          className={`relative w-full px-4 py-4 border-2 ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-200/50 focus:border-amber-500 focus:ring-amber-500/20'
          } rounded-xl focus:ring-4 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 hover:border-amber-300 hover:bg-white/90`}
          placeholder="12345678@unica.edu.pe"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          <svg
            className={`h-5 w-5 transition-colors duration-300 ${
              error 
                ? 'text-red-400' 
                : 'text-gray-400 group-hover:text-amber-500'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-red-600 text-sm font-medium flex items-center space-x-1">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
