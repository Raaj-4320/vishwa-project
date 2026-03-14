import { StatusCodes } from 'http-status-codes';

export const notFoundHandler = (_, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Route not found' });
};

export const errorHandler = (err, _, res, __) => {
  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(status).json({ success: false, message: err.publicMessage || 'Unexpected server error' });
};
