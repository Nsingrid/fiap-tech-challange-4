import { z } from 'zod';

/**
 * Schemas de validação para User
 */
export const CreateUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const UpdateUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores')
    .optional(),
  email: z.string().email('Invalid email format').optional(),
});

/**
 * Schemas de validação para Transaction
 */
export const CreateTransactionSchema = z.object({
  type: z.enum(['Credit', 'Debit'], {
    errorMap: () => ({ message: 'Type must be either Credit or Debit' }),
  }),
  value: z
    .number()
    .positive('Value must be positive')
    .max(1000000000, 'Value too large'),
  category: z.string().min(1, 'Category is required'),
  investmentCategory: z.string().optional().nullable(),
});

export const GetTransactionsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  type: z.enum(['Credit', 'Debit']).optional(),
  category: z.string().optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().min(0).optional(),
});

/**
 * Schemas de validação para Investment
 */
export const CreateInvestmentSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  category: z.string().min(1, 'Category is required'),
  value: z
    .number()
    .positive('Value must be positive')
    .max(1000000000, 'Value too large'),
});

/**
 * Schemas de validação para Account
 */
export const UpdateAccountSchema = z.object({
  accountType: z.enum(['CHECKING', 'SAVINGS', 'INVESTMENT']).optional(),
});

// Tipos TypeScript inferidos dos schemas
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type GetTransactionsQuery = z.infer<typeof GetTransactionsQuerySchema>;
export type CreateInvestmentInput = z.infer<typeof CreateInvestmentSchema>;
export type UpdateAccountInput = z.infer<typeof UpdateAccountSchema>;
