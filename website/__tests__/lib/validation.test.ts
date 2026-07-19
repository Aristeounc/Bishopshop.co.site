import {
  validateEmail,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  sanitizeEmail,
  sanitizeInput,
} from '@/lib/validation';

describe('Validation utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      const result = validateEmail('test@example.com');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should reject invalid email format', () => {
      const result = validateEmail('invalid-email');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should reject very long emails', () => {
      const longEmail = 'a'.repeat(255) + '@example.com';
      const result = validateEmail(longEmail);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('should accept non-empty strings', () => {
      const result = validateRequired('test', 'Field');
      expect(result.valid).toBe(true);
    });

    it('should reject empty strings', () => {
      const result = validateRequired('', 'Field');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Field is required');
    });

    it('should reject whitespace-only strings', () => {
      const result = validateRequired('   ', 'Field');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateMinLength', () => {
    it('should accept strings meeting minimum length', () => {
      const result = validateMinLength('hello', 3, 'Text');
      expect(result.valid).toBe(true);
    });

    it('should reject strings below minimum length', () => {
      const result = validateMinLength('hi', 3, 'Text');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must be at least 3 characters');
    });
  });

  describe('validateMaxLength', () => {
    it('should accept strings within maximum length', () => {
      const result = validateMaxLength('hello', 10, 'Text');
      expect(result.valid).toBe(true);
    });

    it('should reject strings exceeding maximum length', () => {
      const result = validateMaxLength('hello world', 5, 'Text');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must not exceed 5 characters');
    });
  });

  describe('sanitizeEmail', () => {
    it('should convert to lowercase and trim', () => {
      const result = sanitizeEmail('  TEST@EXAMPLE.COM  ');
      expect(result).toBe('test@example.com');
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      const result = sanitizeInput('  hello world  ');
      expect(result).toBe('hello world');
    });
  });
});
