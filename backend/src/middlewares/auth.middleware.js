import { StatusCodes } from 'http-status-codes';
import { auth } from '../config/firebase.js';

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !auth) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
    }
    const decoded = await auth.verifyIdToken(token, true);
    req.user = { uid: decoded.uid, role: decoded.role || 'customer' };
    return next();
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Invalid token' });
  }
};

export const requireAnyRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Forbidden' });
  }
  return next();
};
