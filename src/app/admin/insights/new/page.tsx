"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { createInsightAction } from "@/actions/insights";
import { ChevronLeft, FileText, Image as ImageIcon, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const revalidate = 0;

export default function NewInsightPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("Edukasi");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);
    formData.append("category", category);

    try {
      await createInsightAction(formData);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan artikel.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 px-4">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-gold" />
        </Link>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Tulis <span className="text-gold">Wawasan</span></h1>
          <p className="text-gray-500 font-medium text-sm">Bagikan ilmu, tips, atau berita otomotif terbaru.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-card p-6 md:p-8 border-gold/10 space-y-6">
          {/* COVER IMAGE */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Gambar Sampul (Maks 4MB)</label>
            <div className="p-8 border-2 border-dashed border-white/10 rounded-xl bg-black/20 flex flex-col items-center justify-center gap-4">
              {image ? (
                <div className="text-center space-y-4">
                  <div className="w-full max-w-xs aspect-video bg-white/5 rounded overflow-hidden border border-white/10">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-green-500 text-sm font-bold flex items-center justify-center gap-2">
                    <Upload size={16} /> Gambar berhasil diupload!
                  </p>
                  <button 
                    type="button" 
                    onClick={() => setImage("")}
                    className="text-xs font-bold text-red-400 uppercase hover:underline"
                  >
                    Ganti Gambar
                  </button>
                </div>
              ) : (
                <UploadButton
                  endpoint="insightImage"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]) {
                      setImage(res[0].url);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`Upload failed: ${error.message}`);
                  }}
                  appearance={{
                    button: "bg-gold text-black font-black uppercase text-xs px-8 py-4 rounded hover:bg-gold-dark transition-all",
                    allowedContent: "text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2"
                  }}
                />
              )}
            </div>
          </div>

          <hr className="border-white/5" />

          {/* INFO ARTIKEL */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Judul Artikel</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: 5 Tips Merawat Mesin Motor di Musim Hujan"
                className="w-full bg-black/40 border border-white/10 rounded py-4 px-4 text-white focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded py-4 px-4 text-white focus:outline-none focus:border-gold transition-colors appearance-none"
              >
                <option value="Edukasi">Edukasi</option>
                <option value="Tips">Tips</option>
                <option value="Modifikasi">Modifikasi</option>
                <option value="Berita">Berita</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Konten Artikel</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan isi artikel Anda di sini..."
                rows={10}
                className="w-full bg-black/40 border border-white/10 rounded py-4 px-4 text-white focus:outline-none focus:border-gold transition-colors resize-none"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !title || !content}
          className="w-full py-6 bg-gold text-black font-black uppercase tracking-widest rounded hover:bg-gold-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          {loading ? "Menyimpan..." : "Publish Artikel"}
        </button>
      </form>
    </div>
  );
}
