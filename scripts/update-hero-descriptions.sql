-- Update hero sections with descriptions
-- Run this in your PostgreSQL database

UPDATE hero_sections 
SET description = 'Crafted with passion, designed for authenticity. Explore our premium collection of Indonesian footwear.'
WHERE title = 'Welcome to Brodo' AND description IS NULL;

UPDATE hero_sections 
SET description = 'Experience the perfect blend of tradition and innovation in every step.'
WHERE title = 'Authentic Indonesian Footwear' AND description IS NULL;

UPDATE hero_sections 
SET description = 'Discover timeless designs that tell a story of craftsmanship and quality.'
WHERE title = 'Crafted with Pride' AND description IS NULL;

-- If you want to update all NULL descriptions with a default
UPDATE hero_sections 
SET description = 'Discover our carefully curated collection of premium Indonesian footwear, crafted with passion and precision.'
WHERE description IS NULL;
