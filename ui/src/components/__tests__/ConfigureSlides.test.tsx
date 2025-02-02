import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfigureSlides from '../pages/ConfigureSlides';
import { SlideGroupConfig } from '../../types/slide_groups';

// Mock the ConfigContext module
jest.mock('../../context/ConfigContext', () => ({
  useConfig: () => ({
    dashboard: {
      slideGroups: [{ 
        type: 'NESTED_IMAGES',
        slide_count: 3,
        captions: {}
      }],
    },
    setDashboard: jest.fn(),
  }),
}));

// Mock MUI Lab components
jest.mock('@mui/lab', () => ({
  Timeline: ({ children }: any) => <div role="list">{children}</div>,
  TimelineItem: ({ children, ...props }: any) => (
    <div role="listitem" data-testid="timeline-item" {...props}>{children}</div>
  ),
  TimelineSeparator: ({ children }: any) => <div>{children}</div>,
  TimelineConnector: ({ children }: any) => <div>{children}</div>,
  TimelineContent: ({ children }: any) => <div>{children}</div>,
  TimelineOppositeContent: ({ children, onClick }: any) => (
    <div onClick={onClick} data-testid="timeline-opposite-content">{children}</div>
  ),
  TimelineDot: ({ children, sx, onClick, ...props }: any) => (
    <div data-testid="timeline-dot" onClick={onClick} {...props}>{children}</div>
  ),
  timelineOppositeContentClasses: {
    root: 'MuiTimelineOppositeContent-root'
  }
}));

describe('Goals Component', () => {
  const mockSetDashboard = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Update the mock to include multiple slide groups and setDashboard
    (jest.requireMock('../../context/ConfigContext') as any).useConfig = () => ({
      dashboard: {
        slideGroups: [
          { type: 'NESTED_IMAGES', slide_count: 3, captions: {} },
          { type: 'BULLETS', slides: [{ type: 'BULLETS', content: [''] }], captions: {} }
        ],
      },
      setDashboard: mockSetDashboard,
    });
  });

  test('clicking TimelineDot should not cause infinite updates', () => {
    render(<ConfigureSlides />);
    
    // Find all timeline dots and click the first one (the slide dot, not the add button)
    const timelineDots = screen.getAllByTestId('timeline-dot');
    fireEvent.click(timelineDots[0]);
    
    // The state should be updated without infinite loops
    expect(timelineDots[0]).toBeInTheDocument();
  });

  test('renders ConfigureSlides', () => {
    render(<ConfigureSlides />);
    const addButton = screen.getByTestId('AddIcon');
    expect(addButton).toBeInTheDocument();
  });

  test('handles drag and drop reordering', () => {
    render(<ConfigureSlides />);
    const timelineItems = screen.getAllByRole('listitem');
    
    // Start dragging the first item
    fireEvent.dragStart(timelineItems[0], {
      dataTransfer: {
        setData: jest.fn(),
        setDragImage: jest.fn(),
      },
    });
    
    // Drag over the second item
    fireEvent.dragOver(timelineItems[1], {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    });
    
    // Drop on the second item
    fireEvent.drop(timelineItems[1], {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: {
        getData: () => '0',
      },
    });

    // Verify that setDashboard was called with reordered slide groups
    expect(mockSetDashboard).toHaveBeenCalledWith(expect.objectContaining({
      slideGroups: [
        { type: 'BULLETS', slides: [{ type: 'BULLETS', content: [''] }], captions: {} },
        { type: 'NESTED_IMAGES', slide_count: 3, captions: {} },
      ],
    }));
  });

  test('applies dragging styles during drag operation', async () => {
    render(<ConfigureSlides />);
    const timelineItems = screen.getAllByTestId('timeline-item');
    
    // Start dragging the first item
    await act(async () => {
      fireEvent.dragStart(timelineItems[0], {
        dataTransfer: {
          setData: jest.fn(),
          setDragImage: jest.fn(),
        },
      });
    });

    // Check that dragging class is applied
    expect(timelineItems[0]).toHaveAttribute('data-dragging', 'true');
    
    // End dragging
    await act(async () => {
      // Simulate dragend event at document level since that's where we're listening
      const dragEndEvent = new Event('dragend', { bubbles: true });
      document.dispatchEvent(dragEndEvent);
    });
    
    // Check that dragging class is removed
    expect(timelineItems[0]).toHaveAttribute('data-dragging', 'false');
  });
});
