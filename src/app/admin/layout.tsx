import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/sidebar";

export const metadata: Metadata = {
  robots: { index: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-off-white">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-6 pt-16 lg:p-8">{children}</div>
    </div>
  );
}
