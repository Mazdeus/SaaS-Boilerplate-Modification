import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const aboutSection = pgTable('about_section', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  introText: text('intro_text'),
  storyTitle: varchar('story_title', { length: 255 }),
  storyContent: text('story_content'),
  missionTitle: varchar('mission_title', { length: 255 }),
  missionContent: text('mission_content'),
  visionTitle: varchar('vision_title', { length: 255 }),
  visionContent: text('vision_content'),
  imageUrl: varchar('image_url', { length: 500 }),
  statsLabel1: varchar('stats_label_1', { length: 100 }),
  statsValue1: integer('stats_value_1'),
  statsLabel2: varchar('stats_label_2', { length: 100 }),
  statsValue2: integer('stats_value_2'),
  statsLabel3: varchar('stats_label_3', { length: 100 }),
  statsValue3: integer('stats_value_3'),
  statsLabel4: varchar('stats_label_4', { length: 100 }),
  statsValue4: integer('stats_value_4'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type AboutSection = typeof aboutSection.$inferSelect;
export type NewAboutSection = typeof aboutSection.$inferInsert;
