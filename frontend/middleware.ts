import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = ['/campus-virtual'];

// Rutas que son solo para usuarios no autenticados
const authRoutes = ['/iniciar-sesion'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar si tiene token (esto es básico, en producción se debería validar el token)
  const token = request.cookies.get('authToken')?.value;
  
  // Si está en una ruta protegida y no tiene token, redirigir a login
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/iniciar-sesion', request.url));
  }
  
  // Si está en una ruta de auth y ya tiene token, redirigir al campus
  if (authRoutes.some(route => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL('/campus-virtual', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
