module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.success = err.success || 'error';

  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development' && req.originalUrl.startsWith('/api'))
    return res.status(err.statusCode).json({
      success: err.success,
      error: err,
      stack: err.stack
    });
};
