# Testing Standards for Goal Finch UI

## General Principles

1. **Conservative Testing Approach**
   - Focus on critical user flows and error prevention
   - Avoid over-testing implementation details
   - Test behavior, not implementation

2. **Test Organization**
   ```typescript
   describe('ComponentName', () => {
     describe('Feature or Behavior Group', () => {
       it('should do specific thing', () => {
         // Test case
       });
     });
   });
   ```

## Best Practices

### Test Structure

1. **File Organization**
   - Place tests in `src/components/__tests__/`
   - Name test files `ComponentName.test.tsx`
   - Group related test utilities in `src/components/__tests__/utils/`

2. **Test Setup**
   ```typescript
   // Mock data at the top
   const mockData = {/*...*/};

   // Reusable test utilities next
   const renderWithContext = (props) => {/*...*/};

   // Test suites last
   describe('Component', () => {/*...*/});
   ```

### Writing Tests

1. **Naming Conventions**
   - Test descriptions should be clear and behavior-focused
   - Use "should" in test names: `it('should update when valid')`
   - Group related tests with descriptive `describe` blocks

2. **Assertions**
   - Make assertions specific and meaningful
   - Test one behavior per test case
   - Use positive assertions when possible (`toBeInTheDocument` over `not.toBeNull`)

3. **User Interactions**
   ```typescript
   // Prefer userEvent over fireEvent
   await userEvent.click(button);  // ✓
   fireEvent.click(button);        // ✗
   ```

### Testing Tools

1. **React Testing Library**
   - Query elements by role, label, or text (user-centric)
   - Avoid querying by test IDs except when necessary
   ```typescript
   // Good
   screen.getByRole('button', { name: 'Save' });
   screen.getByLabelText('Name');

   // Avoid if possible
   screen.getByTestId('save-button');
   ```

2. **Context and Props**
   - Use test utilities to wrap components with required context
   - Mock only what's necessary for the test
   ```typescript
   const renderWithContext = (ui, contextValue) => {
     return render(
       <AppContext.Provider value={contextValue}>
         {ui}
       </AppContext.Provider>
     );
   };
   ```

### Mocking

1. **Mock Functions**
   - Use descriptive names for mock functions
   - Clear mocks in `beforeEach` when needed
   ```typescript
   const mockHandleSubmit = jest.fn();
   
   beforeEach(() => {
     mockHandleSubmit.mockClear();
   });
   ```

2. **Mock Data**
   - Keep mock data minimal but realistic
   - Use type-safe mock data
   ```typescript
   const mockUser: User = {
     id: '1',
     name: 'Test User'
   };
   ```

### Async Testing

1. **Handling Async Operations**
   - Always await async operations
   - Use `waitFor` for changes that don't happen immediately
   ```typescript
   await waitFor(() => {
     expect(screen.getByText('Success')).toBeInTheDocument();
   });
   ```

## What to Test

### Priority 1: Critical User Flows
- Form submissions
- Data mutations
- Error states
- Navigation flows

### Priority 2: Data Display
- Correct rendering of data
- Empty states
- Loading states

### Priority 3: Edge Cases
- Validation edge cases
- Error handling
- Boundary conditions

### What Not to Test
- Implementation details
- Third-party component internals
- Purely visual styles
- Constants and static content

## Running Tests

1. **Local Development**
   ```bash
   # Run all tests
   pnpm test --watchAll=false

   # Run specific test file
   pnpm test ComponentName.test.tsx
   ```

2. **Before Committing**
   - Ensure all tests pass
   - Check test coverage for new code
   - Review test descriptions for clarity
