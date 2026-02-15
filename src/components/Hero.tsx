"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 carbon-texture opacity-30" />
        {/* You could add a background image here */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-matte" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            Anak Kampoeng: <br />
            <span className="gold-gradient-text">Sentuhan Berkelas</span> buat <br />
            Mesin Kesayangan.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto font-light">
            Dari tangan dingin buat lo yang paham kualitas. <br className="hidden md:block" />
            Bukan sekadar bengkel, ini tempat lahirnya karya.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-gold flex items-center gap-2 group"
            >
              Konsultasi Sekarang
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-1 h-12 rounded-full bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
