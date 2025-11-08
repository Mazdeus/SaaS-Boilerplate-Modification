import { z } from 'zod';

// ============================================
// CMS VALIDATION SCHEMAS
// ============================================

// User Authentication
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'editor', 'viewer']).default('editor'),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'editor', 'viewer']).optional(),
  isActive: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Hero Section
export const heroSectionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subtitle: z.string().max(300).optional(),
  description: z.string().max(1000).optional(),
  ctaText: z.string().max(100).optional(),
  ctaLink: z.string().url('Invalid URL').or(z.string().regex(/^\//, 'Must be a valid URL or path')).optional(),
  imageId: z.number().int().positive().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

// About Section
export const aboutSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  whoWeAre: z.string().optional(),
  whatWeDo: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  statsClients: z.number().int().min(0).default(0),
  statsProjects: z.number().int().min(0).default(0),
  statsYears: z.number().int().min(0).default(0),
  statsTeam: z.number().int().min(0).default(0),
});

// Team Member
export const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  position: z.string().min(1, 'Position is required').max(100),
  bio: z.string().optional(),
  imageId: z.number().int().positive().optional(),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

// Service Item
export const serviceItemSchema = z.object({
  icon: z.string().max(50).optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

// Company Value
export const companyValueSchema = z.object({
  icon: z.string().max(50).optional(),
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

// Testimonial
export const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  position: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  rating: z.number().int().min(1).max(5).default(5),
  avatarId: z.number().int().positive().optional(),
  isActive: z.boolean().default(true),
});

// Collection Item
export const collectionItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().optional(),
  imageId: z.number().int().positive().optional(),
  productLink: z.string().url('Invalid product link').optional().or(z.literal('')),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

// Product Item
export const productItemSchema = z.object({
  collectionId: z.number().int().positive().optional(),
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().optional(),
  price: z.number().int().min(0).optional(),
  imageId: z.number().int().positive().optional(),
  productLink: z.string().url('Invalid product link').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// Image Upload
export const imageSchema = z.object({
  fileName: z.string().min(1, 'File name is required').max(150),
  url: z.string().url('Invalid image URL'),
  altText: z.string().max(200).optional(),
  type: z.string().max(50).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  fileSize: z.number().int().positive().optional(),
  mimeType: z.string().max(50).optional(),
});

// Contact Info
export const contactInfoSchema = z.object({
  email: z.string().email('Invalid email').optional(),
  phone: z.string().max(30).optional(),
  address: z.string().optional(),
  city: z.string().max(100).optional(),
  province: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(100).default('Indonesia'),
  mapLocation: z.string().max(300).optional(),
  businessHours: z.string().optional(),
});

// Social Media
export const socialMediaSchema = z.object({
  platform: z.string().min(1, 'Platform is required').max(50),
  url: z.string().url('Invalid URL'),
  icon: z.string().max(50).optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

// Site Settings
export const siteSettingsSchema = z.object({
  key: z.string().min(1, 'Key is required').max(100),
  value: z.string().optional(),
  type: z.enum(['string', 'number', 'boolean', 'json']).default('string'),
  description: z.string().optional(),
});

// Activity Log
export const activityLogSchema = z.object({
  userId: z.number().int().positive(),
  action: z.enum(['create', 'update', 'delete', 'login', 'logout']),
  entityType: z.string().max(50).optional(),
  entityId: z.number().int().positive().optional(),
  details: z.string().optional(),
  ipAddress: z.string().max(45).optional(),
  userAgent: z.string().optional(),
});

// Export all schemas
export const cmsSchemas = {
  login: loginSchema,
  register: registerSchema,
  updateUser: updateUserSchema,
  changePassword: changePasswordSchema,
  heroSection: heroSectionSchema,
  aboutSection: aboutSectionSchema,
  teamMember: teamMemberSchema,
  serviceItem: serviceItemSchema,
  companyValue: companyValueSchema,
  testimonial: testimonialSchema,
  collectionItem: collectionItemSchema,
  productItem: productItemSchema,
  image: imageSchema,
  contactInfo: contactInfoSchema,
  socialMedia: socialMediaSchema,
  siteSettings: siteSettingsSchema,
  activityLog: activityLogSchema,
};
