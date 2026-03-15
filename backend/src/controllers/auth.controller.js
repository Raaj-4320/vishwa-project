import { StatusCodes } from 'http-status-codes';
import { db } from '../config/firebase.js';
import { ROLES } from '../constants/roles.js';

const safeRole = (candidate) => {
  const allowed = Object.values(ROLES);
  return allowed.includes(candidate) ? candidate : ROLES.CUSTOMER;
};

export const bootstrapUser = async (req, res) => {
  if (!db) {
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ success: false, message: 'Firebase is not configured' });
  }

  const ref = db.collection('users').doc(req.user.uid);
  const snap = await ref.get();

  const existingRole = snap.exists ? safeRole(snap.data().role) : null;
  const tokenRole = safeRole(req.user.role);
  const finalRole = existingRole || tokenRole || ROLES.CUSTOMER;

  const payload = {
    uid: req.user.uid,
    email: req.user.email || snap.data()?.email || '',
    name: (req.body.name || '').trim() || req.user.name || snap.data()?.name || 'User',
    phone: (req.body.phone || '').trim() || snap.data()?.phone || '',
    role: finalRole,
    status: 'active',
    updatedAt: new Date().toISOString()
  };

  if (!snap.exists) payload.createdAt = new Date().toISOString();

  await ref.set(payload, { merge: true });
  return res.status(StatusCodes.OK).json({ success: true, data: payload });
};
