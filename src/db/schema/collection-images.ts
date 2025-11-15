import { pgTable, serial, integer, varchar, timestamp } from 'drizzle-orm/pg-core';
import { collections } from './collections';
import { images } from './images';

export const collectionImages = pgTable('collection_images', {
  id: serial('id').primaryKey(),
  collectionId: integer('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
  imageId: integer('image_id').notNull().references(() => images.id, { onDelete: 'cascade' }),
  caption: varchar('caption', { length: 255 }),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type CollectionImage = typeof collectionImages.$inferSelect;
export type NewCollectionImage = typeof collectionImages.$inferInsert;
