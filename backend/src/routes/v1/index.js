import { Router } from 'express';
import { requireAuth, requireAnyRole } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { locationSchema } from '../../validators/location.validator.js';
import { createOrderSchema } from '../../validators/order.validator.js';
import { getLocationMaster, matchStores } from '../../controllers/locations.controller.js';
import { discoverPharmacies, getPharmacyDetail } from '../../controllers/pharmacies.controller.js';
import { searchMedicines } from '../../controllers/medicines.controller.js';
import { createOrder, listOrders } from '../../controllers/orders.controller.js';
import { adminDashboard } from '../../controllers/admin.controller.js';
import { ROLES } from '../../constants/roles.js';

export const apiRouter = Router();

apiRouter.get('/locations/master', getLocationMaster);
apiRouter.post('/locations/match-stores', validate(locationSchema), matchStores);
apiRouter.get('/pharmacies/discover', discoverPharmacies);
apiRouter.get('/pharmacies/:id', getPharmacyDetail);
apiRouter.get('/medicines/search', searchMedicines);

apiRouter.get('/orders', requireAuth, listOrders);
apiRouter.post('/orders', requireAuth, validate(createOrderSchema), createOrder);


apiRouter.get('/seller/medicines', requireAuth, listSellerMedicines);
apiRouter.post('/seller/medicines', requireAuth, validate(createSellerMedicineSchema), createSellerMedicine);
apiRouter.get('/seller/medicines/:id', requireAuth, getSellerMedicineById);
apiRouter.patch('/seller/medicines/:id', requireAuth, validate(updateSellerMedicineSchema), updateSellerMedicine);
apiRouter.get('/seller/inventory/batches', requireAuth, listInventoryBatches);
apiRouter.post('/seller/inventory/batches', requireAuth, validate(createBatchSchema), createInventoryBatch);
apiRouter.patch('/seller/inventory/batches/:id', requireAuth, validate(updateBatchSchema), updateInventoryBatch);
apiRouter.get('/seller/purchases', requireAuth, listPurchases);
apiRouter.post('/seller/purchases', requireAuth, validate(createPurchaseSchema), createPurchase);
apiRouter.get('/seller/alerts/low-stock', requireAuth, getLowStockItems);
apiRouter.get('/seller/alerts/expiry', requireAuth, getExpiryAlerts);
apiRouter.post('/seller/transactions/import', requireAuth, validate(importTransactionsSchema), importTransactions);

apiRouter.get('/admin/dashboard', requireAuth, requireAnyRole(ROLES.ADMIN, ROLES.SUPER_ADMIN), adminDashboard);
