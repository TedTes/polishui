/**
 * ZipExportService
 * 
 * Creates ZIP packages with rendered images and manifest.
 * 
 * Design Principles:
 * - Deterministic Naming: Uses generateFilename from domain
 * - Manifest Generation: Complete metadata for traceability
 * - Single Package: All targets in one ZIP
 */

import JSZip from 'jszip';
import {
  generateFilename,
  MANIFEST_FILENAME,
  GENERATOR_VERSION,
  ExportManifest,
} from '@/domain';
import { IExportService, ExportOptions, ExportResult } from './IExportService';

/**
 * ZIP-based export service implementation.
 */
export class ZipExportService implements IExportService {
  /**
   * Export storyboard as ZIP package.
   */
  async exportAsZip(options: ExportOptions): Promise<ExportResult> {
    const { storyboard, targets, renderedImages } = options;
    
    // Create ZIP instance
    const zip = new JSZip();
    
    // Add rendered images with deterministic filenames
    for (const image of renderedImages) {
      const filename = generateFilename(
        image.target.platform,
        image.slideId
      );
      
      zip.file(filename, image.buffer);
    }
    
    // Generate and add manifest
    const manifest = this.generateManifest(storyboard, targets, renderedImages);
    zip.file(MANIFEST_FILENAME, JSON.stringify(manifest, null, 2));
    
    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9, // Maximum compression
      },
    });
    
    return {
      zipBuffer,
      fileCount: renderedImages.length + 1, // Images + manifest
      sizeBytes: zipBuffer.length,
      manifest,
    };
  }
  
  // ========================================================================
  // Private Helper Methods
  // ========================================================================
  
  /**
   * Generate export manifest.
   */
  private generateManifest(
    storyboard: any,
    targets: any[],
    renderedImages: any[]
  ): ExportManifest {
    // Get unique template IDs used
    const templatesUsed = Array.from(
      new Set(storyboard.slides.map((s: any) => s.templateId))
    );
    
    // Build target metadata
    const targetMetadata = targets.map((target) => {
      const imagesForTarget = renderedImages.filter(
        (img) => img.target.id === target.id
      );
      
      return {
        platform: target.platform,
        width: target.width,
        height: target.height,
        fileCount: imagesForTarget.length,
      };
    });
    
    // Build slide metadata
    const slideMetadata = storyboard.slides.map((slide: any) => ({
      slideId: slide.id,
      headline: slide.text.headline,
      subheadline: slide.text.subheadline,
      screenshotId: slide.screenshot.screenshotId,
      templateId: slide.templateId,
    }));
    
    return {
      appName: storyboard.appName,
      exportedAt: new Date().toISOString(),
      locale: storyboard.locale,
      targets: targetMetadata,
      templatesUsed,
      slides: slideMetadata,
      generatorVersion: GENERATOR_VERSION,
    };
  }
}