/**
 * Error Handler Utility
 * 
 * Centralized error handling for consistent error responses.
 * 
 * @version 1.0
 */

const { createLogger } = require('./logger');
const logger = createLogger('ERROR_HANDLER');

class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR', data = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.data = data;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error types
class ValidationError extends AppError {
  constructor(message, data = null) {
    super(message, 400, 'VALIDATION_ERROR', data);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Authorization failed') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, 'CONFLICT');
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(err.message, err, {
    path: req.path,
    method: req.method,
    userId: req.user?.user_id
  });

  // Default error
  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  let message = 'Something went wrong';
  let data = null;

  // Handle operational errors
  if (err.isOperational) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    message = err.message;
    data = err.data;
  }
  // Handle Sequelize errors
  else if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = 'Validation error';
    data = err.errors.map(e => ({ field: e.path, message: e.message }));
  }
  else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    errorCode = 'CONFLICT';
    message = 'Resource already exists';
  }
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'INVALID_TOKEN';
    message = 'Invalid token';
  }
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'TOKEN_EXPIRED';
    message = 'Token expired';
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    errorCode,
    message,
    ...(data && { data }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Async handler wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  errorHandler,
  asyncHandler
};

