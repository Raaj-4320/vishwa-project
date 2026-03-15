import { z } from 'zod';

export const bootstrapSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    phone: z.string().trim().regex(/^\+?[0-9]{10,15}$/).optional().or(z.literal(''))
  }).default({}),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
