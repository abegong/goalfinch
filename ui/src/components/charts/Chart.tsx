import React from 'react';
import { VegaLite } from 'react-vega';
import { TopLevelSpec } from 'vega-lite';
import * as d3 from 'd3';

interface ChartProps {
  data: any[];  // CSV data after loading
  goal: number;
  rounding: number;
  units: string;
}

const Chart: React.FC<ChartProps> = ({ data, goal, rounding, units }) => {
  // Generate goal line data
  const firstDate = data[0]?.date;
  const lastDate = data[data.length - 1]?.date;
  const goalLineData = [
    { date: firstDate, value: 0 },
    { date: lastDate, value: goal }
  ];

  // Calculate weekly target values
  const startDate = new Date(firstDate);
  const endDate = new Date(lastDate);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const weeklyTargets = [];
  
  for (let i = 0; i <= totalDays; i += 7) {
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + i);
    const targetValue = (i / totalDays) * goal;
    weeklyTargets.push(targetValue);
  }

  const spec: TopLevelSpec = {
    width: 1000,
    height: 600,
    autosize: {
      type: "fit",
      contains: "padding"
    },
    data: { name: "values" },
    layer: [
      {
        data: { values: goalLineData },
        mark: {
          type: "line",
          strokeDash: [6, 4],
          color: "#999",
          strokeWidth: 1
        },
        encoding: {
          x: {
            field: "date",
            type: "temporal",
            axis: { 
              title: null,
              tickCount: 4,
              grid: true,
              gridDash: [2, 2]
            }
          },
          y: {
            field: "value",
            type: "quantitative",
            axis: { 
              title: units,
              grid: true,
              gridDash: [2, 2],
              values: weeklyTargets
            }
          }
        }
      },
      {
        data: { name: "values" },
        mark: {
          type: "line",
          point: true
        },
        encoding: {
          x: {
            field: "date",
            type: "temporal",
            axis: { 
              title: null,
              tickCount: 4,
              grid: true,
              gridDash: [2, 2]
            }
          },
          y: {
            field: "value",
            type: "quantitative",
            axis: { 
              title: units,
              grid: true,
              gridDash: [2, 2],
              values: weeklyTargets
            }
          }
        }
      }
    ]
  };

  // Use JSON parse/stringify for deep cloning
  const safeData = JSON.parse(JSON.stringify(data));

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      minWidth: '1000px',
      minHeight: '600px'
    }}>
      <VegaLite spec={spec} data={{ values: safeData }} />
    </div>
  );
};

export default Chart;
