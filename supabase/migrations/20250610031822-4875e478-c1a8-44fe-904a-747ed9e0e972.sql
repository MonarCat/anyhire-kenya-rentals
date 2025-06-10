
-- Create an enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Grant Moses Mwombe admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'mwombe007@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Check if Moses already has a subscription and remove it
DELETE FROM public.user_subscriptions 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'mwombe007@gmail.com');

-- Insert Moses Mwombe's Diamond subscription
INSERT INTO public.user_subscriptions (
  user_id, 
  plan_id, 
  status, 
  current_period_start, 
  current_period_end
)
SELECT 
  id,
  'diamond',
  'active',
  now(),
  now() + interval '1 month'
FROM auth.users 
WHERE email = 'mwombe007@gmail.com';
