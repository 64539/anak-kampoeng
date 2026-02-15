import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";

const address = "Jl. Mushollah Nurul Asih No. 22, RT 03/RW 08, Ciriung, Kec. Cibinong, Kabupaten Bogor, 16918";
const mapsQuery = encodeURIComponent(address);
const mapsEmbed = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-matte">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-start gap-10">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Kontak <span className="text-gold">Resmi</span></h1>
            <p className="text-gray-500 font-medium">Hubungi kami untuk konsultasi modifikasi, servis, atau jadwal kunjungan.</p>
            
            <div className="glass-card p-8 border-gold/10 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-gold flex-shrink-0" size={20} />
                <span className="text-gray-300">{address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-gold flex-shrink-0" size={20} />
                <a 
                  href="https://wa.me/6281285019989" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-gold transition-colors"
                >
                  081285019989
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-gold flex-shrink-0" size={20} />
                <span className="text-white">Senin - Minggu (08.30 - 17.00 WIB)</span>
              </div>
            </div>
          </div>

          <div className="md:w-[320px] w-full">
            <div className="relative w-full rounded-lg border border-gold overflow-hidden">
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10"
                aria-label="Buka lokasi di Google Maps"
              />
              <iframe
                title="Lokasi Anak Kampoeng Auto Garage"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-60 md:h-80 pointer-events-none"
                src={mapsEmbed}
              />
            </div>
            <div className="mt-4">
              <Link href="/" className="text-xs text-gray-500 hover:text-white uppercase font-bold tracking-widest">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
