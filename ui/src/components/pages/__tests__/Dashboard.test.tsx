import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import Dashboard from '../Dashboard';
import { LayoutContext } from '../../Layout';
import { type BulletSlideGroupConfig, type ChartSlideGroupConfig, type PictureSlideGroupConfig } from '../../../types/slide_groups';
import { SlideType } from '../../../types/slides';

const mockSlideGroups = [
  {
    type: SlideType.BULLETS,
    name: "Test Bullet Group",
    slides: [{
      type: SlideType.BULLETS,
      bullets: ['Test bullet point']
    }],
    captions: {}
  } as BulletSlideGroupConfig,
  {
    type: SlideType.CHART,
    name: "Test Chart Group",
    slides: [{
      type: SlideType.CHART,
      source: 'test-url',
      goal: 100,
      rounding: 0,
      units: 'units'
    }],
    captions: {}
  } as ChartSlideGroupConfig,
  {
    type: SlideType.PICTURE,
    name: "Test Picture Group",
    source: "test-source",
    slides: [
      { type: SlideType.PICTURE },
      { type: SlideType.PICTURE },
      { type: SlideType.PICTURE }
    ],
    slide_count: 3,
    captions: {}
  } as PictureSlideGroupConfig
];

const mockLayoutContext = {
  appControlBarOpen: false,
  setAppControlBarOpen: vi.fn(),
  appControlBarVisible: true,
  setAppControlBarVisible: vi.fn(),
};

vi.mock('../../../context/ConfigContext', () => ({
  useConfig: () => ({
    dashboard: {
      slideGroups: mockSlideGroups,
    },
    app: {
      appControlBar: {
        open: false,
        visible: true
      },
      theme: {
        mode: 'light'
      }
    },
    setApp: vi.fn(),
    setDashboard: vi.fn()
  }),
  ConfigProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('Dashboard', () => {
  it('renders all slide types correctly', () => {
    render(
      <LayoutContext.Provider value={mockLayoutContext}>
        <Dashboard />
      </LayoutContext.Provider>
    );
  });
});
