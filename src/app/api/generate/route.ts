/**
 * POST /api/generate
 *
 * Generate promotional screenshots using OpenAI image edits.
 *
 * Request: FormData
 * - screenshots: File[] (1-10 images)
 * - appName: string (optional, used for naming)
 *
 * Response: application/zip
 * - ZIP with 3 variations per uploaded screenshot
 */

import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const imageModel = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';

    // Parse FormData
    const formData = await request.formData();

    const appName = (formData.get('appName') as string) || 'app-store';
    
    // Extract screenshots
    const screenshotFiles = formData.getAll('screenshots') as File[];
    
    if (screenshotFiles.length === 0) {
      return NextResponse.json(
        { error: 'No screenshots uploaded' },
        { status: 400 }
      );
    }

    if (screenshotFiles.length > 10) {
      return NextResponse.json(
        { error: 'Too many screenshots uploaded (max 10)' },
        { status: 400 }
      );
    }
    
    const basePrompt = [
      'You are an expert App Store screenshot designer creating high-converting, 100% Apple-compliant promotional images (Guideline 2.3 Accurate Metadata, 2026 rules).',
      'Base image to edit: preserve EVERY pixel of the original UI exactly as-is. Do NOT alter, blur, cover, fake, add, remove, or regenerate any in-app element, text, color, layout, icon, or content.',
      'Task rules - strict compliance:',
      '- Keep 100% of the original app UI visible, authentic, and unchanged.',
      '- Overlays ONLY allowed outside the device frame or in non-critical edge areas (minimal overlap ok if it does not hide UI).',
      '- All added text MUST be factual, descriptive, and directly tied to visible features in the screenshot.',
      '- NO hype, NO promises, NO superlatives, NO prices, NO rankings, NO competitors, NO unverifiable claims.',
      '- Use clean sans-serif font, high contrast, subtle glow/shadow for readability at thumbnail size.',
      '- Match the app color theme for headline and bullets.',
      'Output: Modern iPhone 14/15/16 Pro Max style frame, high resolution (1290x2796), vertical portrait.',
      'Headline: "Build Strength & Track Progress Daily".',
      'Bullet points (4 items): Personalized Workout Plans; Daily Streaks & Calendar Tracking; Log Sets, Reps & Exercises; Meal Planning Integration.',
      'Final output: Ultra-realistic edited images that look like official App Store screenshots - accurate, clean, professional.',
    ].join(' ');

    const variants = [
      { key: 'main', instruction: 'Main version: headline at top, bullets on right.' },
      { key: 'minimal', instruction: 'Minimal version: only headline plus small callouts pointing to UI elements (e.g., arrow to calendar: "Track Streaks").' },
      { key: 'bottom', instruction: 'Bottom-focused version: headline at bottom, bullets on left.' },
    ];

    const zip = new JSZip();

    for (let i = 0; i < screenshotFiles.length; i++) {
      const file = screenshotFiles[i];

      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.name}. Must be an image.` },
          { status: 400 }
        );
      }

      for (const variant of variants) {
        const upstream = new FormData();
        upstream.append('model', imageModel);
        upstream.append('image', file, file.name || `screenshot-${i + 1}.png`);
        upstream.append('prompt', `${basePrompt} ${variant.instruction}`);

        const response = await fetch('https://api.openai.com/v1/images/edits', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: upstream,
        });

        if (!response.ok) {
          const errorText = await response.text();
          return NextResponse.json(
            { error: `OpenAI error ${response.status}: ${errorText}` },
            { status: 502 }
          );
        }

        const data = await response.json();
        const b64 = data?.data?.[0]?.b64_json;
        if (!b64 || typeof b64 !== 'string') {
          return NextResponse.json(
            { error: 'OpenAI response missing image data' },
            { status: 502 }
          );
        }

        const buffer = Buffer.from(b64, 'base64');
        const fileIndex = String(i + 1).padStart(2, '0');
        zip.file(`screenshot-${fileIndex}-${variant.key}.png`, buffer);
      }
    }

    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });

    const safeName = appName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${safeName}_promotional_screenshots.zip"`,
        'Content-Length': zipBuffer.length.toString(),
      },
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
