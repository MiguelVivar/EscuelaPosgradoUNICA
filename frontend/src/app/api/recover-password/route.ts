import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { recoveryTokens, cleanupExpiredTokens } from "@/lib/recoveryTokens";

// Configuración de Mailtrap con opciones optimizadas para conectividad
const createTransporter = (port: number = 2525) => {
  return nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: port,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_USER || "012a734da54fb7",
      pass: process.env.MAILTRAP_PASSWORD || "add7b6837a0301",
    },
    // Timeouts más conservadores pero efectivos
    connectionTimeout: 30000, // 30 segundos
    greetingTimeout: 15000, // 15 segundos
    socketTimeout: 30000, // 30 segundos
    
    // Configuraciones adicionales para problemas de conectividad
    pool: false, // Desactivar pool de conexiones
    maxConnections: 1, // Solo una conexión
    maxMessages: 1, // Un mensaje por conexión
    
    // Configuración TLS permisiva
    tls: {
      rejectUnauthorized: false,
      ciphers: 'SSLv3',
    },
    
    // Configuraciones de red adicionales
    dnsTimeout: 10000, // 10 segundos para DNS
    
    // Debug habilitado en desarrollo
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development',
  } as nodemailer.TransportOptions);
};

const transporter = createTransporter();

function generateRecoveryToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateRecoveryLink(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/recuperar-password/reset?token=${token}`;
}

function generateEmailTemplate(email: string, recoveryLink: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperar Contraseña - Escuela de Posgrado UNICA</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                    Escuela de Posgrado UNICA
                </h1>
                <p style="color: #fef3c7; margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">
                    Recuperación de Contraseña
                </p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <svg width="40" height="40" fill="#ffffff" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <h2 style="color: #374151; margin: 0 0 16px 0; font-size: 24px; font-weight: 700;">
                        Solicitud de Recuperación
                    </h2>
                    <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">
                        Hemos recibido una solicitud para restablecer la contraseña de la cuenta asociada con <strong>${email}</strong>.
                    </p>
                </div>

                <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 30px; border-left: 4px solid #f59e0b;">
                    <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">
                        ¿Qué hacer a continuación?
                    </h3>
                    <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">
                        Haz clic en el botón de abajo para crear una nueva contraseña. Este enlace es válido por <strong>24 horas</strong> por motivos de seguridad.
                    </p>
                    
                    <div style="text-align: center; margin: 24px 0;">
                        <a href="${recoveryLink}" 
                           style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: all 0.2s ease;">
                            Restablecer Contraseña
                        </a>
                    </div>
                </div>

                <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
                    <h4 style="color: #374151; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
                        🔒 Importante para tu seguridad:
                    </h4>
                    <ul style="color: #6b7280; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                        <li style="margin-bottom: 8px;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura</li>
                        <li style="margin-bottom: 8px;">Este enlace expirará en 24 horas</li>
                        <li style="margin-bottom: 8px;">Solo funciona una vez</li>
                        <li>Si tienes problemas, contacta al soporte técnico</li>
                    </ul>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        Si el botón no funciona, copia y pega este enlace en tu navegador:
                    </p>
                    <p style="color: #6b7280; font-size: 12px; margin: 8px 0 0 0; word-break: break-all;">
                        ${recoveryLink}
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
                    Escuela de Posgrado UNICA
                </p>
                <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                    Universidad Nacional San Luis Gonzaga de Ica
                </p>
                <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 12px;">
                    Este es un correo automático, por favor no responder.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  let email = "";
  
  try {
    console.log('🔄 Iniciando proceso de recuperación de contraseña...');
    
    // Limpiar tokens expirados
    cleanupExpiredTokens();

    const requestBody = await request.json();
    email = requestBody.email;

    console.log('📧 Email solicitado:', email);

    // Validaciones
    if (!email) {
      return NextResponse.json(
        { success: false, message: "El correo electrónico es requerido" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Por favor, ingresa un correo válido" },
        { status: 400 }
      );
    }

    // Generar token y enlace
    const recoveryToken = generateRecoveryToken();
    const recoveryLink = generateRecoveryLink(recoveryToken);

    // Guardar token
    recoveryTokens.set(recoveryToken, {
      email: email,
      createdAt: new Date(),
      used: false
    });

    console.log(`🔑 Token generado para ${email}: ${recoveryToken}`);

    // Configurar email
    const mailOptions = {
      from: {
        name: "Escuela de Posgrado UNICA",
        address: process.env.MAILTRAP_FROM_EMAIL || "noreply@unica.edu.pe"
      },
      to: email,
      subject: "🔐 Recuperación de Contraseña - Escuela de Posgrado UNICA",
      html: generateEmailTemplate(email, recoveryLink),
      text: `
        Recuperación de Contraseña - Escuela de Posgrado UNICA
        
        Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
        
        Para crear una nueva contraseña, visita el siguiente enlace:
        ${recoveryLink}
        
        Este enlace es válido por 24 horas por motivos de seguridad.
        
        Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
        
        Escuela de Posgrado UNICA
        Universidad Nacional San Luis Gonzaga de Ica
      `
    };

    console.log('📤 Configuración de email:', {
      host: "sandbox.smtp.mailtrap.io",
      ports: [2525, 587, 25],
      user: process.env.MAILTRAP_USER,
      from: mailOptions.from,
      to: mailOptions.to,
      timeout: "30s"
    });

    // Función auxiliar para enviar email con reintentos y puertos alternativos
    async function sendEmailWithRetry(mailOptions: any, maxRetries = 3): Promise<any> {
      const ports = [2525, 587, 25]; // Puertos a probar
      
      for (let portIndex = 0; portIndex < ports.length; portIndex++) {
        const currentPort = ports[portIndex];
        const currentTransporter = createTransporter(currentPort);
        
        console.log(`🔌 Probando puerto ${currentPort}...`);
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            console.log(`🔍 Puerto ${currentPort}, Intento ${attempt}/${maxRetries} - Verificando conexión SMTP...`);
            
            // Verificar conexión solo en el primer intento de cada puerto
            if (attempt === 1) {
              await currentTransporter.verify();
              console.log(`✅ Conexión SMTP verificada en puerto ${currentPort}`);
            }
            
            const info = await currentTransporter.sendMail(mailOptions);
            console.log(`✅ Email enviado exitosamente en puerto ${currentPort}:`, info.messageId);
            return info;
            
          } catch (error: any) {
            console.warn(`⚠️ Puerto ${currentPort}, Intento ${attempt}/${maxRetries} falló:`, error.message);
            
            if (attempt === maxRetries) {
              if (portIndex === ports.length - 1) {
                throw error; // Re-lanzar el error si es el último puerto y último intento
              }
              break; // Pasar al siguiente puerto
            }
            
            // Esperar antes del siguiente intento (backoff exponencial)
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 3000);
            console.log(`⏳ Esperando ${delay}ms antes del siguiente intento...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
    }

    // Intentar enviar el email
    try {
      const info = await sendEmailWithRetry(mailOptions);
      
      return NextResponse.json({
        success: true,
        message: "Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.",
        debug: process.env.NODE_ENV === 'development' ? {
          token: recoveryToken,
          link: recoveryLink,
          messageId: info.messageId
        } : undefined
      });
      
    } catch (emailError: any) {
      console.warn('⚠️ Error al enviar email después de todos los intentos:', emailError.message);
      console.warn('🔧 Problema de conectividad detectado. Posibles causas:');
      console.warn('   • Firewall bloqueando puertos SMTP');
      console.warn('   • Problema de DNS o conectividad de red');
      console.warn('   • Credenciales de Mailtrap incorrectas');
      console.warn('   • Límites de rate limiting de Mailtrap alcanzados');
      
      // Modo fallback para desarrollo
      console.log('🔗 ENLACE DE RECUPERACIÓN PARA TESTING:');
      console.log(`   📧 Email: ${email}`);
      console.log(`   🔑 Token: ${recoveryToken}`);
      console.log(`   🔗 Enlace: ${recoveryLink}`);
      console.log('   ⚠️ Usa este enlace para continuar con las pruebas');
      console.log('   💡 Revisa tu bandeja de Mailtrap manualmente si no aparece');
      
      return NextResponse.json({
        success: true,
        message: "Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.",
        debug: process.env.NODE_ENV === 'development' ? {
          mode: "fallback",
          token: recoveryToken,
          link: recoveryLink,
          error: emailError.message,
          note: "Email no enviado - Revisa la consola del servidor para el enlace de testing",
          troubleshooting: "Verifica credenciales Mailtrap y conectividad de red"
        } : undefined
      });
    }

  } catch (error: any) {
    console.error("❌ Error en el proceso de recuperación:", error);
    
    // Mensaje específico según el error
    let errorMessage = "Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.";
    
    if (error?.code === 'EAUTH') {
      errorMessage = "Error de configuración del servidor. Contacta al administrador.";
    } else if (error?.code === 'ETIMEDOUT') {
      errorMessage = "Tiempo de espera agotado. Intenta nuevamente.";
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
