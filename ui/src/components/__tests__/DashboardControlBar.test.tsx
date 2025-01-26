import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardControlBar from '../DashboardControlBar';
import { SlideType } from '../../types/slides';
import { SlideGroupConfig } from '../../types/slide_groups';

describe('DashboardControlBar', () => {
  test('handles slide groups with undefined captions', () => {
    const mockSlideGroups: SlideGroupConfig[] = [{
      type: SlideType.BULLETS,
      slides: [{ type: SlideType.BULLETS, content: ['Test bullet'] }],
      // Missing captions field to recreate the error
    } as SlideGroupConfig];

    render(
      <DashboardControlBar
        visible={true}
        onClose={() => {}}
        slideGroups={mockSlideGroups}
        visibleColorIndex={0}
        onSlideClick={() => {}}
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
      slides: [{ type: SlideType.BULLETS, content: ['Test bullet'] }],
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
        onSlideClick={() => {}}
      />
    );

    // Should use the bottom_right caption since it's the only one available
    expect(screen.getByText('Bottom Right Caption')).toBeInTheDocument();
  });
});
