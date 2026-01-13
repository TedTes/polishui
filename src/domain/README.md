# Domain Layer

This layer contains the core business logic and domain models.

## Principles

- **Framework Independent**: No dependencies on Next.js, React, or external libraries
- **Pure Business Logic**: Types, interfaces, constants, and domain rules
- **Single Source of Truth**: Device targets, theme tokens, templates

## Contents

- `types.ts` - Core domain interfaces (DeviceTarget, Slide, Storyboard, Locale)
- `theme.ts` - Theme tokens and typography constants
- `templates.ts` - Data-driven template configurations
- `constants.ts` - Device targets and other domain constants
