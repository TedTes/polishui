/**
 * Template Definitions
 * 
 * Data-driven template configurations for slide layouts.
 * Uses layout primitives (stack, split, hero) to create different visual styles.
 * 
 * Design Principles:
 * - Open/Closed: Add new templates without modifying renderer
 * - Data-Driven: Templates are configuration objects, not code branches
 * - Single Responsibility: Each template defines one layout pattern
 */

import { Template, SlideType, LayoutPrimitive } from './types';
import { THEME } from './theme';

// ============================================================================
// Template Definitions
// ============================================================================

/**
 * Hero Template - Full-screen with centered text overlay
 * 
 * Best for: Slide 1 (core promise)
 * Layout: Text centered on top half, screenshot fills bottom half
 */
const HERO_TEMPLATE: Template = {
  id: 'hero',
  name: 'Hero Layout',
  layout: 'hero',
  applicableTypes: ['hero'],
  
  textPosition: {
    align: 'center',
    verticalPosition: 20, // 20% from top
    maxWidth: 85, // 85% of safe area width
  },
  
  screenshotPosition: {
    verticalPosition: 45, // Start at 45% from top
    width: 70, // 70% of canvas width
    applyFrame: true, // Show device frame
  },
  
  background: {
    type: 'gradient',
    colors: [THEME.colors.primary[600], THEME.colors.primary[400]],
  },
};

/**
 * Stack Template - Vertical stack with text above screenshot
 * 
 * Best for: Slides 2-4 (feature highlights)
 * Layout: Headline at top, screenshot in middle, subheadline below
 */
const STACK_TEMPLATE: Template = {
  id: 'stack',
  name: 'Stack Layout',
  layout: 'stack',
  applicableTypes: ['feature'],
  
  textPosition: {
    align: 'center',
    verticalPosition: 12, // 12% from top
    maxWidth: 90, // 90% of safe area width
  },
  
  screenshotPosition: {
    verticalPosition: 35, // Start at 35% from top
    width: 65, // 65% of canvas width
    applyFrame: true,
  },
  
  background: {
    type: 'solid',
    colors: [THEME.backgroundColors.solid.light],
  },
};

/**
 * Split Template - Side-by-side layout
 * 
 * Best for: Slides 2-4 (alternative for features)
 * Layout: Text on left, screenshot on right (or vice versa)
 */
const SPLIT_TEMPLATE: Template = {
  id: 'split',
  name: 'Split Layout',
  layout: 'split',
  applicableTypes: ['feature'],
  
  textPosition: {
    align: 'left',
    verticalPosition: 30, // Vertically centered around 30%
    maxWidth: 80, // 80% of left half
  },
  
  screenshotPosition: {
    verticalPosition: 25, // Start at 25% from top
    width: 45, // 45% of canvas width (right side)
    applyFrame: true,
  },
  
  background: {
    type: 'solid',
    colors: [THEME.backgroundColors.solid.light],
  },
};

/**
 * Closing Template - Strong CTA with minimal screenshot
 * 
 * Best for: Slide 5 (closing/CTA)
 * Layout: Large centered text, small screenshot accent
 */
const CLOSING_TEMPLATE: Template = {
  id: 'closing',
  name: 'Closing Layout',
  layout: 'hero',
  applicableTypes: ['closing'],
  
  textPosition: {
    align: 'center',
    verticalPosition: 35, // Centered vertically
    maxWidth: 85,
  },
  
  screenshotPosition: {
    verticalPosition: 70, // Near bottom
    width: 50, // Smaller screenshot
    applyFrame: false, // No frame for subtlety
  },
  
  background: {
    type: 'gradient',
    colors: [THEME.colors.primary[700], THEME.colors.primary[500]],
  },
};

// ============================================================================
// Template Registry
// ============================================================================

/**
 * All available templates.
 * Order matters for fallback selection.
 */
export const TEMPLATES: readonly Template[] = [
  HERO_TEMPLATE,
  STACK_TEMPLATE,
  SPLIT_TEMPLATE,
  CLOSING_TEMPLATE,
] as const;

/**
 * Default template mapping by slide type.
 * Ensures each slide type has a sensible default.
 */
export const DEFAULT_TEMPLATE_BY_TYPE: Record<SlideType, string> = {
  hero: 'hero',
  feature: 'stack',
  closing: 'closing',
};

// ============================================================================
// Template Selection Logic
// ============================================================================

/**
 * Get template by ID.
 * Throws if template not found (fail fast).
 */
export function getTemplateById(id: string): Template {
  const template = TEMPLATES.find((t) => t.id === id);
  if (!template) {
    throw new Error(`Template not found: ${id}`);
  }
  return template;
}

/**
 * Get all templates applicable for a slide type.
 */
export function getTemplatesForSlideType(slideType: SlideType): Template[] {
  return TEMPLATES.filter((t) => t.applicableTypes.includes(slideType));
}

/**
 * Get default template for a slide type.
 * Always returns a valid template (uses fallback if needed).
 */
export function getDefaultTemplateForSlideType(slideType: SlideType): Template {
  const templateId = DEFAULT_TEMPLATE_BY_TYPE[slideType];
  return getTemplateById(templateId);
}

/**
 * Select template for a slide with optional override.
 * 
 * @param slideType - The type of slide
 * @param templateId - Optional specific template ID to use
 * @returns Selected template
 * 
 * If templateId is provided and valid for the slide type, uses it.
 * Otherwise, falls back to default template for the slide type.
 */
export function selectTemplate(
  slideType: SlideType,
  templateId?: string
): Template {
  // If specific template requested, validate and use it
  if (templateId) {
    try {
      const template = getTemplateById(templateId);
      
      // Verify template is applicable for this slide type
      if (template.applicableTypes.includes(slideType)) {
        return template;
      }
      
      console.warn(
        `Template "${templateId}" not applicable for slide type "${slideType}". Using default.`
      );
    } catch (error) {
      console.warn(
        `Template "${templateId}" not found. Using default for "${slideType}".`
      );
    }
  }
  
  // Fall back to default template for slide type
  return getDefaultTemplateForSlideType(slideType);
}

/**
 * Validate that all slide types have templates available.
 * Called during app initialization to ensure configuration is valid.
 */
export function validateTemplateConfiguration(): void {
  const slideTypes: SlideType[] = ['hero', 'feature', 'closing'];
  
  for (const slideType of slideTypes) {
    const templates = getTemplatesForSlideType(slideType);
    if (templates.length === 0) {
      throw new Error(`No templates available for slide type: ${slideType}`);
    }
    
    // Verify default template exists
    const defaultId = DEFAULT_TEMPLATE_BY_TYPE[slideType];
    const defaultTemplate = TEMPLATES.find((t) => t.id === defaultId);
    if (!defaultTemplate) {
      throw new Error(
        `Default template "${defaultId}" for slide type "${slideType}" not found`
      );
    }
  }
}

// ============================================================================
// Layout Primitive Helpers
// ============================================================================

/**
 * Get layout primitive for a template.
 * Useful for renderer to determine which layout algorithm to use.
 */
export function getLayoutPrimitive(template: Template): LayoutPrimitive {
  return template.layout;
}

/**
 * Check if template uses device frame for screenshot.
 */
export function shouldApplyDeviceFrame(template: Template): boolean {
  return template.screenshotPosition.applyFrame;
}

/**
 * Get background configuration for rendering.
 */
export function getBackgroundConfig(template: Template): {
  type: 'solid' | 'gradient';
  colors: string[];
} {
  return template.background;
}