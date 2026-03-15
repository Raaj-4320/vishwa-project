import { StatusCodes } from 'http-status-codes';
import { db } from '../config/firebase.js';

const sellerRoleAllowed = (role) => ['seller', 'pharmacist'].includes(role);
const normalize = (input) => String(input || '').trim().toLowerCase();

const deriveStock = ({ totalPurchase, totalSold }) => Math.max(0, Number(totalPurchase || 0) - Number(totalSold || 0));

const sanitizeMedicinePayload = (body) => ({
  name: body.name?.trim(),
  category: body.category?.trim(),
  dosageForm: body.dosageForm?.trim(),
  strength: body.strength?.trim(),
  brand: body.brand?.trim(),
  generic: body.generic?.trim(),
  barcode: body.barcode?.trim(),
  manufacturer: body.manufacturer?.trim(),
  rxRequired: Boolean(body.rxRequired),
  totalPurchase: Number(body.totalPurchase || 0),
  totalSold: Number(body.totalSold || 0),
  currentStock: deriveStock(body),
  price: Number(body.price || 0),
  status: body.status || 'active'
});

const ensureSellerAccess = (req, res) => {
  if (!db) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ success: false, message: 'Firebase is not configured' });
    return false;
  }
  if (!sellerRoleAllowed(req.user.role)) {
    res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Forbidden' });
    return false;
  }
  return true;
};

const getOwnedMedicine = async (sellerId, medicineId) => {
  const ref = db.collection('sellerMedicines').doc(medicineId);
  const snap = await ref.get();
  if (!snap.exists) return { error: 'Medicine not found', status: StatusCodes.NOT_FOUND };
  const data = snap.data();
  if (data.sellerId !== sellerId) return { error: 'Forbidden', status: StatusCodes.FORBIDDEN };
  return { ref, snap, data };
};

const patchMedicineTotals = async (medicineRef, medicine, qtyDelta = 0, soldDelta = 0) => {
  const totalPurchase = Number(medicine.totalPurchase || 0) + Number(qtyDelta || 0);
  const totalSold = Number(medicine.totalSold || 0) + Number(soldDelta || 0);

  if (totalPurchase < 0 || totalSold < 0 || totalSold > totalPurchase) {
    return { error: 'Stock totals conflict: totalSold cannot exceed totalPurchase', status: StatusCodes.BAD_REQUEST };
  }

  const update = {
    totalPurchase,
    totalSold,
    currentStock: Math.max(0, totalPurchase - totalSold),
    updatedAt: new Date().toISOString()
  };
  await medicineRef.set(update, { merge: true });
  return { data: update };
};

export const listSellerMedicines = async (req, res) => {
  if (!ensureSellerAccess(req, res)) return;

  const search = normalize(req.query.search);
  const snap = await db.collection('sellerMedicines').where('sellerId', '==', req.user.uid).orderBy('updatedAt', 'desc').get();
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const filtered = search ? rows.filter((r) => normalize(r.name).includes(search) || normalize(r.barcode).includes(search)) : rows;

  return res.status(StatusCodes.OK).json({ success: true, data: filtered });
};

export const createSellerMedicine = async (req, res) => {
  if (!ensureSellerAccess(req, res)) return;

  const duplicateSnap = await db.collection('sellerMedicines')
    .where('sellerId', '==', req.user.uid)
    .where('barcode', '==', req.body.barcode.trim())
    .limit(1)
    .get();

  if (!duplicateSnap.empty) {
    return res.status(StatusCodes.CONFLICT).json({ success: false, message: 'Duplicate barcode for this seller' });
  }

  const payload = sanitizeMedicinePayload(req.body);
  const now = new Date().toISOString();
  const doc = { ...payload, sellerId: req.user.uid, createdAt: now, updatedAt: now };

  const ref = await db.collection('sellerMedicines').add(doc);
  return res.status(StatusCodes.CREATED).json({ success: true, data: { id: ref.id, ...doc } });
};

export const getSellerMedicineById = async (req, res) => {
  if (!ensureSellerAccess(req, res)) return;

  const out = await getOwnedMedicine(req.user.uid, req.params.id);
  if (out.error) return res.status(out.status).json({ success: false, message: out.error });

  return res.status(StatusCodes.OK).json({ success: true, data: { id: out.snap.id, ...out.data } });
};

