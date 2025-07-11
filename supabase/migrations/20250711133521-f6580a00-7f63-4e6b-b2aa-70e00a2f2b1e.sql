
-- Phase 1: Critical RBAC Vulnerability Fix - Add missing RLS policies for user_roles table
-- This fixes the privilege escalation vulnerability

-- Policy to prevent unauthorized role creation
CREATE POLICY "Users cannot create roles for others"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (false); -- Block all direct inserts

-- Policy to prevent privilege escalation through updates
CREATE POLICY "Users cannot modify roles"
  ON public.user_roles
  FOR UPDATE
  USING (false); -- Block all direct updates

-- Policy to prevent unauthorized role deletion
CREATE POLICY "Users cannot delete roles"
  ON public.user_roles
  FOR DELETE
  USING (false); -- Block all direct deletions

-- Only service role can manage roles (for admin functions)
CREATE POLICY "Service role can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (auth.role() = 'service_role');

-- Phase 2: RLS Policy Cleanup - Remove duplicate and conflicting policies on items table
DROP POLICY IF EXISTS "Anyone can view available items" ON public.items;
DROP POLICY IF EXISTS "Users can delete own items" ON public.items;
DROP POLICY IF EXISTS "Users can insert own items" ON public.items;
DROP POLICY IF EXISTS "Users can update own items" ON public.items;
DROP POLICY IF EXISTS "Users can view own items" ON public.items;
DROP POLICY IF EXISTS "Users can delete their own items" ON public.items;
DROP POLICY IF EXISTS "Users can insert their own items" ON public.items;
DROP POLICY IF EXISTS "Users can update their own items" ON public.items;
DROP POLICY IF EXISTS "Users can view their own items" ON public.items;
DROP POLICY IF EXISTS "Users can manage own items" ON public.items;

-- Create clean, consolidated policies for items
CREATE POLICY "Public can view available items"
  ON public.items
  FOR SELECT
  USING (is_available = true);

CREATE POLICY "Users can manage their own items"
  ON public.items
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Phase 3: Add missing RLS policies for subscription_plans table
CREATE POLICY "Anyone can view active subscription plans"
  ON public.subscription_plans
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role can manage subscription plans"
  ON public.subscription_plans
  FOR ALL
  USING (auth.role() = 'service_role');

-- Add security audit logging table for monitoring sensitive operations
CREATE TABLE public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.security_audit_log
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Service role can insert audit logs
CREATE POLICY "Service role can insert audit logs"
  ON public.security_audit_log
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Add function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_details
  );
END;
$$;

-- Add trigger to log role changes
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_security_event(
      'ROLE_GRANTED',
      'user_roles',
      NEW.id::TEXT,
      jsonb_build_object('user_id', NEW.user_id, 'role', NEW.role)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_security_event(
      'ROLE_REVOKED',
      'user_roles',
      OLD.id::TEXT,
      jsonb_build_object('user_id', OLD.user_id, 'role', OLD.role)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for role change auditing
CREATE TRIGGER audit_user_roles_changes
  AFTER INSERT OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_role_changes();
