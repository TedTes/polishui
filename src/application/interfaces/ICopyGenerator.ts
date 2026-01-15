/**
 * ICopyGenerator Interface
 * 
 * Abstraction for generating slide copy (headlines and subheadlines).
 * 
 * Design Principles:
 * - Dependency Inversion: Business logic depends on this interface, not concrete implementations
 * - Liskov Substitution: All implementations must be interchangeable
 * - Interface Segregation: Single, focused interface
 */

import { Locale, SlideType } from '@/domain';

/**
 * Input for copy generation.
 */
export interface CopyGenerationInput {
  /** App name */
  appName: string;
  
  /** Value bullet point (for feature slides) */
  valueBullet?: string;
  
  /** Slide type to generate copy for */
  slideType: SlideType;
  
  /** Target locale */
  locale: Locale;
  
  /** Optional brand context */
  brandContext?: {
    industry?: string;
    targetAudience?: string;
    tone?: 'professional' | 'casual' | 'playful';
  };
}

/**
 * Generated copy output.
 */
export interface GeneratedCopy {
  /** Headline (max 32 chars) */
  headline: string;
  
  /** Subheadline (max 60 chars) */
  subheadline: string;
  
  /** Locale of generated text */
  locale: Locale;
  
  /** Optional metadata about generation */
  metadata?: {
    model?: string;
    truncated?: boolean;
    fallbackUsed?: boolean;
  };
}

/**
 * Copy generator interface.
 * 
 * Implementations:
 * - OpenAICopyGenerator: Uses OpenAI API
 */
export interface ICopyGenerator {
  /**
   * Generate headline and subheadline for a slide.
   * 
   * @param input - Copy generation input
   * @returns Generated copy with character limits enforced
   * 
   * Guarantees:
   * - headline.length <= 32
   * - subheadline.length <= 60
   * - Same input produces same output (for deterministic implementations)
   */
  generateCopy(input: CopyGenerationInput): Promise<GeneratedCopy>;
  
  /**
   * Check if generator is available (e.g., API key configured).
   * Used to determine if this generator can be used.
   */
  isAvailable(): Promise<boolean>;
  
  /**
   * Get name of this generator (for logging/debugging).
   */
  getName(): string;
}
