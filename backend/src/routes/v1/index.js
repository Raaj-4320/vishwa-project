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

apiRouter.get('/admin/dashboard', requireAuth, requireAnyRole(ROLES.ADMIN, ROLES.SUPER_ADMIN), adminDashboard);
