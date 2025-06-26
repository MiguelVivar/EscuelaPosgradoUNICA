"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { 
  campusVirtualSidebarItems, 
  adminSidebarItems, 
  coordinadorSidebarItems 
} from "@/data/SidebarItems";
import { SidebarItemProps } from "@/types";

export default function CampusVirtualLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuth();
  const pathname = usePathname();

  // Función para marcar items como activos según la ruta actual
  const setActiveItems = (items: SidebarItemProps[]): SidebarItemProps[] => {
    return items.map(item => ({
      ...item,
      isActive: item.href === pathname
    }));
  };

  // Determinar qué items mostrar según el rol del usuario
  const getSidebarItems = () => {
    const baseItems = campusVirtualSidebarItems;
    
    if (!user) return setActiveItems(baseItems);
    
    switch (user.role) {
      case 'ADMIN':
        return setActiveItems([...baseItems, ...adminSidebarItems]);
      case 'COORDINADOR':
        return setActiveItems([...baseItems, ...coordinadorSidebarItems]);
      default:
        return setActiveItems(baseItems);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      <Sidebar 
        items={getSidebarItems()}
        width="narrow"
        position="left"
        backgroundColor="bg-zinc-900/95"
      />
      <main className="flex-1 ml-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}
