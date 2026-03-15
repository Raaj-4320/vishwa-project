export const isStoreServiceable = (customerLocation, serviceArea, forDelivery = true) => {
  const cityMatch = serviceArea.city?.toLowerCase() === customerLocation.city?.toLowerCase();
  const areaMatch = serviceArea.areas?.includes(customerLocation.area);
  const localityMatch = serviceArea.localities?.includes(customerLocation.locality);
  const pincodeMatch = serviceArea.pincodes?.includes(customerLocation.pincode);
  if (!cityMatch) return false;
  if (forDelivery) return areaMatch || localityMatch || pincodeMatch;
  return areaMatch || localityMatch || pincodeMatch || cityMatch;
};
