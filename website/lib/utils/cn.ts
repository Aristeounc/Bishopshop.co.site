/**
 * Utility for combining classNames with tailwind-merge
 * Prevents style conflicts when combining Tailwind classes
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
