"use client";

import React, { useState } from "react";
import { updateProfileAction } from "@/actions/profile";
import { motion } from "framer-motion";
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ProfileFormProps {
  user: any;
}

const ProfileForm = ({ user }: ProfileFormProps) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [phone, setPhone] = useState(user.phoneNumber || "");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val.replace(/[^0-9+]/g, "");
    
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
    setMessage(null);
    
    const isAdmin = user.role === "ADMIN";
    const phoneNumber = formData.get("phoneNumber") as string;
    
    if (!isAdmin && (!phoneNumber.startsWith("+62") || phoneNumber.length < 10)) {
      setMessage({ type: "error", text: "Format WhatsApp tidak valid. Gunakan format +62..." });
      setLoading(false);
      return;
    }
    
    const result = await updateProfileAction(formData);
    
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.success) {
      setMessage({ type: "success", text: result.success });
    }
    
    setLoading(false);
  }

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="glass-card p-8 border-gold/10">
      <form action={handleSubmit} className="space-y-6">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded flex items-center gap-3 ${
              message.type === "success" 
                ? "bg-green-500/10 border border-green-500/50 text-green-500" 
                : "bg-red-500/10 border border-red-500/50 text-red-500"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm font-bold">{message.text}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gold mb-2">Nama Lengkap</label>
            <input
              name="name"
              type="text"
              defaultValue={user.name}
              required
              className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none transition-colors font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gold mb-2">Alamat Email</label>
            <input
              name="email"
              type="email"
              defaultValue={user.email}
              required
              className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none transition-colors font-medium"
            />
          </div>

          {/* WhatsApp Field: Hidden or Readonly for Admin */}
          {!isAdmin ? (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gold mb-2">Nomor WhatsApp</label>
              <input
                name="phoneNumber"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none transition-colors font-medium"
                placeholder="+62812xxxxxx"
              />
              <p className="mt-2 text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                Format: +62 (10-15 digit)
              </p>
            </div>
          ) : (
            <div className="opacity-50">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nomor WhatsApp (Admin)</label>
              <input
                name="phoneNumber"
                type="text"
                value="Tidak diperlukan untuk Admin"
                readOnly
                className="w-full bg-white/5 border border-white/10 rounded p-3 text-gray-500 outline-none cursor-not-allowed font-medium"
              />
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            disabled={loading}
            className="btn-gold w-full md:w-auto flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
