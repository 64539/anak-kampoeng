import Link from "next/link";
import { Plus, Users, Image as ImageIcon, FileText } from "lucide-react";
import { db } from "@/lib/db";
import { users, gallery, insights } from "@/db/schema";
import { sql } from "drizzle-orm";

export const revalidate = 0;

export default async function AdminDashboard() {
  const [userCount] = await db.select({ count: sql`count(*)` }).from(users);
  const [galleryCount] = await db.select({ count: sql`count(*)` }).from(gallery);
  const [insightCount] = await db.select({ count: sql`count(*)` }).from(insights);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black mb-2 uppercase tracking-tighter">
            Halo, <span className="text-gold">Koko Mechanic!</span>
          </h1>
          <p className="text-gray-500 font-medium">Ini adalah pusat kendali untuk mengelola operasional garasi digital Anda.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded border border-white/10 w-full md:w-auto justify-between md:justify-center">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Database Connected
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/gallery/new" className="group p-8 bg-gold hover:bg-gold-dark transition-all rounded flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-black uppercase tracking-tight">Posting Karya Baru</h3>
            <p className="text-black/70 font-bold text-sm">Perbarui koleksi karya terbaik di galeri Anda.</p>
          </div>
          <div className="bg-black/20 p-4 rounded-full group-hover:scale-110 transition-transform">
            <Plus size={32} className="text-black" />
          </div>
        </Link>

        <Link href="/admin/insights/new" className="group p-8 glass-card hover:bg-white/5 transition-all rounded flex items-center justify-between border-gold/20">
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Tulis Wawasan</h3>
            <p className="text-gray-500 font-bold text-sm">Bagikan ilmu edukasi mesin.</p>
          </div>
          <div className="bg-gold/10 p-4 rounded-full group-hover:scale-110 transition-transform">
            <FileText size={32} className="text-gold" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-gold/10">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-gold" size={24} />
            <span className="text-2xl font-black">{(userCount as any).count}</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Member</p>
        </div>
        <div className="glass-card p-6 border-gold/10">
          <div className="flex items-center justify-between mb-4">
            <ImageIcon className="text-gold" size={24} />
            <span className="text-2xl font-black">{(galleryCount as any).count}</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Karya</p>
        </div>
        <div className="glass-card p-6 border-gold/10">
          <div className="flex items-center justify-between mb-4">
            <FileText className="text-gold" size={24} />
            <span className="text-2xl font-black">{(insightCount as any).count}</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Artikel</p>
        </div>
      </div>
    </div>
  );
}
