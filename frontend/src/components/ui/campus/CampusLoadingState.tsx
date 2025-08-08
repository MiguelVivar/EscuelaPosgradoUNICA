"use client";

import { CampusLoadingStateProps } from "@/types";

export default function CampusLoadingState({ 
  message = "Cargando Campus Virtual..." 
}: CampusLoadingStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}
