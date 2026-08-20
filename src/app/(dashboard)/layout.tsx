import { DashboardNav } from "@/components/dashboard-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <DashboardNav />
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
