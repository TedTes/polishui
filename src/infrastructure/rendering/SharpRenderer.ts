/**
 * SharpRenderer
 * 
 * Server-side image rendering using Sharp library.
 * Composites background, screenshot, and text overlays.
 * 
 * Design Principles:
 * - Exact Pixel Dimensions: Guarantees output matches device target
 * - Deterministic: Same input produces identical output
 * - No External Dependencies: Works offline with bundled fonts
 */

import sharp from 'sharp';
import path from 'path';
import {
  THEME,
  getTemplateById,
  getResponsiveFontSize,
  hexToRgb,
  getBrandColor,
} from '@/domain';
import { IImageRenderer, RenderOptions, RenderedImage } from './IImageRenderer';

/**
 * Sharp-based image renderer implementation.
 */
export class SharpRenderer implements IImageRenderer {
  private fontsPath: string;
  private ready: boolean = false;
  
  constructor() {
    // Path to bundled fonts
    this.fontsPath = path.join(process.cwd(), 'public', 'fonts');
  }
  
  /**
   * Initialize renderer (verify fonts exist).
   */
  async initialize(): Promise<void> {
    // TODO: Verify font files exist
    this.ready = true;
  }
  
  /**
   * Check if renderer is ready.
   */
  async isReady(): Promise<boolean> {
    return this.ready;
  }
  
  /**
   * Render a slide to an image.
   */
  async render(options: RenderOptions): Promise<RenderedImage> {
    const { target, slide, screenshotBuffer, brandColor } = options;
    
    // Get template configuration
    const template = getTemplateById(slide.templateId);
    
    // Create base canvas
    const canvas = await this.createBaseCanvas(target, template, brandColor);
    
    // Composite screenshot
    const withScreenshot = await this.compositeScreenshot(
      canvas,
      screenshotBuffer,
      target,
      template
    );
    
    // Add text overlays
    const withText = await this.addTextOverlays(
      withScreenshot,
      slide,
      target,
      template
    );
    
    // Convert to final PNG buffer
    const finalImage = await withText
      .png({ quality: 100, compressionLevel: 9 })
      .toBuffer({ resolveWithObject: true });
    
    // Verify dimensions
    if (finalImage.info.width !== target.width || finalImage.info.height !== target.height) {
      throw new Error(
        `Dimension mismatch: expected ${target.width}x${target.height}, got ${finalImage.info.width}x${finalImage.info.height}`
      );
    }
    
    return {
      buffer: finalImage.data,
      width: finalImage.info.width,
      height: finalImage.info.height,
      format: 'png',
      metadata: {
        targetId: target.id,
        slideId: slide.id,
        templateId: template.id,
      },
    };
  }
  
  // ========================================================================
  // Private Rendering Methods
  // ========================================================================
  
