import Sidebar from "@/components/sidebar/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 p-10">
        <div className="max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
