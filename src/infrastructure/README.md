# Infrastructure Layer

This layer contains concrete implementations of external dependencies.

## Principles

- **Implementation Details**: Sharp rendering, ZIP creation, file I/O
- **Adapters**: Concrete implementations of application interfaces
- **Framework Specific**: Can use Sharp, JSZip, filesystem APIs

## Contents

### Rendering
- `rendering/IImageRenderer.ts` - Image rendering interface
  - Abstraction for image composition and rendering
  - Guarantees exact pixel dimensions
  
- `rendering/SharpRenderer.ts` - Sharp-based renderer implementation
  - Server-side image rendering with Sharp library
  - Composites background + screenshot + text overlays
  - Exact pixel dimension enforcement
  - SVG-based text rendering
  - Deterministic output

### Export (Coming in Commit 8)
- `export/` - ZIP packaging and export service

### LLM (Future)
- `llm/` - LLM provider adapters (Anthropic, OpenAI)

## Usage

### Render a Slide
```typescript
import { SharpRenderer } from '@/infrastructure/rendering';
import { getDeviceTargetById } from '@/domain';
import fs from 'fs';

const renderer = new SharpRenderer();
await renderer.initialize();

const target = getDeviceTargetById('iphone-6.7');
const screenshotBuffer = fs.readFileSync('screenshot.png');

const result = await renderer.render({
  target,
  slide: {
    id: 1,
    type: 'hero',
    text: {
      headline: 'MyApp',
      subheadline: 'The app you need',
      locale: 'en-US',
    },
    screenshot: {
      screenshotId: 'ss1',
      originalFilename: 'home.png',
    },
    templateId: 'hero',
  },
  screenshotBuffer,
  brandColor: '#0ea5e9',
});

console.log(result.width, result.height); // 1290 2796
fs.writeFileSync('rendered.png', result.buffer);
```

## Architecture

The rendering infrastructure follows **Dependency Inversion**:
- Application layer depends on `IImageRenderer` interface
- `SharpRenderer` is a concrete implementation
- Can swap renderers (Canvas, Skia, etc.) without changing application code