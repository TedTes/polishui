# Fonts

## Inter Font

This project uses the **Inter** font family for both UI and rendered screenshot overlays.

### For UI (Web)
- Loaded via Next.js `next/font/google` in `src/app/layout.tsx`
- Automatically optimized and self-hosted by Next.js

### For Server-Side Rendering (Screenshot Overlays)
- Actual Inter font files (.ttf) for Sharp rendering
- Font files downloaded from [Inter GitHub repository](https://github.com/rsms/inter)

**Available weights:**
- `Inter-Regular.ttf` - 400 (regular)
- `Inter-Medium.ttf` - 500 (medium)
- `Inter-SemiBold.ttf` - 600 (semibold)
- `Inter-Bold.ttf` - 700 (bold)

### Usage
The rendering engine uses these fonts to draw text overlays on screenshots with exact typography matching the UI design system.

## Why Inter?

- Clean, readable sans-serif optimized for screens
- Excellent for UI text at all sizes
- Open source (SIL Open Font License)
- Wide character set support including Latin, Cyrillic, Greek
- Designed specifically for digital interfaces

## License

Inter is licensed under the [SIL Open Font License 1.1](https://github.com/rsms/inter/blob/master/LICENSE.txt)
