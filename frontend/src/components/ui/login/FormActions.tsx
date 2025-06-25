import Link from "next/link";

export default function FormActions() {
  return (
    <>
      {/* Recordar sesión y recuperar contraseña */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded transition-all duration-200 hover:scale-110"
          />
          <label
            htmlFor="remember-me"
            className="ml-3 block text-sm text-gray-700 font-medium"
          >
            Recordar sesión
          </label>
        </div>

        <div className="text-sm">
          <Link
            href="/recuperar-password"
            className="text-amber-600 hover:text-amber-700 font-semibold transition-all duration-200 hover:underline underline-offset-4"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>

      {/* Enlaces adicionales dentro del formulario */}
      <div className="text-center space-y-3 pt-4 border-t border-gray-200/50">
        <div className="text-sm text-gray-500">
          <Link
            href="/ayuda"
            className="hover:text-amber-600 transition-colors duration-200 hover:underline underline-offset-4"
          >
            ¿Necesitas ayuda?
          </Link>
        </div>
      </div>
    </>
  );
}
