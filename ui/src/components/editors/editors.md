# Slide Editors Architecture

The `editors` directory contains components for configuring slides within Goal Finch. Each slide type has a corresponding editor component that allows users to modify its configuration.

## Core Components

### SlideGroupEditor
The main container component that:
- Manages the editing UI for a group of slides
- Handles slide type switching via SpeedDial
- Provides common UI elements (Card container, collapse/expand)
- Manages dialog state for confirmations
- Provides caption configuration through composition
- Manages collapsible sections

## Type-Specific Editors

Each slide type has its own editor component that extends the base functionality through composition:

- `BulletEditor`: Configuration for bullet slide groups
  - Bullet point management
  - List formatting options

- `ChartEditor`: Configuration for chart slide groups
  - Data source URL
  - Goal values and units
  - Rounding configuration

- `PicturesEditor`: Configuration for picture slide groups
  - Multiple chart management
  - Chart relationship configuration

## State Management

Editors use a combination of:
- Local state for UI elements (collapse state, dialogs)
- Props for slide configuration
- Context for shared functionality (type switching, deletion)

## Type Safety

Each editor uses TypeScript discriminated unions to ensure type safety:
```typescript
type SlideEditorConfig = 
  | { type: 'bullets', content: string[] }
  | { type: 'chart', url: string, goal: number }
  // etc
```

## Component Composition

Instead of inheritance, editors use composition to share functionality:
```typescript
const ChartSlideEditor = (props) => (
  <SlideGroupEditor>
    <ChartConfig {...props} />
  </SlideGroupEditor>
)
```

This approach follows React best practices and makes the codebase more maintainable and flexible.
