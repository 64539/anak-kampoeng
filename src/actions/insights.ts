"use server";

import { db } from "@/lib/db";
import { insights } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

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
  redirect("/admin");
}
