"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, Edit, Trash2 } from "lucide-react";
import { updateInsightAction, deleteInsightAction } from "@/actions/insights";

interface InsightItem {
  id: number;
  title: string;
  content: string;
  image: string | null;
  category: string | null;
}

interface AdminInsightsListProps {
  items: InsightItem[];
}

export default function AdminInsightsList({ items }: AdminInsightsListProps) {
  const router = useRouter();
  const [editingItem, setEditingItem] = useState<InsightItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`Yakin ingin menghapus artikel "${title}"?`)) return;

    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteInsightAction(id);
        alert("Artikel berhasil dihapus.");
        router.refresh();
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus artikel.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingItem) return;

    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
      await updateInsightAction(formData);
      alert("Artikel berhasil diperbarui.");
      setEditingItem(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui artikel.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
                    <button
                      type="button"
                      onClick={() => setEditingItem(article)}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2"
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(article.id, article.title)}
                      className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded text-[10px] font-black uppercase tracking-widest text-red-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={deletingId === article.id || isPending}
                    >
                      <Trash2 size={12} />
                      {deletingId === article.id || isPending ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden grid grid-cols-1 gap-4">
        {items.map((article) => (
          <div key={article.id} className="glass-card p-4 border-gold/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gold" />
                <span className="font-black text-sm uppercase tracking-tight">{article.title}</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gold/60">
                {article.category}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingItem(article)}
                className="px-3 py-1 bg-white/10 rounded text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1"
              >
                <Edit size={12} /> Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(article.id, article.title)}
                className="px-3 py-1 bg-red-500/20 rounded text-[10px] font-black uppercase tracking-widest text-red-300 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={deletingId === article.id || isPending}
              >
                <Trash2 size={12} />
                {deletingId === article.id || isPending ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-[1000] bg-black/70 flex items-center justify-center px-4">
          <div className="w-full max-w-xl bg-matte-lighter border border-gold/20 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-widest">Edit Artikel</h2>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input type="hidden" name="id" value={editingItem.id} />

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Judul Artikel</label>
                <input
                  name="title"
                  defaultValue={editingItem.title}
                  className="w-full bg-black/40 border border-white/10 rounded py-3 px-4 text-white focus:outline-none focus:border-gold transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Kategori</label>
                <select
                  name="category"
                  defaultValue={editingItem.category || "Edukasi"}
                  className="w-full bg-black/40 border border-white/10 rounded py-3 px-4 text-white focus:outline-none focus:border-gold transition-colors appearance-none"
                >
                  <option value="Edukasi">Edukasi</option>
                  <option value="Tips">Tips</option>
                  <option value="Modifikasi">Modifikasi</option>
                  <option value="Berita">Berita</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Gambar Sampul (URL)</label>
                <input
                  name="image"
                  defaultValue={editingItem.image || ""}
                  className="w-full bg-black/40 border border-white/10 rounded py-3 px-4 text-white focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Konten Artikel</label>
                <textarea
                  name="content"
                  defaultValue={editingItem.content}
                  rows={8}
                  className="w-full bg-black/40 border border-white/10 rounded py-3 px-4 text-white focus:outline-none focus:border-gold transition-colors resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gold text-black text-xs font-black uppercase tracking-widest rounded hover:bg-gold-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

