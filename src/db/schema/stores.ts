import { pgTable, serial, varchar, text, integer, boolean, timestamp, decimal } from 'drizzle-orm/pg-core';

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  province: varchar('province', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  phoneNumber: varchar('phone_number', { length: 50 }),
  email: varchar('email', { length: 255 }),
  operatingHours: text('operating_hours'),
  mapUrl: varchar('map_url', { length: 500 }),
  imageUrl: varchar('image_url', { length: 500 }),
  instagramUsername: varchar('instagram_username', { length: 100 }),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;
