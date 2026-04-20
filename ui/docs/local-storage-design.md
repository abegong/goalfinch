# Local Storage Design Decisions

This document outlines key design decisions for implementing local storage in Goal Finch's React app.

## Save Frequency

### Options

1. **Save on Every Change**
   - Pros:
     - Maximum data safety
     - Simplest to implement
     - Clear mental model
   - Cons:
     - More writes to localStorage
     - Could impact performance with large configs
     - May hit rate limits on some browsers

2. **Debounced Saves**
   - Pros:
     - Reduces number of writes
     - Better performance
     - Still maintains good data safety
   - Cons:
     - Slightly more complex implementation
     - Small window where changes could be lost
     - Need to choose appropriate debounce interval

3. **Save on Specific Actions**
   - Pros:
     - Most control over when saves happen
     - Could tie into UX (e.g., "Save" button)
   - Cons:
     - Risk of losing changes
     - More complex UX
     - Goes against modern auto-save expectations

### Recommendation

Implement **debounced saves** with a 1000ms (1 second) delay:
- Provides good balance of performance and data safety
- Matches modern user expectations of auto-save
- Can be easily adjusted if needed
- Consider adding explicit save on page unload for additional safety

## Version Migration

### Options

1. **Version Number in Storage**
   - Pros:
     - Clear upgrade path
     - Can run multiple migrations in sequence
     - Easy to detect outdated data
   - Cons:
     - Need to maintain migration scripts
     - More complex initial setup

2. **Schema-Based Detection**
   - Pros:
     - No version numbers to maintain
     - More flexible
   - Cons:
     - Less reliable
     - Harder to handle complex migrations
     - More difficult to debug

3. **Reset on Schema Change**
   - Pros:
     - Simplest implementation
     - No migration code needed
   - Cons:
     - Poor user experience
     - Loss of user data

### Recommendation

Implement **Version Number in Storage**:
- Store version number alongside config data
- Create a migrations directory for version upgrade scripts
- Default to empty config if migration fails
- Log migration failures for debugging

## Error Handling

### Options

1. **Silent Fallback**
   - Pros:
     - Seamless user experience
     - No error messages to handle
   - Cons:
     - Users unaware of data loss
     - Hard to debug issues

2. **Notify and Continue**
   - Pros:
     - Users aware of issues
     - Still functional
   - Cons:
     - Need UI for notifications
     - Could be annoying if persistent

3. **Block and Require Action**
   - Pros:
     - Users must acknowledge issues
     - Clear about data loss
   - Cons:
     - More intrusive
     - Could prevent app use

### Recommendation

Implement **Notify and Continue**:
- Show non-blocking toast notification on storage errors
- Log errors for debugging
- Provide clear message about what was lost
- Add "Don't show again" option for persistent issues

## Architecture Integration

### Options

1. **Direct in ConfigContext**
   ```typescript
   class ConfigContext {
     private save() { /* localStorage logic */ }
     private load() { /* localStorage logic */ }
   }
   ```
   - Pros:
     - Simple implementation
     - Clear ownership
   - Cons:
     - Harder to test
     - Mixes concerns
     - Less flexible

2. **Storage Service**
   ```typescript
   class StorageService {
     save(key: string, data: any): void
     load(key: string): any
     // Additional methods for versioning, migration
   }
   ```
   - Pros:
     - Separation of concerns
     - Easier to test
     - Could support different storage backends
   - Cons:
     - More files/complexity
     - Need to manage service lifecycle

3. **Custom Hook**
   ```typescript
   function useLocalStorage<T>(key: string, initialValue: T)
   ```
   - Pros:
     - React-idiomatic
     - Easy to use in components
     - Built-in state management
   - Cons:
     - May not fit well with Context
     - Could lead to multiple instances
     - Less control over timing

### Recommendation

Implement **Storage Service**:
- Create a dedicated service for storage operations
- Inject service into ConfigContext
- Benefits:
  - Clear separation of concerns
  - Easier to test and mock
  - Could support different storage backends
  - Centralizes storage logic
- Example structure:
  ```typescript
  interface StorageService {
    save(key: string, data: any): Promise<void>;
    load(key: string): Promise<any>;
    migrate(): Promise<void>;
    // Additional methods as needed
  }
  
  class LocalStorageService implements StorageService {
    // Implementation
  }
  
  // In ConfigContext:
  constructor(private storage: StorageService) {}
  ```
