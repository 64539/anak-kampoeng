"use client";

import { useEffect, useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { createGalleryAction } from "@/actions/gallery";
import { ChevronLeft, Image as ImageIcon, Video, Link as LinkIcon, Upload, Play } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { extractYouTubeVideoId, buildYouTubeThumbnailUrl, isSupportedEmbedUrl, isYouTubeUrl } from "@/lib/media";

export const revalidate = 0;

const DRAFT_KEY = "admin_gallery_new_draft";

interface DraftState {
  title: string;
  sourceType: "image" | "video";
  mediaType: "upload" | "embed";
  mediaUrl: string;
  thumbnailUrl: string;
  category: string;
}

export default function NewGalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sourceType, setSourceType] = useState<"image" | "video">("image");
  const [mediaType, setMediaType] = useState<"upload" | "embed">("embed");
  const [mediaUrl, setMediaUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Custom");
  const [embedUrlError, setEmbedUrlError] = useState("");
  const [embedThumbnailPreview, setEmbedThumbnailPreview] = useState("");
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [mainUploadProgress, setMainUploadProgress] = useState(0);
  const [thumbUploadProgress, setThumbUploadProgress] = useState(0);
  const [lastDraftSavedAt, setLastDraftSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as DraftState;
      setTitle(parsed.title || "");
      setSourceType(parsed.sourceType || "image");
      setMediaType(parsed.mediaType || "embed");
      setMediaUrl(parsed.mediaUrl || "");
      setThumbnailUrl(parsed.thumbnailUrl || "");
      setCategory(parsed.category || "Custom");
      if (parsed.mediaType === "embed" && parsed.mediaUrl && isYouTubeUrl(parsed.mediaUrl)) {
        const id = extractYouTubeVideoId(parsed.mediaUrl);
        if (id) {
          setEmbedThumbnailPreview(buildYouTubeThumbnailUrl(id));
        }
      }
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const timeout = setTimeout(() => {
      const draft: DraftState = {
        title,
        sourceType,
        mediaType,
        mediaUrl,
        thumbnailUrl,
        category,
      };
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setLastDraftSavedAt(new Date());
    }, 1000);
    return () => clearTimeout(timeout);
  }, [title, sourceType, mediaType, mediaUrl, thumbnailUrl, category]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mediaType === "embed") {
      if (!isSupportedEmbedUrl(mediaUrl)) {
        setEmbedUrlError("URL tidak valid. Gunakan YouTube atau TikTok.");
        return;
      }
    }
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
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(DRAFT_KEY);
      }
      router.push("/admin/gallery");
    } catch (error: any) {
      console.error(error);
      const message = typeof error?.message === "string" ? error.message : "Gagal menyimpan karya.";
      alert(message);
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
                <span className={`text-sm font-bold ${mediaType === "embed" ? "text-white" : "text-gray-500"}`}>Embed Link (YouTube/TikTok)</span>
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

          <div className="space-y-4">
            {mediaType === "embed" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">URL Embed</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => {
                        const value = e.target.value;
                        setMediaUrl(value);
                        setEmbedUrlError("");
                        setEmbedThumbnailPreview("");
                        if (!value) return;
                        if (!isSupportedEmbedUrl(value)) {
                          setEmbedUrlError("URL tidak valid. Gunakan YouTube atau TikTok.");
                          return;
                        }
                        if (isYouTubeUrl(value)) {
                          const id = extractYouTubeVideoId(value);
                          if (id) {
                            const thumbUrl = buildYouTubeThumbnailUrl(id);
                            setThumbnailUrl(thumbUrl);
                            setEmbedThumbnailPreview(thumbUrl);
                          }
                        }
                      }}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className={`w-full bg-black/40 border rounded py-4 pl-12 pr-4 text-white focus:outline-none transition-colors ${
                        embedUrlError ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-gold"
                      }`}
                      required
                    />
                  </div>
                  {embedUrlError && (
                    <p className="text-xs text-red-400 font-medium">{embedUrlError}</p>
                  )}
                  {!embedUrlError && (
                    <p className="text-[11px] text-gray-500">
                      Contoh: https://www.youtube.com/watch?v=VIDEO_ID atau link TikTok publik.
                    </p>
                  )}
                </div>
                {(embedThumbnailPreview || thumbnailUrl) && (
                  <div className="w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-white/10 bg-black/40">
                    <div className="aspect-video relative">
                      <img
                        src={embedThumbnailPreview || thumbnailUrl}
                        alt={title || "Preview video"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Play size={48} className="text-gold fill-gold" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                      File Utama {sourceType === "image" ? "(JPG/PNG maks 4MB)" : "(MP4/MOV maks 32MB)"}
                    </label>
                    <div className="p-6 border-2 border-dashed border-white/10 rounded-xl bg-black/20 flex flex-col items-center justify-center gap-4 w-full">
                      {mediaUrl ? (
                        <div className="w-full space-y-3">
                          {sourceType === "image" ? (
                            <div className="w-full aspect-video rounded overflow-hidden border border-white/10 bg-black/40">
                              <img src={mediaUrl} alt={title || "Preview"} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-full aspect-video rounded overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center text-gray-400 text-xs">
                              <span>Video ter-upload. Thumbnail akan menggunakan gambar di sebelah kanan.</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-green-500 text-xs font-bold flex items-center gap-2">
                              <Upload size={14} /> File utama berhasil diupload
                            </p>
                            <button
                              type="button"
                              onClick={() => setMediaUrl("")}
                              className="text-[11px] font-bold text-red-400 uppercase hover:underline"
                            >
                              Ganti File
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-gray-400 text-center">
                            Drop file di sini atau klik tombol di bawah.
                          </p>
                          <div className="w-full">
                            {isUploadingMain && (
                              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden mb-2">
                                <div
                                  className="h-full bg-gold transition-all"
                                  style={{ width: `${mainUploadProgress}%` }}
                                />
                              </div>
                            )}
                            <UploadButton
                              endpoint="galleryUploader"
                              onUploadBegin={() => {
                                setIsUploadingMain(true);
                                setMainUploadProgress(5);
                              }}
                              onUploadProgress={(p: number) => {
                                setMainUploadProgress(Math.min(95, Math.max(5, p)));
                              }}
                              onClientUploadComplete={(res) => {
                                setIsUploadingMain(false);
                                setMainUploadProgress(100);
                                if (res && res[0]) {
                                  const file = res[0];
                                  const name = file.name || "";
                                  const lower = name.toLowerCase();
                                  const isImage = lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png");
                                  const isVideo = lower.endsWith(".mp4") || lower.endsWith(".mov");
                                  if (sourceType === "image" && !isImage) {
                                    alert("Format tidak didukung. Gunakan JPG atau PNG.");
                                    return;
                                  }
                                  if (sourceType === "video" && !isVideo) {
                                    alert("Format tidak didukung. Gunakan MP4 atau MOV.");
                                    return;
                                  }
                                  setMediaUrl(file.url);
                                }
                              }}
                              onUploadError={(error: Error) => {
                                setIsUploadingMain(false);
                                setMainUploadProgress(0);
                                alert(`Upload failed: ${error.message}`);
                              }}
                              appearance={{
                                button: "bg-gold text-black font-black uppercase text-xs px-8 py-3 rounded hover:bg-gold-dark transition-all w-full",
                                allowedContent:
                                  "text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2 text-center",
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                      Thumbnail Manual {sourceType === "video" ? "(Disarankan 16:9 JPG/PNG)" : "(Opsional)"}
                    </label>
                    <div className="p-6 border-2 border-dashed border-white/10 rounded-xl bg-black/20 flex flex-col items-center justify-center gap-4 w-full">
                      {thumbnailUrl ? (
                        <div className="w-full space-y-3">
                          <div className="w-full aspect-video rounded overflow-hidden border border-white/10 bg-black/40">
                            <img src={thumbnailUrl} alt={title || "Thumbnail"} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-green-500 text-xs font-bold flex items-center gap-2">
                              <Upload size={14} /> Thumbnail berhasil diupload
                            </p>
                            <button
                              type="button"
                              onClick={() => setThumbnailUrl("")}
                              className="text-[11px] font-bold text-red-400 uppercase hover:underline"
                            >
                              Ganti Thumbnail
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-gray-400 text-center">
                            Thumbnail akan tampil sebagai cover sebelum video diputar.
                          </p>
                          <div className="w-full">
                            {isUploadingThumb && (
                              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden mb-2">
                                <div
                                  className="h-full bg-gold transition-all"
                                  style={{ width: `${thumbUploadProgress}%` }}
                                />
                              </div>
                            )}
                            <UploadButton
                              endpoint="galleryUploader"
                              onUploadBegin={() => {
                                setIsUploadingThumb(true);
                                setThumbUploadProgress(5);
                              }}
                              onUploadProgress={(p: number) => {
                                setThumbUploadProgress(Math.min(95, Math.max(5, p)));
                              }}
                              onClientUploadComplete={(res) => {
                                setIsUploadingThumb(false);
                                setThumbUploadProgress(100);
                                if (res && res[0]) {
                                  const file = res[0];
                                  const name = file.name || "";
                                  const lower = name.toLowerCase();
                                  const isImage = lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png");
                                  if (!isImage) {
                                    alert("Thumbnail harus berupa JPG atau PNG.");
                                    return;
                                  }
                                  setThumbnailUrl(file.url);
                                }
                              }}
                              onUploadError={(error: Error) => {
                                setIsUploadingThumb(false);
                                setThumbUploadProgress(0);
                                alert(`Upload failed: ${error.message}`);
                              }}
                              appearance={{
                                button: "bg-white/10 text-white font-black uppercase text-xs px-8 py-3 rounded hover:bg-white/20 transition-all w-full",
                                allowedContent:
                                  "text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2 text-center",
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mediaType === "upload" && sourceType === "video" && !thumbnailUrl && (
              <p className="text-xs text-yellow-400">
                Untuk video upload manual, thumbnail wajib diisi agar tampilan galeri lebih menarik.
              </p>
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

        <div className="space-y-2">
          <button
            type="submit"
            disabled={
              loading ||
              !mediaUrl ||
              !title ||
              (mediaType === "embed" && !!embedUrlError) ||
              (mediaType === "upload" && sourceType === "video" && !thumbnailUrl)
            }
            className="w-full py-6 bg-gold text-black font-black uppercase tracking-widest rounded hover:bg-gold-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          >
            {loading ? "Menyimpan..." : "Publish ke Galeri"}
          </button>
          {lastDraftSavedAt && (
            <p className="text-[11px] text-gray-500 text-center">
              Draft otomatis tersimpan pada {lastDraftSavedAt.toLocaleTimeString("id-ID")}.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
