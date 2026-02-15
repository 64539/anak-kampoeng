"use server";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { login, logout } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phoneNumber = formData.get("phoneNumber") as string;

  if (!name || !email || !password || !phoneNumber) {
    return { error: "Semua field wajib diisi!" };
  }

  // Validasi format WhatsApp (+62, angka saja, 10-15 digit)
  const phoneRegex = /^\+62[0-9]{7,12}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return { error: "Format WhatsApp tidak valid! Gunakan +62 dan 10-15 digit total." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role: "USER",
    }).returning();

    await login({
      id: newUser[0].id,
      email: newUser[0].email,
      name: newUser[0].name,
      role: newUser[0].role,
    });
  } catch (error: any) {
    if (error.message.includes("unique constraint")) {
      return { error: "Email sudah terdaftar!" };
    }
    return { error: "Terjadi kesalahan saat pendaftaran." };
  }

  redirect("/");
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi!" };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Email atau password salah!" };
  }

  await login({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  if (user.role === "ADMIN") {
    redirect("/admin");
  } else {
    redirect("/");
  }
}

export async function logoutAction() {
  await logout();
  redirect("/");
}
