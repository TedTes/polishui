# Application Layer

This layer contains application services and use cases.

## Principles

- **Orchestration**: Coordinates domain logic and infrastructure
- **Interface Driven**: Depends on abstractions, not concrete implementations
- **Business Workflows**: Storyboard generation, copy generation logic

## Contents

- `interfaces/` - Abstract interfaces (ICopyGenerator, etc.)
- `services/` - Application services (StoryboardGenerator)
- Implementation details are injected, following Dependency Inversion
