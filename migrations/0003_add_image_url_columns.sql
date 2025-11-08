-- Add image_url columns for easier content management
-- This allows direct URL input without requiring image upload first

ALTER TABLE hero_section ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE collection_item ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE product_item ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE service_item ADD COLUMN IF NOT EXISTS icon_url VARCHAR(500);
ALTER TABLE team_member ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500);
