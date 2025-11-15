import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const seoSettings = pgTable('seo_settings', {
  id: serial('id').primaryKey(),
  pageName: varchar('page_name', { length: 100 }).notNull().unique(), // homepage, about, collections, stores, contact, instagram
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  metaKeywords: text('meta_keywords'),
  ogImage: varchar('og_image', { length: 500 }),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type SeoSetting = typeof seoSettings.$inferSelect;
export type NewSeoSetting = typeof seoSettings.$inferInsert;
