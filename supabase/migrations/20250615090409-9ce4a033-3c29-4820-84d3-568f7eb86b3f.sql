
-- Enable RLS on the items table
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Allow users to SELECT only their own items
CREATE POLICY "Users can view their own items"
  ON public.items
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to INSERT items for themselves
CREATE POLICY "Users can insert their own items"
  ON public.items
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Allow users to UPDATE their own items
CREATE POLICY "Users can update their own items"
  ON public.items
  FOR UPDATE
  USING (user_id = auth.uid());

-- Allow users to DELETE their own items
CREATE POLICY "Users can delete their own items"
  ON public.items
  FOR DELETE
  USING (user_id = auth.uid());
