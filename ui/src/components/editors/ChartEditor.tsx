import React from 'react';
import { CollapsibleSection } from './CollapsibleSection';
import { ChartSlideConfig } from '../../types/slides';
import { Captions } from '../../types/slide_groups';
import styles from './SlideGroupEditor.module.css';

interface ChartEditorProps {
  configs: ChartSlideConfig[];
  captions?: Captions;
  onChange: (configs: ChartSlideConfig[]) => void;
}

export const ChartEditor: React.FC<ChartEditorProps> = ({ configs, captions, onChange }) => {
  const handleSlideChange = (index: number, update: Partial<ChartSlideConfig>) => {
    const newConfigs = [...configs];
    newConfigs[index] = { ...configs[index], ...update };
    onChange(newConfigs);
  };

  return (
    <div>
      {configs.map((config, index) => (
        <ChartSlideEditor
          key={index}
          config={config}
          captions={captions}
          onChange={(update) => handleSlideChange(index, update)}
        />
      ))}
    </div>
  );
};

interface ChartSlideEditorProps {
  config: ChartSlideConfig;
  captions?: Captions;
  onChange: (config: Partial<ChartSlideConfig>) => void;
}

export const ChartSlideEditor: React.FC<ChartSlideEditorProps> = ({
  config,
  onChange,
}) => {
  const handleChange = (update: Partial<ChartSlideConfig>) => {
    onChange({ ...config, ...update });
  };

  return (
    <CollapsibleSection title="Chart Settings">
      <div className={styles['form-grid']}>
        <label htmlFor="data-url">Data URL</label>
        <input
          id="data-url"
          type="text"
          value={config.source}
          onChange={(e) => handleChange({ source: e.target.value })}
        />
        <label htmlFor="goal">Goal Value</label>
        <input
          id="goal"
          type="number"
          value={config.goal}
          onChange={(e) => handleChange({ goal: Number(e.target.value) })}
        />
        <label htmlFor="rounding">Decimal Places</label>
        <input
          id="rounding"
          type="number"
          min="0"
          max="10"
          value={config.rounding}
          onChange={(e) => handleChange({ rounding: Number(e.target.value) })}
        />
        <label htmlFor="units">Units</label>
        <input
          id="units"
          type="text"
          value={config.units}
          onChange={(e) => handleChange({ units: e.target.value })}
        />
      </div>
    </CollapsibleSection>
  );
};

export default ChartEditor;
