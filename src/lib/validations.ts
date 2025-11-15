import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'super_admin']).default('admin'),
});

// Hero Section Schemas
export const heroSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  description: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  imageUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  ctaText: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  ctaLink: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

// About Schema
export const aboutSchema = z.object({
  title: z.string().min(1, 'Title is required').optional().nullable(),
  introText: z.string().optional().nullable(),
  storyTitle: z.string().optional().nullable(),
  storyContent: z.string().optional().nullable(),
  missionTitle: z.string().optional().nullable(),
  missionContent: z.string().optional().nullable(),
  visionTitle: z.string().optional().nullable(),
  visionContent: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  statsLabel1: z.string().optional().nullable(),
  statsValue1: z.number().int().optional().nullable(),
  statsLabel2: z.string().optional().nullable(),
  statsValue2: z.number().int().optional().nullable(),
  statsLabel3: z.string().optional().nullable(),
  statsValue3: z.number().int().optional().nullable(),
  statsLabel4: z.string().optional().nullable(),
  statsValue4: z.number().int().optional().nullable(),
});

// Founder Schema
export const founderSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.string().min(1, 'Position is required'),
  bio: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  imageUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  linkedinUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  instagramUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

// Company Values Schema
export const companyValueSchema = z.object({
  icon: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  description: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

// Collection Schema
export const collectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required'),
  description: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  imageUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export const collectionImageSchema = z.object({
  collectionId: z.number().int(),
  imageUrl: z.string().min(1, 'Image URL is required'),
  caption: z.string().optional(),
  displayOrder: z.number().int().default(0),
});

// Store Schema
export const storeSchema = z.object({
  name: z.string().min(1, 'Store name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  phoneNumber: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  email: z.string().email('Invalid email').optional().or(z.literal('')).transform(val => val || null).nullable(),
  operatingHours: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  mapUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  imageUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  instagramUsername: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  latitude: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  longitude: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

// Testimonial Schema
export const testimonialSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerPosition: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  customerCompany: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  customerImageUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  rating: z.number().int().min(1).max(5).default(5),
  testimonialText: z.string().min(1, 'Testimonial text is required'),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

// Company Info Schema
export const companyInfoSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  tagline: z.string().optional(),
  email: z.string().email('Invalid email'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  whatsappNumber: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  logoUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  faviconUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  instagramUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  facebookUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  twitterUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  linkedinUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  tiktokUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  youtubeUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  footerText: z.string().optional(),
});

// Contact Message Schema
export const contactMessageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// SEO Settings Schema
export const seoSettingSchema = z.object({
  pageName: z.string().min(1, 'Page name is required'),
  metaTitle: z.string().min(1, 'Meta title is required'),
  metaDescription: z.string().min(1, 'Meta description is required'),
  metaKeywords: z.string().optional(),
  ogImage: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
});

// About Section Schema (singleton)
export const aboutSectionSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  introText: z.string().optional(),
  storyTitle: z.string().optional(),
  storyContent: z.string().optional(),
  missionTitle: z.string().optional(),
  missionContent: z.string().optional(),
  visionTitle: z.string().optional(),
  visionContent: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal('')).transform(val => val || null).nullable(),
  statsLabel1: z.string().optional(),
  statsValue1: z.number().int().optional(),
  statsLabel2: z.string().optional(),
  statsValue2: z.number().int().optional(),
  statsLabel3: z.string().optional(),
  statsValue3: z.number().int().optional(),
  statsLabel4: z.string().optional(),
  statsValue4: z.number().int().optional(),
});

// Social Media Schema
export const socialMediaSchema = z.object({
  platform: z.enum(['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'whatsapp']),
  url: z.string().min(1, 'URL is required'),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

// Export types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type HeroSectionInput = z.infer<typeof heroSectionSchema>;
export type AboutInput = z.infer<typeof aboutSchema>;
export type FounderInput = z.infer<typeof founderSchema>;
export type CollectionInput = z.infer<typeof collectionSchema>;
export type CollectionImageInput = z.infer<typeof collectionImageSchema>;
export type StoreInput = z.infer<typeof storeSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type CompanyInfoInput = z.infer<typeof companyInfoSchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
export type SeoSettingInput = z.infer<typeof seoSettingSchema>;
export type CompanyValueInput = z.infer<typeof companyValueSchema>;
export type AboutSectionInput = z.infer<typeof aboutSectionSchema>;
export type SocialMediaInput = z.infer<typeof socialMediaSchema>;
