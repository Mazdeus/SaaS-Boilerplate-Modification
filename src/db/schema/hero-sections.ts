import { pgTable, serial, text, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const heroSections = pgTable('hero_sections', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }),
  ctaText: varchar('cta_text', { length: 100 }),
  ctaLink: varchar('cta_link', { length: 500 }),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type HeroSection = typeof heroSections.$inferSelect;
export type NewHeroSection = typeof heroSections.$inferInsert;
