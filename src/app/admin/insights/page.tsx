import { db } from "@/lib/db";
import { insights } from "@/db/schema";
import Link from "next/link";
import { FileText, Edit, Trash2, Plus } from "lucide-react";

export default async function InsightsManagementPage() {
  const items = await db.select().from(insights);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
          WAWASAN <span className="text-gold">OTOMOTIF</span>
        </h1>
        <Link href="/admin/insights/new" className="btn-gold text-xs px-4 py-2 flex items-center gap-2 w-full md:w-auto justify-center">
          <Plus size={14} />
          Tulis Artikel
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="glass-card p-8 border-gold/10 text-center">
          <p className="text-gray-400 font-bold uppercase tracking-widest">Belum ada ilmu yang dibagikan, Beh.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block glass-card overflow-hidden border-gold/10">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-gold/10">
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-gold">Judul</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-gold">Kategori</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-gold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((article) => (
                  <tr key={article.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold">{article.title}</td>
                    <td className="p-4 text-gray-400">{article.category}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                          <Edit size={12} /> Edit
                        </button>
                        <button className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded text-[10px] font-black uppercase tracking-widest text-red-300 flex items-center gap-2">
                          <Trash2 size={12} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {items.map((article) => (
              <div key={article.id} className="glass-card p-4 border-gold/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-gold" />
                    <span className="font-black text-sm uppercase tracking-tight">{article.title}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gold/60">{article.category}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button className="px-3 py-1 bg-white/10 rounded text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1">
                    <Edit size={12} /> Edit
                  </button>
                  <button className="px-3 py-1 bg-red-500/20 rounded text-[10px] font-black uppercase tracking-widest text-red-300 flex items-center gap-1">
                    <Trash2 size={12} /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
