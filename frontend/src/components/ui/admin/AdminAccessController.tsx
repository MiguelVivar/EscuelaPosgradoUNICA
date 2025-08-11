"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AdminLoading } from "@/components/ui/admin";

interface AdminAccessControllerProps {
  children: ReactNode;
}

export default function AdminAccessController({ children }: AdminAccessControllerProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/iniciar-sesion");
        return;
      }
      
      // Solo permitir acceso a ADMIN y COORDINADOR
      if (user && user.role !== 'ADMIN' && user.role !== 'COORDINADOR') {
        router.push("/campus-virtual");
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return <AdminLoading />;
  }

  if (!isAuthenticated || !user || (user.role !== 'ADMIN' && user.role !== 'COORDINADOR')) {
    return null;
  }

  return <>{children}</>;
}
