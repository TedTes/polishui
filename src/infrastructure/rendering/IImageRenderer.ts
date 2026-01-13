/**
 * IImageRenderer Interface
 * 
 * Abstraction for image rendering and composition.
 * 
 * Design Principles:
 * - Dependency Inversion: Application layer depends on this interface
 * - Interface Segregation: Focused on image rendering only
 */

import { DeviceTarget, Slide } from '@/domain';

/**
 * Render options for a single slide.
 */
export interface RenderOptions {
  /** Target device specifications */
  target: DeviceTarget;
  
  /** Slide to render */
  slide: Slide;
  
  /** Screenshot image buffer */
  screenshotBuffer: Buffer;
  
  /** Optional brand color override (hex) */
  brandColor?: string;
}

/**
 * Rendered image result.
 */
export interface RenderedImage {
  /** Image buffer (PNG) */
  buffer: Buffer;
  
  /** Actual dimensions (for verification) */
  width: number;
  height: number;
  
  /** Format */
  format: 'png';
  
  /** Metadata */
  metadata: {
    targetId: string;
    slideId: number;
    templateId: string;
  };
}

/**
 * Image renderer interface.
 */
export interface IImageRenderer {
  /**
   * Render a single slide to an image.
   * 
   * @param options - Render options
   * @returns Rendered image buffer with metadata
   * 
   * Guarantees:
   * - Output dimensions exactly match target specifications
   * - PNG format
   * - Deterministic output (same input = same output)
   */
  render(options: RenderOptions): Promise<RenderedImage>;
  
  /**
   * Check if renderer is ready (fonts loaded, etc.).
   */
  isReady(): Promise<boolean>;
}