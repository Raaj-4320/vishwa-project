import { StatusCodes } from 'http-status-codes';

export const searchMedicines = (req, res) => {
  const { q = '', category, generic, brand } = req.query;
  res.status(StatusCodes.OK).json({
    success: true,
    data: [{ id: 'med_1', name: 'Paracetamol 650', category, generic, brand, match: q }]
  });
};
