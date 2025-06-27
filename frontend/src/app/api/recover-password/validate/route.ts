import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/lib/recoveryTokens";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { valid: false, message: "Token requerido" },
        { status: 400 }
      );
    }

    const validation = validateToken(token);

    if (!validation.valid) {
      return NextResponse.json(
        { valid: false, message: validation.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      message: validation.message
    });

  } catch (error) {
    console.error("Error al validar token:", error);
    
    return NextResponse.json(
      { 
        valid: false, 
        message: "Error interno del servidor" 
      },
      { status: 500 }
    );
  }
}
