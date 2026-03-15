export const validate = (schema) => (req, _, next) => {
  const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
  if (!result.success) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.publicMessage = result.error.issues[0]?.message || 'Validation failed';
    throw err;
  }
  next();
};
