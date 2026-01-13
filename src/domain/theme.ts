/**
 * Theme System
 * 
 * Single source of truth for visual design tokens.
 * Used by both:
 * - UI layer (Tailwind CSS)
 * - Rendering engine (Sharp for screenshot overlays)
 * 
 * Design Principles:
 * - Consistent Styling: One theme source for all visual elements
 * - Determinism: Fixed color/typography values ensure consistent output
 * - Open/Closed: Can extend with new theme variants without breaking existing code
 */

// ============================================================================
// Typography Tokens
// ============================================================================

/**
 * Font family configuration.
 * MVP: Inter only, but structure allows adding more fonts.
 */
export const FONT_FAMILY = {
  primary: 'Inter',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
} as const;

/**
 * Font file paths for server-side rendering.
 * These are the actual .ttf files used by Sharp.
 */
export const FONT_FILES = {
  regular: '/public/fonts/Inter-Regular.ttf',
  medium: '/public/fonts/Inter-Medium.ttf',
  semibold: '/public/fonts/Inter-SemiBold.ttf',
  bold: '/public/fonts/Inter-Bold.ttf',
} as const;

/**
 * Font weights mapped to standard CSS values.
 */
export const FONT_WEIGHTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/**
 * Typography scale for different text elements.
 * Sizes are in pixels for deterministic rendering.
 */
export const TYPOGRAPHY = {
  // Headline sizes (used in slide overlays)
  headline: {
    fontSize: 64,
    lineHeight: 72,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: -0.02, // -2% tracking (tighter for headlines)
  },
  
  // Subheadline sizes
  subheadline: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: -0.01, // -1% tracking
  },
  
  // App name display
  appName: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: 0,
  },
  
  // Body text (for UI, not overlays)
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: 0,
  },
  
  // Small text (captions, labels)
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: 0,
  },
} as const;

/**
 * Responsive typography adjustments per device target.
 * iPhone gets slightly smaller text due to narrower canvas.
 */
export const TYPOGRAPHY_RESPONSIVE = {
  iPhone: {
    headlineScale: 0.85,      // 85% of base size
    subheadlineScale: 0.9,    // 90% of base size
  },
  iPad: {
    headlineScale: 1.0,       // 100% of base size
    subheadlineScale: 1.0,    // 100% of base size
  },
} as const;

// ============================================================================
// Color Tokens
// ============================================================================

/**
 * Base color palette.
 * These are the default colors, but can be overridden by user's brand color.
 */
export const COLORS = {
  // Primary brand colors (defaults)
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // Default brand color
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Neutral grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Pure white/black
  white: '#ffffff',
  black: '#000000',
  
  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
} as const;

/**
 * Text colors for different contexts.
 */
export const TEXT_COLORS = {
  // Light mode (text on light backgrounds)
  light: {
    primary: COLORS.gray[900],
    secondary: COLORS.gray[600],
    tertiary: COLORS.gray[400],
  },
  
  // Dark mode (text on dark backgrounds)
  dark: {
    primary: COLORS.white,
    secondary: COLORS.gray[200],
    tertiary: COLORS.gray[400],
  },
  
  // Overlay text (on screenshot backgrounds)
  overlay: {
    primary: COLORS.white,
    withShadow: true, // Apply text shadow for readability
  },
} as const;

/**
 * Background colors for templates.
 */
export const BACKGROUND_COLORS = {
  // Solid backgrounds
  solid: {
    light: COLORS.white,
    dark: COLORS.gray[900],
    primary: COLORS.primary[500],
  },
  
  // Gradient backgrounds (array of color stops)
  gradient: {
    primary: [COLORS.primary[600], COLORS.primary[400]],
    sunset: ['#ff6b6b', '#feca57'],
    ocean: ['#667eea', '#764ba2'],
    forest: ['#134e5e', '#71b280'],
  },
} as const;

// ============================================================================
// Spacing Tokens
// ============================================================================

/**
 * Spacing scale (in pixels).
 * Used for margins, padding, gaps.
 */
export const SPACING = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

/**
 * Safe area margins per device target.
 * Already defined in constants.ts via DeviceTarget.safeMargin,
 * but we expose them here for theme-aware components.
 */
export const SAFE_MARGINS = {
  iPhone: {
    top: 120,
    right: 60,
    bottom: 120,
    left: 60,
  },
  iPad: {
    top: 160,
    right: 80,
    bottom: 160,
    left: 80,
  },
} as const;

/**
 * Content padding (inside safe margins).
 */
export const CONTENT_PADDING = {
  small: SPACING[4],   // 16px
  medium: SPACING[6],  // 24px
  large: SPACING[8],   // 32px
} as const;

// ============================================================================
// Shadow Tokens
// ============================================================================

/**
 * Shadow definitions for depth and elevation.
 */
export const SHADOWS = {
  // Text shadows (for overlay readability)
  text: {
    soft: '0 2px 8px rgba(0, 0, 0, 0.3)',
    hard: '0 4px 12px rgba(0, 0, 0, 0.5)',
  },
  
  // Box shadows (for UI elements)
  box: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
  
  // Device frame shadow (for screenshot mockups)
  device: '0 25px 50px rgba(0, 0, 0, 0.25)',
} as const;

// ============================================================================
// Border Radius Tokens
// ============================================================================

/**
 * Border radius scale (in pixels).
 */
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

// ============================================================================
// Theme Composition
// ============================================================================

/**
 * Complete theme object.
 * This is the single source of truth exported to other layers.
 */
export const THEME = {
  fonts: FONT_FAMILY,
  fontFiles: FONT_FILES,
  fontWeights: FONT_WEIGHTS,
  typography: TYPOGRAPHY,
  typographyResponsive: TYPOGRAPHY_RESPONSIVE,
  colors: COLORS,
  textColors: TEXT_COLORS,
  backgroundColors: BACKGROUND_COLORS,
  spacing: SPACING,
  safeMargins: SAFE_MARGINS,
  contentPadding: CONTENT_PADDING,
  shadows: SHADOWS,
  borderRadius: BORDER_RADIUS,
} as const;

// ============================================================================
// Type Exports
// ============================================================================

/**
 * Theme type for type-safe usage.
 */
export type Theme = typeof THEME;

/**
 * Color palette type.
 */
export type ColorPalette = typeof COLORS;

/**
 * Typography style type.
 */
export type TypographyStyle = typeof TYPOGRAPHY[keyof typeof TYPOGRAPHY];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get responsive font size for a device target.
 * Applies scaling factor based on device.
 */
export function getResponsiveFontSize(
  baseSize: number,
  devicePlatform: 'iPhone' | 'iPad',
  textType: 'headline' | 'subheadline' = 'headline'
): number {
  const scale = TYPOGRAPHY_RESPONSIVE[devicePlatform][
    textType === 'headline' ? 'headlineScale' : 'subheadlineScale'
  ];
  return Math.round(baseSize * scale);
}

/**
 * Parse hex color to RGB components (for Sharp rendering).
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Validate user-provided brand color (must be valid hex).
 */
export function isValidHexColor(hex: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(hex);
}

/**
 * Get brand color with fallback to default.
 */
export function getBrandColor(userColor?: string): string {
  if (userColor && isValidHexColor(userColor)) {
    return userColor;
  }
  return COLORS.primary[500];
}
