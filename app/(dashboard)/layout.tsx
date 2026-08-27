import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* SideNavBar (Shared Component) */}
      <Sidebar />

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col md:ml-64 h-screen overflow-y-auto w-full relative z-10">
        
        {/* Children Content */}
        {children}

      </main>
    </div>
  );
}
