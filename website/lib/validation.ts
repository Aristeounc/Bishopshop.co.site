export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): {
  valid: boolean;
  error?: string;
} {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  if (email.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

export function validateRequired(value: string, fieldName: string): {
  valid: boolean;
  error?: string;
} {
  if (!value || !value.trim()) {
    return { valid: false, error: `${fieldName} is required` };
  }

  return { valid: true };
}

export function validateMinLength(value: string, min: number, fieldName: string): {
  valid: boolean;
  error?: string;
} {
  if (value.length < min) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${min} characters`,
    };
  }

  return { valid: true };
}

export function validateMaxLength(value: string, max: number, fieldName: string): {
  valid: boolean;
  error?: string;
} {
  if (value.length > max) {
    return {
      valid: false,
      error: `${fieldName} must not exceed ${max} characters`,
    };
  }

  return { valid: true };
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizeInput(input: string): string {
  return input.trim();
}
