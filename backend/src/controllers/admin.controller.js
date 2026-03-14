import { StatusCodes } from 'http-status-codes';

export const adminDashboard = (_, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    data: { totalUsers: 0, totalPharmacies: 0, totalOrders: 0, verificationPending: 0 }
  });
};
