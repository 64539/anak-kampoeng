"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Video, Edit, Trash2 } from "lucide-react";
import { updateGalleryAction, deleteGalleryAction } from "@/actions/gallery";
import { isSupportedEmbedUrl } from "@/lib/media";

interface GalleryItem {
  id: number;
  title: string;
  sourceType: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  category: string | null;
}

interface AdminGalleryListProps {
  items: GalleryItem[];
}

export default function AdminGalleryList({ items }: AdminGalleryListProps) {
  const router = useRouter();
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`Yakin ingin menghapus karya "${title}"?`)) return;

    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteGalleryAction(id);
        alert("Karya berhasil dihapus.");
        router.refresh();
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus karya.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingItem) return;

    const formData = new FormData(event.currentTarget);
    const nextMediaType = (formData.get("mediaType") as string) || editingItem.mediaType;
    const nextMediaUrl = (formData.get("mediaUrl") as string) || "";

    if (nextMediaType === "embed" && !isSupportedEmbedUrl(nextMediaUrl)) {
      alert("URL embed tidak valid. Gunakan YouTube atau TikTok.");
      return;
    }

    const mediaChanged = nextMediaUrl !== editingItem.mediaUrl || nextMediaType !== editingItem.mediaType;
    if (mediaChanged) {
      const confirmed = confirm(
        "Anda akan mengganti sumber media utama. File lama tidak akan digunakan lagi. Lanjutkan?"
      );
      if (!confirmed) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await updateGalleryAction(formData);
      alert("Karya berhasil diperbarui.");
      setEditingItem(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui karya.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                <img
                  src={work.mediaUrl}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <img
                  src={work.thumbnailUrl || "/placeholder.jpg"}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              )}
              <div className="hidden md:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(work)}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(work.id, work.title)}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded text-xs font-bold uppercase tracking-widest text-red-300 flex items-center gap-2"
                  disabled={deletingId === work.id || isPending}
                >
                  <Trash2 size={14} />
                  {deletingId === work.id || isPending ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
            <div className="md:hidden flex items-center justify-between mt-2">
              <span className="text-xs font-bold text-gray-400">{work.title}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(work)}
                  className="px-3 py-1 bg-white/10 rounded text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1"
                >
                  <Edit size={12} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(work.id, work.title)}
                  className="px-3 py-1 bg-red-500/20 rounded text-[10px] font-black uppercase tracking-widest text-red-300 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={deletingId === work.id || isPending}
                >
                  <Trash2 size={12} />
                  {deletingId === work.id || isPending ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-[1000] bg-black/70 flex items-center justify-center px-4">
          <div className="w-full max-w-xl bg-matte-lighter border border-gold/20 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-widest">Edit Karya</h2>
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
              <input type="hidden" name="sourceType" value={editingItem.sourceType} />

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Sumber Media</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <input
                      type="radio"
                      name="mediaType"
                      value="upload"
                      defaultChecked={editingItem.mediaType === "upload"}
                      className="mr-1"
                    />
                    Upload Manual
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <input
                      type="radio"
                      name="mediaType"
                      value="embed"
                      defaultChecked={editingItem.mediaType === "embed"}
                      className="mr-1"
                    />
                    Embed Link
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Judul Karya</label>
                <input
                  name="title"
                  defaultValue={editingItem.title}
                  className="w-full bg-black/40 border border-white/10 rounded py-3 px-4 text-white focus:outline-none focus:border-gold transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">URL Media</label>
                <input
                  name="mediaUrl"
                  defaultValue={editingItem.mediaUrl}
                  className="w-full bg-black/40 border border-white/10 rounded py-3 px-4 text-white focus:outline-none focus:border-gold transition-colors"
                  required
                />
              </div>

              {editingItem.sourceType === "video" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Thumbnail URL</label>
                  <input
                    name="thumbnailUrl"
                    defaultValue={editingItem.thumbnailUrl || ""}
                    className="w-full bg-black/40 border border-white/10 rounded py-3 px-4 text-white focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Kategori</label>
                <select
                  name="category"
                  defaultValue={editingItem.category || "Custom"}
                  className="w-full bg-black/40 border border-white/10 rounded py-3 px-4 text-white focus:outline-none focus:border-gold transition-colors appearance-none"
                >
                  <option value="Custom">Custom</option>
                  <option value="Service">Service</option>
                  <option value="Performance">Performance</option>
                  <option value="Restorasi">Restorasi</option>
                </select>
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
