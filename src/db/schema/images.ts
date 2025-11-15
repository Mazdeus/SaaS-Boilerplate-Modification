import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  altText: varchar('alt_text', { length: 255 }),
  category: varchar('category', { length: 100 }), // hero, collection, product, team, store, testimonial, general
  width: integer('width'),
  height: integer('height'),
  fileSize: integer('file_size'), // in bytes
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;
