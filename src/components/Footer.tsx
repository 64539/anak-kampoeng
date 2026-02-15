import React from "react";
import { Instagram, Facebook, Youtube, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-black tracking-tighter text-white mb-6 block">
              ANAK <span className="text-gold">KAMPOENG</span>
            </span>
            <p className="text-gray-500 max-w-sm mb-6">
              Bengkel kustom dan servis spesialis mesin berperforma tinggi. 
              Membawa standar kemewahan balap ke kendaraan harian lo.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Youtube size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-6">Kontak</h4>
            <ul className="space-y-4 text-gray-500">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-gold flex-shrink-0" />
                <span>Jl. Mushollah Nurul Asih No. 22, RT 03/RW 08, Ciriung, Kec. Cibinong, Kabupaten Bogor, 16918</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-gold flex-shrink-0" />
                <a 
                  href="https://wa.me/6281285019989" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-gold transition-colors"
                >
                  081285019989
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-6">Jam Operasional</h4>
            <ul className="space-y-2 text-gray-500">
              <li className="flex justify-between">
                <span>Senin - Minggu</span>
                <span className="text-white">08.30 - 17.00 WIB</span>
              </li>
            </ul>
          </div>

          <div className="md:flex md:justify-end">
            <div className="relative w-full md:w-[280px] rounded-lg border border-gold overflow-hidden">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Jl.%20Mushollah%20Nurul%20Asih%20No.%2022%2C%20RT%2003%2FRW%2008%2C%20Ciriung%2C%20Kec.%20Cibinong%2C%20Kabupaten%20Bogor%2C%2016918"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10"
                aria-label="Buka lokasi di Google Maps"
              />
              <iframe
                title="Lokasi Anak Kampoeng Auto Garage"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-40 md:h-48 pointer-events-none"
                src="https://www.google.com/maps?q=Jl.%20Mushollah%20Nurul%20Asih%20No.%2022%2C%20RT%2003%2FRW%2008%2C%20Ciriung%2C%20Kec.%20Cibinong%2C%20Kabupaten%20Bogor%2C%2016918&output=embed"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Anak Kampoeng Auto Garage. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
