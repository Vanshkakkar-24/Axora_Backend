import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const details = result.array().map((error) => ({
    field: error.path,
    message: error.msg
  }));

  return res.status(422).json({
    success: false,
    message: 'Validation failed',
    errors: details
  });
};