import { StatusCodes } from 'http-status-codes';

export const getLocationMaster = (_, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      states: ['Maharashtra', 'Karnataka'],
      cities: ['Mumbai', 'Pune', 'Bengaluru']
    }
  });
};

export const matchStores = (req, res) => {
  const { city, area, locality, pincode } = req.body;
  const filters = { city, area, locality, pincode };
  res.status(StatusCodes.OK).json({ success: true, message: 'Use filters to query serviceable stores', data: filters });
};
