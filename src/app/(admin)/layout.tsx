import { AdminSidebar } from "@/components/layout/admin-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 md:flex">
      <AdminSidebar />
      <main className="flex-1 p-5 pt-20 md:p-8 lg:p-10 max-w-7xl">{children}</main>
    </div>
  )
}
