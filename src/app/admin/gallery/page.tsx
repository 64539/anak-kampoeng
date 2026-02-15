import { db } from "@/lib/db";
import { gallery } from "@/db/schema";
import Link from "next/link";
import { Image as ImageIcon, Video, Edit, Trash2, Plus } from "lucide-react";

export default async function GalleryManagementPage() {
  const items = await db.select().from(gallery);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black uppercase tracking-tighter">KELOLA <span className="text-gold">KARYA</span></h1>
        <Link href="/admin/gallery/new" className="btn-gold text-xs px-4 py-2 flex items-center gap-2">
          <Plus size={14} />
          Upload Karya
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="glass-card p-8 border-gold/10 text-center">
          <p className="text-gray-400 font-bold uppercase tracking-widest">Belum ada karya untuk ditampilkan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((work) => (
            <div key={work.id} className="group relative">
              <div className="aspect-square glass-card overflow-hidden border border-gold/20">
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded bg-gold text-black flex items-center gap-1">
                    {work.sourceType === "video" ? <Video size={12} /> : <ImageIcon size={12} />}
                    {work.sourceType === "video" ? "Video" : "Foto"}
                  </span>
                </div>
                {work.sourceType === "image" ? (
                  <img src={work.mediaUrl} alt={work.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <img src={work.thumbnailUrl || "/placeholder.jpg"} alt={work.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                )}
                {/* Desktop Overlay */}
                <div className="hidden md:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-3">
                  <button className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                    <Edit size={14} /> Edit
                  </button>
                  <button className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded text-xs font-bold uppercase tracking-widest text-red-300 flex items-center gap-2">
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              </div>
              {/* Mobile Actions */}
              <div className="md:hidden flex items-center justify-between mt-2">
                <span className="text-xs font-bold text-gray-400">{work.title}</span>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-white/10 rounded text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1">
                    <Edit size={12} /> Edit
                  </button>
                  <button className="px-3 py-1 bg-red-500/20 rounded text-[10px] font-black uppercase tracking-widest text-red-300 flex items-center gap-1">
                    <Trash2 size={12} /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
