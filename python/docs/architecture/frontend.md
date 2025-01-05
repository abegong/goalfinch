# Frontend

This doc describes the architecture of the React App in the `ui/` directory.

## Domain model

The Goal Finch app is built around a `Dashboard` that helps users track progress towards personal `Goals`. The Dashboard consists of a series of `Slides`, in four types: `Picture`, `Chart`, `Bullets`, `Summary`. Slides are grouped into `SlideGroups` sharing the same type. 

Goals are inferred from slide configuration. Any time a Chart Slide is has a target value, or a Bullets Slide is configured with checkboxes enabled, the app treats the contents of the Slide as a Goal.

In order to populate the different kinds of Slides, users can configure several kinds of `Connection`. These are typically web services that serve pictures or data. A special case is the `Self-Hosted Backend` (SHB), which both acts as Connections for any data the user wants, and also makes additional APIs available. When the Self-Hosted Backend is enabled, new functionality becomes available in the app.

### State and persistence

At the highest level, the app tracks three kinds of state: `DashboardConfig`, `ConnectionsConfig`, and `AppConfig`. These objects are singletons, managed through a Context called `ConfigContext`. The are persisted via local storage. When the SHB is available, state is also synced to the backend.

* The DashboardConfig contains all the information necessary to populate SlideGroups. This information is stored in `SlideGroupConfigs`, with subclasses `PictureGroupConfig`, `ChartGroupConfig`, and `BulletGroupConfig`. In turn, these objects can contain `PictureConfig`s, `ChartConfig`s, and `BulletListConfig`s.
* The ConnectionConfig stores information such as URLs, API keys, etc. for connecting to services that provide data for charts (Ex: self-hosted backend, online CSVs, Google sheets) and pictures (Ex: Unsplash API, picture manifests).
* The AppConfig stores UI preferences, such as whether to start on the Home page or Dashboard page.

All of these config objects strongly typed and validated with zod. Most of the information passed among Components is contained in these types, interfaces, and classes. See `src/types` for source code.

Aside from these top-level objects, specific components may manage their own internal state, usually relating to things like UI elements, animations, etc.

# Navigation and Pages

Navigation in the app is structured around `Pages`. Each Page corresponds to a top-level nav item, and has a persistent URL. In addition, some Pages allow deeper linking via anchors. Each Page is implemented as a React component, passed as the element to a top-level Route in App.tsx.

Here's the list of Pages:

* `Home`: A simple landing page with setup instructions and links to documentation.
* `Dashboard`: The main app dashboard
* `Slides`: Configuration page for SlideGroups and Slides
* `Connections`: Configuration page for Connections

Source code for Page components is in the `src/components/pages` directory.

# Slides

The other important type of components are `Slides` and `SlideEditors`.

Components for viewing Slides are stored in the `src/components/slides` directory. There is a different Slide component for each SlideType, responsible for fetching and displaying the appropriate content. Slide components can also have logic for updating state (if the user clicks a checkbox on a Bullet slide), and transition animations between slides.

Components for editing Slides are stored in the `src/components/editors` directory. Instead of displaying the content of the Slide, these components allow the user to configure the Slide. Configuration is handled at the SlideGroup level.

# Other Components

A few other component types are stored in `src/components/`. In general, I avoid creating specific types, unless they are reused with inheritance (like Slides) or are so big and complex that they need to be pulled into files of their own (like Pages).

# Component documentation

Each of the component subdirectories contains a markdown file (ex: `src/components/editors/editors.md`) that documents the purpose, behavior, and general shape of implementation of the components.These documentation files serve as living documentation that should be kept up to date as components evolve.

# Testing

The app uses React Testing Library for component tests, focusing on user-centric behavior rather than implementation details. Tests are co-located with their components (ex: `Home.test.tsx` alongside `Home.tsx`).

Key testing areas:
* Critical user flows (dashboard navigation, slide transitions)
* Complex state management (config updates, connection status)
* Reusable components (slides, editors)

Integration tests verify that major features work together correctly, particularly around configuration persistence and data loading. We avoid testing implementation details or maintaining high test coverage for simple UI components.

# Type Definitions

Type definitions are centralized in `src/types/`, with separate files for major domain concepts (ex: `slides.ts`, `connections.ts`). We use Zod schemas to validate runtime data, with TypeScript types derived from these schemas using `z.infer<typeof Schema>`.

Component props are defined inline with their components unless they're shared across multiple files. Shared prop types are placed in the relevant domain type file.

External API responses are typed using interfaces that match the exact shape of the JSON. These are kept in `src/types/api.ts` and transformed into our domain types where needed.
