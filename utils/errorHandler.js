module.exports = class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.success = `${statusCode}`.startsWith('4') ? 'failed' : 'error';
  }
};
