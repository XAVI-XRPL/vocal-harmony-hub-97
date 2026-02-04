-- Add new product category enum values
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'essential-oils';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'tea-honey';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'nasal-sinus';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'allergy-wellness';

-- Add new columns to products table for partner brand features
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_code text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_coming_soon boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_partner_brand boolean DEFAULT false;