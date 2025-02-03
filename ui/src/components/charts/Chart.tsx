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

  // Find the last date with data
  const lastDataPoint = [...data]
    .reverse()
    .find(d => d.value !== null);

  if (lastDataPoint) {
    // Calculate target value for the last data point
    const startDate = new Date(firstDate);
    const lastDataDate = new Date(lastDataPoint.date);
    const endDate = new Date(lastDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysSoFar = Math.ceil((lastDataDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const targetForLastDay = (daysSoFar / totalDays) * goal;

    // Create data for vertical target line
    const targetLine = [
      { date: lastDataPoint.date, value: lastDataPoint.value },
      { date: lastDataPoint.date, value: targetForLastDay }
    ];

    // Get current value (last non-null value)
    const currentValue = [...data]
      .reverse()
      .find(d => d.value !== null)?.value || 0;

    // Calculate weekly target values
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
            strokeWidth: 3
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
          data: { values: targetLine },
          mark: {
            type: "line",
            strokeDash: [4, 4],
            color: "#666",
            strokeWidth: 2
          },
          encoding: {
            x: {
              field: "date",
              type: "temporal"
            },
            y: {
              field: "value",
              type: "quantitative"
            }
          }
        },
        {
          data: { name: "values" },
          mark: {
            type: "line",
            strokeWidth: 5,
            opacity: 0.6
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
            type: "point",
            filled: true,
            opacity: 1.0,
            size: 180
          },
          transform: [
            {
              filter: "datum.showPoint"
            }
          ],
          encoding: {
            x: {
              field: "date",
              type: "temporal"
            },
            y: {
              field: "value",
              type: "quantitative"
            }
          }
        }
      ]
    };

    // Use JSON parse/stringify for deep cloning
    const safeData = JSON.parse(JSON.stringify(data)) as Array<{
      date: string;
      value: number;
      showPoint?: boolean;
    }>;

    // Add showPoint property to data
    safeData.forEach((d, i: number) => {
      if (i === 0 || d.value !== safeData[i - 1].value) {
        d.showPoint = true;
      } else {
        d.showPoint = false;
      }
    });

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
  } else {
    return <div>No data available</div>;
  }
};

export default Chart;
