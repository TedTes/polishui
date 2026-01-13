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

### Export
- `export/IExportService.ts` - Export service interface
  - Abstraction for packaging rendered images
  
- `export/ZipExportService.ts` - ZIP-based export implementation
  - Creates ZIP packages with deterministic filenames
  - Generates manifest.json with complete metadata
  - Maximum compression (level 9)
  - Single package contains all targets

### LLM (Future)
- `llm/` - LLM provider adapters (Anthropic, OpenAI)

## Usage

### Render and Export
```typescript
import { SharpRenderer } from '@/infrastructure/rendering';
import { ZipExportService } from '@/infrastructure/export';
import { DEVICE_TARGETS } from '@/domain';
import fs from 'fs';

// Render all slides for all targets
const renderer = new SharpRenderer();
await renderer.initialize();

const renderedImages = [];

for (const target of DEVICE_TARGETS) {
  for (const slide of storyboard.slides) {
    const screenshotBuffer = fs.readFileSync(`screenshots/${slide.screenshot.screenshotId}.png`);
    
    const rendered = await renderer.render({
      target,
      slide,
      screenshotBuffer,
      brandColor: '#0ea5e9',
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

const result = await exportService.exportAsZip({
  storyboard,
  targets: DEVICE_TARGETS,
  renderedImages,
});

console.log(`ZIP created: ${result.fileCount} files, ${result.sizeBytes} bytes`);
fs.writeFileSync('export.zip', result.zipBuffer);
```

### Manifest Structure

The generated `manifest.json` includes:
```json
{
  "appName": "MyApp",
  "exportedAt": "2025-01-13T21:30:00.000Z",
  "locale": "en-US",
  "targets": [
    {
      "platform": "iPhone",
      "width": 1290,
      "height": 2796,
      "fileCount": 5
    },
    {
      "platform": "iPad",
      "width": 2064,
      "height": 2752,
      "fileCount": 5
    }
  ],
  "templatesUsed": ["hero", "stack", "split", "closing"],
  "slides": [
    {
      "slideId": 1,
      "headline": "MyApp",
      "subheadline": "The app you've been waiting for",
      "screenshotId": "ss1",
      "templateId": "hero"
    }
    // ... slides 2-5
  ],
  "generatorVersion": "1.0"
}
```

## Architecture

Both rendering and export follow **Dependency Inversion**:
- Application layer depends on interfaces (`IImageRenderer`, `IExportService`)
- Concrete implementations can be swapped without changing application code
- Clean separation between business logic and infrastructure details
```

---

## Summary of Commit 8:

**Created:**
- ✅ `src/infrastructure/export/IExportService.ts` - Export service interface
- ✅ `src/infrastructure/export/ZipExportService.ts` - ZIP implementation
- ✅ `src/infrastructure/export/index.ts` - Public API
- ✅ Updated `src/infrastructure/README.md` - Documentation with examples

**Key Features:**
1. **ZIP Package Creation** - Single ZIP with all rendered images
2. **Deterministic Filenames**:
   - `iphone_01.png` through `iphone_05.png`
   - `ipad_01.png` through `ipad_05.png`
   - `manifest.json`
3. **Manifest Generation** - Complete metadata:
   - App name, locale, export timestamp
   - Device targets with dimensions
   - Templates used
   - Slide details (headline, subheadline, screenshot mapping)
   - Generator version
4. **Maximum Compression** - Level 9 deflate compression
5. **File Count Tracking** - Returns count and total size

**Design Decisions:**
- All targets in single ZIP (simpler for users)
- Deterministic filenames (consistent, sortable)
- Comprehensive manifest (traceability)
- Maximum compression (smaller downloads)
- Clean interface for future export formats

**Package Contents:**
```
export.zip
├── iphone_01.png (1290×2796)
├── iphone_02.png
├── iphone_03.png
├── iphone_04.png
├── iphone_05.png
├── ipad_01.png (2064×2752)
├── ipad_02.png
├── ipad_03.png
├── ipad_04.png
├── ipad_05.png
└── manifest.json