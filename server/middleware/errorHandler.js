function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    status: 404,
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.originalUrl} does not exist.`
  });
}

function globalErrorHandler(err, req, res, next) {
  console.error('[DATABASE/SERVER ERROR]:', err);
  res.status(err.status || 500).json({
    success: false,
    status: err.status || 500,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected database or server error occurred.'
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
