import { StatusCodes } from 'http-status-codes';

export const discoverPharmacies = (req, res) => {
  const { city, area, locality, pincode, delivery = 'true' } = req.query;
  res.status(StatusCodes.OK).json({
    success: true,
    data: [
      {
        id: 'pharmacy_demo_1',
        name: 'CarePlus Pharmacy',
        serviceabilityMatchedBy: pincode || locality || area || city,
        supportsDelivery: delivery === 'true',
        supportsPickup: true
      }
    ]
  });
};

export const getPharmacyDetail = (req, res) => {
  res.status(StatusCodes.OK).json({ success: true, data: { id: req.params.id, name: 'CarePlus Pharmacy' } });
};
