import {
  bigint,
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// This file defines the structure of your database tables using the Drizzle ORM.
// Updated to match the actual database schema structure

// ====================================================================
// ORGANIZATION TABLE
// For subscription and billing management
// ====================================================================
export const organizationSchema = pgTable(
  'organization',
  {
    id: text('id').primaryKey(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeSubscriptionPriceId: text('stripe_subscription_price_id'),
    stripeSubscriptionStatus: text('stripe_subscription_status'),
    stripeSubscriptionCurrentPeriodEnd: bigint(
      'stripe_subscription_current_period_end',
      { mode: 'number' },
    ),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      stripeCustomerIdIdx: uniqueIndex('stripe_customer_id_idx').on(
        table.stripeCustomerId,
      ),
    };
  },
);

// ====================================================================
// TODO TABLE
// ====================================================================
export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ====================================================================
// CONTACT SUBMISSION TABLE
// ====================================================================
export const contactSubmissionSchema = pgTable('contact_submission', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at', { mode: 'date' }),
});

// ====================================================================
// CMS USER TABLE
// ====================================================================
export const cmsUserSchema = pgTable(
  'cms_user',
  {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: varchar('role', { length: 50 }).notNull().default('editor'),
    isActive: boolean('is_active').notNull().default(true),
    lastLogin: timestamp('last_login', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      usernameIdx: uniqueIndex('cms_user_username_idx').on(table.username),
      emailIdx: uniqueIndex('cms_user_email_idx').on(table.email),
      roleIdx: index('cms_user_role_idx').on(table.role),
      isActiveIdx: index('cms_user_is_active_idx').on(table.isActive),
    };
  },
);

// ====================================================================
// IMAGES TABLE
// ====================================================================
export const imagesSchema = pgTable(
  'images',
  {
    id: serial('id').primaryKey(),
    fileName: varchar('file_name', { length: 255 }).notNull(),
    url: text('url').notNull(),
    altText: varchar('alt_text', { length: 255 }),
    type: varchar('type', { length: 50 }),
    width: integer('width'),
    height: integer('height'),
    fileSize: integer('file_size'),
    mimeType: varchar('mime_type', { length: 100 }),
    uploadedBy: integer('uploaded_by'),
    uploadedAt: timestamp('uploaded_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      uploadedByIdx: index('images_uploaded_by_idx').on(table.uploadedBy),
      typeIdx: index('images_type_idx').on(table.type),
      uploadedAtIdx: index('images_uploaded_at_idx').on(table.uploadedAt),
    };
  },
);

// ====================================================================
// COMPANY INFO TABLE
// ====================================================================
export const companyInfoSchema = pgTable('company_info', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  tagline: text('tagline'),
  description: text('description'),
  foundedYear: integer('founded_year'),
  location: varchar('location', { length: 255 }),
  industry: varchar('industry', { length: 255 }),
  employees: integer('employees'),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  logoUrl: varchar('logo_url', { length: 500 }),
  isActive: boolean('is_active').notNull().default(true),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ====================================================================
// COMPANY BRANCH TABLE
// ====================================================================
export const companyBranchSchema = pgTable(
  'company_branch',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    address: text('address'),
    city: varchar('city', { length: 100 }),
    province: varchar('province', { length: 100 }),
    postalCode: varchar('postal_code', { length: 20 }),
    phone: varchar('phone', { length: 50 }),
    email: varchar('email', { length: 255 }),
    operatingHours: text('operating_hours'),
    mapUrl: varchar('map_url', { length: 500 }),
    imageUrl: varchar('image_url', { length: 500 }),
    isActive: boolean('is_active').notNull().default(true),
    order: integer('order').default(0),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    instagramUsername: varchar('instagram_username', { length: 100 }),
  },
  (table) => {
    return {
      isActiveIdx: index('company_branch_is_active_idx').on(table.isActive),
      orderIdx: index('company_branch_order_idx').on(table.order),
      cityIdx: index('company_branch_city_idx').on(table.city),
    };
  },
);

// ====================================================================
// CONTACT INFO TABLE
// ====================================================================
export const contactInfoSchema = pgTable('contact_info', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  province: varchar('province', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  country: varchar('country', { length: 100 }).default('Indonesia'),
  mapLocation: varchar('map_location', { length: 500 }),
  businessHours: text('business_hours'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ====================================================================
// HERO SECTION TABLE
// ====================================================================
export const heroSectionSchema = pgTable(
  'hero_section',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    description: text('description'),
    ctaText: varchar('cta_text', { length: 100 }),
    ctaLink: varchar('cta_link', { length: 500 }),
    imageId: integer('image_id'),
    imageUrl: varchar('image_url', { length: 500 }),
    order: integer('order').default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      isActiveIdx: index('hero_section_is_active_idx').on(table.isActive),
      orderIdx: index('hero_section_order_idx').on(table.order),
    };
  },
);

// ====================================================================
// ABOUT SECTION TABLE
// ====================================================================
export const aboutSectionSchema = pgTable('about_section', {
  id: serial('id').primaryKey(),
  title: text('title'),
  whoWeAre: text('who_we_are'),
  whatWeDo: text('what_we_do'),
  mission: text('mission'),
  vision: text('vision'),
  statsClients: integer('stats_clients').default(0),
  statsProjects: integer('stats_projects').default(0),
  statsYears: integer('stats_years').default(0),
  statsTeam: integer('stats_team').default(0),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ====================================================================
// COMPANY VALUE TABLE
// ====================================================================
export const companyValueSchema = pgTable(
  'company_value',
  {
    id: serial('id').primaryKey(),
    icon: varchar('icon', { length: 255 }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    order: integer('order').default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      isActiveIdx: index('company_value_is_active_idx').on(table.isActive),
      orderIdx: index('company_value_order_idx').on(table.order),
    };
  },
);

// ====================================================================
// TEAM MEMBER TABLE
// ====================================================================
export const teamMemberSchema = pgTable(
  'team_member',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    position: varchar('position', { length: 255 }),
    bio: text('bio'),
    imageId: integer('image_id'),
    photoUrl: varchar('photo_url', { length: 500 }),
    linkedinUrl: varchar('linkedin_url', { length: 500 }),
    order: integer('order').default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      isActiveIdx: index('team_member_is_active_idx').on(table.isActive),
      orderIdx: index('team_member_order_idx').on(table.order),
    };
  },
);

// ====================================================================
// SERVICE ITEM TABLE
// ====================================================================
export const serviceItemSchema = pgTable(
  'service_item',
  {
    id: serial('id').primaryKey(),
    icon: varchar('icon', { length: 255 }),
    iconUrl: varchar('icon_url', { length: 500 }),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    description: text('description'),
    order: integer('order').default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      isActiveIdx: index('service_item_is_active_idx').on(table.isActive),
      orderIdx: index('service_item_order_idx').on(table.order),
    };
  },
);

