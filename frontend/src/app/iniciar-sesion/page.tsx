import LoginForm from "@/components/ui/login/LoginForm";
import ScrollAnimationProvider from "@/providers/ScrollAnimationProvider";
import { AuthPageLayout } from "@/components/ui/auth";

export const metadata = {
  title: "Iniciar Sesión - UNICA Posgrado",
  description: "Accede a tu cuenta de la Escuela de Posgrado UNICA",
};

export default function IniciarSesionPage() {
  return (
    <ScrollAnimationProvider>
      <AuthPageLayout>
        <LoginForm />
      </AuthPageLayout>
    </ScrollAnimationProvider>
  );
}
