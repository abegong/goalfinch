import React from 'react';
import { render, screen } from '@testing-library/react';
import ChartSlide from '../ChartSlide';
import { SlideType } from '../../../types/slides';

// Mock the Chart component
jest.mock('../../charts/Chart');

describe('ChartSlide', () => {
  const mockSlideConfig = {
    type: SlideType.CHART as const,
    source: 'test.csv',
    csv_extraction: {
      date_column: 'date',
      value_column: 'value'
    },
    goal: 100,
    rounding: 1,
    units: 'points'
  };

  it('renders loading state initially', () => {
    render(<ChartSlide slideConfig={mockSlideConfig} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
