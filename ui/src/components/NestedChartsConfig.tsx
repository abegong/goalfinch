import React from 'react';
import { Captions } from '../data/slide_data';
import BaseSlideConfig from './BaseSlideConfig';
import LookForwardChartConfig from './LookForwardChartConfig';
import styles from './SlideConfig.module.css';

interface NestedChartsConfigProps {
  content: any[];
  captions?: Captions;
  onChange: (config: any) => void;
}

export const NestedChartsConfig: React.FC<NestedChartsConfigProps> = ({ content, captions, onChange }) => {
  return (
    <div>
      <div className={styles['nested-charts-config']}>
        <h3>Nested Charts</h3>
        {content.map((chart, index) => (
          <LookForwardChartConfig
            key={index}
            {...chart}
            onChange={(newConfig) => {
              const newContent = [...content];
              newContent[index] = { ...newContent[index], ...newConfig };
              onChange({ content: newContent });
            }}
          />
        ))}
      </div>
      <BaseSlideConfig captions={captions} onChange={(newCaptions) => onChange({ captions: newCaptions })} />
    </div>
  );
};

export default NestedChartsConfig;