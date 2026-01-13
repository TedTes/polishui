# API Routes

Next.js API routes for the App Store Screenshot Generator.

## Endpoints

### POST /api/generate

Generate a storyboard from user input.

**Request (FormData):**
```
appName: string (required)
valueBullets: string (required, JSON array of strings)
screenshots: File[] (required, 5-10 image files)
locale: string (optional, defaults to en-US)
brandColor: string (optional, hex format like #0ea5e9)
```

**Response (JSON):**
```json
{
  "storyboard": {
    "appName": "MyApp",
    "locale": "en-US",
    "slides": [ /* 5 slides */ ],
    "createdAt": "2025-01-13T21:30:00.000Z",
    "version": "1.0"
  },
  "warnings": [
    "Slide 4: Using screenshot #1 (not enough screenshots provided)"
  ]
}
```

**Example:**
```javascript
const formData = new FormData();
formData.append('appName', 'MyApp');
formData.append('valueBullets', JSON.stringify([
  'Fast and intuitive',
  'Works offline',
  'Sync across devices'
]));
formData.append('screenshots', file1);
formData.append('screenshots', file2);
// ... more screenshots

const response = await fetch('/api/generate', {
  method: 'POST',
  body: formData,
});

const { storyboard, warnings } = await response.json();
```

---

### POST /api/export

Render and export storyboard as ZIP.

**Request (FormData):**
```
storyboard: string (required, JSON)
screenshots: File[] (required, must match IDs in storyboard)
brandColor: string (optional, hex format)
```

**Response:**
- Content-Type: `application/zip`
- Binary ZIP file containing:
  - `iphone_01.png` through `iphone_05.png` (1290×2796)
  - `ipad_01.png` through `ipad_05.png` (2064×2752)
  - `manifest.json`

**Example:**
```javascript
const formData = new FormData();
formData.append('storyboard', JSON.stringify(storyboard));
formData.append('screenshots', file1);
formData.append('screenshots', file2);
// ... all screenshots
formData.append('brandColor', '#0ea5e9');

const response = await fetch('/api/export', {
  method: 'POST',
  body: formData,
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);
// Trigger download
const a = document.createElement('a');
a.href = url;
a.download = 'myapp_screenshots.zip';
a.click();
```

---

### GET /api/health

Health check endpoint.

**Response (JSON):**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-13T21:30:00.000Z",
  "services": {
    "renderer": "ready",
    "copyGenerator": "ready",
    "templates": "validated"
  },
  "config": {
    "deviceTargets": 2,
    "generatorType": "RuleBasedCopyGenerator"
  }
}
```

## Error Handling

All endpoints return errors in this format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad request (invalid input)
- `500` - Server error (rendering failed, etc.)

## Architecture

API routes follow the layered architecture:
```
API Route (route.ts)
    ↓
Application Services (StoryboardGenerator, etc.)
    ↓
Domain Logic (validation, templates, etc.)
    ↓
Infrastructure (SharpRenderer, ZipExportService)
```

All business logic is in the application and domain layers.
API routes only handle HTTP concerns (parsing, validation, responses).