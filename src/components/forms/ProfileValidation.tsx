
import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(50, 'Full name must be less than 50 characters'),
  phone: z.string().optional().refine((val) => {
    if (!val) return true;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(val);
  }, 'Please enter a valid phone number'),
  location: z.string().min(1, 'Location is required'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: z.string().optional().refine((val) => {
    if (!val) return true;
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, 'Please enter a valid website URL')
});

export type ProfileFormData = z.infer<typeof profileSchema>;
