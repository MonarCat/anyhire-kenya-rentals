// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jnwoqedjzdbvgrpxmoix.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impud29xZWRqemRidmdycHhtb2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMDczMjUsImV4cCI6MjA2Mjc4MzMyNX0.QQF9L_uVRYmjEVw5UauNfGbv2LaGK-Luww3ZdrdAcBw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);