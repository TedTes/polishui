/**
 * Domain Constants
 * 
 * Single source of truth for device targets, dimensions, and constraints.

 */

import { DeviceTarget, Locale } from './types';

// ============================================================================
// Device Targets (Single Source of Truth)
// ============================================================================

/**
 * Supported device targets for App Store screenshots.
 * 
 * MVP: 2 targets (iPhone 6.7" and iPad Pro 12.9")
 * These are the exact pixel dimensions required by App Store Connect.
 * 
 * TODO: These dimensions are hardcoded per requirements.
 *  compliance with other Apple sizes without verification.
 */
export const DEVICE_TARGETS: readonly DeviceTarget[] = [
  {
    id: 'iphone-6.7',
    platform: 'iPhone',
    displayName: 'iPhone 6.7" Display',
    width: 1290,
    height: 2796,
    orientation: 'portrait',
    safeMargin: {
      top: 120,
      right: 60,
      bottom: 120,
      left: 60,
    },
  },
  {
    id: 'ipad-12.9',
    platform: 'iPad',
    displayName: 'iPad Pro 12.9" Display',
    width: 2064,
    height: 2752,
    orientation: 'portrait',
    safeMargin: {
      top: 160,
      right: 80,
      bottom: 160,
      left: 80,
    },
  },
] as const;

/**
 * Helper to get device target by ID.
 * Throws if target not found (fail fast for invalid IDs).
 */
export function getDeviceTargetById(id: string): DeviceTarget {
  const target = DEVICE_TARGETS.find((t) => t.id === id);
  if (!target) {
    throw new Error(`Device target not found: ${id}`);
  }
  return target;
}

/**
 * Helper to get device target by platform.
 * Returns first matching target (MVP has one per platform).
 */
export function getDeviceTargetByPlatform(platform: 'iPhone' | 'iPad'): DeviceTarget {
  const target = DEVICE_TARGETS.find((t) => t.platform === platform);
  if (!target) {
    throw new Error(`No device target for platform: ${platform}`);
  }
  return target;
}

// ============================================================================
// Locale Constants
// ============================================================================

/**
 * Supported locales.
 * MVP: en-US only, but structure allows easy expansion.
 */
export const SUPPORTED_LOCALES: readonly Locale[] = ['en-US'] as const;

/**
 * Default locale for the application.
 */
export const DEFAULT_LOCALE: Locale = 'en-US';

/**
 * Helper to validate locale.
 */
export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

// ============================================================================
// Storyboard Constants
// ============================================================================

/**
 * Fixed number of slides in a storyboard.
 * This is a core business rule - App Store previews are exactly 5 slides.
 */
export const SLIDES_PER_STORYBOARD = 5 as const;

/**
 * Valid range for value bullets input.
 */
export const VALUE_BULLETS_MIN = 3;
export const VALUE_BULLETS_MAX = 6;

/**
 * Valid range for screenshot uploads.
 */
export const SCREENSHOTS_MIN = 5;
export const SCREENSHOTS_MAX = 10;

// ============================================================================
// Copy Generation Constants
// ============================================================================

/**
 * Character limits for headline and subheadline.
 * Enforced by copy generator (hard truncation if exceeded).
 */
export const HEADLINE_MAX_LENGTH = 32;
export const SUBHEADLINE_MAX_LENGTH = 60;

/**
 * App name length limit (reasonable UX constraint).
 */
export const APP_NAME_MAX_LENGTH = 50;

// ============================================================================
// File Generation Constants
// ============================================================================

/**
 * Filename patterns for deterministic output.
 * Format: {platform}_{slideNumber}.png
 * 
 * Examples:
 * - iphone_01.png
 * - iphone_02.png
 * - ipad_01.png
 */
export const FILENAME_PATTERN = {
  iphone: (slideNumber: number) => `iphone_${slideNumber.toString().padStart(2, '0')}.png`,
  ipad: (slideNumber: number) => `ipad_${slideNumber.toString().padStart(2, '0')}.png`,
} as const;

/**
 * Generate deterministic filename for a slide and target.
 */
export function generateFilename(platform: 'iPhone' | 'iPad', slideNumber: number): string {
  if (slideNumber < 1 || slideNumber > SLIDES_PER_STORYBOARD) {
    throw new Error(`Invalid slide number: ${slideNumber}. Must be 1-${SLIDES_PER_STORYBOARD}`);
  }
  
  const pattern = platform === 'iPhone' ? FILENAME_PATTERN.iphone : FILENAME_PATTERN.ipad;
  return pattern(slideNumber);
}

// ============================================================================
// Version Constants
// ============================================================================

/**
 * Generator version for manifests and exports.
 */
export const GENERATOR_VERSION = '1.0' as const;

/**
 * Manifest filename (included in ZIP).
 */
export const MANIFEST_FILENAME = 'manifest.json' as const;

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate storyboard input constraints.
 * Throws descriptive errors for invalid input.
 */
export function validateStoryboardInput(input: {
  appName: string;
  valueBullets: string[];
  screenshots: unknown[];
}): void {
  // App name
  if (!input.appName || input.appName.trim().length === 0) {
    throw new Error('App name is required');
  }
  if (input.appName.length > APP_NAME_MAX_LENGTH) {
    throw new Error(`App name must be ${APP_NAME_MAX_LENGTH} characters or less`);
  }

  // Value bullets
  if (input.valueBullets.length < VALUE_BULLETS_MIN) {
    throw new Error(`At least ${VALUE_BULLETS_MIN} value bullets are required`);
  }
  if (input.valueBullets.length > VALUE_BULLETS_MAX) {
    throw new Error(`Maximum ${VALUE_BULLETS_MAX} value bullets allowed`);
  }

  // Screenshots
  if (input.screenshots.length < SCREENSHOTS_MIN) {
    throw new Error(`At least ${SCREENSHOTS_MIN} screenshots are required`);
  }
  if (input.screenshots.length > SCREENSHOTS_MAX) {
    throw new Error(`Maximum ${SCREENSHOTS_MAX} screenshots allowed`);
  }
}