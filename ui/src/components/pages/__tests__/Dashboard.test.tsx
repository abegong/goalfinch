import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';
import { SlideProvider } from '../../../context/SlideContext';
import { LayoutContext } from '../../Layout';
import { BulletSlideGroupConfig, ChartSlideGroupConfig, PictureSlideGroupConfig } from '../../../types/slide_groups';
import { SlideType } from '../../../types/slides';

// Mock the Layout context
const mockLayoutContext = {
  setAppControlBarVisible: jest.fn(),
  appControlBarVisible: false,
  appControlBarOpen: false,
  setAppControlBarOpen: jest.fn(),
};

// Mock demo data
const mockSlideGroups = [
  {
    type: SlideType.BULLETS,
    captions: {
      top_center: "Test Bullet Slide",
      bottom_center: "Bottom Caption",
    },
    slide: {
      type: SlideType.BULLETS,
      content: ["Test bullet point"],
    }
  },
  {
    type: SlideType.CHART,
    captions: {
      top_center: "Test Chart Slide",
      bottom_center: "Bottom Caption",
    },
    slide: {
      type: SlideType.CHART,
      content: {
        url: "test-url",
        goal: 100,
        rounding: 0,
        units: "units",
      }
    }
  },
  {
    type: SlideType.PICTURE,
    captions: {
      top_center: "Test Picture Slide",
      bottom_center: "Bottom Caption",
    },
    slide: {
      type: SlideType.PICTURE,
      content: "test-image-url",
    }
  }
];

// Mock the useSlideGroups hook
jest.mock('../../../context/SlideContext', () => ({
  ...jest.requireActual('../../../context/SlideContext'),
  useSlideGroups: () => ({
    slideGroups: mockSlideGroups,
  }),
}));

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all slide types correctly', () => {
    render(
      <LayoutContext.Provider value={mockLayoutContext}>
        <SlideProvider>
          <Dashboard />
        </SlideProvider>
      </LayoutContext.Provider>
    );

    // Check for slide group names in the control bar
    expect(screen.getAllByText('slide-name-goes-here')).toHaveLength(3);
  });

  it('renders with empty slide groups', () => {
    // Override the mock to return empty slide groups
    jest.spyOn(require('../../../context/SlideContext'), 'useSlideGroups').mockReturnValue({
      slideGroups: [],
    });

    render(
      <LayoutContext.Provider value={mockLayoutContext}>
        <SlideProvider>
          <Dashboard />
        </SlideProvider>
      </LayoutContext.Provider>
    );

    // Should render the menu button but no slides
    expect(screen.getByTestId('MenuIcon')).toBeInTheDocument();
    expect(screen.queryByText('slide-name-goes-here')).not.toBeInTheDocument();
  });
});
