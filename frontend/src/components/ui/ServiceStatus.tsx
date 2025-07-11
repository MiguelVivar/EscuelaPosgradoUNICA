import { FiWifi, FiWifiOff, FiRefreshCw } from "react-icons/fi";

interface ServiceStatusProps {
  isAvailable: boolean | null;
  serviceName: string;
  onRetry?: () => void;
  className?: string;
}

export default function ServiceStatus({ 
  isAvailable, 
  serviceName, 
  onRetry, 
  className = "" 
}: ServiceStatusProps) {
  if (isAvailable === null) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200 ${className}`}>
        <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
        Verificando...
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
      isAvailable 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    } ${className}`}>
      {isAvailable ? <FiWifi className="w-4 h-4" /> : <FiWifiOff className="w-4 h-4" />}
      {isAvailable ? `${serviceName} Activo` : `${serviceName} Inactivo`}
      {!isAvailable && onRetry && (
        <button
          onClick={onRetry}
          className="ml-2 p-1 hover:bg-red-200 rounded transition-colors"
          title="Reintentar conexión"
        >
          <FiRefreshCw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
