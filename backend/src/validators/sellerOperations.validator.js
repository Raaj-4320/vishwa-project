import { z } from 'zod';

const nonNegative = z.number().min(0, 'Value cannot be negative');

export const createBatchSchema = z.object({
  body: z.object({
    sellerMedicineId: z.string().min(1),
    batchNo: z.string().trim().min(2).max(40),
    expiryDate: z.string().datetime(),
    qty: nonNegative,
    reservedQty: nonNegative.default(0),
    purchasePrice: nonNegative,
    sellingPrice: nonNegative,
    supplier: z.string().trim().min(2).max(120),
    status: z.enum(['active', 'quarantined', 'expired']).default('active')
  }).superRefine((val, ctx) => {
    if (val.reservedQty > val.qty) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['reservedQty'], message: 'reservedQty cannot exceed qty' });
    }
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const updateBatchSchema = z.object({
  body: z.object({
    expiryDate: z.string().datetime().optional(),
    qty: nonNegative.optional(),
    reservedQty: nonNegative.optional(),
    purchasePrice: nonNegative.optional(),
    sellingPrice: nonNegative.optional(),
    supplier: z.string().trim().min(2).max(120).optional(),
    status: z.enum(['active', 'quarantined', 'expired']).optional()
  }),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional()
});

export const createPurchaseSchema = z.object({
  body: z.object({
    sellerMedicineId: z.string().min(1),
    qty: nonNegative,
    unitCost: nonNegative,
    invoiceNo: z.string().trim().min(2).max(60),
    supplier: z.string().trim().min(2).max(120),
    purchaseDate: z.string().datetime()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const importTransactionsSchema = z.object({
  body: z.object({
    entries: z.array(z.object({
      sellerMedicineId: z.string().min(1),
      type: z.enum(['purchase', 'sale']),
      quantity: nonNegative,
      reference: z.string().trim().min(2).max(120).optional().default(''),
      happenedAt: z.string().datetime()
    })).min(1)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