  /**
   * Create base canvas with background color/gradient.
   */
  private async createBaseCanvas(
    target: any,
    template: any,
    brandColor?: string
  ): Promise<sharp.Sharp> {
    const { width, height } = target;
    const bgConfig = template.background;
    
    let backgroundColor: string;
    
    if (bgConfig.type === 'solid') {
      backgroundColor = brandColor 
        ? getBrandColor(brandColor)
        : bgConfig.colors[0];
    } else {
      // For gradients, use first color as base (Sharp doesn't support gradients natively)
      // In production, we'd render gradient to SVG first
      backgroundColor = brandColor
        ? getBrandColor(brandColor)
        : bgConfig.colors[0];
    }
    
    // Convert hex to RGB
    const rgb = hexToRgb(backgroundColor);
    
    // Create blank canvas
    return sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: rgb.r, g: rgb.g, b: rgb.b, alpha: 1 },
      },
    });
  }
  
  /**
   * Composite screenshot onto canvas.
   */
  private async compositeScreenshot(
    canvas: sharp.Sharp,
    screenshotBuffer: Buffer,
    target: any,
    template: any
  ): Promise<sharp.Sharp> {
    const { width: canvasWidth, height: canvasHeight } = target;
    const screenshotConfig = template.screenshotPosition;
    
    // Calculate screenshot dimensions
    const screenshotWidth = Math.round(canvasWidth * (screenshotConfig.width / 100));
    const screenshotTop = Math.round(canvasHeight * (screenshotConfig.verticalPosition / 100));
    
    // Resize screenshot to fit
    const resizedScreenshot = await sharp(screenshotBuffer)
      .resize(screenshotWidth, undefined, {
        fit: 'contain',
        withoutEnlargement: false,
      })
      .png()
      .toBuffer();
    
    // Get resized screenshot dimensions
    const screenshotMeta = await sharp(resizedScreenshot).metadata();
    const screenshotHeight = screenshotMeta.height || 0;
    
    // Center horizontally
    const screenshotLeft = Math.round((canvasWidth - screenshotWidth) / 2);
    
    // Composite onto canvas
    return canvas.composite([
      {
        input: resizedScreenshot,
        left: screenshotLeft,
        top: screenshotTop,
      },
    ]);
  }
  
  /**
   * Add text overlays to canvas.
   * 
   * Note: Sharp doesn't have built-in text rendering.
   * For MVP, we'll create SVG text and composite it.
   */
  private async addTextOverlays(
    canvas: sharp.Sharp,
    slide: any,
    target: any,
    template: any
  ): Promise<sharp.Sharp> {
    const { width: canvasWidth, height: canvasHeight } = target;
    const { text } = slide;
    const textConfig = template.textPosition;
    
    // Calculate safe area
    const safeLeft = target.safeMargin.left;
    const safeRight = canvasWidth - target.safeMargin.right;
    const safeWidth = safeRight - safeLeft;
    
    // Calculate text area width
    const textAreaWidth = Math.round(safeWidth * (textConfig.maxWidth / 100));
    
    // Calculate vertical position
    const textTop = Math.round(canvasHeight * (textConfig.verticalPosition / 100));
    
    // Get responsive font sizes
    const headlineFontSize = getResponsiveFontSize(
      THEME.typography.headline.fontSize,
      target.platform,
      'headline'
    );
    
    const subheadlineFontSize = getResponsiveFontSize(
      THEME.typography.subheadline.fontSize,
      target.platform,
      'subheadline'
    );
    
    // Create SVG for headline
    const headlineSvg = this.createTextSvg(
      text.headline,
      headlineFontSize,
      THEME.fontWeights.bold,
      textConfig.align,
      textAreaWidth,
      THEME.textColors.overlay.primary
    );
    
    // Create SVG for subheadline
    const subheadlineSvg = this.createTextSvg(
      text.subheadline,
      subheadlineFontSize,
      THEME.fontWeights.medium,
      textConfig.align,
      textAreaWidth,
      THEME.textColors.overlay.secondary
    );
    
    // Calculate positions
    let headlineLeft = safeLeft;
    let subheadlineLeft = safeLeft;
    
    if (textConfig.align === 'center') {
      headlineLeft = Math.round((canvasWidth - textAreaWidth) / 2);
      subheadlineLeft = headlineLeft;
    } else if (textConfig.align === 'right') {
      headlineLeft = safeRight - textAreaWidth;
      subheadlineLeft = headlineLeft;
    }
    
    const subheadlineTop = textTop + headlineFontSize + 20; // 20px gap
    
    // Composite text overlays
    return canvas.composite([
      {
        input: Buffer.from(headlineSvg),
        left: headlineLeft,
        top: textTop,
      },
      {
        input: Buffer.from(subheadlineSvg),
        left: subheadlineLeft,
        top: subheadlineTop,
      },
    ]);
  }
  
  /**
   * Create SVG text element.
   */
  private createTextSvg(
    text: string,
    fontSize: number,
    fontWeight: number,
    align: 'left' | 'center' | 'right',
    maxWidth: number,
    color: string
  ): string {
    const textAnchor = align === 'center' ? 'middle' : align === 'right' ? 'end' : 'start';
    const x = align === 'center' ? maxWidth / 2 : align === 'right' ? maxWidth : 0;
    
    // Simple SVG text (no wrapping for MVP)
    const svg = `
      <svg width="${maxWidth}" height="${fontSize + 10}">
        <text
          x="${x}"
          y="${fontSize}"
          font-family="Inter, sans-serif"
          font-size="${fontSize}"
          font-weight="${fontWeight}"
          fill="${color}"
          text-anchor="${textAnchor}"
        >${this.escapeXml(text)}</text>
      </svg>
    `;
    
    return svg.trim();
  }
  
  /**
   * Escape XML special characters.
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}