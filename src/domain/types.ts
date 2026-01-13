/**
 * Domain Types
 * 
 * Core business entities and interfaces.
 * Framework-independent, pure TypeScript.
 * 
 * Design Principles:
 * - Single Responsibility: Each type represents one concept
 * - Open/Closed: Extensible for new locales, devices, templates
 * - Interface Segregation: Small, focused interfaces
 */

// ============================================================================
// Locale Types
// ============================================================================

/**
 * Supported locales for screenshot copy generation.
 * MVP: en-US only, but structure allows easy addition of new locales.
 */
export type Locale = 'en-US';

/**
 * Future locales can be added without changing core logic:
 * export type Locale = 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE';
 */

// ============================================================================
// Device Target Types
// ============================================================================

/**
 * Device platform type for screenshot exports.
 */
export type DevicePlatform = 'iPhone' | 'iPad';

/**
 * Orientation for screenshot rendering.
 * MVP: portrait only, but structure allows landscape.
 */
export type Orientation = 'portrait' | 'landscape';

/**
 * Device target specification with exact pixel dimensions.
 * Follows Open/Closed principle: new targets can be added to DEVICE_TARGETS
 * constant without modifying this interface.
 */
export interface DeviceTarget {
  /** Unique identifier for this device target (e.g., 'iphone-6.7') */
  readonly id: string;
  
  /** Platform type */
  readonly platform: DevicePlatform;
  
  /** Display name for UI */
  readonly displayName: string;
  
  /** Exact width in pixels (deterministic) */
  readonly width: number;
  
  /** Exact height in pixels (deterministic) */
  readonly height: number;
  
  /** Orientation */
  readonly orientation: Orientation;
  
  /** Safe margin padding (pixels from edges) */
  readonly safeMargin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// ============================================================================
// Slide and Storyboard Types
// ============================================================================

/**
 * Slide type identifier.
 * Determines which template is used for rendering.
 */
export type SlideType = 
  | 'hero'      // Slide 1: Core promise
  | 'feature'   // Slides 2-4: Value bullets
  | 'closing';  // Slide 5: CTA/closing

/**
 * Text content for a slide.
 * Character limits enforced by copy generator.
 */
export interface SlideText {
  /** Main headline (max 32 chars, hard-truncated if needed) */
  headline: string;
  
  /** Supporting subheadline (max 60 chars) */
  subheadline: string;
  
  /** Locale for this text */
  locale: Locale;
}

/**
 * Screenshot reference for a slide.
 * References user-uploaded screenshots by ID.
 */
export interface SlideScreenshot {
  /** ID of the uploaded screenshot (e.g., 'screenshot-1') */
  screenshotId: string;
  
  /** Original filename for reference */
  originalFilename: string;
  
  /** Optional crop/positioning hints (future enhancement) */
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * A single slide in the storyboard.
 * Combines text content, screenshot assignment, and template selection.
 */
export interface Slide {
  /** Unique slide identifier (1-indexed: 1, 2, 3, 4, 5) */
  readonly id: number;
  
  /** Type determines template and positioning */
  readonly type: SlideType;
  
  /** Text content (generated or user-edited) */
  text: SlideText;
  
  /** Screenshot assignment */
  screenshot: SlideScreenshot;
  
  /** Template ID to use for rendering */
  templateId: string;
}

/**
 * Complete storyboard of 5 slides.
 * Represents the full screenshot set for one locale.
 */
export interface Storyboard {
  /** App name */
  readonly appName: string;
  
  /** Target locale */
  readonly locale: Locale;
  
  /** Exactly 5 slides */
  readonly slides: readonly [Slide, Slide, Slide, Slide, Slide];
  
  /** Timestamp of generation (ISO 8601 string for determinism) */
  readonly createdAt: string;
  