export const updateSellerMedicine = async (req, res) => {
  if (!ensureSellerAccess(req, res)) return;

  const out = await getOwnedMedicine(req.user.uid, req.params.id);
  if (out.error) return res.status(out.status).json({ success: false, message: out.error });

  const current = out.data;
  if (req.body.barcode && req.body.barcode.trim() !== current.barcode) {
    const dupe = await db.collection('sellerMedicines')
      .where('sellerId', '==', req.user.uid)
      .where('barcode', '==', req.body.barcode.trim())
      .limit(1)
      .get();
    if (!dupe.empty) return res.status(StatusCodes.CONFLICT).json({ success: false, message: 'Duplicate barcode for this seller' });
  }

  const merged = { ...current, ...req.body };
  if (Number(merged.totalSold || 0) > Number(merged.totalPurchase || 0)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'totalSold cannot exceed totalPurchase' });
  }

  const payload = sanitizeMedicinePayload(merged);
  const updateDoc = { ...payload, updatedAt: new Date().toISOString(), sellerId: current.sellerId, createdAt: current.createdAt };

  await out.ref.set(updateDoc, { merge: true });
  return res.status(StatusCodes.OK).json({ success: true, data: { id: out.snap.id, ...updateDoc } });
};

export const listInventoryBatches = async (req, res) => {
  if (!ensureSellerAccess(req, res)) return;

  const snap = await db.collection('inventoryBatches').where('sellerId', '==', req.user.uid).orderBy('expiryDate', 'asc').get();
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return res.status(StatusCodes.OK).json({ success: true, data: rows });
};

export const createInventoryBatch = async (req, res) => {
  if (!ensureSellerAccess(req, res)) return;

  const med = await getOwnedMedicine(req.user.uid, req.body.sellerMedicineId);
  if (med.error) return res.status(med.status).json({ success: false, message: med.error });

  const dupe = await db.collection('inventoryBatches')
    .where('sellerId', '==', req.user.uid)
    .where('sellerMedicineId', '==', req.body.sellerMedicineId)
    .where('batchNo', '==', req.body.batchNo.trim())
    .limit(1)
    .get();
  if (!dupe.empty) return res.status(StatusCodes.CONFLICT).json({ success: false, message: 'Duplicate batch number for this medicine' });

  const qty = Number(req.body.qty || 0);
  const now = new Date().toISOString();
  const doc = {
    sellerId: req.user.uid,
    sellerMedicineId: req.body.sellerMedicineId,
    medicineName: med.data.name,
    batchNo: req.body.batchNo.trim(),
    expiryDate: req.body.expiryDate,
    qty,
    reservedQty: Number(req.body.reservedQty || 0),
    purchasePrice: Number(req.body.purchasePrice || 0),
    sellingPrice: Number(req.body.sellingPrice || 0),
    supplier: req.body.supplier.trim(),
    status: req.body.status || 'active',
    createdAt: now,
    updatedAt: now
  };

  const stockPatch = await patchMedicineTotals(med.ref, med.data, qty, 0);
  if (stockPatch.error) return res.status(stockPatch.status).json({ success: false, message: stockPatch.error });

  const ref = await db.collection('inventoryBatches').add(doc);
  return res.status(StatusCodes.CREATED).json({ success: true, data: { id: ref.id, ...doc } });
};

export const updateInventoryBatch = async (req, res) => {
  if (!ensureSellerAccess(req, res)) return;

  const ref = db.collection('inventoryBatches').doc(req.params.id);
  const snap = await ref.get();
  if (!snap.exists) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Batch not found' });

  const current = snap.data();
  if (current.sellerId !== req.user.uid) return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Forbidden' });

  const med = await getOwnedMedicine(req.user.uid, current.sellerMedicineId);
  if (med.error) return res.status(med.status).json({ success: false, message: med.error });

  const nextQty = req.body.qty === undefined ? Number(current.qty || 0) : Number(req.body.qty || 0);
  const qtyDelta = nextQty - Number(current.qty || 0);

  const stockPatch = await patchMedicineTotals(med.ref, med.data, qtyDelta, 0);
  if (stockPatch.error) return res.status(stockPatch.status).json({ success: false, message: stockPatch.error });

  const nextDoc = {
    ...current,
    ...req.body,
    qty: nextQty,
    updatedAt: new Date().toISOString()
  };

  if (Number(nextDoc.reservedQty || 0) > Number(nextDoc.qty || 0)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'reservedQty cannot exceed qty' });
  }

  await ref.set(nextDoc, { merge: true });
  return res.status(StatusCodes.OK).json({ success: true, data: { id: snap.id, ...nextDoc } });
};

