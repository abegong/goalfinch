# Type Definitions Update Plan

## Current State Analysis

### Type Definition Location Issues
1. Type definitions are currently scattered across multiple locations:
   - `src/data/slide_interfaces.ts`: Core slide type definitions
   - `src/components/editors/slide_editor_types.ts`: Editor-specific type definitions
   - `src/data/BaseSlide.ts`: Base slide implementation

### Architecture Violations
1. Types are not centralized in `src/types/` as specified in the architecture document
2. Domain concepts are mixed together (slide types with editor types)
3. No clear separation between different major domain concepts

## Proposed Changes

### Phase 1: Create Type Directory Structure
1. Create new type definition files in `src/types/`:
   - `slides.ts`: Core slide types and interfaces
   - `editors.ts`: Editor-specific types
   - `common.ts`: Shared types like `Captions`

### Phase 2: Migrate Existing Types
1. Move slide-related types from `slide_interfaces.ts` to `src/types/slides.ts`:
   - `SlideType` enum
   - `Slide` base class
   - Specific slide type classes
2. Move editor types from `slide_editor_types.ts` to `src/types/editors.ts`:
   - `BaseSlideConfig`
   - Specific slide config interfaces
   - Editor prop interfaces
3. Extract common types to `src/types/common.ts`:
   - `Captions` interface

### Phase 3: Update Imports
1. Update all import statements in existing files to reference new type locations
2. Ensure no circular dependencies are created
3. Remove old type definition files

### Phase 4: Type Enhancement
1. Add proper TypeScript documentation to all type definitions
2. Strengthen type safety:
   - Replace `any` types with proper interfaces
   - Add proper generic constraints
   - Consider using discriminated unions for slide types

## Implementation Notes
- Each phase should be implemented as a separate PR for easier review
- Tests should be updated alongside type changes
- Documentation should be updated to reflect new type organization
- All changes should maintain backward compatibility

## Questions for Review
1. Should `BaseSlide.ts` be moved to `src/types/` or remain in `src/data/`?
2. Are there any additional domain concepts that need their own type definition files?
3. Should we consider using TypeScript's strict mode to catch more type-related issues?

## Success Criteria
- All type definitions are properly organized in `src/types/`
- No type definitions exist outside of designated files
- All types are properly documented
- No regression in existing functionality
- Type safety is improved across the codebase
