import { z } from 'zod';

const nonNegative = z.number().min(0, 'Value cannot be negative');

const medicineBody = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(80),
  dosageForm: z.string().trim().min(2).max(80),
  strength: z.string().trim().min(1).max(40),
  brand: z.string().trim().min(1).max(80),
  generic: z.string().trim().min(1).max(80),
  barcode: z.string().trim().min(4).max(40),
  manufacturer: z.string().trim().min(2).max(120),
  rxRequired: z.boolean(),
  totalPurchase: nonNegative,
  totalSold: nonNegative,
  price: nonNegative,
  status: z.enum(['active', 'inactive'])
}).superRefine((val, ctx) => {
  if (val.totalSold > val.totalPurchase) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['totalSold'], message: 'totalSold cannot exceed totalPurchase' });
  }
});

export const createSellerMedicineSchema = z.object({
  body: medicineBody,
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const updateSellerMedicineSchema = z.object({
  body: medicineBody.partial().superRefine((val, ctx) => {
    if (val.totalPurchase !== undefined && val.totalPurchase < 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['totalPurchase'], message: 'totalPurchase cannot be negative' });
    }
    if (val.totalSold !== undefined && val.totalSold < 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['totalSold'], message: 'totalSold cannot be negative' });
    }
  }),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional()
});
