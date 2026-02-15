"use server";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession, login } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Silakan login terlebih dahulu." };

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;

  if (!name || !email) {
    return { error: "Nama dan Email wajib diisi!" };
  }

  // Validasi nomor WA: Wajib untuk USER, opsional untuk ADMIN
  if (session.user.role === "USER") {
    if (!phoneNumber) {
      return { error: "Nomor WhatsApp wajib diisi untuk member!" };
    }
    const phoneRegex = /^\+62[0-9]{7,12}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return { error: "Format WhatsApp tidak valid! Gunakan +62 dan 10-15 digit total." };
    }
  }

  try {
    const updateData: any = {
      name,
      email,
    };

    // Hanya update phoneNumber jika role bukan ADMIN atau jika ADMIN memberikan nilai
    if (session.user.role === "USER" || (session.user.role === "ADMIN" && phoneNumber !== undefined)) {
      updateData.phoneNumber = phoneNumber || null;
    }

    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id))
      .returning();

    // Update session dengan data baru
    await login({
      id: updatedUser[0].id,
      email: updatedUser[0].email,
      name: updatedUser[0].name,
      role: updatedUser[0].role,
    });

    revalidatePath("/profile");
    return { success: "Profil berhasil diperbarui!" };
  } catch (error: any) {
    if (error.message.includes("unique constraint")) {
      return { error: "Email sudah digunakan oleh akun lain!" };
    }
    return { error: "Terjadi kesalahan saat memperbarui profil." };
  }
}
