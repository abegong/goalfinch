import React from 'react';
import { VegaLite } from 'react-vega';
import { TopLevelSpec } from 'vega-lite';
import * as d3 from 'd3';
import { Typography } from '@mui/material';
import { roundToDigits } from '../../utils/chart';

interface ChartProps {
  data: Array<{date: string; value: number}>;
  goal: number;
  rounding: number;
  units: string;
  asOfDate?: string;
}

const Chart: React.FC<ChartProps> = ({ data, goal, rounding, units, asOfDate }) => {
  // Generate goal line data
  const firstDate = data[0]?.date;
  const lastDateInMonth = data[data.length - 1]?.date;
  const goalLineData = [
    { date: firstDate, value: 0 },
    { date: lastDateInMonth, value: goal }
  ];

  // Find the last date with data
  const lastDataPoint = [...data]
    .reverse()
    .find(d => d.value !== null);

  if (lastDataPoint) {
    // Calculate target value for the last data point
    const startDate = new Date(firstDate);
    const lastDataDate = new Date(lastDataPoint.date);
    const endDate = new Date(lastDateInMonth);
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
            strokeDash: [6, 4],
            color: "#999",
            strokeWidth: 3
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

    // Calculate how far ahead/behind
    const diff = lastDataPoint.value - targetForLastDay;
    const roundedDiff = Math.abs(roundToDigits(diff, rounding));
    let assessmentText = '';
    
    if (Math.abs(diff) < 0.0001) {  // Account for floating point
      assessmentText = "Right on track! 🎯";
    } else if (diff > 0) {
      assessmentText = `Ahead by ${roundedDiff} ${units} 🚀`;
    } else {
      assessmentText = `Behind by ${roundedDiff} ${units} ⏰`;
    }

    return (
      <div style={{ 
        width: '100%', 
        minWidth: '1000px'
      }}>
        <div style={{ 
          width: '100%', 
          height: '100%',
          minHeight: '600px'
        }}>
          <VegaLite spec={spec} data={{ values: safeData }} actions={false} />
        </div>
        <div style={{ 
          width: '100%',
          display: 'flex', 
          justifyContent: 'center'
        }}>
          <Typography 
            variant="h4" 
            align="center" 
            sx={{ 
              mt: 3,
              mb: 2,
              color: 'white',
              fontWeight: 500
            }}
          >
            {assessmentText}
          </Typography>
        </div>
      </div>
    );
  } else {
    return <div>No data available</div>;
  }
};

export default Chart;
