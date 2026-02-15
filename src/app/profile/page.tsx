import React from "react";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileForm from "../../components/ProfileForm";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-black">
      <Navbar session={session} />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Profil <span className="text-gold">Saya</span></h1>
            <p className="text-gray-500 font-medium">Kelola informasi akun dan pengaturan profil profesional Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar Profil */}
            <div className="md:col-span-1">
              <div className="glass-card p-6 border-gold/10 text-center">
                <div className="w-24 h-24 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-black text-gold">{user.name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight">{user.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{user.email}</p>
                <div className="inline-block px-3 py-1 rounded bg-gold text-black text-[10px] font-black uppercase tracking-widest">
                  {user.role}
                </div>
              </div>
            </div>

            {/* Form Profil */}
            <div className="md:col-span-2">
              <ProfileForm user={user} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
