# Pages Architecture

The `pages` directory contains top-level page components for Goal Finch. Each page corresponds to a primary navigation item and has a persistent URL, following the architecture defined in our frontend documentation.

## Core Pages

### Home
A landing page component that:
- Provides setup instructions
- Links to documentation
- Serves as the entry point for new users

### Dashboard
The main application view that:
- Displays configured SlideGroups
- Manages slide transitions and animations
- Handles slide interaction (e.g., checkbox state in Bullet slides)
- Provides navigation between slides

### Slides
Configuration interface that:
- Lists all SlideGroups
- Provides access to SlideEditors
- Manages SlideGroup ordering
- Handles SlideGroup creation/deletion

### Connections
Configuration page for data sources that:
- Manages Connection setup and editing
- Validates Connection configurations
- Handles API key storage
- Tests Connection availability

## State Management

Pages utilize the following state patterns as defined in our architecture:
- ConfigContext for accessing DashboardConfig, ConnectionsConfig, and AppConfig
- Local state for UI-specific elements
- URL state for deep linking and navigation

## Type Safety

Pages leverage TypeScript to ensure type safety:
```typescript
type PageProps = {
  config: DashboardConfig | ConnectionsConfig | AppConfig
  onUpdate: (config: Config) => void
}
```

Future versions may use zod.

## Component Structure

Pages follow a composition-based pattern:
```typescript
const DashboardPage = () => (
  <PageContainer>
    <SlideViewport />
    <Navigation />
  </PageContainer>
)
```

This structure promotes maintainability and follows React best practices.

## URL Management

Each page has a dedicated route in `App.tsx`. In the future, pages may support additional URL parameters:
- Dashboard: Supports slide index anchors
- Slides: Supports direct linking to specific slide editors
- Connections: Supports linking to specific connection types

## Persistence

Pages interact with persistent state through the ConfigContext, which:
- Saves to local storage
- Handles config validation and migration
- Not implemented yet: Syncs with Goal Finch Backend when available
