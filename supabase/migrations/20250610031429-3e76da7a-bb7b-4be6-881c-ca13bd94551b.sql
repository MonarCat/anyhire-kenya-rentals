
-- First, let's see what categories actually exist
SELECT id, name, slug FROM public.categories ORDER BY name;

-- Update categories with proper image URLs and descriptions
UPDATE public.categories SET 
  image_url = 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop',
  description = 'Latest smartphones, laptops, tablets and electronic gadgets'
WHERE name = 'Electronics';

UPDATE public.categories SET 
  image_url = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
  description = 'Professional tools and equipment for any job'
WHERE name = 'Tools & Equipment';

UPDATE public.categories SET 
  image_url = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
  description = 'Books, magazines, movies and educational content'
WHERE name = 'Books & Media';

UPDATE public.categories SET 
  image_url = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
  description = 'Sports equipment and recreational gear'
WHERE name = 'Sports & Outdoor';

UPDATE public.categories SET 
  image_url = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  description = 'Home and office furniture'
WHERE name = 'Furniture';

UPDATE public.categories SET 
  image_url = 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop',
  description = 'Various items and miscellaneous products'
WHERE name = 'Events & Party';

UPDATE public.categories SET 
  image_url = 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
  description = 'Cars, motorcycles and other vehicles'
WHERE name = 'Vehicles';

UPDATE public.categories SET 
  image_url = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop',
  description = 'Clothing, shoes and accessories'
WHERE name = 'Fashion';

