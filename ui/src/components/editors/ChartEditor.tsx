import React from 'react';
import { CollapsibleSection } from './CollapsibleSection';
import { ChartSlideConfig } from '../../types/slides';
import { Captions } from '../../types/slide_groups';
import styles from './SlideGroupEditor.module.css';

interface ChartConfigProps {
  config: ChartSlideConfig;
  captions?: Captions;
  onChange: (config: Partial<ChartSlideConfig>) => void;
}

export const ChartEditor: React.FC<ChartConfigProps> = ({
  config,
  onChange,
}) => {
  const handleChange = (update: Partial<ChartSlideConfig>) => {
    onChange({ ...config, ...update });
  };

  return (
    <CollapsibleSection title="Chart Settings">
      <div className={styles['form-grid']}>
        {/* <label htmlFor="data-url">Data URL</label>
        <input
          id="data-url"
          type="text"
          value={config.url}
          onChange={(e) => handleChange({ url: e.target.value })}
        />
        <label htmlFor="goal-value">Goal</label>
        <input
          id="goal-value"
          type="number"
          value={config.goal}
          onChange={(e) => handleChange({ goal: parseFloat(e.target.value) })}
        />
        <label htmlFor="rounding-digits">Decimals</label>
        <input
          id="rounding-digits"
          type="number"
          min="0"
          value={config.rounding}
          onChange={(e) => handleChange({ rounding: parseInt(e.target.value, 10) })}
        />
        <label htmlFor="units">Units</label>
        <input
          id="units"
          type="text"
          value={config.units}
          onChange={(e) => handleChange({ units: e.target.value })}
        /> */}
      </div>
    </CollapsibleSection>
  );
};

export default ChartEditor;
