import React from 'react';
import { PictureSlideGroupConfig } from '../../types/slide_groups';
import { SourceConfig } from '../../types/connections';
import styles from './SlideGroupEditor.module.css';
import { Autocomplete, TextField } from '@mui/material';
import { useConfig } from '../../context/ConfigContext';

interface PictureEditorProps {
  config: PictureSlideGroupConfig;
  onChange: (config: Partial<PictureSlideGroupConfig>) => void;
}

export const PictureEditor: React.FC<PictureEditorProps> = ({
  config,
  onChange,
}) => {
  const { connections } = useConfig();
  const sources = connections?.pictureSources || [];

  return (
    <div className={styles.editorSection}>
      <Autocomplete
        options={sources}
        getOptionLabel={(option: SourceConfig) => option.name}
        value={sources.find(source => source.name === config.source) }
        onChange={(_, newValue: SourceConfig | null) => {
          onChange({ source: newValue?.name });
        }}
        disableClearable={true}
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
    </div>
  );
};

export default PictureEditor;
