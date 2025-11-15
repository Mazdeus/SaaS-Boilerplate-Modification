import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const companyValues = pgTable('company_values', {
  id: serial('id').primaryKey(),
  icon: varchar('icon', { length: 100 }),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: text('subtitle'),
  description: text('description'),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type CompanyValue = typeof companyValues.$inferSelect;
export type NewCompanyValue = typeof companyValues.$inferInsert;
