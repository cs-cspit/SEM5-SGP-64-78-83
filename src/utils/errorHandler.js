// Error handling utility for form validation and API errors
export class FormValidator {
  constructor() {
    this.errors = {};
  }

  // Clear all errors
  clearErrors() {
    this.errors = {};
    return this;
  }

  // Add a field error
  addError(field, message) {
    if (!this.errors[field]) {
      this.errors[field] = [];
    }
    this.errors[field].push(message);
    return this;
  }

  // Check if form has any errors
  hasErrors() {
    return Object.keys(this.errors).length > 0;
  }

  // Get all errors as a flat array
  getAllErrors() {
    const allErrors = [];
    Object.values(this.errors).forEach(fieldErrors => {
      allErrors.push(...fieldErrors);
    });
    return allErrors;
  }

  // Get first error message
  getFirstError() {
    const allErrors = this.getAllErrors();
    return allErrors.length > 0 ? allErrors[0] : null;
  }

  // Get errors for a specific field
  getFieldErrors(field) {
    return this.errors[field] || [];
  }

  // Validate email format
  validateEmail(email, fieldName = 'email') {
    if (!email) {
      this.addError(fieldName, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
      return this;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      this.addError(fieldName, 'Please enter a valid email address (e.g., user@example.com)');
    }
    return this;
  }

  // Validate password strength
  validatePassword(password, fieldName = 'password') {
    if (!password) {
      this.addError(fieldName, 'Password is required');
      return this;
    }

    if (password.length < 6) {
      this.addError(fieldName, 'Password must be at least 6 characters long');
    }

    if (password.length > 128) {
      this.addError(fieldName, 'Password cannot exceed 128 characters');
    }

    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
      this.addError(fieldName, 'Password must contain at least one letter');
    }

    // Check for common weak passwords
    const weakPasswords = ['password', '123456', 'password123', 'admin', 'qwerty'];
    if (weakPasswords.includes(password.toLowerCase())) {
      this.addError(fieldName, 'Password is too weak. Please choose a stronger password');
    }

    return this;
  }

  // Validate password confirmation
  validatePasswordConfirmation(password, confirmPassword) {
    if (!confirmPassword) {
      this.addError('confirmPassword', 'Please confirm your password');
      return this;
    }

    if (password !== confirmPassword) {
      this.addError('confirmPassword', 'Passwords do not match. Please ensure both password fields are identical');
    }

    return this;
  }

  // Validate required field
  validateRequired(value, fieldName, customMessage = null) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      const message = customMessage || `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      this.addError(fieldName, message);
    }
    return this;
  }

  // Validate phone number
  validatePhone(phone, fieldName = 'phone') {
    if (!phone) {
      this.addError(fieldName, 'Phone number is required');
      return this;
    }

    // Remove spaces, dashes, and parentheses for validation
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Check for valid Indian mobile number
    const indianMobileRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
    if (!indianMobileRegex.test(cleanPhone)) {
      this.addError(fieldName, 'Please enter a valid Indian mobile number (e.g., +91 9876543210)');
    }

    return this;
  }

  // Validate GST number
  validateGST(gstNumber, fieldName = 'gstNumber') {
    if (!gstNumber) {
      this.addError(fieldName, 'GST number is required');
      return this;
    }

    const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
    if (!gstRegex.test(gstNumber.toUpperCase())) {
      this.addError(fieldName, 'Please enter a valid GST number (format: 29ABCDE1234F1Z5)');
    }

    return this;
  }

  // Validate PAN number
  validatePAN(panNumber, fieldName = 'panNumber', required = false) {
    if (!panNumber && required) {
      this.addError(fieldName, 'PAN number is required');
      return this;
    }

    if (panNumber) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(panNumber.toUpperCase())) {
        this.addError(fieldName, 'Please enter a valid PAN number (format: ABCDE1234F)');
      }
    }

    return this;
  }

  // Validate string length
  validateLength(value, fieldName, minLength = 0, maxLength = null) {
    if (value) {
      if (value.length < minLength) {
        this.addError(fieldName, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${minLength} characters long`);
      }
      
      if (maxLength && value.length > maxLength) {
        this.addError(fieldName, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${maxLength} characters`);
      }
    }

    return this;
  }

  // Validate name format
  validateName(name, fieldName = 'name') {
    if (!name) {
      this.addError(fieldName, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
      return this;
    }

    if (name.length < 2) {
      this.addError(fieldName, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least 2 characters long`);
    }

    if (name.length > 50) {
      this.addError(fieldName, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed 50 characters`);
    }

    // Check for valid name characters (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
    if (!nameRegex.test(name)) {
      this.addError(fieldName, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} can only contain letters, spaces, hyphens, and apostrophes`);
    }

    return this;
  }
}

// API Error handler utility
export class APIErrorHandler {
  static parseError(error) {
    // If it's already a string, return it
    if (typeof error === 'string') {
      return error;
    }

    // Handle axios error structure
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return data.message || 'Invalid request. Please check your input and try again.';
        case 401:
          return 'Your session has expired. Please login again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return data.message || 'This data already exists. Please check for duplicates.';
        case 422:
          return data.message || 'Validation failed. Please check your input.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
          return 'Internal server error. Please try again later.';
        case 502:
          return 'Service temporarily unavailable. Please try again later.';
        case 503:
          return 'Service maintenance in progress. Please try again later.';
        default:
          return data.message || `Server error (${status}). Please try again later.`;
      }
    }

    // Handle network errors
    if (error.request) {
      return 'Network error. Please check your internet connection and try again.';
    }

    // Handle other errors
    if (error.message) {
      return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
  }

  static getFieldSpecificError(error, field) {
    if (error.response?.data?.errors) {
      const fieldErrors = error.response.data.errors[field];
      if (fieldErrors && Array.isArray(fieldErrors)) {
        return fieldErrors.join(', ');
      }
    }
    return null;
  }
}

// Password strength checker
export class PasswordStrengthChecker {
  static checkStrength(password) {
    let score = 0;
    const feedback = [];

    if (!password) {
      return { score: 0, strength: 'No password', feedback: ['Please enter a password'] };
    }

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Use at least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Add uppercase letters');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Add lowercase letters');
    }

    // Number check
    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Add numbers');
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Add special characters (!@#$%^&*)');
    }

    // Determine strength
    let strength;
    if (score < 2) {
      strength = 'Very Weak';
    } else if (score < 3) {
      strength = 'Weak';
    } else if (score < 4) {
      strength = 'Good';
    } else if (score < 5) {
      strength = 'Strong';
    } else {
      strength = 'Very Strong';
    }

    return { score, strength, feedback };
  }
}

// Export all utilities
export default {
  FormValidator,
  APIErrorHandler,
  PasswordStrengthChecker
};