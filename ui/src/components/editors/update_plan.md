# Editors Component Refactoring Plan

This document outlines the plan to refactor the editors codebase to better align with the architecture specified in `editors.md`.

## Current State

We currently have:
- A main `SlideGroupEditor` component that handles type switching and core UI
- A `BaseSlideGroupEditor` that's somewhat redundant with `SlideGroupEditor`
- Type-specific editors that mix concerns (captions, type-specific config)

## Refactoring Goals

1. Simplify component hierarchy
2. Better separation of concerns
3. Improve type safety
4. Make code more maintainable through proper composition

## Implementation Plan

### Phase 1: Simplify Component Hierarchy

1. Remove `BaseSlideGroupEditor` (redundant with `SlideGroupEditor`)
   - Move caption functionality directly into `SlideGroupEditor`
   - Each type-specific editor should only handle its specific configuration

2. Update type-specific editors to be pure configuration components:
   - Rename them to remove "Group" (e.g., `ChartEditor`, `BulletEditor`)
   - Remove caption handling (already in `SlideGroupEditor`)
   - Focus only on type-specific configuration

### Phase 2: Extract Common Functionality

1. Create shared hooks:
   ```typescript
   ui/src/components/editors/hooks/
   ├── useSlideTypeSwitch.ts   // SpeedDial logic
   ├── useDeleteConfirmation.ts // Delete dialog state
   └── useCaptions.ts          // Caption management
   ```

2. Extract reusable UI components:
   ```typescript
   ui/src/components/editors/components/
   ├── CaptionFields.tsx           // Caption input fields
   ├── DeleteConfirmationDialog.tsx // Delete confirmation UI
   └── SlideTypeSpeedDial.tsx      // Type switching UI
   ```

### Phase 3: Refactor Type-Specific Editors

For each editor (`BulletSlideGroupEditor`, `ChartSlideGroupEditor`, `NestedChartsSlideGroupEditor`):

1. Extract type-specific configuration into a focused component
2. Remove caption handling (now in `SlideGroupEditor`)
3. Update props interface to focus on type-specific config
4. Add proper TypeScript validation

### Phase 4: Improve Type Safety

1. Update `slide_editor_types.ts`:
   - Add proper validation for each config type
   - Add runtime type guards
   - Improve TypeScript discriminated unions

## Implementation Steps

Each step can be implemented and committed separately while maintaining a working application:

1. **Extract Common UI Components (Safe)**
   - Create new component directory
   - Move reusable UI elements
   - Update imports
   - Test each component

2. **Create Hooks (Safe)**
   - Create hooks directory
   - Extract logic into custom hooks
   - Update components to use hooks
   - Add tests for hooks

3. **Update ChartSlideGroupEditor (Safe)**
   - Rename to `ChartEditor`
   - Remove caption handling
   - Focus on chart-specific configuration
   - Update tests

4. **Update BulletSlideGroupEditor (Safe)**
   - Rename to `BulletEditor`
   - Remove caption handling
   - Focus on bullet-specific configuration
   - Update tests

5. **Update NestedChartsSlideGroupEditor (Safe)**
   - Rename to `NestedChartsEditor`
   - Remove caption handling
   - Focus on nested chart configuration
   - Update tests

6. **Remove BaseSlideGroupEditor (Safe)**
   - Move any remaining unique functionality to `SlideGroupEditor`
   - Update imports in all files
   - Remove the file
   - Update tests

Each step is marked as "Safe" because it:
- Can be implemented without breaking existing functionality
- Can be tested independently
- Can be rolled back if issues are found

## Alignment with Architecture

This refactoring plan aligns with the architecture document by:

1. Making `SlideGroupEditor` the main container component that:
   - Manages editing UI for slide groups
   - Handles slide type switching
   - Provides common UI elements
   - Manages dialog state
   - Provides caption configuration

2. Using composition over inheritance by:
   - Removing base class inheritance
   - Using hooks for shared functionality
   - Composing UI from smaller, focused components

3. Properly separating concerns between:
   - Core UI (in `SlideGroupEditor`)
   - Type-specific configuration (in individual editors)
   - Reusable UI components
   - Shared hooks

4. Maintaining type safety through:
   - Improved TypeScript types
   - Runtime type guards
   - Better discriminated unions