// ====================================================================
// COLLECTION ITEM TABLE
// ====================================================================
export const collectionItemSchema = pgTable(
  'collection_item',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description'),
    imageId: integer('image_id'),
    imageUrl: varchar('image_url', { length: 500 }),
    productLink: varchar('product_link', { length: 500 }),
    order: integer('order').default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      slugIdx: uniqueIndex('collection_item_slug_idx').on(table.slug),
      isActiveIdx: index('collection_item_is_active_idx').on(table.isActive),
      orderIdx: index('collection_item_order_idx').on(table.order),
    };
  },
);

// ====================================================================
// PRODUCT ITEM TABLE
// ====================================================================
export const productItemSchema = pgTable(
  'product_item',
  {
    id: serial('id').primaryKey(),
    collectionId: integer('collection_id'),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description'),
    price: integer('price'),
    imageId: integer('image_id'),
    imageUrl: varchar('image_url', { length: 500 }),
    productLink: varchar('product_link', { length: 500 }),
    isFeatured: boolean('is_featured').default(false),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      slugIdx: uniqueIndex('product_item_slug_idx').on(table.slug),
      collectionIdIdx: index('product_item_collection_id_idx').on(table.collectionId),
      isFeaturedIdx: index('product_item_is_featured_idx').on(table.isFeatured),
      isActiveIdx: index('product_item_is_active_idx').on(table.isActive),
    };
  },
);

// ====================================================================
// TESTIMONIAL TABLE
// ====================================================================
export const testimonialSchema = pgTable(
  'testimonial',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    position: varchar('position', { length: 255 }),
    company: varchar('company', { length: 255 }),
    message: text('message').notNull(),
    rating: integer('rating').default(5),
    avatarId: integer('avatar_id'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      isActiveIdx: index('testimonial_is_active_idx').on(table.isActive),
      ratingIdx: index('testimonial_rating_idx').on(table.rating),
    };
  },
);

// ====================================================================
// SOCIAL MEDIA TABLE
// ====================================================================
export const socialMediaSchema = pgTable(
  'social_media',
  {
    id: serial('id').primaryKey(),
    platform: varchar('platform', { length: 100 }).notNull(),
    url: varchar('url', { length: 500 }).notNull(),
    icon: varchar('icon', { length: 255 }),
    order: integer('order').default(0),
    isActive: boolean('is_active').notNull().default(true),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      isActiveIdx: index('social_media_is_active_idx').on(table.isActive),
      orderIdx: index('social_media_order_idx').on(table.order),
    };
  },
);

// ====================================================================
// SITE SETTINGS TABLE
// ====================================================================
export const siteSettingsSchema = pgTable(
  'site_settings',
  {
    id: serial('id').primaryKey(),
    key: varchar('key', { length: 255 }).notNull().unique(),
    value: text('value'),
    type: varchar('type', { length: 50 }).default('text'),
    description: text('description'),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      keyIdx: uniqueIndex('site_settings_key_idx').on(table.key),
    };
  },
);

// ====================================================================
// ACTIVITY LOG TABLE
// ====================================================================
export const activityLogSchema = pgTable(
  'activity_log',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id'),
    action: varchar('action', { length: 100 }).notNull(),
    entityType: varchar('entity_type', { length: 100 }),
    entityId: integer('entity_id'),
    details: text('details'),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdIdx: index('activity_log_user_id_idx').on(table.userId),
      actionIdx: index('activity_log_action_idx').on(table.action),
      createdAtIdx: index('activity_log_created_at_idx').on(table.createdAt),
    };
  },
);

// ====================================================================
// RELATIONS (Optional - for Drizzle ORM relationships)
// ====================================================================
export const imagesRelations = relations(imagesSchema, ({ one }) => ({
  uploadedBy: one(cmsUserSchema, {
    fields: [imagesSchema.uploadedBy],
    references: [cmsUserSchema.id],
  }),
}));

export const productItemRelations = relations(productItemSchema, ({ one }) => ({
  collection: one(collectionItemSchema, {
    fields: [productItemSchema.collectionId],
    references: [collectionItemSchema.id],
  }),
  image: one(imagesSchema, {
    fields: [productItemSchema.imageId],
    references: [imagesSchema.id],
  }),
}));

export const activityLogRelations = relations(activityLogSchema, ({ one }) => ({
  user: one(cmsUserSchema, {
    fields: [activityLogSchema.userId],
    references: [cmsUserSchema.id],
  }),
}));
