"use client";

import Sidebar from "@/components/layout/Sidebar";
import { MobileNavigation } from "@/components/ui/campus";
import { useSidebarConfig } from "@/hooks/useSidebar";

export default function CampusVirtualLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sidebarConfig = useSidebarConfig();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden sm:block">
        <Sidebar 
          items={sidebarConfig.items}
          width="narrow"
          position="left"
          backgroundColor="bg-zinc-900/95"
        />
      </div>
      
      {/* Main content - Responsive margins */}
      <main className="flex-1 sm:ml-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}
