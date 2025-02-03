import React from 'react';

interface ChartProps {
  data: any[];
  goal: number;
  rounding: number;
  units: string;
}

const Chart: React.FC<ChartProps> = ({ data, goal, units }) => (
  <div data-testid="mock-chart">
    <div>Data points: {data.length}</div>
    <div>Goal: {goal}</div>
    <div>Units: {units}</div>
  </div>
);

export default Chart;
