/**
 * Almacén temporal de tokens de recuperación
 * En una implementación de producción, esto debería ser una base de datos
 */

export interface RecoveryTokenData {
  email: string;
  createdAt: Date;
  used: boolean;
}

// Mapa global para almacenar tokens
declare global {
  var recoveryTokens: Map<string, RecoveryTokenData> | undefined;
}

// Usar un almacén global para evitar reinicios en desarrollo
export const recoveryTokens = globalThis.recoveryTokens ?? new Map<string, RecoveryTokenData>();

if (process.env.NODE_ENV !== 'production') {
  globalThis.recoveryTokens = recoveryTokens;
}

/**
 * Limpia tokens expirados (más de 24 horas)
 */
export function cleanupExpiredTokens(): void {
  const now = new Date();
  const twentyFourHours = 24 * 60 * 60 * 1000;

  for (const [token, data] of recoveryTokens.entries()) {
    const tokenAge = now.getTime() - data.createdAt.getTime();
    if (tokenAge > twentyFourHours) {
      recoveryTokens.delete(token);
    }
  }
}

/**
 * Valida si un token es válido y no ha expirado
 */
export function validateToken(token: string): { valid: boolean; message: string; data?: RecoveryTokenData } {
  const tokenData = recoveryTokens.get(token);
  
  if (!tokenData) {
    return { valid: false, message: "Token no válido" };
  }

  if (tokenData.used) {
    return { valid: false, message: "Este enlace ya ha sido utilizado" };
  }

  const now = new Date();
  const tokenAge = now.getTime() - tokenData.createdAt.getTime();
  const twentyFourHours = 24 * 60 * 60 * 1000;

  if (tokenAge > twentyFourHours) {
    recoveryTokens.delete(token);
    return { valid: false, message: "El enlace ha expirado. Solicita uno nuevo." };
  }

  return { valid: true, message: "Token válido", data: tokenData };
}

/**
 * Marca un token como usado
 */
export function markTokenAsUsed(token: string): boolean {
  const tokenData = recoveryTokens.get(token);
  if (tokenData) {
    tokenData.used = true;
    recoveryTokens.set(token, tokenData);
    return true;
  }
  return false;
}
