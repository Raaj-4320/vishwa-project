import { StatusCodes } from 'http-status-codes';
import { db } from '../config/firebase.js';
import { ROLES } from '../constants/roles.js';

const DEFAULT_ADMIN_EMAIL = 'admin@123.com';

const roleFromEmail = (email = '') => (email.trim().toLowerCase() === DEFAULT_ADMIN_EMAIL ? ROLES.ADMIN : null);

export const getMe = async (req, res) => {
  if (!db) {
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ success: false, message: 'Firebase is not configured' });
  }

  const ref = db.collection('users').doc(req.user.uid);
  const snap = await ref.get();

  if (!snap.exists) {
    const email = req.user.email || '';
    const fallback = {
      uid: req.user.uid,
      email,
      name: req.user.name || 'User',
      phone: '',
      role: roleFromEmail(email) || req.user.role || ROLES.CUSTOMER,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await ref.set(fallback, { merge: true });
    return res.status(StatusCodes.OK).json({ success: true, data: fallback });
  }

  return res.status(StatusCodes.OK).json({ success: true, data: snap.data() });
};