-- Insert sample items using actual category IDs from the database
INSERT INTO public.items (
  user_id, category_id, title, description, condition, price, price_period, 
  location, images, is_available, is_featured, ad_type
) VALUES 
-- Electronics category items
((SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com' LIMIT 1), 
 (SELECT id FROM public.categories WHERE name = 'Electronics' LIMIT 1), 
 'MacBook Pro 13" 2021', 
 'High-performance laptop perfect for work and creative projects. M1 chip, 8GB RAM, 256GB SSD.', 
 'excellent', 
 350000, 'day', 'Nairobi, Kenya', 
 '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=400&fit=crop"]', 
 true, true, 'normal'),

((SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com' LIMIT 1), 
 (SELECT id FROM public.categories WHERE name = 'Electronics' LIMIT 1), 
 'Canon EOS R6 Camera', 
 'Professional mirrorless camera with 24-105mm lens. Perfect for photography and videography.', 
 'excellent', 
 450000, 'day', 'Nairobi, Kenya', 
 '["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=400&fit=crop"]', 
 true, true, 'normal'),

-- Tools & Equipment category items
((SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com' LIMIT 1), 
 (SELECT id FROM public.categories WHERE name = 'Tools & Equipment' LIMIT 1), 
 'Professional Drill Set', 
 'Complete cordless drill set with multiple bits and accessories. Perfect for home improvement.', 
 'good', 
 15000, 'day', 'Nairobi, Kenya', 
 '["https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=500&h=400&fit=crop"]', 
 true, false, 'normal'),

((SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com' LIMIT 1), 
 (SELECT id FROM public.categories WHERE name = 'Tools & Equipment' LIMIT 1), 
 'Chainsaw Heavy Duty', 
 'Professional chainsaw for tree cutting and landscaping work. Well maintained and powerful.', 
 'good', 
 25000, 'day', 'Nairobi, Kenya', 
 '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop"]', 
 true, false, 'normal'),

-- Sports & Outdoor category items
((SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com' LIMIT 1), 
 (SELECT id FROM public.categories WHERE name = 'Sports & Outdoor' LIMIT 1), 
 'Mountain Bike Trek', 
 'High-quality mountain bike perfect for trail riding and outdoor adventures.', 
 'excellent', 
 8000, 'day', 'Nairobi, Kenya', 
 '["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=400&fit=crop"]', 
 true, true, 'normal'),

((SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com' LIMIT 1), 
 (SELECT id FROM public.categories WHERE name = 'Sports & Outdoor' LIMIT 1), 
 'Complete Gym Equipment Set', 
 'Dumbbells, resistance bands, yoga mat and other fitness equipment for home workouts.', 
 'good', 
 5000, 'week', 'Nairobi, Kenya', 
 '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop"]', 
 true, false, 'normal'),

-- Furniture category items
((SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com' LIMIT 1), 
 (SELECT id FROM public.categories WHERE name = 'Furniture' LIMIT 1), 
 'Executive Office Chair', 
 'Ergonomic leather office chair with lumbar support. Perfect for long work sessions.', 
 'excellent', 
 12000, 'week', 'Nairobi, Kenya', 
 '["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop"]', 
 true, true, 'normal'),

((SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com' LIMIT 1), 
 (SELECT id FROM public.categories WHERE name = 'Furniture' LIMIT 1), 
 'Modern Dining Table Set', 
 '6-seater wooden dining table with matching chairs. Perfect for events and gatherings.', 
 'good', 
 18000, 'day', 'Nairobi, Kenya', 
 '["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=400&fit=crop"]', 
 true, false, 'normal'),

-- Vehicles category items
((SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com' LIMIT 1), 
 (SELECT id FROM public.categories WHERE name = 'Vehicles' LIMIT 1), 
 'Toyota Corolla 2020', 
 'Reliable sedan perfect for city driving and long trips. Excellent fuel economy and comfort.', 
 'excellent', 
 500000, 'day', 'Nairobi, Kenya', 
 '["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=400&fit=crop"]', 
 true, true, 'normal'),

((SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com' LIMIT 1), 
 (SELECT id FROM public.categories WHERE name = 'Vehicles' LIMIT 1), 
 'Honda Motorcycle CB300R', 
 'Stylish motorcycle perfect for city commuting. Excellent fuel efficiency and reliability.', 
 'good', 
 80000, 'day', 'Nairobi, Kenya', 
 '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop"]', 
 true, false, 'normal'),

-- Events & Party category items
((SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com' LIMIT 1), 
 (SELECT id FROM public.categories WHERE name = 'Events & Party' LIMIT 1), 
 'Professional Sound System', 
 'Complete PA system with speakers, mixer and microphones. Perfect for events.', 
 'excellent', 
 35000, 'day', 'Nairobi, Kenya', 
 '["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=400&fit=crop"]', 
 true, true, 'normal'),

((SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com' LIMIT 1), 
 (SELECT id FROM public.categories WHERE name = 'Events & Party' LIMIT 1), 
 'Wedding Decoration Package', 
 'Complete wedding decoration set including flowers, lights, and centerpieces.', 
 'excellent', 
 45000, 'day', 'Nairobi, Kenya', 
 '["https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&h=400&fit=crop"]', 
 true, false, 'normal'),

-- Fashion category items
((SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com' LIMIT 1), 
 (SELECT id FROM public.categories WHERE name = 'Fashion' LIMIT 1), 
 'Designer Tuxedo Set', 
 'Elegant black tuxedo perfect for formal events and weddings. Includes jacket, pants, and accessories.', 
 'excellent', 
 8000, 'day', 'Nairobi, Kenya', 
 '["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=400&fit=crop"]', 
 true, false, 'normal'),

((SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com' LIMIT 1), 
 (SELECT id FROM public.categories WHERE name = 'Fashion' LIMIT 1), 
 'Wedding Dress Collection', 
 'Beautiful wedding dresses in various sizes. Perfect for your special day.', 
 'excellent', 
 25000, 'day', 'Nairobi, Kenya', 
 '["https://images.unsplash.com/photo-1594736797933-d0b22d4fb344?w=500&h=400&fit=crop"]', 
 true, true, 'normal'),

-- Books & Media category items
((SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com' LIMIT 1), 
 (SELECT id FROM public.categories WHERE name = 'Books & Media' LIMIT 1), 
 'Business Strategy Books Collection', 
 'Complete collection of top business strategy books including Good to Great, Blue Ocean Strategy.', 
 'excellent', 
 2000, 'week', 'Nairobi, Kenya', 
 '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop"]', 
 true, false, 'normal'),

((SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com' LIMIT 1), 
 (SELECT id FROM public.categories WHERE name = 'Books & Media' LIMIT 1), 
 'Photography Course DVDs', 
 'Professional photography training course with practical exercises and assignments.', 
 'good', 
 3500, 'week', 'Nairobi, Kenya', 
 '["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=400&fit=crop"]', 
 true, false, 'normal');

-- Enable RLS and create policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" ON public.categories
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view available items" ON public.items;
CREATE POLICY "Public can view available items" ON public.items
FOR SELECT USING (is_available = true);

DROP POLICY IF EXISTS "Users can manage own items" ON public.items;
CREATE POLICY "Users can manage own items" ON public.items
FOR ALL USING (auth.uid() = user_id);
