import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Image as ImageIcon, FileText, ExternalLink, Database } from "lucide-react";
import { db } from "@/lib/db";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Check database connection
  let isConnected = false;
  try {
    await db.execute("SELECT 1");
    isConnected = true;
  } catch (e) {
    isConnected = false;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-matte-lighter border-r border-gold/10 flex-col">
        <div className="p-6 border-b border-gold/10">
          <Link href="/" className="text-xl font-black tracking-tighter text-white">
            ANAK <span className="text-gold">KAMPOENG</span>
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-[10px] uppercase font-bold text-gray-500">
              {isConnected ? 'Database Connected' : 'Database Offline'}
            </span>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 text-gray-400 hover:text-gold hover:bg-gold/5 rounded transition-colors font-bold uppercase text-xs tracking-widest">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 p-3 text-gray-400 hover:text-gold hover:bg-gold/5 rounded transition-colors font-bold uppercase text-xs tracking-widest">
            <Users size={18} />
            Manajemen User
          </Link>
          <Link href="/admin/gallery" className="flex items-center gap-3 p-3 text-gray-400 hover:text-gold hover:bg-gold/5 rounded transition-colors font-bold uppercase text-xs tracking-widest">
            <ImageIcon size={18} />
            Kelola Karya
          </Link>
          <Link href="/admin/insights" className="flex items-center gap-3 p-3 text-gray-400 hover:text-gold hover:bg-gold/5 rounded transition-colors font-bold uppercase text-xs tracking-widest">
            <FileText size={18} />
            Wawasan Otomotif
          </Link>
        </nav>

        <div className="p-4 border-t border-gold/10">
          <Link href="/" className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors uppercase font-bold">
            <ExternalLink size={14} />
            Lihat Website
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Top Bar (Mobile) */}
        <header className="md:hidden border-b border-gold/10 bg-matte-lighter">
          <div className="px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-lg font-black tracking-tighter text-white">
              ANAK <span className="text-gold">KAMPOENG</span>
            </Link>
            <div className="flex items-center gap-2">
              <Database size={16} className="text-gold" />
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-[10px] uppercase font-bold text-gray-500">
                  {isConnected ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto bg-black relative">
          <div className="absolute inset-0 carbon-texture opacity-10 pointer-events-none" />
          <div className="relative z-10 p-4 pb-24 md:p-8 md:pb-8">
            {children}
          </div>
        </main>

        {/* Bottom Navigation (Mobile) */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-matte-lighter border-t border-gold/10 flex justify-around items-center py-3 z-[999] pointer-events-auto">
          <Link href="/admin/dashboard" className="flex flex-col items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <LayoutDashboard size={18} className="text-gold" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/users" className="flex flex-col items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Users size={18} className="text-gold" />
            <span>Users</span>
          </Link>
          <Link href="/admin/gallery" className="flex flex-col items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <ImageIcon size={18} className="text-gold" />
            <span>Galeri</span>
          </Link>
          <Link href="/admin/insights" className="flex flex-col items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <FileText size={18} className="text-gold" />
            <span>Wawasan</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
