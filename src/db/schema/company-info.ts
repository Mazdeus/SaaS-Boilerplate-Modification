import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const companyInfo = pgTable('company_info', {
  id: serial('id').primaryKey(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  tagline: text('tagline'),
  description: text('description'),
  foundedYear: integer('founded_year'),
  email: varchar('email', { length: 255 }),
  phoneNumber: varchar('phone_number', { length: 50 }),
  whatsappNumber: varchar('whatsapp_number', { length: 50 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  province: varchar('province', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  logoUrl: varchar('logo_url', { length: 500 }),
  faviconUrl: varchar('favicon_url', { length: 500 }),
  footerText: text('footer_text'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type CompanyInfo = typeof companyInfo.$inferSelect;
export type NewCompanyInfo = typeof companyInfo.$inferInsert;
