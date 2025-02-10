# Goal Finch Type System

This document describes the type system implementation in Goal Finch and how these types are used throughout the application.

## Core Configuration Types

The application's persisted state is managed through three main configuration objects, all accessible via the `ConfigContext`:

1. **DashboardConfig**
   - Contains all SlideGroup configurations
   - Represents the complete state of the dashboard
   - Persisted in local storage and synced with the GFB when available

2. **ConnectionsConfig**
   - Stores external service configurations (URLs, API keys)
   - Used by slides to fetch data and images

3. **AppConfig**
   - Contains UI preferences and application settings
   - Affects global application behavior

## Slide Types

Slides use TypeScript interfaces and a discriminated union pattern with SlideType as the discriminator.

The `SlideType` enum defines three supported types: BULLETS, PICTURE, and CHART.

## SlideGroup Types

SlideGroups follow a similar interface extension pattern.

Each SlideGroup contains:
- A `type` field matching the corresponding `SlideType`
- A `captions` object for positioning text overlays
- A `slides` array containing the appropriate slide configurations

## Props Flow

### Page Components
- Receive configuration through `ConfigContext`
- Maintain their own local state
- May receive URL parameters through React Router
- Pass relevant subsets of configuration to child components

### Slide Components
- Receive their configuration via props from parent SlideGroup
- Must implement type-specific rendering logic
- May receive callbacks for user interaction

### Editor Components
- Receive current configuration and update callbacks
- Follow controlled component pattern
- Validate changes before propagating updates

## Type Safety

1. All configuration objects are strongly typed
2. Discriminated unions are used for type-safe handling of different slide types

## Best Practices

1. Keep prop interfaces close to their components unless shared
2. Use TypeScript's strict mode
3. Avoid `any` - use `unknown` for runtime data that needs validation
4. Leverage union types with discriminants for type narrowing
5. Co-locate related types in domain-specific files

## Type File Organization

The type system is organized into four main files:

- `slides.ts`: Slide interfaces and the SlideType enum
- `slide_groups.ts`: SlideGroup interfaces and caption types
- `connections.ts`: Connection configuration interfaces
- `config.ts`: Core configuration types

This organization aligns with the frontend architecture document by maintaining clear separation of concerns and supporting the component hierarchy described there.

## Type Safety Best Practices

1. Use TypeScript's strict mode
2. Leverage discriminated unions for type-safe handling of different slide types
3. Use interface extension to enforce type consistency
4. Avoid `any` - use `unknown` for runtime data that needs validation
5. Keep prop interfaces close to their components unless shared
