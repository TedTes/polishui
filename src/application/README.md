# Application Layer

This layer contains application services and use cases.

## Principles

- **Orchestration**: Coordinates domain logic and infrastructure
- **Interface Driven**: Depends on abstractions, not concrete implementations
- **Business Workflows**: Storyboard generation, copy generation logic

## Contents

### Interfaces
- `interfaces/ICopyGenerator.ts` - Abstract interface for copy generation
  - Allows swapping between rule-based, Anthropic, OpenAI implementations
  - Enforces character limits (headline ≤32, subheadline ≤60)

### Services
- `services/RuleBasedCopyGenerator.ts` - Deterministic template-based copy generation
  - Works without API key (MVP fallback)
  - Guarantees same input = same output
  - Character limit enforcement with smart truncation
  
- `services/LLMCopyGeneratorAdapter.ts` - LLM provider adapter (future)
  - Stub for Anthropic/OpenAI integration
  - Falls back to rule-based if no API key

## Usage
```typescript
import { RuleBasedCopyGenerator } from '@/application/services';

const generator = new RuleBasedCopyGenerator();

const copy = await generator.generateCopy({
  appName: 'MyApp',
  slideType: 'hero',
  locale: 'en-US',
});

console.log(copy.headline); // "MyApp" (≤32 chars)
console.log(copy.subheadline); // "The app you've been waiting for" (≤60 chars)
```