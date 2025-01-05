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

## Data Fetching

Slides that require external data (charts, pictures) handle:
- Connection configuration from ConnectionsConfig
- Data fetching and caching
- Error states and loading indicators
- Refresh/update cycles

This architecture aligns with Goal Finch's domain model where slides are the primary interface for displaying progress towards personal goals.
