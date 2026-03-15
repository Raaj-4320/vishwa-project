import { z } from 'zod';

export const locationSchema = z.object({
  body: z.object({
    country: z.string().default('India').optional(),
    state: z.string().min(2),
    city: z.string().min(2),
    area: z.string().min(2),
    locality: z.string().min(2),
    pincode: z.string().regex(/^\d{6}$/),
    landmark: z.string().optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
