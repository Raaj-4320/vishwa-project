import { StatusCodes } from 'http-status-codes';
import { validateOrderPlacement } from '../services/order.service.js';

export const listOrders = (_, res) => {
  res.status(StatusCodes.OK).json({ success: true, data: [] });
};

export const createOrder = (req, res) => {
  const samplePharmacy = { holidayMode: false };
  const sampleServiceArea = { city: req.body.location.city, areas: [req.body.location.area], localities: [req.body.location.locality], pincodes: [req.body.location.pincode] };
  validateOrderPlacement({ cart: req.body, pharmacy: samplePharmacy, serviceArea: sampleServiceArea });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Order placed successfully',
    data: { id: `ord_${Date.now()}`, status: 'placed', timeline: [{ status: 'placed', at: new Date().toISOString() }] }
  });
};
