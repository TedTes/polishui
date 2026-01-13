/**
 * Domain Layer Public API
 * 
 * Exports all domain types, interfaces, and constants.
 * Other layers should import from this index, not individual files.
 * 
 * This follows Interface Segregation and provides a clean public API.
 */

// Types and Interfaces
export type {
  Locale,
  DevicePlatform,
  Orientation,
  DeviceTarget,
  SlideType,
  SlideText,
  SlideScreenshot,
  Slide,
  Storyboard,
  LayoutPrimitive,
  TextPosition,
  ScreenshotPosition,
  Template,
  StoryboardInput,
  UploadedScreenshot,
  ExportManifest,
  RenderedImage,
} from './types';

// Constants
export {
  DEVICE_TARGETS,
  getDeviceTargetById,
  getDeviceTargetByPlatform,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  isValidLocale,
  SLIDES_PER_STORYBOARD,
  VALUE_BULLETS_MIN,
  VALUE_BULLETS_MAX,
  SCREENSHOTS_MIN,
  SCREENSHOTS_MAX,
  HEADLINE_MAX_LENGTH,
  SUBHEADLINE_MAX_LENGTH,
  APP_NAME_MAX_LENGTH,
  FILENAME_PATTERN,
  generateFilename,
  GENERATOR_VERSION,
  MANIFEST_FILENAME,
  validateStoryboardInput,
} from './constants';

// Theme
export type { Theme, ColorPalette, TypographyStyle } from './theme';
export {
  THEME,
  FONT_FAMILY,
  FONT_FILES,
  FONT_WEIGHTS,
  TYPOGRAPHY,
  TYPOGRAPHY_RESPONSIVE,
  COLORS,
  TEXT_COLORS,
  BACKGROUND_COLORS,
  SPACING,
  SAFE_MARGINS,
  CONTENT_PADDING,
  SHADOWS,
  BORDER_RADIUS,
  getResponsiveFontSize,
  hexToRgb,
  isValidHexColor,
  getBrandColor,
} from './theme';

// Templates
export {
  TEMPLATES,
  DEFAULT_TEMPLATE_BY_TYPE,
  getTemplateById,
  getTemplatesForSlideType,
  getDefaultTemplateForSlideType,
  selectTemplate,
  validateTemplateConfiguration,
  getLayoutPrimitive,
  shouldApplyDeviceFrame,
  getBackgroundConfig,
} from './templates';
