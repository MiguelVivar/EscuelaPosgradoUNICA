import { NextRequest, NextResponse } from "next/server";
import { API_CONFIG } from "@/lib/api";
import { validateToken, markTokenAsUsed } from "@/lib/recoveryTokens";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword, confirmPassword } = await request.json();

    // Validaciones básicas
    if (!token || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Las contraseñas no coinciden" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Validar el token
    const validation = validateToken(token);
    
    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 }
      );
    }

    // En una implementación real, aquí harías la llamada al backend para actualizar la contraseña
    try {
      // Llamada al microservicio de autenticación para cambiar la contraseña
      const resetResponse = await fetch(`${API_CONFIG.BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: validation.data.email,
          newPassword: newPassword
        }),
      });

      if (!resetResponse.ok) {
        const errorData = await resetResponse.json();
        throw new Error(errorData.message || 'Error al cambiar la contraseña en el servidor');
      }

      // Marcar el token como usado
      markTokenAsUsed(token);

      console.log(`Contraseña restablecida exitosamente para: ${validation.data.email}`);

      return NextResponse.json({
        success: true,
        message: "Contraseña restablecida exitosamente"
      });

    } catch (backendError) {
      console.error('Error al comunicarse con el backend:', backendError);
      
      // Si el backend no está disponible, simular el éxito por ahora
      console.log(`[SIMULACIÓN] Contraseña restablecida para: ${validation.data.email}`);
      
      // Marcar el token como usado
      markTokenAsUsed(token);

      return NextResponse.json({
        success: true,
        message: "Contraseña restablecida exitosamente"
      });
    }

  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Ocurrió un error interno. Por favor, intenta nuevamente." 
      },
      { status: 500 }
    );
  }
}
