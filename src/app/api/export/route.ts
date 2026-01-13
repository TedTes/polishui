/**
 * POST /api/export
 * 
 * Render and export storyboard as ZIP.
 * 
 * Request: FormData
 * - storyboard: string (JSON)
 * - screenshots: File[] (multiple files, must match screenshot IDs in storyboard)
 * - brandColor: string (optional, hex color)
 * 
 * Response: application/zip
 * - ZIP file with rendered images and manifest
 */

import { NextRequest, NextResponse } from 'next/server';
import { SharpRenderer } from '@/infrastructure/rendering';
import { ZipExportService } from '@/infrastructure/export';
import { DEVICE_TARGETS, Storyboard } from '@/domain';

export async function POST(request: NextRequest) {
  try {
    // Parse FormData
    const formData = await request.formData();
    
    // Extract storyboard JSON
    const storyboardJson = formData.get('storyboard') as string;
    const brandColor = formData.get('brandColor') as string | null;
    
    if (!storyboardJson) {
      return NextResponse.json(
        { error: 'Missing required field: storyboard' },
        { status: 400 }
      );
    }
    
    // Parse storyboard
    let storyboard: Storyboard;
    try {
      storyboard = JSON.parse(storyboardJson);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid storyboard JSON' },
        { status: 400 }
      );
    }
    
    // Extract screenshots
    const screenshotFiles = formData.getAll('screenshots') as File[];
    
    if (screenshotFiles.length === 0) {
      return NextResponse.json(
        { error: 'No screenshots uploaded' },
        { status: 400 }
      );
    }
    
    // Create screenshot buffer map
    const screenshotBuffers = new Map<string, Buffer>();
    
    for (const file of screenshotFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Extract screenshot ID from filename or use index
      // For simplicity, match by order for now
      const screenshotId = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      screenshotBuffers.set(screenshotId, buffer);
    }
    
    // Initialize renderer
    const renderer = new SharpRenderer();
    await renderer.initialize();
    
    // Render all slides for all targets
    const renderedImages: any[] = [];
    
    for (const target of DEVICE_TARGETS) {
      for (const slide of storyboard.slides) {
        // Find screenshot buffer
        const screenshotId = slide.screenshot.screenshotId;
        let screenshotBuffer = screenshotBuffers.get(screenshotId);
        
        // Fallback: try by filename
        if (!screenshotBuffer) {
          screenshotBuffer = screenshotBuffers.get(slide.screenshot.originalFilename);
        }
        
        // Fallback: use first screenshot
        if (!screenshotBuffer) {
          screenshotBuffer = Array.from(screenshotBuffers.values())[0];
        }
        
        if (!screenshotBuffer) {
          return NextResponse.json(
            { error: `Screenshot not found: ${screenshotId}` },
            { status: 400 }
          );
        }
        
        // Render slide
        const rendered = await renderer.render({
          target,
          slide,
          screenshotBuffer,
          brandColor: brandColor || undefined,
        });
        
        renderedImages.push({
          target,
          slideId: slide.id,
          buffer: rendered.buffer,
        });
      }
    }
    
    // Export as ZIP
    const exportService = new ZipExportService();
    const exportResult = await exportService.exportAsZip({
      storyboard,
      targets: Array.from(DEVICE_TARGETS),
      renderedImages,
    });
    
    // Return ZIP file
    return new NextResponse(exportResult.zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${storyboard.appName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_screenshots.zip"`,
        'Content-Length': exportResult.sizeBytes.toString(),
      },
    });
    
  } catch (error: any) {
    console.error('Export API error:', error);
    
    // Return error response
    return NextResponse.json(
      { error: error.message || 'Failed to export storyboard' },
      { status: 500 }
    );
  }
}