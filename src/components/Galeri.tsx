"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, Image as ImageIcon, Video, X } from "lucide-react";
import VideoPlayer from "./VideoPlayer";

interface GaleriProps {
  items: any[];
}

const Galeri = ({ items }: GaleriProps) => {
  const [filter, setFilter] = useState("Semua");
  const [selectedWork, setSelectedWork] = useState<any>(null);

  const filteredWorks = items.filter(work => {
    if (filter === "Semua") return true;
    if (filter === "Foto") return work.sourceType === "image";
    if (filter === "Video") return work.sourceType === "video";
    return true;
  });

  return (
    <section id="galeri" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gold uppercase tracking-[0.3em] font-bold text-sm mb-4">Portofolio Kami</h2>
          <h3 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter">Karya <span className="text-gold">Koko Mechanic</span></h3>
          <div className="w-24 h-1 bg-gold mx-auto mb-10" />
          
          {/* Filter */}
          <div className="flex justify-center gap-4">
            {["Semua", "Foto", "Video"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-gold text-black' : 'bg-white/5 text-gray-400 hover:text-gold'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredWorks.length === 0 ? (
          <div className="text-center py-20 glass-card border-gold/10">
            <p className="text-gray-500 font-bold uppercase tracking-widest">Belum ada karya untuk ditampilkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredWorks.map((work) => (
                <motion.div
                  key={work.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-square overflow-hidden group cursor-pointer glass-card border-gold/10"
                  onClick={() => setSelectedWork(work)}
                >
                  {/* Image/Thumbnail */}
                  <div className="absolute inset-0 bg-zinc-900 overflow-hidden">
                    {work.sourceType === 'image' ? (
                      <img 
                        src={work.mediaUrl} 
                        alt={work.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full relative">
                        {work.thumbnailUrl ? (
                          <img 
                            src={work.thumbnailUrl} 
                            alt={work.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-gold/20">
                            <Video size={64} />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/0 transition-all">
                          <Play size={48} className="text-gold fill-gold" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Type Icon */}
                  <div className="absolute top-4 right-4 z-20 text-gold/50 group-hover:text-black transition-colors">
                    {work.sourceType === 'video' ? <Video size={20} /> : <ImageIcon size={20} />}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/90 transition-all duration-500 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 p-6">
                    {work.sourceType === 'video' ? <Play className="text-black mb-4 fill-black" size={48} /> : <Search className="text-black mb-4" size={48} />}
                    <h4 className="text-black text-2xl font-black uppercase text-center tracking-tighter">{work.title}</h4>
                    <p className="text-black/70 font-bold uppercase tracking-widest text-sm mt-2">{work.category}</p>
                  </div>
                  
                  {/* Corner accent */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold/40 group-hover:border-black/40 transition-colors" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold/40 group-hover:border-black/40 transition-colors" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
          >
            <button 
              onClick={() => setSelectedWork(null)}
              className="absolute top-8 right-8 text-white/50 hover:text-gold transition-colors z-[110]"
            >
              <X size={40} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-5xl aspect-video glass-card overflow-hidden relative"
            >
              {selectedWork.sourceType === 'video' ? (
                <div className="w-full h-full bg-black">
                  <VideoPlayer
                    sourceType="video"
                    mediaType={selectedWork.mediaType}
                    mediaUrl={selectedWork.mediaUrl}
                    thumbnailUrl={selectedWork.thumbnailUrl}
                    title={selectedWork.title}
                    autoPlay
                  />
                </div>
              ) : (
                <img 
                  src={selectedWork.mediaUrl} 
                  alt={selectedWork.title} 
                  className="w-full h-full object-contain"
                />
              )}
              
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-3xl font-black uppercase tracking-tighter text-gold">{selectedWork.title}</h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest">{selectedWork.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Galeri;
