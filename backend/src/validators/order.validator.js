import { z } from 'zod';

const orderItem = z.object({
  sellerMedicineId: z.string().min(1),
  quantity: z.number().int().positive(),
  prescriptionRequired: z.boolean(),
  prescriptionId: z.string().optional()
});

export const createOrderSchema = z.object({
  body: z.object({
    pharmacyId: z.string().min(1),
    fulfillmentType: z.enum(['delivery', 'pickup']),
    location: z.object({
      state: z.string().min(2),
      city: z.string().min(2),
      area: z.string().min(2),
      locality: z.string().min(2),
      pincode: z.string().regex(/^\d{6}$/)
    }),
    items: z.array(orderItem).min(1)
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});