export const listPurchases = async (req, res) => {
  if (!ensureSellerAccess(req, res)) return;

  const snap = await db.collection('purchases').where('sellerId', '==', req.user.uid).orderBy('purchaseDate', 'desc').get();
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return res.status(StatusCodes.OK).json({ success: true, data: rows });
};

export const createPurchase = async (req, res) => {
  if (!ensureSellerAccess(req, res)) return;

  const med = await getOwnedMedicine(req.user.uid, req.body.sellerMedicineId);
  if (med.error) return res.status(med.status).json({ success: false, message: med.error });

  const qty = Number(req.body.qty || 0);
  const stockPatch = await patchMedicineTotals(med.ref, med.data, qty, 0);
  if (stockPatch.error) return res.status(stockPatch.status).json({ success: false, message: stockPatch.error });

  const now = new Date().toISOString();
  const doc = {
    sellerId: req.user.uid,
    sellerMedicineId: req.body.sellerMedicineId,
    medicineName: med.data.name,
    qty,
    unitCost: Number(req.body.unitCost || 0),
    totalCost: qty * Number(req.body.unitCost || 0),
    invoiceNo: req.body.invoiceNo.trim(),
    supplier: req.body.supplier.trim(),
    purchaseDate: req.body.purchaseDate,
    createdAt: now,
    updatedAt: now
  };

  const ref = await db.collection('purchases').add(doc);
  return res.status(StatusCodes.CREATED).json({ success: true, data: { id: ref.id, ...doc } });
};

export const getLowStockItems = async (req, res) => {
  if (!ensureSellerAccess(req, res)) return;

  const threshold = Math.max(0, Number(req.query.threshold || 10));
  const snap = await db.collection('sellerMedicines').where('sellerId', '==', req.user.uid).get();
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((r) => Number(r.currentStock || 0) <= threshold);
  return res.status(StatusCodes.OK).json({ success: true, data: rows, meta: { threshold } });
};

export const getExpiryAlerts = async (req, res) => {
  if (!ensureSellerAccess(req, res)) return;

  const days = Math.max(1, Number(req.query.days || 60));
  const limitDate = new Date();
  limitDate.setDate(limitDate.getDate() + days);

  const snap = await db.collection('inventoryBatches').where('sellerId', '==', req.user.uid).orderBy('expiryDate', 'asc').get();
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const filtered = rows.filter((row) => new Date(row.expiryDate) <= limitDate);
  return res.status(StatusCodes.OK).json({ success: true, data: filtered, meta: { days } });
};

export const importTransactions = async (req, res) => {
  if (!ensureSellerAccess(req, res)) return;

  let applied = 0;
  for (const entry of req.body.entries) {
    const med = await getOwnedMedicine(req.user.uid, entry.sellerMedicineId);
    if (med.error) {
      return res.status(med.status).json({ success: false, message: `Entry failed: ${med.error}` });
    }

    const quantity = Number(entry.quantity || 0);
    const deltaPurchase = entry.type === 'purchase' ? quantity : 0;
    const deltaSold = entry.type === 'sale' ? quantity : 0;

    const patch = await patchMedicineTotals(med.ref, med.data, deltaPurchase, deltaSold);
    if (patch.error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: `Entry failed for ${med.data.name}: ${patch.error}` });
    }

    await db.collection('inventoryTransactions').add({
      sellerId: req.user.uid,
      sellerMedicineId: entry.sellerMedicineId,
      medicineName: med.data.name,
      type: entry.type,
      quantity,
      reference: (entry.reference || '').trim(),
      happenedAt: entry.happenedAt,
      createdAt: new Date().toISOString()
    });

    applied += 1;
  }

  return res.status(StatusCodes.OK).json({ success: true, message: 'Transactions imported', data: { applied } });
};
