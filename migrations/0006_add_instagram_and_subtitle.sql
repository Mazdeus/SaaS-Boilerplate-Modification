-- Migration: Add instagram_username to company_branch and subtitle to service_item
-- Created: $(date)

-- Add instagram_username field to company_branch table
ALTER TABLE company_branch 
ADD COLUMN instagram_username VARCHAR(100);

-- Add subtitle field to service_item table  
ALTER TABLE service_item
ADD COLUMN subtitle TEXT;

-- Update existing service items with placeholder subtitles (optional)
-- This is safe to run as subtitle is nullable
UPDATE service_item SET subtitle = 'Subtitle for ' || title WHERE subtitle IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN company_branch.instagram_username IS 'Instagram username for the specific branch (without @)';
COMMENT ON COLUMN service_item.subtitle IS 'Short subtitle/tagline for the service item';
