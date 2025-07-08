/**
 * Servicio para manejar la recuperación de contraseñas
 */

export interface RecoveryResponse {
  success: boolean;
  message: string;
}

export class RecoveryService {
  private static baseUrl = '/api';

  /**
   * Envía un email de recuperación de contraseña
   */
  static async sendRecoveryEmail(email: string): Promise<RecoveryResponse> {
    try {
      console.log('Enviando solicitud de recuperación para:', email);
      
      const response = await fetch(`${this.baseUrl}/recover-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      // Verificar si la respuesta es válida
      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Error al parsear respuesta de error:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      // Intentar parsear JSON con manejo de errores mejorado
      let data;
      try {
        const responseText = await response.text();
        console.log('Respuesta del servidor (texto):', responseText);
        
        if (!responseText.trim()) {
          throw new Error('Respuesta vacía del servidor');
        }
        
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error al parsear JSON:', parseError);
        throw new Error('Respuesta inválida del servidor. Por favor, intenta nuevamente.');
      }

      console.log('Datos parseados:', data);

      // En desarrollo, mostrar el enlace si está disponible
      if (process.env.NODE_ENV === 'development' && data.dev_info) {
        console.log('🔗 DESARROLLO - Enlace de recuperación:', data.dev_info.recovery_link);
        console.log('💡 Nota:', data.dev_info.note);
      }

      return data;
    } catch (error) {
      console.error('Error en sendRecoveryEmail:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Error de conexión con el servidor. Verifica tu conexión a internet.');
    }
  }

  /**
   * Valida un token de recuperación
   */
  static async validateRecoveryToken(token: string): Promise<{ valid: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/recover-password/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en validateRecoveryToken:', error);
      return { valid: false, message: 'Error al validar el token' };
    }
  }

  /**
   * Restablece la contraseña usando un token válido
   */
  static async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<RecoveryResponse> {
    try {
      if (newPassword !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (newPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      const response = await fetch(`${this.baseUrl}/recover-password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, 
          newPassword, 
          confirmPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al restablecer la contraseña');
      }

      return data;
    } catch (error) {
      console.error('Error en resetPassword:', error);
      throw error;
    }
  }
}
