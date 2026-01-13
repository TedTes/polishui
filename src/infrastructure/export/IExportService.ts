/**
 * IExportService Interface
 * 
 * Abstraction for exporting storyboards as downloadable packages.
 * 
 * Design Principles:
 * - Single Responsibility: Only handles export packaging
 * - Dependency Inversion: Application depends on interface
 */

import { Storyboard, DeviceTarget } from '@/domain';

/**
 * Export request options.
 */
export interface ExportOptions {
  /** Storyboard to export */
  storyboard: Storyboard;
  
  /** Device targets to render for */
  targets: DeviceTarget[];
  
  /** Rendered images (one per target per slide) */
  renderedImages: {
    target: DeviceTarget;
    slideId: number;
    buffer: Buffer;
  }[];
}

/**
 * Export result.
 */
export interface ExportResult {
  /** ZIP file buffer */
  zipBuffer: Buffer;
  
  /** Total file count in ZIP */
  fileCount: number;
  
  /** ZIP size in bytes */
  sizeBytes: number;
  
  /** Manifest included */
  manifest: any;
}

/**
 * Export service interface.
 */
export interface IExportService {
  /**
   * Export storyboard as ZIP package.
   * 
   * @param options - Export options
   * @returns ZIP buffer with manifest
   * 
   * Package contents:
   * - iphone_01.png through iphone_05.png
   * - ipad_01.png through ipad_05.png
   * - manifest.json
   */
  exportAsZip(options: ExportOptions): Promise<ExportResult>;
}