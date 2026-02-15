"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { createGalleryAction } from "@/actions/gallery";
import { ChevronLeft, Image as ImageIcon, Video, Link as LinkIcon, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewGalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sourceType, setSourceType] = useState<"image" | "video">("image");
  const [mediaType, setMediaType] = useState<"upload" | "embed">("embed");
  const [mediaUrl, setMediaUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Custom");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("sourceType", sourceType);
    formData.append("mediaType", mediaType);
    formData.append("mediaUrl", mediaUrl);
    formData.append("thumbnailUrl", thumbnailUrl);
    formData.append("category", category);

    try {
      await createGalleryAction(formData);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan karya.");
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
          <h1 className="text-3xl font-black uppercase tracking-tighter">Posting <span className="text-gold">Karya Baru</span></h1>
          <p className="text-gray-500 font-medium text-sm">Tambahkan koleksi modifikasi atau servis terbaru ke galeri.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-card p-6 md:p-8 border-gold/10 space-y-6">
          {/* TIPE MEDIA */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSourceType("image")}
              className={`p-4 rounded border flex flex-col items-center gap-2 transition-all ${sourceType === "image" ? "bg-gold/10 border-gold text-gold" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20"}`}
            >
              <ImageIcon size={24} />
              <span className="text-xs font-bold uppercase tracking-widest">Foto</span>
            </button>
            <button
              type="button"
              onClick={() => setSourceType("video")}
              className={`p-4 rounded border flex flex-col items-center gap-2 transition-all ${sourceType === "video" ? "bg-gold/10 border-gold text-gold" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20"}`}
            >
              <Video size={24} />
              <span className="text-xs font-bold uppercase tracking-widest">Video</span>
            </button>
          </div>

          {/* SUMBER MEDIA */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-gold">Sumber Media</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="mediaType" 
                  value="embed" 
                  checked={mediaType === "embed"} 
                  onChange={() => setMediaType("embed")}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${mediaType === "embed" ? "border-gold" : "border-gray-600"}`}>
                  {mediaType === "embed" && <div className="w-2.5 h-2.5 bg-gold rounded-full" />}
                </div>
                <span className={`text-sm font-bold ${mediaType === "embed" ? "text-white" : "text-gray-500"}`}>Embed Link (YouTube/TikTok/IG)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="mediaType" 
                  value="upload" 
                  checked={mediaType === "upload"} 
                  onChange={() => setMediaType("upload")}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${mediaType === "upload" ? "border-gold" : "border-gray-600"}`}>
                  {mediaType === "upload" && <div className="w-2.5 h-2.5 bg-gold rounded-full" />}
                </div>
                <span className={`text-sm font-bold ${mediaType === "upload" ? "text-white" : "text-gray-500"}`}>Upload Manual</span>
              </label>
            </div>
          </div>

          {/* INPUT MEDIA */}
          <div className="space-y-4">
            {mediaType === "embed" ? (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">URL Embed</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-black/40 border border-white/10 rounded py-4 pl-12 pr-4 text-white focus:outline-none focus:border-gold transition-colors"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Upload File {sourceType === "image" ? "(Maks 4MB)" : "(Maks 32MB)"}</label>
                <div className="p-8 border-2 border-dashed border-white/10 rounded-xl bg-black/20 flex flex-col items-center justify-center gap-4">
                  {mediaUrl ? (
                    <div className="text-center space-y-4">
                      <p className="text-green-500 text-sm font-bold flex items-center gap-2">
                        <Upload size={16} /> File berhasil diupload!
                      </p>
                      <button 
                        type="button" 
                        onClick={() => setMediaUrl("")}
                        className="text-xs font-bold text-red-400 uppercase hover:underline"
                      >
                        Ganti File
                      </button>
                    </div>
                  ) : (
                    <UploadButton
                      endpoint="galleryUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res[0]) {
                          setMediaUrl(res[0].url);
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
            )}

            {sourceType === "video" && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Thumbnail URL (Opsional)</label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-black/40 border border-white/10 rounded py-4 px-4 text-white focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            )}
          </div>

          <hr className="border-white/5" />

          {/* INFO KARYA */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Judul Karya</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Modifikasi Honda Vario 150 Full Carbon"
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
                <option value="Custom">Custom</option>
                <option value="Service">Service</option>
                <option value="Performance">Performance</option>
                <option value="Restorasi">Restorasi</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !mediaUrl || !title}
          className="w-full py-6 bg-gold text-black font-black uppercase tracking-widest rounded hover:bg-gold-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          {loading ? "Menyimpan..." : "Publish ke Galeri"}
        </button>
      </form>
    </div>
  );
}
