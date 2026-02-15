import { db } from './db';
import { users } from '../db/schema';
import bcrypt from 'bcryptjs';

async function setupAdmin() {
  console.log('--- Menyiapkan Akun Admin Babeh ---');
  
  try {
    // Hash password agar aman di database
    const hashedPassword = await bcrypt.hash('Admin2311', 10);
    
    await db.insert(users).values({
      name: 'Babeh', // Username/Nama
      email: 'admin@anakkampoeng.com', // Email untuk login
      password: hashedPassword,
      phoneNumber: null, // Kosongkan WA sesuai request
      role: 'ADMIN',
    });

    console.log('✅ Akun Admin "Babeh" berhasil dibuat!');
    console.log('📧 Email: admin@anakkampoeng.com');
    console.log('🔑 Password: Admin2311');
  } catch (error) {
    console.error('❌ Gagal membuat akun:', error);
  }
}

setupAdmin();