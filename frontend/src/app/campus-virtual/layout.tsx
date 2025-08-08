"use client";

import Sidebar from "@/components/layout/Sidebar";
import { MobileNavigation } from "@/components/ui/campus";
import { CampusFooter } from "@/components/layout/Footer/CampusFooter";
import { useSidebarConfig } from "@/hooks/useSidebar";

export default function CampusVirtualLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sidebarConfig = useSidebarConfig();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      <MobileNavigation />

      <div className="hidden sm:block">
        <Sidebar
          items={sidebarConfig.items}
          width="narrow"
          position="left"
          backgroundColor="bg-zinc-900/95"
        />
      </div>

      <div className="flex-1 sm:ml-16 flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
        <CampusFooter />
      </div>
    </div>
  );
}
