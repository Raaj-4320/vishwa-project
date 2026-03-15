import { isStoreServiceable } from './location.service.js';

export const validateOrderPlacement = ({ cart, pharmacy, serviceArea }) => {
  if (!isStoreServiceable(cart.location, serviceArea, cart.fulfillmentType === 'delivery')) {
    const err = new Error('Address not serviceable');
    err.status = 400;
    err.publicMessage = 'Selected address is not serviceable for this pharmacy';
    throw err;
  }

  const hasRxPending = cart.items.some((item) => item.prescriptionRequired && !item.prescriptionId);
  if (hasRxPending) {
    const err = new Error('Prescription required');
    err.status = 400;
    err.publicMessage = 'Prescription required items are pending verification';
    throw err;
  }

  if (pharmacy.holidayMode) {
    const err = new Error('Store unavailable');
    err.status = 400;
    err.publicMessage = 'Pharmacy is temporarily unavailable';
    throw err;
  }

  return true;
};
