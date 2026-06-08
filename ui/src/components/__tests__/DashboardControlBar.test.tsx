import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import DashboardControlBar from '../DashboardControlBar';
import { type SlideGroupConfig } from '../../types/slide_groups';
import { SlideType } from '../../types/slides';

describe('DashboardControlBar', () => {
  test('handles slide groups with undefined captions', () => {
    const mockSlideGroups: SlideGroupConfig[] = [{
      type: SlideType.BULLETS,
      name: "Test Bullet Group",
      slides: [{ type: SlideType.BULLETS, bullets: ['Test bullet'] }],
      // Missing captions field to recreate the error
    } as SlideGroupConfig];

    const noop = vi.fn();
    render(
      <DashboardControlBar
        visible={true}
        onClose={noop}
        slideGroups={mockSlideGroups}
        visibleColorIndex={0}
        activeSlideIndex={0}
        onSlideClick={noop}
        isPaused={false}
        onPauseChange={noop}
      />
    );

    // The component should render without throwing an error
    expect(screen.getByLabelText('Dashboard Control Bar')).toBeInTheDocument();
    // Should show the slide type when no captions are available
    expect(screen.getByText('Test Bullet Group')).toBeInTheDocument();
  });

  test('uses available caption from any position', () => {
    const mockSlideGroups: SlideGroupConfig[] = [{
      type: SlideType.BULLETS,
      name: "Test Bullet Group",
      slides: [{ type: SlideType.BULLETS, bullets: ['Test bullet'] }],
      captions: {
        bottom_right: 'Bottom Right Caption',
      }
    } as SlideGroupConfig];

    const noop = vi.fn();
    render(
      <DashboardControlBar
        visible={true}
        onClose={noop}
        slideGroups={mockSlideGroups}
        visibleColorIndex={0}
        activeSlideIndex={0}
        onSlideClick={noop}
        isPaused={false}
        onPauseChange={noop}
      />
    );

    expect(screen.getByText('Test Bullet Group')).toBeInTheDocument();
  });
});
