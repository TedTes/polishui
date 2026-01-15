# Application Layer

This layer contains application services and use cases.

## Principles

- **Orchestration**: Coordinates domain logic and infrastructure
- **Interface Driven**: Depends on abstractions, not concrete implementations
- **Business Workflows**: Storyboard generation, copy generation logic

## Contents

### Interfaces
- `interfaces/ICopyGenerator.ts` - Abstract interface for copy generation
  - Allows swapping between LLM providers
  - Enforces character limits (headline ≤32, subheadline ≤60)

### Services
- `services/LLMCopyGeneratorAdapter.ts` - LLM provider adapter
  - OpenAI integration for copy generation
  - Character limit enforcement with smart truncation

- `services/StoryboardGenerator.ts` - Orchestrates storyboard creation
  - Generates exactly 5 slides from user input
  - Slide 1: Hero (core promise)
  - Slides 2-4: Features (from value bullets)
  - Slide 5: Closing (CTA)
  - Default screenshot assignment (sequential)
  - Methods to update screenshot assignments and text

## Usage

### Generate Storyboard
```typescript
import { StoryboardGenerator, LLMCopyGeneratorAdapter } from '@/application/services';

const copyGenerator = new LLMCopyGeneratorAdapter({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
});
const storyboardGenerator = new StoryboardGenerator(copyGenerator);

const result = await storyboardGenerator.generate({
  appName: 'MyApp',
  valueBullets: [
    'Fast and intuitive',
    'Works offline',
    'Sync across devices',
  ],
  screenshots: [
    { id: 'ss1', filename: 'home.png', mimeType: 'image/png', size: 1024 },
    { id: 'ss2', filename: 'feature.png', mimeType: 'image/png', size: 2048 },
    // ... more screenshots
  ],
  locale: 'en-US',
});

console.log(result.storyboard.slides.length); // 5
console.log(result.warnings); // ['Slide 4: Using screenshot #1 (not enough screenshots)']
```

### Update Storyboard
```typescript
// Update screenshot assignment
const updatedStoryboard = storyboardGenerator.updateScreenshotAssignment(
  result.storyboard,
  2, // Slide 2
  'ss3', // New screenshot ID
  'new-feature.png'
);

// Update slide text
const editedStoryboard = storyboardGenerator.updateSlideText(
  result.storyboard,
  1, // Slide 1
  {
    headline: 'Custom Headline',
    subheadline: 'Custom subheadline text',
  }
);
```

## Architecture

The StoryboardGenerator follows the **Dependency Inversion Principle**:
- Depends on `ICopyGenerator` interface (not concrete implementations)
- Can work with any copy generator (OpenAI or other providers)
- Uses domain entities and validation rules
- Orchestrates business logic without knowing infrastructure details
