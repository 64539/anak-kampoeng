import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { CopyButton } from "@/components/CopyButton";

export const revalidate = 0;

export default async function UserManagement() {
  const allUsers = await db.select().from(users).orderBy(users.createdAt);
  
  // Filter hanya nomor WA yang valid (+62, angka saja, 10-15 digit) untuk disalin
  const validWhatsAppList = allUsers
    .filter(u => u.phoneNumber && /^\+62[0-9]{7,12}$/.test(u.phoneNumber))
    .map(u => `${u.name} - ${u.phoneNumber}`)
    .join('\n');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
            Manajemen <span className="text-gold">User</span>
          </h1>
          <p className="text-gray-500 font-medium">Daftar semua member yang terdaftar di sistem.</p>
        </div>
        <div className="w-full md:w-auto flex md:justify-end">
          <CopyButton data={validWhatsAppList} />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block glass-card overflow-hidden border-gold/10">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 border-b border-gold/10">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gold">Nama</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gold">Email</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gold">WhatsApp</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gold">Role</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold">{user.name}</td>
                <td className="p-4 text-gray-400">{user.email}</td>
                <td className="p-4 text-gray-400 font-mono">{user.phoneNumber}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${user.role === 'ADMIN' ? 'bg-gold text-black' : 'bg-white/10 text-gray-400'}`}>
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {allUsers.map((user) => (
          <div key={user.id} className="glass-card p-4 border-gold/10">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-bold text-sm">{user.name}</p>
                <p className="text-gray-400 text-xs">{user.email}</p>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${user.role === 'ADMIN' ? 'bg-gold text-black' : 'bg-white/10 text-gray-400'}`}>
                {user.role}
              </span>
            </div>
            <p className="text-gray-400 text-xs font-mono break-all">WA: {user.phoneNumber}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
