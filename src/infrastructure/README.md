# Infrastructure Layer

This layer contains concrete implementations of external dependencies.

## Principles

- **Implementation Details**: Sharp rendering, ZIP creation, file I/O
- **Adapters**: Concrete implementations of application interfaces
- **Framework Specific**: Can use Sharp, JSZip, filesystem APIs

## Contents

- `rendering/` - Image composition and rendering engine (Sharp)
- `export/` - ZIP packaging and export service
- `llm/` - LLM provider adapters (rule-based fallback + optional API)
