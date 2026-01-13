/**
 * POST /api/generate
 * 
 * Generate storyboard from user input.
 * 
 * Request: FormData
 * - appName: string
 * - valueBullets: string (JSON array)
 * - screenshots: File[] (multiple files)
 * - locale: string (optional, defaults to en-US)
 * - brandColor: string (optional, hex color)
 * 
 * Response: JSON
 * - storyboard: Storyboard
 * - warnings: string[]
 */

import { NextRequest, NextResponse } from 'next/server';
import { StoryboardGenerator, RuleBasedCopyGenerator } from '@/application/services';
import { DEFAULT_LOCALE, isValidHexColor } from '@/domain';

export async function POST(request: NextRequest) {
  try {
    // Parse FormData
    const formData = await request.formData();
    
    // Extract fields
    const appName = formData.get('appName') as string;
    const valueBulletsJson = formData.get('valueBullets') as string;
    const locale = (formData.get('locale') as string) || DEFAULT_LOCALE;
    const brandColor = formData.get('brandColor') as string | null;
    
    // Validate required fields
    if (!appName || !valueBulletsJson) {
      return NextResponse.json(
        { error: 'Missing required fields: appName, valueBullets' },
        { status: 400 }
      );
    }
    
    // Parse value bullets
    let valueBullets: string[];
    try {
      valueBullets = JSON.parse(valueBulletsJson);
      if (!Array.isArray(valueBullets)) {
        throw new Error('valueBullets must be an array');
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid valueBullets format. Must be JSON array.' },
        { status: 400 }
      );
    }
    
    // Validate brand color if provided
    if (brandColor && !isValidHexColor(brandColor)) {
      return NextResponse.json(
        { error: 'Invalid brandColor. Must be hex format (e.g., #0ea5e9)' },
        { status: 400 }
      );
    }
    
    // Extract screenshots
    const screenshots: any[] = [];
    const screenshotFiles = formData.getAll('screenshots') as File[];
    
    if (screenshotFiles.length === 0) {
      return NextResponse.json(
        { error: 'No screenshots uploaded' },
        { status: 400 }
      );
    }
    
    // Process screenshots
    for (let i = 0; i < screenshotFiles.length; i++) {
      const file = screenshotFiles[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.name}. Must be an image.` },
          { status: 400 }
        );
      }
      
      // Create screenshot metadata
      screenshots.push({
        id: `screenshot-${i + 1}`,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
      });
    }
    
    // Generate storyboard
    const copyGenerator = new RuleBasedCopyGenerator();
    const storyboardGenerator = new StoryboardGenerator(copyGenerator);
    
    const result = await storyboardGenerator.generate({
      appName,
      valueBullets,
      screenshots,
      locale: locale as any,
      brandColor: brandColor || undefined,
    });
    
    // Return storyboard and warnings
    return NextResponse.json({
      storyboard: result.storyboard,
      warnings: result.warnings,
    });
    
  } catch (error: any) {
    console.error('Generate API error:', error);
    
    // Return error response
    return NextResponse.json(
      { error: error.message || 'Failed to generate storyboard' },
      { status: 500 }
    );
  }
}