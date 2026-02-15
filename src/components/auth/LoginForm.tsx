"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function LoginForm({ action }: { action: (formData: FormData) => Promise<any> }) {
  const { pending } = useFormStatus();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 carbon-texture opacity-20 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2 tracking-tighter">
            MASUK KE <span className="text-gold">GARASI</span>
          </h1>
          <p className="text-gray-400">Selamat datang kembali, Mechanic!</p>
        </div>

        <form action={action} className="space-y-6">
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
            disabled={pending}
            className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            {pending ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
            Masuk Sekarang
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Belum punya member?{" "}
          <Link href="/register" className="text-gold hover:underline font-bold">
            Gabung Member
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
