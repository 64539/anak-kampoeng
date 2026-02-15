"use server";

import { db } from "@/lib/db";
import { gallery } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

export async function createGalleryAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const sourceType = formData.get("sourceType") as string; // 'image', 'video'
  const mediaType = formData.get("mediaType") as string; // 'upload', 'embed'
  const mediaUrl = formData.get("mediaUrl") as string;
  const thumbnailUrl = formData.get("thumbnailUrl") as string;
  const category = formData.get("category") as string;

  if (!title || !sourceType || !mediaType || !mediaUrl) {
    throw new Error("Data tidak lengkap");
  }

  await db.insert(gallery).values({
    title,
    sourceType,
    mediaType,
    mediaUrl,
    thumbnailUrl: thumbnailUrl || null,
    category: category || "Custom",
  });

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
  const title = formData.get("title") as string;
  const sourceType = formData.get("sourceType") as string;
  const mediaType = formData.get("mediaType") as string;
  const mediaUrl = formData.get("mediaUrl") as string;
  const thumbnailUrl = formData.get("thumbnailUrl") as string;
  const category = formData.get("category") as string;

  if (!id || Number.isNaN(id)) {
    throw new Error("ID karya tidak valid");
  }

  if (!title || !sourceType || !mediaType || !mediaUrl) {
    throw new Error("Data tidak lengkap");
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
