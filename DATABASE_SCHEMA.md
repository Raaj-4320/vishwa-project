# DATABASE SCHEMA (FIRESTORE)

## Collections

### users
- `uid`, `role`, `name`, `email`, `phone`, `status`, `createdAt`.
- Owner: self, admin.
- Index: `role+status`.

### pharmacies
- `id`, `sellerId`, `name`, `licenseStatus`, `address`, `workingHours`, `holidayMode`, `deliveryEnabled`, `pickupEnabled`.
- Index: `sellerId`, `licenseStatus`.

### serviceAreas
- `pharmacyId`, `country`, `state`, `city`, `areas[]`, `localities[]`, `pincodes[]`, `landmarks[]`.
- Index: `city+pincodes`, `pharmacyId`.

### medicinesMaster
- normalized medicine definition (`name`, `generic`, `brand`, `dosageForm`, `strength`, `rxRequired`).
- Index: `name`, `generic`, `brand`.

### sellerMedicines
- seller listing (`pharmacyId`, `medicineMasterId`, pricing, stockSummary, availability flags).
- Index: `pharmacyId+isActive`, `medicineMasterId+pharmacyId`.

### inventoryBatches
- batch-level stock (`sellerMedicineId`, `batchNo`, `expiryDate`, `qty`, `reservedQty`, `purchasePrice`, `sellingPrice`).
- Index: `sellerMedicineId+expiryDate`, `expiryDate`.

### carts
- `customerId`, `items[]`, `selectedAddressId`, `serviceabilitySnapshot`.

### orders
- `customerId`, `pharmacyId`, `status`, `fulfillmentType`, `location`, `amounts`, `timeline[]`.
- Index: `customerId+createdAt`, `pharmacyId+status`, `status+createdAt`.

### orderItems
- `orderId`, `sellerMedicineId`, `qty`, `price`, `batchAllocations[]`, `rxRequired`.

### prescriptions
- `orderId`, `customerId`, `status`, `filePath`, `reviewedBy`, `rejectionReason`.

### deliveryAssignments
- `orderId`, `deliveryStaffId`, `status`, `otp`, `failureReason`.

### notifications / supportTickets / reviews / auditLogs / settings
- standard operational/governance collections with role-specific ownership.
