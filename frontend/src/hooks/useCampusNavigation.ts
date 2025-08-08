"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function useCampusNavigation() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/iniciar-sesion");
  };

  const navigateToProfile = () => {
    router.push("/campus-virtual/perfil");
  };

  const navigateToModule = (modulePath: string) => {
    router.push(`/campus-virtual/${modulePath}`);
  };

  const navigateBack = () => {
    router.back();
  };

  const navigateToHome = () => {
    router.push("/campus-virtual");
  };

  return {
    handleLogout,
    navigateToProfile,
    navigateToModule,
    navigateBack,
    navigateToHome,
    router,
  };
}
