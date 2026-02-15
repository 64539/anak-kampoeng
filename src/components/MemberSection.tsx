"use client";

import React from "react";
import { User, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const MemberSection = () => {
  return (
    <section id="login" className="py-20 bg-matte border-t border-gold/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 md:p-12 relative overflow-hidden group">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-gold/10 transition-colors" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 border border-gold/20">
              <User size={40} className="text-gold" />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h3 className="text-2xl font-black mb-3 uppercase tracking-wider">Akses Member</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Silakan masuk untuk memantau progres servis kendaraan Anda secara real-time. 
                Dapatkan riwayat servis lengkap dan notifikasi perawatan berkala secara eksklusif.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="btn-gold px-10">
                  Masuk Akun
                </button>
                <div className="flex items-center gap-2 text-gold/60 text-sm font-bold uppercase tracking-widest">
                  <ShieldCheck size={18} />
                  Akses Terenkripsi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberSection;