  /** Version identifier for tracking */
  readonly version: '1.0';
}

// ============================================================================
// Template Types
// ============================================================================

/**
 * Layout primitive types.
 * Templates compose these primitives to create layouts.
 */
export type LayoutPrimitive = 
  | 'stack'   // Vertical stack (text above screenshot)
  | 'split'   // Side-by-side or asymmetric split
  | 'hero';   // Full-screen with overlay

/**
 * Text positioning configuration.
 */
export interface TextPosition {
  /** Horizontal alignment */
  align: 'left' | 'center' | 'right';
  
  /** Vertical position (percentage from top, 0-100) */
  verticalPosition: number;
  
  /** Maximum width (percentage of safe area, 0-100) */
  maxWidth: number;
}

/**
 * Screenshot positioning configuration.
 */
export interface ScreenshotPosition {
  /** Vertical position (percentage from top, 0-100) */
  verticalPosition: number;
  
  /** Width (percentage of canvas width, 0-100) */
  width: number;
  
  /** Whether to apply device frame/shadow */
  applyFrame: boolean;
}

/**
 * Template definition.
 * Data-driven configuration for slide layouts.
 * 
 * Follows Open/Closed principle: add new templates without changing renderer.
 */
export interface Template {
  /** Unique template identifier */
  readonly id: string;
  
  /** Display name */
  readonly name: string;
  
  /** Layout primitive this template uses */
  readonly layout: LayoutPrimitive;
  
  /** Applicable slide types */
  readonly applicableTypes: SlideType[];
  
  /** Text positioning rules */
  readonly textPosition: TextPosition;
  
  /** Screenshot positioning rules */
  readonly screenshotPosition: ScreenshotPosition;
  
  /** Background style */
  readonly background: {
    type: 'solid' | 'gradient';
    colors: string[]; // Hex colors
  };
}

// ============================================================================
// User Input Types
// ============================================================================

/**
 * User input for storyboard generation.
 * Validated before processing.
 */
export interface StoryboardInput {
  /** App name (required) */
  appName: string;
  
  /** 3-6 value bullets (required) */
  valueBullets: string[];
  
  /** Uploaded screenshots (5-10 required) */
  screenshots: UploadedScreenshot[];
  
  /** Optional brand color (hex) */
  brandColor?: string;
  
  /** Optional font choice (future: support multiple fonts) */
  fontChoice?: string;
  
  /** Target locale */
  locale: Locale;
}

/**
 * Uploaded screenshot metadata.
 */
export interface UploadedScreenshot {
  /** Unique ID assigned by system */
  id: string;
  
  /** Original filename */
  filename: string;
  
  /** File buffer or base64 (handled by infrastructure layer) */
  // Note: actual file data is in infrastructure, not domain
  
  /** MIME type */
  mimeType: string;
  
  /** File size in bytes */
  size: number;
}

// ============================================================================
// Export Types
// ============================================================================

/**
 * Export manifest metadata.
 * Included in ZIP export for traceability.
 */
export interface ExportManifest {
  /** App name */
  appName: string;
  
  /** Export timestamp (ISO 8601) */
  exportedAt: string;
  
  /** Locale */
  locale: Locale;
  
  /** Device targets included */
  targets: {
    platform: DevicePlatform;
    width: number;
    height: number;
    fileCount: number;
  }[];
  
  /** Template IDs used */
  templatesUsed: string[];
  
  /** Slide metadata */
  slides: {
    slideId: number;
    headline: string;
    subheadline: string;
    screenshotId: string;
    templateId: string;
  }[];
  
  /** Generator version */
  generatorVersion: '1.0';
}

/**
 * Rendered image metadata.
 * Used for verification and testing.
 */
export interface RenderedImage {
  /** Target device */
  target: DeviceTarget;
  
  /** Slide ID */
  slideId: number;
  
  /** Filename (deterministic) */
  filename: string;
  
  /** Image buffer (actual pixel data, handled by infrastructure) */
  // Note: buffer is in infrastructure layer
  
  /** Dimensions (for verification) */
  dimensions: {
    width: number;
    height: number;
  };
}
