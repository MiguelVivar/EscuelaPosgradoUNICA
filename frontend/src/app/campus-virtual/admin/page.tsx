"use client";

import { AdminAccessController, AdminDashboard } from "@/components/ui/admin";

export default function AdminCampusPage() {
  return (
    <AdminAccessController>
      <AdminDashboard />
    </AdminAccessController>
  );
}
