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
        mark: {
          type: "line",
          point: true
        },
        encoding: {
          x: {
            field: "date",
            type: "temporal",
            axis: { title: null }
          },
          y: {
            field: "value",
            type: "quantitative",
            axis: { title: units }
          }
        }
      }
    ]
  };

  // Use JSON parse/stringify for deep cloning
  const safeData = JSON.parse(JSON.stringify(data));

  return (
    <div style={{ 
      // width: '100%', 
      // height: '100%',
      minWidth: '1000px',
      minHeight: '600px'
    }}>
      <VegaLite spec={spec} data={{ values: safeData }}/>
    </div>
  );
};

export default Chart;
