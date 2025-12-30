/**
 * ============================================================================
 * SECURITY: Input Sanitization Utilities
 * ============================================================================
 * 
 * PURPOSE:
 * - Prevent XSS attacks
 * - Sanitize user inputs before database storage
 * - Validate data integrity
 * - Remove potentially dangerous characters
 * 
 * SECURITY BENEFITS:
 * - XSS protection
 * - SQL injection prevention
 * - Data integrity
 * - Consistent input handling
 * 
 * REUSABILITY: ✅ YES
 * - Used throughout entire application
 * - Single source of truth for input validation
 * 
 * @module inputSanitization
 */

/**
 * Sanitize text input by removing potentially dangerous characters
 * 
 * @param {string} input - Raw user input
 * @returns {string} Sanitized input
 * 
 * @example
 * const safe = sanitizeInput(userInput);
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/on\w+=/gi, '')
    // Remove SQL injection attempts
    .replace(/['";]/g, '')
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Trim whitespace
    .trim();
};

/**
 * Sanitize email input
 * 
 * @param {string} email - Email address
 * @returns {string} Sanitized email
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  
  return email
    .toLowerCase()
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/['";]/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '');
};

/**
 * Sanitize phone number input
 * 
 * @param {string} phone - Phone number
 * @returns {string} Sanitized phone number
 */
export const sanitizePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  
  // Keep only digits, spaces, dashes, and plus signs
  return phone
    .replace(/[^\d\s\-\+]/g, '')
    .trim();
};

/**
 * Sanitize numeric input
 * 
 * @param {string|number} input - Numeric input
 * @returns {string} Sanitized number as string
 */
export const sanitizeNumber = (input) => {
  if (input === null || input === undefined) return '';
  
  // Convert to string and keep only digits and decimal point
  return String(input)
    .replace(/[^\d.]/g, '')
    .trim();
};

/**
 * Sanitize URL input
 * 
 * @param {string} url - URL input
 * @returns {string} Sanitized URL
 */
export const sanitizeURL = (url) => {
  if (!url || typeof url !== 'string') return '';
  
  return url
    .trim()
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol (potential XSS)
    .replace(/data:/gi, '')
    // Remove vbscript: protocol
    .replace(/vbscript:/gi, '')
    // Remove on* event handlers
    .replace(/on\w+=/gi, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '');
};

/**
 * Sanitize file name input
 * 
 * @param {string} filename - File name
 * @returns {string} Sanitized file name
 */
export const sanitizeFileName = (filename) => {
  if (!filename || typeof filename !== 'string') return '';
  
  return filename
    // Remove path traversal attempts
    .replace(/\.\./g, '')
    // Remove slashes
    .replace(/[/\\]/g, '')
    // Remove special characters
    .replace(/[<>:"|?*]/g, '')
    // Remove null bytes
    .replace(/\0/g, '')
    .trim();
};

/**
 * Sanitize search query input
 * 
 * @param {string} query - Search query
 * @returns {string} Sanitized search query
 */
export const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return '';
  
  return query
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove SQL injection patterns
    .replace(/(\%27)|(\')|(\-\-)|(\%23)|(\#)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Validate and sanitize object of form data
 * 
 * @param {Object} formData - Form data object
 * @returns {Object} Sanitized form data
 */
export const sanitizeFormData = (formData) => {
  if (!formData || typeof formData !== 'object') return {};
  
  const sanitized = {};
  
  for (const key in formData) {
    if (formData.hasOwnProperty(key)) {
      const value = formData[key];
      
      // Skip non-string values
      if (typeof value !== 'string') {
        sanitized[key] = value;
        continue;
      }
      
      // Apply appropriate sanitization based on field type
      if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('phone') || key.toLowerCase().includes('mobile')) {
        sanitized[key] = sanitizePhone(value);
      } else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('link')) {
        sanitized[key] = sanitizeURL(value);
      } else if (key.toLowerCase().includes('filename') || key.toLowerCase().includes('file')) {
        sanitized[key] = sanitizeFileName(value);
      } else if (key.toLowerCase().includes('search') || key.toLowerCase().includes('query')) {
        sanitized[key] = sanitizeSearchQuery(value);
      } else if (!isNaN(value) && !key.toLowerCase().includes('id')) {
        sanitized[key] = sanitizeNumber(value);
      } else {
        sanitized[key] = sanitizeInput(value);
      }
    }
  }
  
  return sanitized;
};

/**
 * Detect and prevent XSS attempts
 * 
 * @param {string} input - User input
 * @returns {boolean} True if XSS pattern detected
 */
export const detectXSS = (input) => {
  if (!input || typeof input !== 'string') return false;
  
  const xssPatterns = [
    /<script/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /data:/gi,
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
};

/**
 * Detect and prevent SQL injection attempts
 * 
 * @param {string} input - User input
 * @returns {boolean} True if SQL injection pattern detected
 */
export const detectSQLInjection = (input) => {
  if (!input || typeof input !== 'string') return false;
  
  const sqlPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(\#)/gi,
    /(\%27)|(\')/gi,
    /((\%3D)|(=))[^\n]*((\%27)|(\'))/gi,
    /\/\*[\s\S]*\*\//gi,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

export default {
  sanitizeInput,
  sanitizeEmail,
  sanitizePhone,
  sanitizeNumber,
  sanitizeURL,
  sanitizeFileName,
  sanitizeSearchQuery,
  sanitizeFormData,
  detectXSS,
  detectSQLInjection,
};

