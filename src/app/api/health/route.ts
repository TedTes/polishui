/**
 * GET /api/health
 * 
 * Health check endpoint.
 * Verifies that services are ready.
 */

import { NextResponse } from 'next/server';
import { SharpRenderer } from '@/infrastructure/rendering';
import { LLMCopyGeneratorAdapter } from '@/application/services';
import { validateTemplateConfiguration, DEVICE_TARGETS } from '@/domain';

export async function GET() {
  try {
    // Validate template configuration
    validateTemplateConfiguration();
    
    // Check renderer
    const renderer = new SharpRenderer();
    await renderer.initialize();
    const rendererReady = await renderer.isReady();
    
    // Check copy generator
    const copyGenerator = new LLMCopyGeneratorAdapter({
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL,
    });
    const copyGeneratorReady = await copyGenerator.isAvailable();
    
    // Gather system info
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        renderer: rendererReady ? 'ready' : 'not ready',
        copyGenerator: copyGeneratorReady ? 'ready' : 'not ready',
        templates: 'validated',
      },
      config: {
        deviceTargets: DEVICE_TARGETS.length,
        generatorType: copyGenerator.getName(),
      },
    };
    
    return NextResponse.json(health);
    
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
