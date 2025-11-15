import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const founders = pgTable('founders', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  position: varchar('position', { length: 255 }).notNull(),
  bio: text('bio'),
  imageUrl: varchar('image_url', { length: 500 }),
  linkedinUrl: varchar('linkedin_url', { length: 500 }),
  instagramUrl: varchar('instagram_url', { length: 500 }),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Founder = typeof founders.$inferSelect;
export type NewFounder = typeof founders.$inferInsert;
