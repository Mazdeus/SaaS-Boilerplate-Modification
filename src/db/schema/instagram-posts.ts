import { pgTable, serial, varchar, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

export const instagramPosts = pgTable('instagram_posts', {
  id: serial('id').primaryKey(),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  caption: text('caption'),
  instagramUrl: varchar('instagram_url', { length: 500 }),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type InstagramPost = typeof instagramPosts.$inferSelect;
export type NewInstagramPost = typeof instagramPosts.$inferInsert;
