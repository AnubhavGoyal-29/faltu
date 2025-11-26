/**
 * Validation Utilities
 * 
 * Common validation functions for request data.
 * 
 * @version 1.0
 */

const { ValidationError } = require('./errorHandler');

/**
 * Validate required fields
 */
function validateRequired(data, fields) {
  const missing = [];
  
  fields.forEach(field => {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missing.push(field);
    }
  });
  
  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missing.join(', ')}`,
      { missingFields: missing }
    );
  }
  
  return true;
}

/**
 * Validate email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
  
  return true;
}

/**
 * Validate string length
 */
function validateLength(value, min, max, fieldName = 'Field') {
  if (value.length < min) {
    throw new ValidationError(`${fieldName} must be at least ${min} characters long`);
  }
  
  if (max && value.length > max) {
    throw new ValidationError(`${fieldName} must be at most ${max} characters long`);
  }
  
  return true;
}

/**
 * Validate number range
 */
function validateRange(value, min, max, fieldName = 'Value') {
  if (value < min || value > max) {
    throw new ValidationError(`${fieldName} must be between ${min} and ${max}`);
  }
  
  return true;
}

/**
 * Validate enum value
 */
function validateEnum(value, allowedValues, fieldName = 'Value') {
  if (!allowedValues.includes(value)) {
    throw new ValidationError(
      `${fieldName} must be one of: ${allowedValues.join(', ')}`
    );
  }
  
  return true;
}

/**
 * Sanitize string (remove dangerous characters)
 */
function sanitizeString(str) {
  return str
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Validate and sanitize user input
 */
function validateAndSanitize(data, schema) {
  const sanitized = {};
  const errors = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    // Check required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push({ field, message: `${field} is required` });
      continue;
    }
    
    // Skip validation if not required and empty
    if (!rules.required && (value === undefined || value === null || value === '')) {
      continue;
    }
    
    // Type validation
    if (rules.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== rules.type) {
        errors.push({ field, message: `${field} must be ${rules.type}` });
        continue;
      }
    }
    
    // String validations
    if (typeof value === 'string') {
      // Sanitize
      sanitized[field] = rules.sanitize !== false ? sanitizeString(value) : value;
      
      // Length
      if (rules.minLength && sanitized[field].length < rules.minLength) {
        errors.push({ field, message: `${field} must be at least ${rules.minLength} characters` });
      }
      if (rules.maxLength && sanitized[field].length > rules.maxLength) {
        errors.push({ field, message: `${field} must be at most ${rules.maxLength} characters` });
      }
      
      // Email
      if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized[field])) {
        errors.push({ field, message: `${field} must be a valid email` });
      }
      
      // Pattern
      if (rules.pattern && !rules.pattern.test(sanitized[field])) {
        errors.push({ field, message: rules.patternMessage || `${field} format is invalid` });
      }
    }
    
    // Number validations
    if (typeof value === 'number') {
      sanitized[field] = value;
      
      if (rules.min !== undefined && value < rules.min) {
        errors.push({ field, message: `${field} must be at least ${rules.min}` });
      }
      if (rules.max !== undefined && value > rules.max) {
        errors.push({ field, message: `${field} must be at most ${rules.max}` });
      }
    }
    
    // Enum validation
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push({ field, message: `${field} must be one of: ${rules.enum.join(', ')}` });
    }
    
    // Custom validator
    if (rules.validator) {
      try {
        const customResult = rules.validator(value);
        if (customResult !== true) {
          errors.push({ field, message: customResult || `${field} validation failed` });
        } else {
          sanitized[field] = value;
        }
      } catch (error) {
        errors.push({ field, message: error.message });
      }
    }
    
    // If no errors so far, add to sanitized
    if (errors.length === 0 && sanitized[field] === undefined) {
      sanitized[field] = value;
    }
  }
  
  if (errors.length > 0) {
    throw new ValidationError('Validation failed', { errors });
  }
  
  return sanitized;
}

module.exports = {
  validateRequired,
  validateEmail,
  validateLength,
  validateRange,
  validateEnum,
  sanitizeString,
  validateAndSanitize
};

