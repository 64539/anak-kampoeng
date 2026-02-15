import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Wawasan from "@/components/Wawasan";
import Galeri from "@/components/Galeri";
import MemberSection from "@/components/MemberSection";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { gallery, insights } from "@/db/schema";
import { desc } from "drizzle-orm";

export default async function Home() {
  const session = await getSession();
  
  // Fetch data for public view
  const galleryItems = await db.select().from(gallery).orderBy(desc(gallery.createdAt));
  const insightItems = await db.select().from(insights).orderBy(desc(insights.createdAt));

  return (
    <main className="min-h-screen bg-matte">
      <Navbar session={session} />
      <Hero />
      <Wawasan items={insightItems} />
      <Galeri items={galleryItems} />
      {!session && <MemberSection />}
      <Footer />
    </main>
  );
}
