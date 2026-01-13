/**
 * StoryboardGenerator Service
 * 
 * Orchestrates the creation of a complete 5-slide storyboard.
 * 
 * Design Principles:
 * - Single Responsibility: Only generates storyboards
 * - Dependency Inversion: Depends on ICopyGenerator interface
 * - Business Logic Coordination: Uses domain rules and copy generation
 */

import {
    Storyboard,
    Slide,
    SlideType,
    StoryboardInput,
    SlideText,
    SlideScreenshot,
    validateStoryboardInput,
    SLIDES_PER_STORYBOARD,
    GENERATOR_VERSION,
    selectTemplate,
  } from '@/domain';
  import { ICopyGenerator } from '../interfaces/ICopyGenerator';
  
  /**
   * Storyboard generation result.
   */
  export interface StoryboardGenerationResult {
    storyboard: Storyboard;
    warnings: string[];
  }
  
  /**
   * Storyboard generator service.
   */
  export class StoryboardGenerator {
    private copyGenerator: ICopyGenerator;
    
    constructor(copyGenerator: ICopyGenerator) {
      this.copyGenerator = copyGenerator;
    }
    
    /**
     * Generate a complete storyboard from user input.
     * 
     * @param input - User input (app name, value bullets, screenshots)
     * @returns Generated storyboard with 5 slides
     * 
     * Business Rules:
     * - Exactly 5 slides per storyboard
     * - Slide 1: Hero (core promise)
     * - Slides 2-4: Features (from value bullets)
     * - Slide 5: Closing (CTA)
     * - Screenshots assigned sequentially by default
     */
    async generate(input: StoryboardInput): Promise<StoryboardGenerationResult> {
      // Validate input
      validateStoryboardInput({
        appName: input.appName,
        valueBullets: input.valueBullets,
        screenshots: input.screenshots,
      });
      
      const warnings: string[] = [];
      
      // Generate slides
      const slides: Slide[] = [];
      
      // Slide 1: Hero
      const heroSlide = await this.generateHeroSlide(
        input,
        1,
        input.screenshots[0]
      );
      slides.push(heroSlide);
      
      // Slides 2-4: Features (use first 3 value bullets)
      for (let i = 0; i < 3; i++) {
        const slideNumber = i + 2;
        const valueBullet = input.valueBullets[i];
        const screenshot = input.screenshots[i + 1] || input.screenshots[0]; // Fallback to first screenshot
        
        if (!input.screenshots[i + 1]) {
          warnings.push(`Slide ${slideNumber}: Using screenshot #1 (not enough screenshots provided)`);
        }
        
        const featureSlide = await this.generateFeatureSlide(
          input,
          slideNumber,
          valueBullet,
          screenshot
        );
        slides.push(featureSlide);
      }
      
      // Slide 5: Closing
      const closingScreenshot = input.screenshots[4] || input.screenshots[0];
      if (!input.screenshots[4]) {
        warnings.push('Slide 5: Using screenshot #1 (not enough screenshots provided)');
      }
      
      const closingSlide = await this.generateClosingSlide(
        input,
        5,
        closingScreenshot
      );
      slides.push(closingSlide);
      
      // Validate we have exactly 5 slides
      if (slides.length !== SLIDES_PER_STORYBOARD) {
        throw new Error(
          `Invalid storyboard: expected ${SLIDES_PER_STORYBOARD} slides, got ${slides.length}`
        );
      }
      
      // Create storyboard
      const storyboard: Storyboard = {
        appName: input.appName,
        locale: input.locale,
        slides: slides as [Slide, Slide, Slide, Slide, Slide],
        createdAt: new Date().toISOString(),
        version: GENERATOR_VERSION,
      };
      
      return {
        storyboard,
        warnings,
      };
    }
    
    // ========================================================================
    // Private Slide Generation Methods
    // ========================================================================
    
    /**
     * Generate hero slide (slide 1).
     */
    private async generateHeroSlide(
      input: StoryboardInput,
      slideNumber: number,
      screenshot: StoryboardInput['screenshots'][0]
    ): Promise<Slide> {
      // Generate copy
      const copy = await this.copyGenerator.generateCopy({
        appName: input.appName,
        slideType: 'hero',
        locale: input.locale,
        brandContext: {
          tone: 'professional',
        },
      });
      
      // Create slide text
      const text: SlideText = {
        headline: copy.headline,
        subheadline: copy.subheadline,
        locale: input.locale,
      };
      
      // Create screenshot reference
      const screenshotRef: SlideScreenshot = {
        screenshotId: screenshot.id,
        originalFilename: screenshot.filename,
      };
      
      // Select template
      const template = selectTemplate('hero');
      
      return {
        id: slideNumber,
        type: 'hero',
        text,
        screenshot: screenshotRef,
        templateId: template.id,
      };
    }
    
    /**
     * Generate feature slide (slides 2-4).
     */
    private async generateFeatureSlide(
      input: StoryboardInput,
      slideNumber: number,
      valueBullet: string,
      screenshot: StoryboardInput['screenshots'][0]
    ): Promise<Slide> {
      // Generate copy
      const copy = await this.copyGenerator.generateCopy({
        appName: input.appName,
        valueBullet,
        slideType: 'feature',
        locale: input.locale,
      });
      
      // Create slide text
      const text: SlideText = {
        headline: copy.headline,
        subheadline: copy.subheadline,
        locale: input.locale,
      };
      
      // Create screenshot reference
      const screenshotRef: SlideScreenshot = {
        screenshotId: screenshot.id,
        originalFilename: screenshot.filename,
      };
      
      // Select template (alternate between stack and split for variety)
      const templateId = slideNumber % 2 === 0 ? 'stack' : 'split';
      const template = selectTemplate('feature', templateId);
      
      return {
        id: slideNumber,
        type: 'feature',
        text,
        screenshot: screenshotRef,
        templateId: template.id,
      };
    }
    
    /**
     * Generate closing slide (slide 5).
     */
    private async generateClosingSlide(
      input: StoryboardInput,
      slideNumber: number,
      screenshot: StoryboardInput['screenshots'][0]
    ): Promise<Slide> {
      // Generate copy
      const copy = await this.copyGenerator.generateCopy({
        appName: input.appName,
        slideType: 'closing',
        locale: input.locale,
        brandContext: {
          tone: 'professional',
        },
      });
      
      // Create slide text
      const text: SlideText = {
        headline: copy.headline,
        subheadline: copy.subheadline,
        locale: input.locale,
      };
      
      // Create screenshot reference
      const screenshotRef: SlideScreenshot = {
        screenshotId: screenshot.id,
        originalFilename: screenshot.filename,
      };
      
      // Select template
      const template = selectTemplate('closing');
      
      return {
        id: slideNumber,
        type: 'closing',
        text,
        screenshot: screenshotRef,
        templateId: template.id,
      };
    }
    
    /**
     * Update screenshot assignment for a specific slide.
     * 
     * @param storyboard - Existing storyboard
     * @param slideId - Slide ID to update (1-5)
     * @param newScreenshotId - New screenshot ID to assign
     * @returns Updated storyboard
     */
    updateScreenshotAssignment(
      storyboard: Storyboard,
      slideId: number,
      newScreenshotId: string,
      newFilename: string
    ): Storyboard {
      if (slideId < 1 || slideId > SLIDES_PER_STORYBOARD) {
        throw new Error(`Invalid slide ID: ${slideId}. Must be 1-${SLIDES_PER_STORYBOARD}`);
      }
      
      // Find the slide
      const slideIndex = slideId - 1;
      const updatedSlides = [...storyboard.slides];
      
      // Update screenshot assignment
      updatedSlides[slideIndex] = {
        ...updatedSlides[slideIndex],
        screenshot: {
          screenshotId: newScreenshotId,
          originalFilename: newFilename,
        },
      };
      
      return {
        ...storyboard,
        slides: updatedSlides as [Slide, Slide, Slide, Slide, Slide],
      };
    }
    
    /**
     * Update text content for a specific slide.
     * 
     * @param storyboard - Existing storyboard
     * @param slideId - Slide ID to update (1-5)
     * @param newText - New headline and/or subheadline
     * @returns Updated storyboard
     */
    updateSlideText(
      storyboard: Storyboard,
      slideId: number,
      newText: { headline?: string; subheadline?: string }
    ): Storyboard {
      if (slideId < 1 || slideId > SLIDES_PER_STORYBOARD) {
        throw new Error(`Invalid slide ID: ${slideId}. Must be 1-${SLIDES_PER_STORYBOARD}`);
      }
      
      const slideIndex = slideId - 1;
      const updatedSlides = [...storyboard.slides];
      const currentSlide = updatedSlides[slideIndex];
      
      // Update text
      updatedSlides[slideIndex] = {
        ...currentSlide,
        text: {
          ...currentSlide.text,
          headline: newText.headline ?? currentSlide.text.headline,
          subheadline: newText.subheadline ?? currentSlide.text.subheadline,
        },
      };
      
      return {
        ...storyboard,
        slides: updatedSlides as [Slide, Slide, Slide, Slide, Slide],
      };
    }
  }