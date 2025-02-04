import { render, screen, within, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigContext } from '../../context/ConfigContext';
import ConfigureConnections from '../pages/ConfigureConnections';
import { act } from '@testing-library/react';

// Mock data
const mockSources = {
  pictureSources: [
    { name: 'pictures-1', url: 'https://example.com/pics' }
  ],
  goalSources: [
    { name: 'data-1', url: 'https://example.com/data' }
  ],
  backend: null
};

// Mock context setup
const mockSetConnections = jest.fn();
const defaultContextValue = {
  connections: mockSources,
  setConnections: mockSetConnections,
  dashboard: { slideGroups: [] },
  setDashboard: jest.fn(),
  app: { appControlBar: { open: false, visible: true }, theme: { mode: 'light' as const } },
  setApp: jest.fn()
};

// Test utilities
const renderWithContext = (contextValue = defaultContextValue) => {
  return render(
    <ConfigContext.Provider value={contextValue}>
      <ConfigureConnections />
    </ConfigContext.Provider>
  );
};

describe('ConfigureConnections', () => {
  beforeEach(() => {
    mockSetConnections.mockClear();
    mockSetConnections.mockImplementation(fn => {
      const result = fn(mockSources);
      return result;
    });
  });

  // Critical user flows
  describe('Source Management', () => {
    it('should add a new source with valid inputs', async () => {
      renderWithContext();
      
      // Find Pictures section and click its Add Source button
      const picturesSection = screen.getByRole('heading', { name: 'Pictures' }).closest('div');
      const addButton = within(picturesSection!).getByRole('button', { name: 'Add Source' });
      await act(async () => {
        await userEvent.click(addButton);
      });
      
      // Fill form with custom name instead of using default
      const nameInput = screen.getByLabelText('Name');
      const urlInput = screen.getByLabelText('URL');
      await act(async () => {
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'pictures-test');
        await userEvent.type(urlInput, 'https://test.com');
      });
      
      // Submit
      await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: 'Save' }));
      });
      
      // Verify
      const updatedConnections = mockSetConnections.mock.calls[0][0](mockSources);
      expect(updatedConnections.pictureSources).toEqual([
        ...mockSources.pictureSources,
        { name: 'pictures-test', url: 'https://test.com' }
      ]);
    });

    it('should edit an existing source', async () => {
      renderWithContext();
      
      // Find Pictures section's first source's edit button
      const picturesSection = screen.getByRole('heading', { name: 'Pictures' }).closest('div');
      const editButton = within(picturesSection!).getByTestId('edit-pictures-1');
      await act(async () => {
        await userEvent.click(editButton);
      });
      
      // Edit URL
      const urlInput = screen.getByLabelText('URL');
      await act(async () => {
        await userEvent.clear(urlInput);
        await userEvent.type(urlInput, 'https://new-url.com');
      });
      
      // Save
      await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: 'Save' }));
      });
      
      // Verify
      const updatedConnections = mockSetConnections.mock.calls[0][0](mockSources);
      expect(updatedConnections.pictureSources).toEqual([
        { name: 'pictures-1', url: 'https://new-url.com' }
      ]);
    });

    it('should delete a source when confirmed', async () => {
      renderWithContext();
      
      // Find Pictures section's first source's delete button
      const picturesSection = screen.getByRole('heading', { name: 'Pictures' }).closest('div');
      const deleteButton = within(picturesSection!).getByTestId('delete-pictures-1');
      await act(async () => {
        await userEvent.click(deleteButton);
      });
      
      // Confirm deletion
      await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      });
      
      // Verify
      const updatedConnections = mockSetConnections.mock.calls[0][0](mockSources);
      expect(updatedConnections.pictureSources).toEqual([]);
    });
  });

  // Validation
  describe('Form Validation', () => {
    it('should reject duplicate names', async () => {
      renderWithContext();
      
      // Find Pictures section and click its Add Source button
      const picturesSection = screen.getByRole('heading', { name: 'Pictures' }).closest('div');
      const addButton = within(picturesSection!).getByRole('button', { name: 'Add Source' });
      await act(async () => {
        await userEvent.click(addButton);
      });
      
      // Try to use existing name
      const nameInput = screen.getByLabelText('Name');
      await act(async () => {
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'pictures-1');
      });
      
      // Verify error message
      expect(screen.getByText('This name is already in use')).toBeInTheDocument();
      
      // Verify save button is disabled
      expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });

    it('should validate URL format', async () => {
      renderWithContext();
      
      // Find Pictures section and click its Add Source button
      const picturesSection = screen.getByRole('heading', { name: 'Pictures' }).closest('div');
      const addButton = within(picturesSection!).getByRole('button', { name: 'Add Source' });
      await act(async () => {
        await userEvent.click(addButton);
      });
      
      // Try invalid URL
      const urlInput = screen.getByLabelText('URL');
      await act(async () => {
        await userEvent.clear(urlInput);
        await userEvent.type(urlInput, 'not-a-url');
      });
      
      // Verify error message
      expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument();
      
      // Verify save button is disabled
      expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });
  });

  // UI Display
  describe('UI Display', () => {
    it('should show empty state when no sources exist', () => {
      renderWithContext({
        ...defaultContextValue,
        connections: {
          ...mockSources,
          pictureSources: [],
          goalSources: []
        }
      });
      
      // Find both sections and verify empty state text
      const picturesSection = screen.getByRole('heading', { name: 'Pictures' }).closest('div');
      const dataSection = screen.getByRole('heading', { name: 'Data' }).closest('div');
      
      expect(within(picturesSection!).getByText('No sources added yet')).toBeInTheDocument();
      expect(within(dataSection!).getByText('No sources added yet')).toBeInTheDocument();
    });

    it('should display sources in table format', () => {
      renderWithContext();
      
      // Find Pictures section's table
      const picturesSection = screen.getByRole('heading', { name: 'Pictures' }).closest('div');
      const table = within(picturesSection!).getByRole('table');
      
      // Verify table headers
      const headers = within(table).getAllByRole('columnheader');
      expect(headers[0]).toHaveTextContent('Name');
      expect(headers[1]).toHaveTextContent('URL');
      
      // Verify source data
      const cells = within(table).getAllByRole('cell');
      expect(cells[0]).toHaveTextContent('pictures-1');
      expect(cells[1]).toHaveTextContent('https://example.com/pics');
    });

    it('should handle modal open/close correctly', async () => {
      renderWithContext();
      
      // Find Pictures section and click its Add Source button
      const picturesSection = screen.getByRole('heading', { name: 'Pictures' }).closest('div');
      const addButton = within(picturesSection!).getByRole('button', { name: 'Add Source' });
      await act(async () => {
        await userEvent.click(addButton);
      });
      
      // Verify modal is open
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      
      // Close modal
      await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      });
      await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
    });
  });
});
