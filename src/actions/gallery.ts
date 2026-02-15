"use server";

import { db } from "@/lib/db";
import { gallery } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { extractYouTubeVideoId, buildYouTubeThumbnailUrl, isSupportedEmbedUrl } from "@/lib/media";

export async function createGalleryAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const title = (formData.get("title") as string) || "";
  const sourceType = (formData.get("sourceType") as string) || "";
  const mediaType = (formData.get("mediaType") as string) || "";
  const mediaUrl = (formData.get("mediaUrl") as string) || "";
  let thumbnailUrl = (formData.get("thumbnailUrl") as string) || "";
  const category = (formData.get("category") as string) || "";

  const rateCookie = cookies().get("gallery_last_create_at")?.value;
  if (rateCookie) {
    const last = Number(rateCookie);
    if (!Number.isNaN(last)) {
      const diff = Date.now() - last;
      if (diff < 10_000) {
        throw new Error("Terlalu banyak upload dalam waktu singkat. Coba lagi beberapa detik lagi.");
      }
    }
  }

  if (!title || !sourceType || !mediaType || !mediaUrl) {
    throw new Error("Data tidak lengkap");
  }

  if (mediaType === "embed") {
    if (!isSupportedEmbedUrl(mediaUrl)) {
      throw new Error("URL embed tidak didukung. Gunakan YouTube atau TikTok.");
    }
    if (sourceType === "video" && !thumbnailUrl && extractYouTubeVideoId(mediaUrl)) {
      const videoId = extractYouTubeVideoId(mediaUrl);
      if (videoId) {
        thumbnailUrl = buildYouTubeThumbnailUrl(videoId);
      }
    }
  }

  if (mediaType === "upload" && sourceType === "video" && !thumbnailUrl) {
    throw new Error("Thumbnail video wajib diisi untuk upload manual.");
  }

  await db.insert(gallery).values({
    title,
    sourceType,
    mediaType,
    mediaUrl,
    thumbnailUrl: thumbnailUrl || null,
    category: category || "Custom",
  });

  cookies().set("gallery_last_create_at", String(Date.now()));

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/kelola-karya");
  redirect("/admin/gallery");
}

export async function updateGalleryAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const id = Number(formData.get("id"));
  const title = (formData.get("title") as string) || "";
  const sourceType = (formData.get("sourceType") as string) || "";
  const mediaType = (formData.get("mediaType") as string) || "";
  const mediaUrl = (formData.get("mediaUrl") as string) || "";
  let thumbnailUrl = (formData.get("thumbnailUrl") as string) || "";
  const category = (formData.get("category") as string) || "";

  if (!id || Number.isNaN(id)) {
    throw new Error("ID karya tidak valid");
  }

  if (!title || !sourceType || !mediaType || !mediaUrl) {
    throw new Error("Data tidak lengkap");
  }

  const existingList = await db.select().from(gallery).where(eq(gallery.id, id));
  const existing = existingList[0];

  if (!existing) {
    throw new Error("Karya tidak ditemukan");
  }

  if (mediaType === "embed") {
    if (!isSupportedEmbedUrl(mediaUrl)) {
      throw new Error("URL embed tidak didukung. Gunakan YouTube atau TikTok.");
    }
    if (sourceType === "video" && !thumbnailUrl && extractYouTubeVideoId(mediaUrl)) {
      const videoId = extractYouTubeVideoId(mediaUrl);
      if (videoId) {
        thumbnailUrl = buildYouTubeThumbnailUrl(videoId);
      }
    }
  }

  if (mediaType === "upload" && sourceType === "video" && !thumbnailUrl) {
    throw new Error("Thumbnail video wajib diisi untuk upload manual.");
  }

  await db
    .update(gallery)
    .set({
      title,
      sourceType,
      mediaType,
      mediaUrl,
      thumbnailUrl: thumbnailUrl || null,
      category: category || "Custom",
    })
    .where(eq(gallery.id, id));

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/kelola-karya");

  return { success: "Karya berhasil diperbarui" };
}

export async function deleteGalleryAction(id: number) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (!id || Number.isNaN(id)) {
    throw new Error("ID karya tidak valid");
  }

  await db.delete(gallery).where(eq(gallery.id, id));

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/kelola-karya");

  return { success: "Karya berhasil dihapus" };
}
