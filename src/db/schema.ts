import { pgTable, serial, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core';

// Tabel Galeri buat Koko Mechanic
export const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  sourceType: varchar('source_type', { length: 20 }).notNull(), // 'image', 'video'
  mediaType: varchar('media_type', { length: 20 }).notNull(), // 'upload', 'embed'
  mediaUrl: text('media_url').notNull(), // Link embed atau URL dari Uploadthing
  thumbnailUrl: text('thumbnail_url'), // Untuk video manual
  category: varchar('category', { length: 50 }), // 'Custom', 'Service', 'Performance'
  createdAt: timestamp('created_at').defaultNow(),
});

// Tabel Wawasan Otomotif
export const insights = pgTable('insights', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  image: text('image'),
  category: varchar('category', { length: 50 }), // 'Tips', 'Modifikasi', 'Edukasi'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabel Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: text('password').notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }), // Untuk broadcast WA, opsional buat Admin
  role: varchar('role', { length: 10 }).default('USER').notNull(), // 'ADMIN' atau 'USER'
  createdAt: timestamp('created_at').defaultNow(),
});

// Tabel Bookmarks (Karya yang disimpan user)
export const bookmarks = pgTable('bookmarks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  galleryId: integer('gallery_id').references(() => gallery.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
