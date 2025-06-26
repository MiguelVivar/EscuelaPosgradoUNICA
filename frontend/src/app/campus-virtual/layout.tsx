"use client";

import Sidebar from "@/components/layout/Sidebar";
import { useSidebarConfig } from "@/hooks/useSidebar";

export default function CampusVirtualLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sidebarConfig = useSidebarConfig();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      <Sidebar 
        items={sidebarConfig.items}
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
