import React from 'react';
import { Captions } from '../../data/slide_interfaces';
import { BaseSlideGroupEditor } from './BaseSlideGroupEditor';
import { CollapsibleSection } from './CollapsibleSection';
import { ChartSlideConfig, SlideEditorProps } from './slide_editor_types';
import styles from './SlideGroupEditor.module.css';

interface ChartConfigProps {
  config: ChartSlideConfig;
  captions?: Captions;
  onChange: (config: Partial<ChartSlideConfig>) => void;
}

export const ChartConfig: React.FC<ChartConfigProps> = ({
  config,
  captions,
  onChange,
}) => {
  const handleChange = (update: Partial<ChartSlideConfig>) => {
    onChange({ ...config, ...update });
  };

  return (
    <BaseSlideGroupEditor<ChartSlideConfig>
      config={{ ...config, captions: captions || config.captions }}
      onChange={onChange}
    >
      <CollapsibleSection title="Chart Settings">
        <div className={styles['form-grid']}>
          <label htmlFor="data-url">Data URL</label>
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
          />
        </div>
      </CollapsibleSection>
    </BaseSlideGroupEditor>
  );
};

export const ChartSlideGroupEditor: React.FC<SlideEditorProps<ChartSlideConfig>> = ({
  config,
  onChange,
}) => {
  const handleChange = (update: Partial<Omit<ChartSlideConfig, 'type'>>) => {
    onChange({ ...update, type: 'chart' });
  };

  return (
    <BaseSlideGroupEditor<ChartSlideConfig>
      config={config}
      onChange={onChange}
    >
      <CollapsibleSection title="Chart Settings">
        <div className={styles['form-grid']}>
          <label htmlFor="data-url">Data URL</label>
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
          />
        </div>
      </CollapsibleSection>
    </BaseSlideGroupEditor>
  );
};

export default ChartSlideGroupEditor;
