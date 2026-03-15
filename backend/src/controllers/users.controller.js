import { StatusCodes } from 'http-status-codes';
import { db } from '../config/firebase.js';
import { ROLES } from '../constants/roles.js';

export const getMe = async (req, res) => {
  if (!db) {
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ success: false, message: 'Firebase is not configured' });
  }

  const ref = db.collection('users').doc(req.user.uid);
  const snap = await ref.get();

  if (!snap.exists) {
    const fallback = {
      uid: req.user.uid,
      email: req.user.email || '',
      name: req.user.name || 'User',
      phone: '',
      role: req.user.role || ROLES.CUSTOMER,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await ref.set(fallback, { merge: true });
    return res.status(StatusCodes.OK).json({ success: true, data: fallback });
  }

  return res.status(StatusCodes.OK).json({ success: true, data: snap.data() });
};
