import { z } from 'zod';

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Product name is too long'),
  description: z.string().max(5000, 'Description is too long').optional().nullable(),
  price: z.number().positive('Price must be positive').max(1000000, 'Price is too high').or(
    z.string().transform((val) => parseFloat(val)).pipe(z.number().positive().max(1000000))
  ),
  image_url: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  interval: z.enum(['one_time', 'month']).optional(),
  active: z.boolean().optional(),
});

export const productUpdateSchema = productSchema.partial();

// Store validation schemas
export const storeSchema = z.object({
  name: z.string().min(1, 'Store name is required').max(100, 'Store name is too long'),
  subdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(30, 'Subdomain is too long')
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(1000, 'Description is too long').optional().nullable(),
  contact_email: z.string().email('Must be a valid email address'),
  maker_bio: z.string().max(1000, 'Bio is too long').optional().nullable(),
  shipping_policy: z.string().max(1000, 'Shipping policy is too long').optional().nullable(),
  return_policy: z.string().max(1000, 'Return policy is too long').optional().nullable(),
  logo_url: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  banner_url: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
});

export const storeUpdateSchema = storeSchema.partial().omit({ subdomain: true });

// Store customization validation
export const storeCustomizationSchema = z.object({
  custom_colors_enabled: z.boolean(),
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional().nullable(),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional().nullable(),
  background_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional().nullable(),
  text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional().nullable(),
  custom_text: z.string().max(500, 'Custom text is too long').optional().nullable(),
});

// User validation schemas
export const userRegistrationSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().min(1, 'First name is required').max(50, 'First name is too long').optional(),
  last_name: z.string().min(1, 'Last name is required').max(50, 'Last name is too long').optional(),
  phone: z.string().max(20, 'Phone number is too long').optional().nullable(),
});

export const userUpdateSchema = z.object({
  first_name: z.string().min(1).max(50).optional(),
  last_name: z.string().min(1).max(50).optional(),
  phone: z.string().max(20).optional().nullable(),
  profile_image_url: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
});

// Address validation schema
export const addressSchema = z.object({
  type: z.enum(['shipping', 'billing']),
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
  address1: z.string().min(1, 'Address is required').max(200),
  address2: z.string().max(200).optional().nullable(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(50),
  postal_code: z.string().min(5, 'Postal code is required').max(10),
  country: z.string().length(2, 'Country code must be 2 characters').default('US'),
  phone: z.string().max(20).optional().nullable(),
  is_default: z.boolean().optional(),
});

// Password validation
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export const passwordResetSchema = z.object({
  email: z.string().email('Must be a valid email address'),
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Order validation
export const returnRequestSchema = z.object({
  orderId: z.string().cuid('Invalid order ID'),
  reason: z.string().min(10, 'Please provide a detailed reason (at least 10 characters)').max(1000),
});

// Helper function to validate data against a schema
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return { success: false, error: firstError.message };
    }
    return { success: false, error: 'Validation failed' };
  }
}
