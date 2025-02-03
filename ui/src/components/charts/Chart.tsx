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
    // width: "container",
    // height: "container",
    autosize: {
      type: "fit",
      contains: "padding"
    },
    data: { name: "values" },
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
    },
    layer: [
      {
        mark: "line",
        encoding: {
          y: { field: "value" }
        }
      },
      {
        mark: "rule",
        encoding: {
          y: { datum: goal },
          color: { value: "red" },
          strokeDash: { value: [8, 4] }
        }
      }
    ]
  };

  // Use JSON parse/stringify for deep cloning
  const safeData = JSON.parse(JSON.stringify(data));

  return (
    <div style={{ width: '600px', height: '400px' }}>
      <VegaLite spec={spec} data={{ values: safeData }} />
    </div>
  );
};

export default Chart;
