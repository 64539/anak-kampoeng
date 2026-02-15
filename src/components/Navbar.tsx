"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, LayoutDashboard, ChevronDown, LogIn } from "lucide-react";
import { logoutAction } from "@/actions/auth";

interface NavbarProps {
  session: any;
}

const Navbar = ({ session }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-lg border-b border-gold/20 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-tighter text-white">
                ANAK <span className="text-gold">KAMPOENG</span>
              </span>
            </Link>
          </div>

          {/* Menu */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              <Link href="/#home" className="text-gray-300 hover:text-gold px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors">Home</Link>
              <Link href="/#wawasan" className="text-gray-300 hover:text-gold px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors">Wawasan</Link>
              <Link href="/#galeri" className="text-gray-300 hover:text-gold px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors">Galeri</Link>
            </div>
          </div>

          {/* Auth Button */}
          <div className="flex items-center gap-3 ml-auto pr-4 md:pr-0">
            {!session ? (
              <Link href="/login" className="btn-gold-outline text-[10px] sm:text-xs py-2 px-4 sm:px-6">
                Masuk ke Garasi
              </Link>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-gold font-bold text-[10px] sm:text-xs uppercase tracking-widest bg-gold/10 px-3 sm:px-4 py-2 rounded border border-gold/20 hover:bg-gold/20 transition-all max-w-[160px] sm:max-w-none truncate"
                >
                  <User size={16} />
                  <span className="truncate">{session.user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 glass-card border-gold/20 rounded shadow-xl overflow-hidden"
                    >
                      <Link href="/profile" className="flex items-center gap-3 p-4 text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-gold hover:bg-gold/5 transition-colors border-b border-gold/10">
                        <User size={16} />
                        Profil Saya
                      </Link>
                      {session.user.role === 'ADMIN' && (
                        <Link href="/admin" className="flex items-center gap-3 p-4 text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-gold hover:bg-gold/5 transition-colors border-b border-gold/10">
                          <LayoutDashboard size={16} />
                          Admin Panel
                        </Link>
                      )}
                      <form action={logoutAction}>
                        <button 
                          type="submit"
                          className="w-full flex items-center gap-3 p-4 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                        >
                          <LogOut size={16} />
                          Keluar
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
