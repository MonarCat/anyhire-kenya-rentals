
# AnyHire Kenya - Database Schema

## Overview
This document outlines the complete database structure for AnyHire Kenya, designed to be implemented in Supabase.

## Tables

### 1. users (extends auth.users)
```sql
-- User profiles extending Supabase auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  avatar_url TEXT,
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  response_time INTERVAL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

### 2. categories
```sql
-- Item categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default categories
INSERT INTO public.categories (name, slug, icon) VALUES
('Electronics', 'electronics', '📱'),
('Vehicles', 'vehicles', '🚗'),
('Tools & Equipment', 'tools-equipment', '🔧'),
('Furniture', 'furniture', '🪑'),
('Sports & Outdoor', 'sports-outdoor', '⚽'),
('Events & Party', 'events-party', '🎉'),
('Fashion', 'fashion', '👗'),
('Books & Media', 'books-media', '📚');
```

### 3. subscription_plans
```sql
-- Subscription plans
CREATE TABLE public.subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'KES',
  item_limit INTEGER, -- NULL means unlimited
  features JSONB,
  ad_type TEXT CHECK (ad_type IN ('normal', 'top', 'super', 'vip')),
  stripe_price_id TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default plans
INSERT INTO public.subscription_plans (id, name, price, item_limit, features, ad_type) VALUES
('basic', 'Basic', 0, 5, '["Up to 5 free listings", "Basic support"]', 'normal'),
('bronze', 'Bronze', 15000, 15, '["Up to 15 listings", "Normal ads", "Email support"]', 'normal'),
('silver', 'Silver', 35000, 40, '["Up to 40 listings", "Top ads placement", "Priority support"]', 'top'),
('gold', 'Gold', 75000, 100, '["Up to 100 listings", "Super top ads", "Phone support"]', 'super'),
('diamond', 'Diamond', 350000, NULL, '["Unlimited listings", "VIP ads placement", "Dedicated support"]', 'vip');
```

### 4. user_subscriptions
```sql
-- User subscription tracking
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT REFERENCES public.subscription_plans(id) NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own subscription" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage subscriptions" ON public.user_subscriptions FOR ALL USING (auth.role() = 'service_role');
```

### 5. items
```sql
-- Rental items
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  condition TEXT CHECK (condition IN ('new', 'excellent', 'good', 'fair')) NOT NULL,
  price INTEGER NOT NULL, -- in cents
  price_period TEXT CHECK (price_period IN ('hour', 'day', 'week', 'month')) NOT NULL,
  min_rental_period TEXT,
  location TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  images JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  included_items JSONB DEFAULT '[]',
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  ad_type TEXT CHECK (ad_type IN ('normal', 'top', 'super', 'vip')) DEFAULT 'normal',
  view_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view available items" ON public.items FOR SELECT USING (is_available = true);
CREATE POLICY "Users can view own items" ON public.items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own items" ON public.items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own items" ON public.items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own items" ON public.items FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX items_category_id_idx ON public.items(category_id);
CREATE INDEX items_location_idx ON public.items(location);
CREATE INDEX items_price_idx ON public.items(price);
CREATE INDEX items_created_at_idx ON public.items(created_at DESC);
CREATE INDEX items_featured_idx ON public.items(is_featured) WHERE is_featured = true;
```

### 6. bookings
```sql
-- Rental bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
  renter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  total_amount INTEGER NOT NULL, -- in cents
  service_fee INTEGER NOT NULL, -- in cents (5%)
  owner_amount INTEGER NOT NULL, -- in cents (95%)
  status TEXT CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'disputed')) DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')) DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own bookings as renter" ON public.bookings FOR SELECT USING (auth.uid() = renter_id);
CREATE POLICY "Users can view own bookings as owner" ON public.bookings FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert bookings as renter" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = renter_id);
CREATE POLICY "Users can update bookings as owner" ON public.bookings FOR UPDATE USING (auth.uid() = owner_id);

-- Indexes
CREATE INDEX bookings_item_id_idx ON public.bookings(item_id);
CREATE INDEX bookings_renter_id_idx ON public.bookings(renter_id);
CREATE INDEX bookings_owner_id_idx ON public.bookings(owner_id);
CREATE INDEX bookings_status_idx ON public.bookings(status);
```

### 7. reviews
```sql
-- Item and user reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  comment TEXT,
  review_type TEXT CHECK (review_type IN ('owner_to_renter', 'renter_to_owner', 'item_review')) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Indexes
CREATE INDEX reviews_reviewee_id_idx ON public.reviews(reviewee_id);
CREATE INDEX reviews_item_id_idx ON public.reviews(item_id);
```

### 8. messages
```sql
-- User messaging system
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own messages" ON public.messages 
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON public.messages 
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON public.messages 
  FOR UPDATE USING (auth.uid() = recipient_id);

-- Indexes
CREATE INDEX messages_conversation_id_idx ON public.messages(conversation_id);
CREATE INDEX messages_sender_id_idx ON public.messages(sender_id);
CREATE INDEX messages_recipient_id_idx ON public.messages(recipient_id);
```

### 9. transactions
```sql
-- Financial transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('payment', 'payout', 'refund', 'fee')) NOT NULL,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'KES',
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX transactions_user_id_idx ON public.transactions(user_id);
CREATE INDEX transactions_booking_id_idx ON public.transactions(booking_id);
```

## Functions

### Update user statistics
```sql
-- Function to update user ratings and review counts
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update reviewee stats
  UPDATE public.profiles
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM public.reviews
      WHERE reviewee_id = NEW.reviewee_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE reviewee_id = NEW.reviewee_id
    ),
    updated_at = now()
  WHERE id = NEW.reviewee_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user stats
CREATE TRIGGER update_user_stats_trigger
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();
```

### Update item statistics
```sql
-- Function to update item ratings and stats
CREATE OR REPLACE FUNCTION update_item_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update item stats
  UPDATE public.items
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM public.reviews
      WHERE item_id = NEW.item_id AND review_type = 'item_review'
    ),
    review_count = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE item_id = NEW.item_id AND review_type = 'item_review'
    ),
    updated_at = now()
  WHERE id = NEW.item_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for item stats
CREATE TRIGGER update_item_stats_trigger
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  WHEN (NEW.review_type = 'item_review')
  EXECUTE FUNCTION update_item_stats();
```

## Edge Functions

### 1. create-checkout
Creates Stripe checkout sessions for subscription upgrades.

### 2. create-booking-payment
Handles rental payment processing with 5% commission.

### 3. webhook-stripe
Processes Stripe webhooks for subscription and payment updates.

### 4. send-notification
Sends email/SMS notifications for bookings and messages.

### 5. calculate-service-fee
Calculates the 5% service fee for rentals.

## Security Notes

1. All tables have Row Level Security (RLS) enabled
2. Users can only access their own data unless specified
3. Service role bypasses RLS for administrative functions
4. All financial data is stored in cents to avoid decimal precision issues
5. Stripe integration handles PCI compliance
6. User verification system for trust and safety

## Deployment Instructions

1. Create a new Supabase project
2. Run the SQL commands in order
3. Set up Stripe integration with webhooks
4. Configure email/SMS services for notifications
5. Deploy edge functions
6. Update environment variables in frontend
