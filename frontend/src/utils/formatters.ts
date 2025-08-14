/**
 * Utilidades para formatear datos
 */

/**
 * Formatear moneda en soles peruanos
 */
export const formatCurrency = (amount: number, currency: 'PEN' | 'USD' = 'PEN'): string => {
  const formatter = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
};

/**
 * Formatear fecha en formato peruano
 */
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('es-PE', { ...defaultOptions, ...options }).format(dateObj);
};

/**
 * Formatear fecha y hora
 */
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Formatear porcentaje
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formatear número con separadores de miles
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Truncar texto con elipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalizar primera letra
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formatear nombre completo
 */
export const formatFullName = (firstName: string, lastName: string): string => {
  return `${firstName.trim()} ${lastName.trim()}`;
};

/**
 * Formatear código de estudiante
 */
export const formatStudentCode = (code: string): string => {
  // Formato típico: YYYY-XXXXXX
  if (code.length >= 6) {
    return `${code.substring(0, 4)}-${code.substring(4)}`;
  }
  return code;
};

/**
 * Formatear DNI
 */
export const formatDNI = (dni: string): string => {
  // Formato: XX.XXX.XXX
  if (dni.length === 8) {
    return `${dni.substring(0, 2)}.${dni.substring(2, 5)}.${dni.substring(5)}`;
  }
  return dni;
};

/**
 * Formatear teléfono
 */
export const formatPhone = (phone: string): string => {
  // Formato: (XXX) XXX-XXXX para números de 9 dígitos
  if (phone.length === 9) {
    return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6)}`;
  }
  return phone;
};

/**
 * Obtener iniciales de un nombre
 */
export const getInitials = (firstName: string, lastName?: string): string => {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  return firstInitial + lastInitial;
};

/**
 * Formatear estado con color
 */
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    // Estados académicos
    'ACTIVO': 'bg-green-100 text-green-800',
    'INACTIVO': 'bg-gray-100 text-gray-800',
    'SUSPENDIDO': 'bg-red-100 text-red-800',
    'EGRESADO': 'bg-blue-100 text-blue-800',
    
    // Estados de matrícula
    'MATRICULADO': 'bg-green-100 text-green-800',
    'PENDIENTE': 'bg-yellow-100 text-yellow-800',
    'CANCELADO': 'bg-red-100 text-red-800',
    'RETIRADO': 'bg-gray-100 text-gray-800',
    
    // Estados de pago
    'PAGADO': 'bg-green-100 text-green-800',
    'VENCIDO': 'bg-red-100 text-red-800',
    'ANULADO': 'bg-gray-100 text-gray-800',
    
    // Estados académicos de notas
    'APROBADO': 'bg-green-100 text-green-800',
    'DESAPROBADO': 'bg-red-100 text-red-800',
    'CURSANDO': 'bg-blue-100 text-blue-800',
    
    // Estados generales
    'COMPLETADO': 'bg-green-100 text-green-800',
    'EN_PROCESO': 'bg-yellow-100 text-yellow-800',
    'RECHAZADO': 'bg-red-100 text-red-800',
  };
  
  return statusColors[status.toUpperCase()] || 'bg-gray-100 text-gray-800';
};

/**
 * Calcular días hasta una fecha
 */
export const getDaysUntil = (date: string | Date): number => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Verificar si una fecha está vencida
 */
export const isOverdue = (date: string | Date): boolean => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return targetDate < today;
};

/**
 * Formatear créditos académicos
 */
export const formatCredits = (credits: number): string => {
  return `${credits} ${credits === 1 ? 'crédito' : 'créditos'}`;
};

/**
 * Formatear semestre académico
 */
export const formatSemester = (semester: number): string => {
  const roman = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return `${roman[semester] || semester}° Semestre`;
};

/**
 * Formatear promedio académico
 */
export const formatGPA = (gpa: number): string => {
  return gpa.toFixed(2);
};

/**
 * Formatear rango de fechas
 */
export const formatDateRange = (startDate: string | Date, endDate: string | Date): string => {
  const start = formatDate(startDate, { month: 'short', day: 'numeric' });
  const end = formatDate(endDate, { month: 'short', day: 'numeric', year: 'numeric' });
  return `${start} - ${end}`;
};
