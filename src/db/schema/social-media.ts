import { pgTable, serial, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const socialMedia = pgTable('social_media', {
  id: serial('id').primaryKey(),
  platform: varchar('platform', { length: 100 }).notNull(), // instagram, facebook, twitter, youtube, linkedin, tiktok
  url: varchar('url', { length: 500 }).notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type SocialMedia = typeof socialMedia.$inferSelect;
export type NewSocialMedia = typeof socialMedia.$inferInsert;
