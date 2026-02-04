-- ========== Phase 7: Hub Module Database Tables ==========

-- Create enum types for categories
CREATE TYPE public.product_category AS ENUM ('throat-care', 'hydration', 'vitamins', 'accessories', 'apparel');
CREATE TYPE public.doctor_specialty AS ENUM ('ENT', 'Laryngologist', 'Voice Therapist', 'Vocal Coach');
CREATE TYPE public.venue_type AS ENUM ('arena', 'stadium', 'theater', 'club');
CREATE TYPE public.gear_category AS ENUM ('iem', 'microphone', 'in-ear-monitor', 'cable', 'case', 'accessories');
CREATE TYPE public.checklist_category AS ENUM ('vocal', 'gear', 'mental', 'physical');

-- ========== Cities Table ==========
CREATE TABLE public.cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  svg_x REAL NOT NULL,
  svg_y REAL NOT NULL,
  venue_count INTEGER DEFAULT 0,
  doctor_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cities are publicly readable"
  ON public.cities FOR SELECT
  USING (true);

-- ========== Venues Table ==========
CREATE TABLE public.venues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type public.venue_type NOT NULL,
  city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Venues are publicly readable"
  ON public.venues FOR SELECT
  USING (true);

-- ========== Medical Providers (Doctors) Table ==========
CREATE TABLE public.medical_providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  credentials TEXT NOT NULL,
  specialty public.doctor_specialty NOT NULL,
  practice TEXT NOT NULL,
  city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT NOT NULL,
  accepts_emergency BOOLEAN DEFAULT false,
  touring_artist_friendly BOOLEAN DEFAULT false,
  rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.medical_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Medical providers are publicly readable"
  ON public.medical_providers FOR SELECT
  USING (true);

-- ========== Products Table (Vocal Rider Store) ==========
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  category public.product_category NOT NULL,
  image_url TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT
  USING (true);

-- ========== Partner Brands Table ==========
CREATE TABLE public.partner_brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  description TEXT NOT NULL,
  discount_code TEXT NOT NULL,
  discount_percent INTEGER DEFAULT 0,
  website_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partner brands are publicly readable"
  ON public.partner_brands FOR SELECT
  USING (true);

-- ========== Gear Products Table ==========
CREATE TABLE public.gear_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand_id TEXT NOT NULL REFERENCES public.partner_brands(id) ON DELETE CASCADE,
  category public.gear_category NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  image_url TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  specs JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gear_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gear products are publicly readable"
  ON public.gear_products FOR SELECT
  USING (true);

-- ========== Checklist Items (Template) Table ==========
CREATE TABLE public.checklist_items (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  category public.checklist_category NOT NULL,
  description TEXT NOT NULL,
  item_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Checklist items are publicly readable"
  ON public.checklist_items FOR SELECT
  USING (true);

-- ========== User Checklist Progress Table ==========
CREATE TABLE public.user_checklist_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  checklist_item_id TEXT NOT NULL REFERENCES public.checklist_items(id) ON DELETE CASCADE,
  is_checked BOOLEAN DEFAULT false,
  checked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, checklist_item_id)
);

ALTER TABLE public.user_checklist_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own checklist progress"
  ON public.user_checklist_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checklist progress"
  ON public.user_checklist_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklist progress"
  ON public.user_checklist_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checklist progress"
  ON public.user_checklist_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at on user_checklist_progress
CREATE TRIGGER update_user_checklist_progress_updated_at
  BEFORE UPDATE ON public.user_checklist_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ========== Indexes for Performance ==========
CREATE INDEX idx_venues_city_id ON public.venues(city_id);
CREATE INDEX idx_medical_providers_city_id ON public.medical_providers(city_id);
CREATE INDEX idx_gear_products_brand_id ON public.gear_products(brand_id);
CREATE INDEX idx_gear_products_category ON public.gear_products(category);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_user_checklist_progress_user_id ON public.user_checklist_progress(user_id);