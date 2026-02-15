"use server";

import { db } from "@/lib/db";
import { insights } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

export async function createInsightAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const image = formData.get("image") as string;
  const category = formData.get("category") as string;

  if (!title || !content) {
    throw new Error("Judul dan Konten wajib diisi");
  }

  await db.insert(insights).values({
    title,
    content,
    image: image || null,
    category: category || "Edukasi",
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/insights");
  revalidatePath("/admin/wawasan-otomotif");
  redirect("/admin/insights");
}

export async function updateInsightAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const id = Number(formData.get("id"));
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const image = formData.get("image") as string;
  const category = formData.get("category") as string;

  if (!id || Number.isNaN(id)) {
    throw new Error("ID artikel tidak valid");
  }

  if (!title || !content) {
    throw new Error("Judul dan Konten wajib diisi");
  }

  await db
    .update(insights)
    .set({
      title,
      content,
      image: image || null,
      category: category || "Edukasi",
    })
    .where(eq(insights.id, id));

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/insights");
  revalidatePath("/admin/wawasan-otomotif");

  return { success: "Artikel berhasil diperbarui" };
}

export async function deleteInsightAction(id: number) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (!id || Number.isNaN(id)) {
    throw new Error("ID artikel tidak valid");
  }

  await db.delete(insights).where(eq(insights.id, id));

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/insights");
  revalidatePath("/admin/wawasan-otomotif");

  return { success: "Artikel berhasil dihapus" };
}
