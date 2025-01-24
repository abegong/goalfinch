import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardControlBar from '../DashboardControlBar';
import { SlideType } from '../../types/slides';
import { SlideGroupConfig } from '../../types/slide_groups';

describe('DashboardControlBar', () => {
  const mockSlideGroups: SlideGroupConfig[] = [{
    type: SlideType.BULLETS,
    // Missing captions field to recreate the error
  } as SlideGroupConfig];

  test('handles slide groups with undefined captions', () => {
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
  });
});
