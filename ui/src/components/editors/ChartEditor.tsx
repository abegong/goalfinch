import React, { useContext } from 'react';
import { ChartSlideConfig } from '../../types/slides';
import { Captions } from '../../types/slide_groups';
import { Box, TextField, Typography, Stack, Autocomplete } from '@mui/material';
import { ConfigContext } from '../../context/ConfigContext';
import { SourceConfig } from '../../types/connections';

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
  const context = useContext(ConfigContext);
  
  if (!context) {
    throw new Error('ChartSlideEditor must be used within a ConfigProvider');
  }
  
  const { connections } = context;

  const handleChange = (updates: Partial<ChartSlideConfig>) => {
    onChange(updates);
  };

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Box sx={{ 
        p: 2, 
        border: '1px solid #e0e0e0', 
        borderRadius: 1,
        backgroundColor: '#fff'
      }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>Data Configuration</Typography>
        <Stack spacing={2}>
          <Autocomplete<SourceConfig>
            id="source"
            options={connections.dataSources}
            getOptionLabel={(option: SourceConfig) => option.name}
            value={connections.dataSources.find((source: SourceConfig) => source.url === config.source) || null}
            onChange={(_, newValue) => {
              handleChange({ source: newValue?.url || '' });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Source"
                variant="outlined"
                size="small"
                fullWidth
              />
            )}
          />
                    
          <TextField
            id="date-column"
            fullWidth
            label="Date Column"
            variant="outlined"
            size="small"
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

          <TextField
            id="value-column"
            fullWidth
            label="Value Column"
            variant="outlined"
            size="small"
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

          <TextField
            id="filter-column"
            fullWidth
            label="Filter Column (Optional)"
            variant="outlined"
            size="small"
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

          <TextField
            id="filter-value"
            fullWidth
            label="Filter Value (Optional)"
            variant="outlined"
            size="small"
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

          <TextField
            id="goal"
            fullWidth
            label="Goal Value"
            type="number"
            variant="outlined"
            size="small"
            value={config.goal}
            onChange={(e) => handleChange({ goal: Number(e.target.value) })}
          />
        </Stack>
      </Box>
        
      <Box sx={{ 
        p: 2, 
        border: '1px solid #e0e0e0', 
        borderRadius: 1,
        backgroundColor: '#fff'
      }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>Display Settings</Typography>
        <Stack spacing={2}>
          <TextField
            id="title"
            fullWidth
            label="Title (Optional)"
            variant="outlined"
            size="small"
            value={config.title ?? ''}
            onChange={(e) => handleChange({ title: e.target.value || undefined })}
          />

          <TextField
            id="rounding"
            fullWidth
            label="Decimal Places"
            type="number"
            variant="outlined"
            size="small"
            inputProps={{ min: 0, max: 10 }}
            value={config.rounding}
            onChange={(e) => handleChange({ rounding: Number(e.target.value) })}
          />

          <TextField
            id="units"
            fullWidth
            label="Units"
            variant="outlined"
            size="small"
            value={config.units}
            onChange={(e) => handleChange({ units: e.target.value })}
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default ChartEditor;
