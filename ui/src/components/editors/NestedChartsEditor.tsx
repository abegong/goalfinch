import React from 'react';
import { ChartEditor } from './ChartEditor';
import { NestedChartsSlideConfig, ChartSlideConfig } from './slide_editor_types';
import styles from './SlideGroupEditor.module.css';
import { CollapsibleSection } from './CollapsibleSection';

interface NestedChartsEditorProps {
  config: NestedChartsSlideConfig;
  onChange: (config: Partial<NestedChartsSlideConfig>) => void;
}

export const NestedChartsEditor: React.FC<NestedChartsEditorProps> = ({
  config,
  onChange,
}) => {
  const handleChartChange = (index: number, chartConfig: Partial<ChartSlideConfig>) => {
    const newContent = [...config.content];
    newContent[index] = { ...newContent[index], ...chartConfig };
    onChange({ ...config, content: newContent });
  };

  const handleAddChart = () => {
    const newChart: ChartSlideConfig = {
      type: 'chart',
      url: '',
      goal: 0,
      rounding: 0,
      units: '',
      captions: {},
    };
    onChange({ ...config, content: [...config.content, newChart] });
  };

  const handleRemoveChart = (index: number) => {
    const newContent = config.content.filter((_, i) => i !== index);
    onChange({ ...config, content: newContent });
  };

  return (
    <CollapsibleSection title="Nested Charts">
      <div className={styles['nested-charts']}>
        {config.content.map((chart, index) => (
          <div key={index} className={styles['nested-chart']}>
            <div className={styles['nested-chart-header']}>
              <h4>Chart {index + 1}</h4>
              <button 
                onClick={() => handleRemoveChart(index)}
                disabled={config.content.length === 1}
                className={styles['remove-chart-button']}
              >
                Remove Chart
              </button>
            </div>
            <ChartEditor
              config={chart}
              onChange={(newConfig) => handleChartChange(index, newConfig)}
            />
          </div>
        ))}
        <button 
          onClick={handleAddChart}
          className={styles['add-chart-button']}
        >
          Add Chart
        </button>
      </div>
    </CollapsibleSection>
  );
};

export default NestedChartsEditor;
