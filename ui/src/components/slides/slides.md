# Slide Components Architecture

The `slides` directory contains components for displaying different types of slides within Goal Finch. Each slide type has a corresponding display component that renders its content according to the configuration.

## Core Components

### SlideGroup
The main container component that:
- Manages the display of a group of related slides
- Handles transitions between slides
- Provides common UI elements (Card container, navigation)
- Manages slide state and interactions
- Handles animations and transitions

## Type-Specific Slides

Each slide type has its own component that implements the base functionality through composition:

- `BulletSlide`: Display for bullet slide groups
  - Renders bullet points
  - Manages checkbox state (for goal-tracking)
  - Handles list formatting

- `ChartSlide`: Display for chart slide groups
  - Fetches and displays data from configured source
  - Visualizes progress towards goals
  - Handles data formatting and units

- `PictureSlide`: Display for picture slide groups
  - Manages image loading and display
  - Handles multiple picture layouts
  - Provides image transitions

## State Management

As described in the frontend architecture, slides use:
- Props from DashboardConfig for content and configuration
- Local state for UI elements (animations, transitions)
- Context for shared functionality (navigation, interaction)

## Type Safety

Each slide uses TypeScript discriminated unions aligned with the config types:
```typescript
type SlideContent = 
  | { type: 'bullets', items: string[], checkable?: boolean }
  | { type: 'chart', data: any, target?: number }
  | { type: 'picture', urls: string[] }
```

## Component Composition

Following React best practices, slides use composition over inheritance:
```typescript
const ChartSlide = (props) => (
  <SlideBase>
    <ChartContent {...props} />
  </SlideBase>
)
```

## Data Fetching

Slides that require external data (charts, pictures) handle:
- Connection configuration from ConnectionsConfig
- Data fetching and caching
- Error states and loading indicators
- Refresh/update cycles

This architecture aligns with Goal Finch's domain model where slides are the primary interface for displaying progress towards personal goals.
