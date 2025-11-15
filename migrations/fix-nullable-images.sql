-- Migration: Fix nullable image fields
-- Make image_url columns nullable for collections, hero_sections

-- Collections table
ALTER TABLE collections 
ALTER COLUMN image_url DROP NOT NULL;

-- Hero sections table
ALTER TABLE hero_sections 
ALTER COLUMN image_url DROP NOT NULL;

-- Founders table - position should be NOT NULL
ALTER TABLE founders 
ALTER COLUMN position SET NOT NULL;
