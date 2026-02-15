"use client";

import React, { useState } from "react";
import { registerAction } from "@/actions/auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { UserPlus, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Hanya izinkan angka dan +
    val = val.replace(/[^0-9+]/g, "");
    
    // Pastikan diawali +62
    if (val.length > 0 && !val.startsWith("+")) {
      val = "+62" + val.replace(/^0+/, "");
    } else if (val.length > 0 && val.startsWith("0")) {
      val = "+62" + val.substring(1);
    }
    
    if (val.length <= 15) {
      setPhone(val);
    }
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    // Validasi tambahan sebelum kirim
    const phoneNumber = formData.get("phoneNumber") as string;
    if (!phoneNumber.startsWith("+62") || phoneNumber.length < 10) {
      setError("Format WhatsApp tidak valid. Gunakan format +62...");
      setLoading(false);
      return;
    }

    const result = await registerAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 py-12">
      <div className="absolute inset-0 carbon-texture opacity-20 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2 tracking-tighter">
            GABUNG <span className="text-gold">MEMBER</span>
          </h1>
          <p className="text-gray-400">Jadi bagian dari ekosistem elit otomotif.</p>
        </div>

        <form action={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gold mb-2">Nama Lengkap</label>
            <input
              name="name"
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none transition-colors"
              placeholder="Nama lo siapa?"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gold mb-2">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none transition-colors"
              placeholder="email@contoh.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gold mb-2">Nomor WhatsApp</label>
            <input
              name="phoneNumber"
              type="tel"
              required
              value={phone}
              onChange={handlePhoneChange}
              className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none transition-colors"
              placeholder="+62812xxxxxx"
            />
            <p className="mt-1 text-[10px] text-gray-500 font-medium">Format: +62 (10-15 digit)</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gold mb-2">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            className="btn-gold w-full flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
            Daftar Sekarang
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-gold hover:underline font-bold">
            Masuk ke Garasi
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
