"use client";

import React from "react";
import { motion } from "framer-motion";
import { Wrench, Fuel, Gauge, FileText } from "lucide-react";

interface WawasanProps {
  items: any[];
}

const Wawasan = ({ items }: WawasanProps) => {
  return (
    <section id="wawasan" className="py-24 bg-matte relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="text-gold uppercase tracking-[0.3em] font-bold text-sm mb-4">Edukasi Otomotif</h2>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Wawasan <span className="text-gold">Mesin</span></h3>
          </div>
          <p className="text-gray-500 max-w-md font-medium">
            Berbagi ilmu dan pengalaman seputar dunia kustom dan perawatan kendaraan dari perspektif ahli.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-50">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-8 border-l-4 border-l-gold/20">
                <div className="w-12 h-12 bg-white/5 rounded mb-6 animate-pulse" />
                <div className="w-3/4 h-6 bg-white/5 rounded mb-4 animate-pulse" />
                <div className="w-full h-20 bg-white/5 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.slice(0, 3).map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="glass-card p-8 border-l-4 border-l-gold hover:bg-white/5 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300 text-gold">
                  {article.category === 'Tips' ? <Wrench size={32} /> : 
                   article.category === 'Modifikasi' ? <Gauge size={32} /> : 
                   article.category === 'Bahan Bakar' ? <Fuel size={32} /> :
                   <FileText size={32} />}
                </div>
                <h4 className="text-2xl font-black mb-4 group-hover:text-gold transition-colors uppercase tracking-tight">
                  {article.title}
                </h4>
                <p className="text-gray-400 leading-relaxed font-medium line-clamp-3 mb-6">
                  {article.content}
                </p>
                <div className="mt-auto">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold/50">{article.category}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Wawasan;
