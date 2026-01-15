/**
 * LLMCopyGeneratorAdapter
 * 
 * Adapter for LLM-based copy generation (Anthropic, OpenAI, etc.).
 * This is a stub for future implementation.
 * 
 * Design Principles:
 * - Open/Closed: Can add new LLM providers without changing interface
 * - Dependency Inversion: Depends on ICopyGenerator interface
 */

import {
    ICopyGenerator,
    CopyGenerationInput,
    GeneratedCopy,
  } from '../interfaces/ICopyGenerator';
  
  /**
   * LLM provider configuration.
   */
export interface LLMConfig {
  provider: 'anthropic' | 'openai';
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  baseUrl?: string;
}
  
  /**
   * LLM-based copy generator adapter.
   * 
   * MVP: Falls back to rule-based generator if no API key.
   * Future: Implements actual LLM calls.
   */
export class LLMCopyGeneratorAdapter implements ICopyGenerator {
  private config: LLMConfig;
  
  constructor(config: LLMConfig) {
    this.config = config;
  }
    
    /**
     * Generate copy using LLM (or fallback to rule-based).
     * 
     * MVP: Always uses fallback.
     * Future: Calls LLM API if available.
     */
  async generateCopy(input: CopyGenerationInput): Promise<GeneratedCopy> {
    const isAvailable = await this.isAvailable();
    
    if (!isAvailable) {
        throw new Error('OpenAI API key is not configured');
    }
    
    if (this.config.provider !== 'openai') {
      throw new Error(`Unsupported LLM provider: ${this.config.provider}`);
    }
    
    return this.generateWithOpenAI(input);
  }
    
    /**
     * Check if LLM is available (API key configured).
     */
  async isAvailable(): Promise<boolean> {
      return this.config.provider === 'openai' && !!this.config.apiKey && this.config.apiKey.length > 0;
  }
    
    /**
     * Get generator name.
     */
  getName(): string {
      return `LLMCopyGeneratorAdapter(${this.config.provider})`;
  }

  private async generateWithOpenAI(input: CopyGenerationInput): Promise<GeneratedCopy> {
    const model = this.config.model || 'gpt-4o-mini';
    const maxTokens = this.config.maxTokens || 200;
    const baseUrl = this.config.baseUrl || 'https://api.openai.com/v1';
    
    const systemPrompt = [
      'You are a conversion-focused copywriter for App Store screenshots.',
      'Return only valid JSON with keys: headline, subheadline.',
      'Constraints: headline <= 32 chars, subheadline <= 60 chars.',
      'Avoid generic phrases like "the app you need" or "experience X today".',
      'Do not include emojis, quotes, or additional keys.',
    ].join(' ');
    
    const userPrompt = [
      `appName: ${input.appName}`,
      `slideType: ${input.slideType}`,
      input.valueBullet ? `valueBullet: ${input.valueBullet}` : 'valueBullet: (none)',
      `locale: ${input.locale}`,
      input.brandContext?.tone ? `tone: ${input.brandContext.tone}` : 'tone: (none)',
    ].join('\n');
    
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error('OpenAI response missing content');
    }
    
    const parsed = this.parseJsonResponse(content);
    if (typeof parsed.headline !== 'string' || typeof parsed.subheadline !== 'string') {
      throw new Error('OpenAI response missing required fields');
    }
    const headline = this.enforceLimit(parsed.headline, 32);
    const subheadline = this.enforceLimit(parsed.subheadline, 60);
    
    return {
      headline,
      subheadline,
      locale: input.locale,
      metadata: {
        model,
        truncated: headline !== parsed.headline || subheadline !== parsed.subheadline,
        fallbackUsed: false,
      },
    };
  }
  
  private parseJsonResponse(content: string): { headline: string; subheadline: string } {
    try {
      return JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error('OpenAI response not JSON');
      }
      return JSON.parse(match[0]);
    }
  }
  
  private enforceLimit(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.7) {
      return truncated.substring(0, lastSpace).trim();
    }
    
    return truncated.substring(0, Math.max(0, maxLength - 3)).trim() + '...';
  }
}
