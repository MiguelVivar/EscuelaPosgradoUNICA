"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCampusNavigation } from "@/hooks/useCampusNavigation";
import { 
  CampusVirtualHeader,
  CampusModulesGrid,
  CampusLoadingState,
  CampusVirtualContainer
} from "@/components/ui/campus";
import { CAMPUS_MODULES } from "@/constants";

export default function CampusVirtualPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { handleLogout, navigateToProfile, router } = useCampusNavigation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/iniciar-sesion");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <CampusLoadingState />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <CampusVirtualContainer>
      {/* Header del Campus Virtual */}
      <CampusVirtualHeader
        user={user}
        onProfileClick={navigateToProfile}
        onLogout={handleLogout}
      />
      
      {/* Creación de botones del Campus Virtual */}
      <div>
        <CampusModulesGrid
          modules={CAMPUS_MODULES}
          userRole={user.role}
        />
      </div>
    </CampusVirtualContainer>
  );
}
