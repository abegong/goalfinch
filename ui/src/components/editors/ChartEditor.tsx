import React from 'react';
import { CollapsibleSection } from './CollapsibleSection';
import { ChartSlideConfig } from '../../types/slides';
import { Captions } from '../../types/slide_groups';
import styles from './SlideGroupEditor.module.css';
import { Divider, Box } from '@mui/material';

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
    <>
      <Box p={2} sx={{ width: '100%', border: '1px solid #ccc' }}>
        <label htmlFor="data-url">Data Source</label>
        <input
          id="data-url"
          type="text"
          value={config.source}
          onChange={(e) => handleChange({ source: e.target.value })}
        />
        </Box>

        <Box p={2} sx={{ width: '100%', border: '1px solid #ccc' }}>
          <label htmlFor="date-column">Date Column</label>
          <input
            id="date-column"
            type="text"
            value={config.csv_extraction?.date_column ?? ''}
            onChange={(e) => {
              const newValue = e.target.value;
              const newExtraction = config.csv_extraction ?? {
                date_column: '',
                value_column: '',
              };
              handleChange({
                csv_extraction: {
                  ...newExtraction,
                  date_column: newValue,
                }
              });
            }}
          />

          <label htmlFor="value-column">Value Column</label>
          <input
            id="value-column"
            type="text"
            value={config.csv_extraction?.value_column ?? ''}
            onChange={(e) => {
              const newValue = e.target.value;
              const newExtraction = config.csv_extraction ?? {
                date_column: '',
                value_column: '',
              };
              handleChange({
                csv_extraction: {
                  ...newExtraction,
                  value_column: newValue,
                }
              });
            }}
          />

          <label htmlFor="filter-column">Filter Column (Optional)</label>
          <input
            id="filter-column"
            type="text"
            value={config.csv_extraction?.filter_column ?? ''}
            onChange={(e) => {
              const newValue = e.target.value;
              const newExtraction = config.csv_extraction ?? {
                date_column: '',
                value_column: '',
              };
              handleChange({
                csv_extraction: {
                  ...newExtraction,
                  filter_column: newValue || undefined,
                }
              });
            }}
          />

          <label htmlFor="filter-value">Filter Value (Optional)</label>
          <input
            id="filter-value"
            type="text"
            value={config.csv_extraction?.filter_value ?? ''}
            onChange={(e) => {
              const newValue = e.target.value;
              const newExtraction = config.csv_extraction ?? {
                date_column: '',
                value_column: '',
              };
              handleChange({
                csv_extraction: {
                  ...newExtraction,
                  filter_value: newValue || undefined,
                }
              });
            }}
          />

          <label htmlFor="goal">Goal Value</label>
          <input
            id="goal"
            type="number"
            value={config.goal}
            onChange={(e) => handleChange({ goal: Number(e.target.value) })}
          />
        </Box>
        
        <Box sx={{ width: '100%', border: '1px solid #ccc' }}>
          <label htmlFor="title">Title (Optional)</label>
          <input
            id="title"
            type="text"
            value={config.title ?? ''}
            onChange={(e) => handleChange({ title: e.target.value || undefined })}
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
        </Box>
    </>
  );
};

export default ChartEditor;
