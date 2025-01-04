import React from 'react';
import { BaseSlideGroupEditor } from './BaseSlideGroupEditor';
import { ChartSlideGroupEditor } from './ChartSlideGroupEditor';
import { NestedChartsSlideConfig, SlideEditorProps, ChartSlideConfig } from './slide_editor_types';
import styles from './SlideGroupEditor.module.css';

export const NestedChartsSlideGroupEditor: React.FC<SlideEditorProps<NestedChartsSlideConfig>> = ({
  config,
  onChange,
}) => {
  const handleChartChange = (index: number, chartConfig: Partial<ChartSlideConfig>) => {
    const newContent = [...config.content];
    newContent[index] = { ...newContent[index], ...chartConfig };
    onChange({ ...config, content: newContent });
  };

  return (
    <BaseSlideGroupEditor<NestedChartsSlideConfig> config={config} onChange={onChange}>
      <div className={styles['nested-charts-config']}>
        <h3>Nested Charts</h3>
        {config.content.map((chart, index) => (
          <ChartSlideGroupEditor
            key={index}
            config={chart}
            onChange={(newConfig) => handleChartChange(index, newConfig)}
          />
        ))}
      </div>
    </BaseSlideGroupEditor>
  );
};

export default NestedChartsSlideGroupEditor;
