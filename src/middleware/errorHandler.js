export const errorHandler = ( error, _req, res, _next ) => {
  console.error(error);

  res.status(
    error.statusCode || 500
  ).json({
    success: false,
    message:
      error.message ||
      'Something went wrong'
  });
};