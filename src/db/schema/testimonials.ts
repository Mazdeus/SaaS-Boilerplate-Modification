import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPosition: varchar('customer_position', { length: 255 }),
  customerCompany: varchar('customer_company', { length: 255 }),
  customerImageUrl: varchar('customer_image_url', { length: 500 }),
  rating: integer('rating').notNull().default(5), // 1-5 stars
  testimonialText: text('testimonial_text').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
