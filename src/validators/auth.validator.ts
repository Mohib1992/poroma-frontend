import { z } from 'zod';

const bangladeshPhoneRegex = /^\+8801[3-9]\d{8}$/;

export const loginSchema = z.object({
  phone: z
    .string({
      required_error: 'Phone number is required',
    })
    .regex(bangladeshPhoneRegex, 'Invalid Bangladesh phone number'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name is required')
      .max(100, 'Name must be less than 100 characters'),
    phone: z
      .string({ required_error: 'Phone number is required' })
      .regex(bangladeshPhoneRegex, 'Invalid Bangladesh phone number'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must be less than 100 characters'),
    confirmPassword: z.string({
      required_error: 'Please confirm your password',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  phone: z
    .string({ required_error: 'Phone number is required' })
    .regex(bangladeshPhoneRegex, 'Invalid Bangladesh phone number'),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must be less than 100 characters'),
    confirmPassword: z.string({
      required_error: 'Please confirm your password',
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
