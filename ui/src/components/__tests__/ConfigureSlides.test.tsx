import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
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
  Timeline: ({ children }: any) => <div>{children}</div>,
  TimelineItem: ({ children }: any) => <div>{children}</div>,
  TimelineSeparator: ({ children }: any) => <div>{children}</div>,
  TimelineConnector: ({ children }: any) => <div>{children}</div>,
  TimelineContent: ({ children }: any) => <div>{children}</div>,
  TimelineOppositeContent: ({ children }: any) => <div>{children}</div>,
  TimelineDot: ({ children, sx, onClick, ...props }: any) => (
    <div data-testid="timeline-dot" onClick={onClick} {...props}>{children}</div>
  ),
  timelineOppositeContentClasses: {
    root: 'MuiTimelineOppositeContent-root'
  }
}));

describe('Goals Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});
