/**
 * RuleBasedCopyGenerator
 * 
 * Deterministic copy generator that works without any API.
 * Uses template-based approach with simple text transformations.
 * 
 * Design Principles:
 * - Determinism: Same input always produces same output
 * - No External Dependencies: Works offline, no API keys needed
 * - Character Limit Enforcement: Guarantees headline ≤32, subheadline ≤60
 */

import {
    ICopyGenerator,
    CopyGenerationInput,
    GeneratedCopy,
  } from '../interfaces/ICopyGenerator';
  import {
    HEADLINE_MAX_LENGTH,
    SUBHEADLINE_MAX_LENGTH,
  } from '@/domain';
  
  /**
   * Template-based copy generation rules.
   */
  const COPY_TEMPLATES = {
    hero: {
      headlineTemplates: [
        (appName: string) => `${appName}`,
        (appName: string) => `Meet ${appName}`,
        (appName: string) => `Introducing ${appName}`,
      ],
      subheadlineTemplates: [
        (appName: string) => `The app you've been waiting for`,
        (appName: string) => `Transform the way you work`,
        (appName: string) => `Built for modern teams`,
      ],
    },
    
    feature: {
      headlineTemplates: [
        (bullet: string) => bullet,
        (bullet: string) => `✓ ${bullet}`,
      ],
      subheadlineTemplates: [
        (bullet: string) => `Experience ${bullet.toLowerCase()}`,
        (bullet: string) => `Designed to help you succeed`,
        (bullet: string) => `Everything you need, simplified`,
      ],
    },
    
    closing: {
      headlineTemplates: [
        (appName: string) => `Get ${appName} Today`,
        (appName: string) => `Start Free`,
        (appName: string) => `Try ${appName} Free`,
        (appName: string) => `Download Now`,
      ],
      subheadlineTemplates: [
        (appName: string) => `Join thousands of happy users`,
        (appName: string) => `Available on iOS and Android`,
        (appName: string) => `No credit card required`,
      ],
    },
  } as const;
  
  /**
   * Rule-based copy generator implementation.
   */
  export class RuleBasedCopyGenerator implements ICopyGenerator {
    /**
     * Generate copy using deterministic template-based approach.
     */
    async generateCopy(input: CopyGenerationInput): Promise<GeneratedCopy> {
      const { appName, valueBullet, slideType, locale } = input;
      
      // Get templates for slide type
      const templates = COPY_TEMPLATES[slideType];
      
      // Generate headline
      let headline: string;
      if (slideType === 'feature' && valueBullet) {
        // Use value bullet for feature slides
        headline = this.selectTemplate(
          templates.headlineTemplates,
          valueBullet
        );
      } else {
        // Use app name for hero/closing slides
        headline = this.selectTemplate(
          templates.headlineTemplates,
          appName
        );
      }
      
      // Generate subheadline
      const subheadline = this.selectTemplate(
        templates.subheadlineTemplates,
        valueBullet || appName
      );
      
      // Enforce character limits
      const truncatedHeadline = this.enforceHeadlineLimit(headline);
      const truncatedSubheadline = this.enforceSubheadlineLimit(subheadline);
      
      return {
        headline: truncatedHeadline,
        subheadline: truncatedSubheadline,
        locale,
        metadata: {
          model: 'rule-based',
          truncated: headline !== truncatedHeadline || subheadline !== truncatedSubheadline,
          fallbackUsed: false,
        },
      };
    }
    
    /**
     * Rule-based generator is always available (no API needed).
     */
    async isAvailable(): Promise<boolean> {
      return true;
    }
    
    /**
     * Get generator name.
     */
    getName(): string {
      return 'RuleBasedCopyGenerator';
    }
    
    // ========================================================================
    // Private Helper Methods
    // ========================================================================
    
    /**
     * Select template deterministically.
     * Uses hash of input to pick template (same input = same template).
     */
    private selectTemplate(
      templates: ReadonlyArray<(input: string) => string>,
      input: string
    ): string {
      // Simple hash function for determinism
      const hash = this.hashString(input);
      const index = hash % templates.length;
      return templates[index](input);
    }
    
    /**
     * Simple string hash for deterministic template selection.
     */
    private hashString(str: string): number {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash);
    }
    
    /**
     * Enforce headline character limit (≤32 chars).
     * Truncates at word boundary if possible.
     */
    private enforceHeadlineLimit(text: string): string {
      if (text.length <= HEADLINE_MAX_LENGTH) {
        return text;
      }
      
      // Try to truncate at word boundary
      const truncated = text.substring(0, HEADLINE_MAX_LENGTH);
      const lastSpace = truncated.lastIndexOf(' ');
      
      if (lastSpace > HEADLINE_MAX_LENGTH * 0.7) {
        // If we can keep 70%+ of text by truncating at word boundary, do it
        return truncated.substring(0, lastSpace).trim();
      }
      
      // Otherwise, hard truncate and add ellipsis
      return truncated.substring(0, HEADLINE_MAX_LENGTH - 1).trim() + '…';
    }
    
    /**
     * Enforce subheadline character limit (≤60 chars).
     * Truncates at word boundary if possible.
     */
    private enforceSubheadlineLimit(text: string): string {
      if (text.length <= SUBHEADLINE_MAX_LENGTH) {
        return text;
      }
      
      // Try to truncate at word boundary
      const truncated = text.substring(0, SUBHEADLINE_MAX_LENGTH);
      const lastSpace = truncated.lastIndexOf(' ');
      
      if (lastSpace > SUBHEADLINE_MAX_LENGTH * 0.7) {
        return truncated.substring(0, lastSpace).trim();
      }
      
      // Hard truncate with ellipsis
      return truncated.substring(0, SUBHEADLINE_MAX_LENGTH - 1).trim() + '…';
    }
  }