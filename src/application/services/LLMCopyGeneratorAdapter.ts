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
  import { RuleBasedCopyGenerator } from './RuleBasedCopyGenerator';
  
  /**
   * LLM provider configuration.
   */
  export interface LLMConfig {
    provider: 'anthropic' | 'openai';
    apiKey?: string;
    model?: string;
    maxTokens?: number;
  }
  
  /**
   * LLM-based copy generator adapter.
   * 
   * MVP: Falls back to rule-based generator if no API key.
   * Future: Implements actual LLM calls.
   */
  export class LLMCopyGeneratorAdapter implements ICopyGenerator {
    private fallbackGenerator: RuleBasedCopyGenerator;
    private config: LLMConfig;
    
    constructor(config: LLMConfig) {
      this.config = config;
      this.fallbackGenerator = new RuleBasedCopyGenerator();
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
        // No API key configured, use fallback
        const fallbackCopy = await this.fallbackGenerator.generateCopy(input);
        return {
          ...fallbackCopy,
          metadata: {
            ...fallbackCopy.metadata,
            fallbackUsed: true,
          },
        };
      }
      
      // TODO: Implement actual LLM call
      // For now, use fallback even if API key is available
      const fallbackCopy = await this.fallbackGenerator.generateCopy(input);
      return {
        ...fallbackCopy,
        metadata: {
          model: `${this.config.provider}-fallback`,
          fallbackUsed: true,
        },
      };
    }
    
    /**
     * Check if LLM is available (API key configured).
     */
    async isAvailable(): Promise<boolean> {
      return !!this.config.apiKey && this.config.apiKey.length > 0;
    }
    
    /**
     * Get generator name.
     */
    getName(): string {
      return `LLMCopyGeneratorAdapter(${this.config.provider})`;
    }
  }