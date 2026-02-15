import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';
import * as dotenv from 'dotenv';

// Tambahkan baris ini biar dia baca file .env
dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL tidak ditemukan di .env. Cek lagi filenya!');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });