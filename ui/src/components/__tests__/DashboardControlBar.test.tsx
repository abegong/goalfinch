import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardControlBar from '../DashboardControlBar';
import { SlideGroupConfig } from '../../types/slide_groups';
import { SlideType } from '../../types/slides';

describe('DashboardControlBar', () => {
  test('handles slide groups with undefined captions', () => {
    const mockSlideGroups: SlideGroupConfig[] = [{
      type: SlideType.BULLETS,
      name: "Test Bullet Group",
      slides: [{ type: SlideType.BULLETS, bullets: ['Test bullet'] }],
      // Missing captions field to recreate the error
    } as SlideGroupConfig];

    render(
      <DashboardControlBar
        visible={true}
        onClose={() => {}}
        slideGroups={mockSlideGroups}
        visibleColorIndex={0}
        activeSlideIndex={0}
        onSlideClick={() => {}}
        isPaused={false}
        onPauseChange={() => {}}
      />
    );

    // The component should render without throwing an error
    expect(screen.getByLabelText('Dashboard Control Bar')).toBeInTheDocument();
    // Should show the slide type when no captions are available
    expect(screen.getByText('bullets')).toBeInTheDocument();
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

    render(
      <DashboardControlBar
        visible={true}
        onClose={() => {}}
        slideGroups={mockSlideGroups}
        visibleColorIndex={0}
        activeSlideIndex={0}
        onSlideClick={() => {}}
        isPaused={false}
        onPauseChange={() => {}}
      />
    );

    // Should use the bottom_right caption since it's the only one available
    expect(screen.getByText('Bottom Right Caption')).toBeInTheDocument();
  });
});
