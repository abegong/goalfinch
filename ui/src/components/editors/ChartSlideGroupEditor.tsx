import React from 'react';
import { Captions } from '../../data/slide_interfaces';
import BaseSlideGroupEditor from './BaseSlideGroupEditor';
import { CollapsibleSection } from './CollapsibleSection';
import styles from './SlideGroupEditor.module.css';

interface ChartConfigProps {
  url: string;
  goal: number;
  rounding: number;
  units: string;
  captions?: Captions;
  onChange: (config: any) => void;
}

export const ChartConfig: React.FC<ChartConfigProps> = ({
  url,
  goal,
  rounding,
  units,
  captions,
  onChange,
}) => {
  return (
    <div>
      <CollapsibleSection title="Chart Settings">
        <div className={styles['form-grid']}>
          <label htmlFor="data-url">Data URL</label>
          <input
            id="data-url"
            type="text"
            value={url}
            onChange={(e) => onChange({ url: e.target.value })}
          />
          <label htmlFor="goal-value">Goal</label>
          <input
            id="goal-value"
            type="number"
            value={goal}
            onChange={(e) => onChange({ goal: parseFloat(e.target.value) })}
          />
          <label htmlFor="rounding-digits">Decimals</label>
          <input
            id="rounding-digits"
            type="number"
            min="0"
            value={rounding}
            onChange={(e) => onChange({ rounding: parseInt(e.target.value) })}
          />
          <label htmlFor="units-label">Units</label>
          <input
            id="units-label"
            type="text"
            value={units}
            onChange={(e) => onChange({ units: e.target.value })}
          />
        </div>
      </CollapsibleSection>
      <BaseSlideGroupEditor captions={captions} onChange={(newCaptions) => onChange({ captions: newCaptions })} />
    </div>
  );
};

export default ChartConfig;
