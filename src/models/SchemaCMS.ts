import { pgTable, serial, text, integer, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';

// ============================================
// CMS SCHEMA FOR BRODO COMPANY PROFILE
// ============================================

// 1. Admin Users - Authentication & Authorization
export const cmsUser = pgTable('cms_user', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).default('editor'), // admin, editor, viewer
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 2. Hero Section - Main banner/slideshow content
export const heroSection = pgTable('hero_section', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  description: text('description'),
  ctaText: varchar('cta_text', { length: 100 }),
  ctaLink: varchar('cta_link', { length: 200 }),
  imageId: integer('image_id').references(() => images.id),
  imageUrl: varchar('image_url', { length: 500 }), // Direct URL field
  order: integer('order').default(0), // For slideshow ordering
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 3. About Section - Company information
export const aboutSection = pgTable('about_section', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  whoWeAre: text('who_we_are'),
  whatWeDo: text('what_we_do'),
  mission: text('mission'),
  vision: text('vision'),
  statsClients: integer('stats_clients').default(0),
  statsProjects: integer('stats_projects').default(0),
  statsYears: integer('stats_years').default(0),
  statsTeam: integer('stats_team').default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 4. Team Members - Founders and key personnel
export const teamMember = pgTable('team_member', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  position: varchar('position', { length: 100 }).notNull(),
  bio: text('bio'),
  imageId: integer('image_id').references(() => images.id),
  photoUrl: varchar('photo_url', { length: 500 }), // Direct URL field
  linkedinUrl: varchar('linkedin_url', { length: 200 }),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 5. Services - What the company offers
export const serviceItem = pgTable('service_item', {
  id: serial('id').primaryKey(),
  icon: varchar('icon', { length: 50 }), // e.g., "Rocket", "Star", "Users"
  iconUrl: varchar('icon_url', { length: 500 }), // Direct URL field
  title: text('title').notNull(),
  subtitle: text('subtitle'), // Short tagline/subtitle for the service
  description: text('description'),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 6. Values - Company values and philosophy
export const companyValue = pgTable('company_value', {
  id: serial('id').primaryKey(),
  icon: varchar('icon', { length: 50 }),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description'),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 7. Testimonials - Customer reviews
export const testimonial = pgTable('testimonial', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  position: varchar('position', { length: 100 }),
  company: varchar('company', { length: 100 }),
  message: text('message').notNull(),
  rating: integer('rating').default(5), // 1-5 stars
  avatarId: integer('avatar_id').references(() => images.id),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 8. Product Collections - Featured products/categories
export const collectionItem = pgTable('collection_item', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  imageId: integer('image_id').references(() => images.id),
  imageUrl: varchar('image_url', { length: 500 }), // Direct URL field
  productLink: varchar('product_link', { length: 300 }),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 9. Products - Individual product items
export const productItem = pgTable('product_item', {
  id: serial('id').primaryKey(),
  collectionId: integer('collection_id').references(() => collectionItem.id),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  price: integer('price'), // Store in cents
  imageId: integer('image_id').references(() => images.id),
  imageUrl: varchar('image_url', { length: 500 }), // Direct URL field
  productLink: varchar('product_link', { length: 300 }),
  isFeatured: boolean('is_featured').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 10. Images / Media Library
export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  fileName: varchar('file_name', { length: 150 }).notNull(),
  url: text('url').notNull(),
  altText: varchar('alt_text', { length: 200 }),
  type: varchar('type', { length: 50 }), // hero, about, service, product, team, testimonial
  width: integer('width'),
  height: integer('height'),
  fileSize: integer('file_size'), // in bytes
  mimeType: varchar('mime_type', { length: 50 }),
  uploadedBy: integer('uploaded_by').references(() => cmsUser.id),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});

// 11. Contact Information
export const contactInfo = pgTable('contact_info', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 100 }),
  phone: varchar('phone', { length: 30 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  province: varchar('province', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  country: varchar('country', { length: 100 }).default('Indonesia'),
  mapLocation: varchar('map_location', { length: 300 }), // Google Maps embed or coordinates
  businessHours: text('business_hours'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 11b. Company Information - General company profile
export const companyInfoTable = pgTable('company_info', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  tagline: text('tagline'),
  description: text('description'),
  foundedYear: integer('founded_year'),
  location: varchar('location', { length: 200 }),
  industry: varchar('industry', { length: 100 }),
  employees: integer('employees'),
  email: varchar('email', { length: 100 }),
  phone: varchar('phone', { length: 30 }),
  address: text('address'),
  logoUrl: varchar('logo_url', { length: 500 }),
  isActive: boolean('is_active').default(true),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 12. Company Branch - Store locations
export const companyBranch = pgTable('company_branch', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  address: text('address').notNull(),
  city: varchar('city', { length: 50 }).notNull(),
  province: varchar('province', { length: 50 }),
  postalCode: varchar('postal_code', { length: 10 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 100 }),
  operatingHours: text('operating_hours'),
  mapUrl: varchar('map_url', { length: 500 }),
  imageUrl: varchar('image_url', { length: 500 }),
  instagramUsername: varchar('instagram_username', { length: 100 }), // Instagram username for this branch
  isActive: boolean('is_active').default(true),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 13. Social Media Links
export const socialMedia = pgTable('social_media', {
  id: serial('id').primaryKey(),
  platform: varchar('platform', { length: 50 }).notNull(), // instagram, facebook, twitter, linkedin, tiktok
  url: varchar('url', { length: 200 }).notNull(),
  icon: varchar('icon', { length: 50 }),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 14. Settings - General site settings
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value'),
  type: varchar('type', { length: 50 }).default('string'), // string, number, boolean, json
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 14. Activity Log - Audit trail for CMS actions
export const activityLog = pgTable('activity_log', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => cmsUser.id),
  action: varchar('action', { length: 50 }).notNull(), // create, update, delete, login
  entityType: varchar('entity_type', { length: 50 }), // hero, about, service, etc.
  entityId: integer('entity_id'),
  details: text('details'), // JSON string with changes
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Export all tables as a single schema object
export const cmsSchema = {
  cmsUser,
  heroSection,
  aboutSection,
  teamMember,
  serviceItem,
  companyValue,
  testimonial,
  collectionItem,
  productItem,
  images,
  contactInfo,
  companyBranch,
  socialMedia,
  siteSettings,
  activityLog,
  companyInfoTable,
};

// TypeScript types for better type safety
export type CmsUser = typeof cmsUser.$inferSelect;
export type NewCmsUser = typeof cmsUser.$inferInsert;

export type HeroSection = typeof heroSection.$inferSelect;
export type NewHeroSection = typeof heroSection.$inferInsert;

export type AboutSection = typeof aboutSection.$inferSelect;
export type NewAboutSection = typeof aboutSection.$inferInsert;

export type TeamMember = typeof teamMember.$inferSelect;
export type NewTeamMember = typeof teamMember.$inferInsert;

export type ServiceItem = typeof serviceItem.$inferSelect;
export type NewServiceItem = typeof serviceItem.$inferInsert;

export type CompanyValue = typeof companyValue.$inferSelect;
export type NewCompanyValue = typeof companyValue.$inferInsert;

export type Testimonial = typeof testimonial.$inferSelect;
export type NewTestimonial = typeof testimonial.$inferInsert;

export type CollectionItem = typeof collectionItem.$inferSelect;
export type NewCollectionItem = typeof collectionItem.$inferInsert;

export type ProductItem = typeof productItem.$inferSelect;
export type NewProductItem = typeof productItem.$inferInsert;

export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;

export type ContactInfo = typeof contactInfo.$inferSelect;
export type NewContactInfo = typeof contactInfo.$inferInsert;

export type CompanyBranch = typeof companyBranch.$inferSelect;
export type NewCompanyBranch = typeof companyBranch.$inferInsert;

export type SocialMedia = typeof socialMedia.$inferSelect;
export type NewSocialMedia = typeof socialMedia.$inferInsert;

export type SiteSettings = typeof siteSettings.$inferSelect;
export type NewSiteSettings = typeof siteSettings.$inferInsert;

export type ActivityLog = typeof activityLog.$inferSelect;
export type NewActivityLog = typeof activityLog.$inferInsert;

// Plural aliases for backward compatibility with API routes
export const teamMembers = teamMember;
export const testimonials = testimonial;
export const services = serviceItem;
export const products = productItem;
export const productCollections = collectionItem;
export const companyInfo = companyInfoTable;
export const companyBranches = companyBranch;
