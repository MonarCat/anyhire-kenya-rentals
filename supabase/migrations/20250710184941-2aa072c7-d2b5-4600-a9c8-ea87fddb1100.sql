
-- Phase 2: Database/RLS cleanup
-- Remove sample data that's polluting the database for real users

-- 1. Clean up sample items (keeping only real user items)
DELETE FROM public.items 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com')
AND title IN (
  'MacBook Pro 13" 2021',
  'Canon EOS R6 Camera', 
  'Professional Drill Set',
  'Chainsaw Heavy Duty',
  'Mountain Bike Trek',
  'Complete Gym Equipment Set',
  'Executive Office Chair',
  'Modern Dining Table Set',
  'Toyota Corolla 2020',
  'Honda Motorcycle CB300R',
  'Professional Sound System',
  'Wedding Decoration Package',
  'Designer Tuxedo Set',
  'Wedding Dress Collection',
  'Business Strategy Books Collection',
  'Photography Course DVDs'
);

-- 2. Remove the admin-specific subscription for sample user
DELETE FROM public.user_subscriptions 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com');

-- 3. Add missing RLS policies for subscription_plans table
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active subscription plans"
  ON public.subscription_plans
  FOR SELECT
  USING (is_active = true);

-- 4. Clean up duplicate RLS policies on items table
DROP POLICY IF EXISTS "Anyone can view available items" ON public.items;
DROP POLICY IF EXISTS "Users can delete own items" ON public.items;
DROP POLICY IF EXISTS "Users can insert own items" ON public.items;
DROP POLICY IF EXISTS "Users can update own items" ON public.items;
DROP POLICY IF EXISTS "Users can view own items" ON public.items;

-- Recreate clean, consolidated policies
CREATE POLICY "Public can view available items"
  ON public.items
  FOR SELECT
  USING (is_available = true);

CREATE POLICY "Users can manage their own items"
  ON public.items
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Clean up duplicate RLS policies on categories table  
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;

-- Keep only the "Public can view all categories" policy

-- 6. Ensure profiles table has proper policies for user management
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

-- Keep consolidated policies:
-- "Anyone can view profiles" (for public profile viewing)
-- "Users can insert own profile" 
-- "Users can update own profile"

-- 7. Add basic default subscription for new users
INSERT INTO public.subscription_plans (id, name, price, item_limit, features, ad_type)
VALUES ('basic', 'Basic', 0, 5, '["Up to 5 free listings", "Basic support"]', 'normal')
ON CONFLICT (id) DO NOTHING;

-- 8. Create trigger to auto-assign basic plan to new users
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Create basic subscription for new user
  INSERT INTO public.user_subscriptions (
    user_id, 
    plan_id, 
    status, 
    current_period_start, 
    current_period_end
  ) VALUES (
    NEW.id,
    'basic',
    'active',
    now(),
    now() + interval '1 year'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_subscription_created ON auth.users;
CREATE TRIGGER on_auth_user_subscription_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();

-- 9. Ensure storage bucket policies are correct
-- Policy for item image uploads
DROP POLICY IF EXISTS "Users can upload item images" ON storage.objects;
CREATE POLICY "Users can upload item images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'items' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for item image updates  
DROP POLICY IF EXISTS "Users can update their item images" ON storage.objects;
CREATE POLICY "Users can update their item images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'items' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for item image deletions
DROP POLICY IF EXISTS "Users can delete their item images" ON storage.objects;
CREATE POLICY "Users can delete their item images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'items' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for viewing item images (public)
DROP POLICY IF EXISTS "Anyone can view item images" ON storage.objects;
CREATE POLICY "Anyone can view item images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'items');
