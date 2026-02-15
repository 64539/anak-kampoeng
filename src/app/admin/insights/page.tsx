import { db } from "@/lib/db";
import { insights } from "@/db/schema";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminInsightsList from "./AdminInsightsList";

export const revalidate = 0;

export default async function InsightsManagementPage() {
  const items = await db.select().from(insights);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
          WAWASAN <span className="text-gold">OTOMOTIF</span>
        </h1>
        <Link href="/admin/insights/new" className="btn-gold text-xs px-4 py-2 flex items-center gap-2 w-full md:w-auto justify-center">
          <Plus size={14} />
          Tulis Artikel
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="glass-card p-8 border-gold/10 text-center">
          <p className="text-gray-400 font-bold uppercase tracking-widest">Belum ada ilmu yang dibagikan, Beh.</p>
        </div>
      ) : (
        <AdminInsightsList items={items as any} />
      )}
    </div>
  );
}
