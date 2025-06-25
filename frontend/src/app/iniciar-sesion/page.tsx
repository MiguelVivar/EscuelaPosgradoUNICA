import LoginForm from "@/components/ui/login/LoginForm";
import ScrollAnimationProvider from "@/providers/ScrollAnimationProvider";

export const metadata = {
  title: "Iniciar Sesión - UNICA Posgrado",
  description: "Accede a tu cuenta de la Escuela de Posgrado UNICA",
};

export default function IniciarSesionPage() {
  return (
    <ScrollAnimationProvider>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-200/30 to-cyan-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-100/20 to-blue-100/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Pattern overlay */}
        <div
          className="absolute inset-0 bg-slate-100/20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <LoginForm />
        </div>
      </main>
    </ScrollAnimationProvider>
  );
}
