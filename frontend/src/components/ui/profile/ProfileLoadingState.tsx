import React from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ProfileLoadingState() {
  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 mt-4">Cargando información del usuario...</p>
      </div>
    </div>
  );
}
