# Goal Finch Type System

This document describes the main groups of types in Goal Finch and how they should be used throughout the application.

## Core Configuration Types

The application's state is managed through three main configuration objects, all accessible via the `ConfigContext`:

1. **DashboardConfig**
   - Contains all SlideGroup configurations
   - Represents the complete state of the dashboard
   - Persisted in local storage and synced with SHB when available

2. **ConnectionsConfig**
   - Stores external service configurations (URLs, API keys)
   - Used by slides to fetch data and images
   - Validated at runtime

3. **AppConfig**
   - Contains UI preferences and application settings
   - Affects global application behavior

## Slide Type Hierarchy

Slides follow a clear inheritance pattern:

```typescript
BaseSlideConfig
├── BulletSlideConfig
├── ChartSlideConfig
└── PictureSlideConfig
```

Each slide type implements the `BaseSlideConfig` interface while adding its own specific content type.

## SlideGroup Type Hierarchy

SlideGroups follow a similar pattern:

```typescript
BaseSlideGroupConfig
├── BulletSlideGroupConfig
├── ChartSlideGroupConfig
└── PictureSlideGroupConfig
```

Each SlideGroup contains:
- A `type` field matching the corresponding `SlideType`
- A `captions` object for positioning text overlays
- A `slides` array containing the appropriate slide configurations

## Props Flow

### Page Components
- Receive configuration through `ConfigContext`
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

1. All configuration objects are strongly typed and validated at runtime
2. External API responses are typed separately in `api.ts`
3. Discriminated unions are used for type-safe handling of different slide types

## Best Practices

1. Keep prop interfaces close to their components unless shared
2. Use TypeScript's strict mode
3. Avoid `any` - use `unknown` for runtime data that needs validation
4. Leverage union types with discriminants for type narrowing
5. Co-locate related types in domain-specific files

## Type File Organization

- `slides.ts`: Slide-related types and interfaces
- `slide_groups.ts`: SlideGroup configurations
- `connections.ts`: Connection and API configuration types
- `config.ts`: Core configuration types
- `api.ts`: External API response types

This organization aligns with the frontend architecture document by maintaining clear separation of concerns and supporting the component hierarchy described there.
