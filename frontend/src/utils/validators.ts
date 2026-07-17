import { z } from 'zod';

export const emailSchema = z.string().email('Please enter a valid email address');

export const phoneSchema = z
  .string()
  .regex(/^[+]?[\d\s\-()]{7,20}$/, 'Please enter a valid phone number')
  .optional();

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one number');

export const salarySchema = z.coerce
  .number()
  .min(0, 'Salary cannot be negative')
  .optional();

export const objectIdSchema = z.string().length(24, 'Invalid ID');
